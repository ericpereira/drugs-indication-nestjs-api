import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DrugIndication } from '../entities/drug-indication.entity';
import { scrapeIndicationsFromDailyMed } from 'libs/infrastructure/src/scrapers/dailymed.scraper';
import { mapIndicationToICD10 } from 'libs/infrastructure/mapper/indication-mapper';
import { DrugIndicationRepositoryImpl } from 'libs/infrastructure/src/database/repositories/drug-indication.repository.impl';

@Injectable()
export class CreateDrugIndicationUseCase {
  constructor(private readonly drugIndicationRepo: DrugIndicationRepositoryImpl) {}

  async execute(data: { query: string }): Promise<DrugIndication> {
    try {
      const { query } = data;

      // before scrape, try to find the query on the database first
      const existingIndication = await this.drugIndicationRepo.findByQuery(query);

      if (existingIndication) {
        return existingIndication;
      }

      const { title, indications } = await scrapeIndicationsFromDailyMed(query);
      console.log('Extracted Indications:\n', indications);
      const mapped = await mapIndicationToICD10(indications.join(' '));
      console.log('mapped string', mapped);
      
  
      const mappedJson = JSON.parse(mapped)
      console.log('json', mappedJson);
  
      console.log("TRY TO CREATE", {
        drugName: title,
        indications: mappedJson?.indications ? mappedJson.indications : ( !mappedJson ? null : mappedJson ),
        rawText: query
      })
  
      return this.drugIndicationRepo.create({
        drugName: title,
        indications: mappedJson?.indications ? mappedJson.indications : ( !mappedJson ? null : mappedJson ),
        rawText: query
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao criar Drug Indication.');
    }   
  }
}
