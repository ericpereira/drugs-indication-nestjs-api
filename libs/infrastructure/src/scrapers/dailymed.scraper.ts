import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface DrugApiReponse {
  title: string,
  drugId: string
}

interface ScraperResponse {
  title: string,
  indications: string[]
}

async function getSetIdFromDrugName(drugName: string): Promise<DrugApiReponse | null> {
  try {
    const apiUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(drugName)}`;
    const response = await axios.get(apiUrl);

    const data = response.data?.data;
    if (!data || data.length === 0) return null;
    
    const responseData = {
      title: data[0].title,
      drugId: data[0].setid
    }; 

    return responseData;

  } catch (error) {
    return null;
  }
}

export async function scrapeIndicationsFromDailyMed(query: string): Promise<ScraperResponse> {
  try {
    const drugData = await getSetIdFromDrugName(query);
    if (!drugData) {
      throw new NotFoundException(`No drug found for query: ${query}`);
    }

    const { drugId, title } = drugData;
    console.log('drugId', drugId);

    const url = `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${drugId}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let indications: string[] = [];

    // Tenta com o LOINC code da seção "Indications and Usage"
    const section42229 = $('div.Section[data-sectioncode="42229-5"]');
    section42229.find('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text) indications.push(text);
    });

    // Fallback para Highlights caso a seção principal esteja vazia
    if (indications.length === 0) {
      const highlights = $('#Highlights');
      highlights.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text) indications.push(text);
      });
    }

    return {
      title,
      indications
    };
  } catch (error) {
    throw error;
  }  
}
