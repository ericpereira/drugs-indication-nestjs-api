import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getSetIdFromDrugName, scrapeIndicationsFromDailyMed } from './dailymed.scraper';

// Create Axios Mock
const mockAxios = new MockAdapter(axios);

describe('scrapeIndicationsFromDailyMed', () => {
  afterEach(() => {
    mockAxios.reset(); // Reset the mock after each test
  });

  it('should return drug indications when valid drug is found', async () => {
    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=paracetamol')
      .reply(200, {
        data: [
          {
            title: 'Paracetamol',
            setid: '123456',
          },
        ],
      });

    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=123456')
      .reply(200, `<div class="Section" data-sectioncode="42229-5">
        <p>Indication 1: Pain relief</p>
        <p>Indication 2: Fever reduction</p>
      </div>`);

    const result = await scrapeIndicationsFromDailyMed('paracetamol');

    expect(result.title).toBe('Paracetamol');
    expect(result.indications).toEqual(['Indication 1: Pain relief', 'Indication 2: Fever reduction']);
  });

  it('should throw NotFoundException when no drug is found from DailyMed API', async () => {
    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=nonexistentdrug')
      .reply(200, { data: [] });

    await expect(scrapeIndicationsFromDailyMed('nonexistentdrug'))
      .rejects
      .toThrowError(new NotFoundException('No drug found for query: nonexistentdrug'));
  });

  it('should handle errors and return null when getSetIdFromDrugName fails', async () => {
    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=paracetamol')
      .reply(500);

    const result = await getSetIdFromDrugName('paracetamol');

    expect(result).toBeNull();
  });

  it('should return empty indications array when scraping fails to find data', async () => {
    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=paracetamol')
      .reply(200, {
        data: [
          {
            title: 'Paracetamol',
            setid: '123456',
          },
        ],
      });

    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=123456')
      .reply(200, '<div class="Section" data-sectioncode="42229-5"></div>');

    const result = await scrapeIndicationsFromDailyMed('paracetamol');

    expect(result.title).toBe('Paracetamol');
    expect(result.indications).toEqual([]);
  });

  it('should handle failure in scraping and throw error', async () => {
    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=paracetamol')
      .reply(200, {
        data: [
          {
            title: 'Paracetamol',
            setid: '123456',
          },
        ],
      });

    mockAxios.onGet('https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=123456')
      .reply(500);

    await expect(scrapeIndicationsFromDailyMed('paracetamol'))
      .rejects
      .toThrowError();
  });
});
