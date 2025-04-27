import { CreateDrugIndicationUseCase } from './create-drug-indication.use-case';
import { DrugIndicationRepositoryImpl } from 'libs/infrastructure/src/database/repositories/drug-indication.repository.impl';
import { scrapeIndicationsFromDailyMed } from 'libs/infrastructure/src/scrapers/dailymed.scraper';
import { mapIndicationToICD10 } from 'libs/infrastructure/src/mapper/indication-mapper';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DrugIndication } from '../../drug-indication/entities/drug-indication.entity';

// Mock dos módulos externos
jest.mock('libs/infrastructure/src/scrapers/dailymed.scraper');
jest.mock('libs/infrastructure/src/mapper/indication-mapper');

describe('CreateDrugIndicationUseCase', () => {
  let createDrugIndicationUseCase: CreateDrugIndicationUseCase;
  let drugIndicationRepo: jest.Mocked<DrugIndicationRepositoryImpl>;

  beforeEach(() => {
    drugIndicationRepo = {
      findByQuery: jest.fn(),
      create: jest.fn(),
    } as any;

    createDrugIndicationUseCase = new CreateDrugIndicationUseCase(drugIndicationRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return existing drug indication if found in database', async () => {
    const mockDrugIndication = { id: '123', drugName: 'Aspirin', rawText: 'aspirin', indications: [] } as DrugIndication;

    drugIndicationRepo.findByQuery.mockResolvedValue(mockDrugIndication);

    const result = await createDrugIndicationUseCase.execute({ query: 'aspirin' });

    expect(drugIndicationRepo.findByQuery).toHaveBeenCalledWith('aspirin');
    expect(result).toEqual(mockDrugIndication);
  });

  it('should scrape, map and create a new drug indication if not found', async () => {
    drugIndicationRepo.findByQuery.mockResolvedValue(null);

    (scrapeIndicationsFromDailyMed as jest.Mock).mockResolvedValue({
      title: 'Ibuprofen',
      indications: ['pain', 'fever'],
    });

    (mapIndicationToICD10 as jest.Mock).mockResolvedValue(
      JSON.stringify({
        indications: [
          { code: 'R50', description: 'Fever' },
          { code: 'R52', description: 'Pain' },
        ],
      })
    );

    const createdDrugIndication = { id: '456', drugName: 'Ibuprofen', rawText: 'ibuprofen', indications: [] } as DrugIndication;
    drugIndicationRepo.create.mockResolvedValue(createdDrugIndication);

    const result = await createDrugIndicationUseCase.execute({ query: 'ibuprofen' });

    expect(drugIndicationRepo.findByQuery).toHaveBeenCalledWith('ibuprofen');
    expect(scrapeIndicationsFromDailyMed).toHaveBeenCalledWith('ibuprofen');
    expect(mapIndicationToICD10).toHaveBeenCalled();
    expect(drugIndicationRepo.create).toHaveBeenCalledWith({
      drugName: 'Ibuprofen',
      rawText: 'ibuprofen',
      indications: [
        { code: 'R50', description: 'Fever' },
        { code: 'R52', description: 'Pain' },
      ],
    });
    expect(result).toEqual(createdDrugIndication);
  });

  it('should throw NotFoundException if scraper throws NotFoundException', async () => {
    drugIndicationRepo.findByQuery.mockResolvedValue(null);

    (scrapeIndicationsFromDailyMed as jest.Mock).mockRejectedValue(new NotFoundException('Not found'));

    await expect(createDrugIndicationUseCase.execute({ query: 'nonexistent-drug' }))
      .rejects
      .toThrow(NotFoundException);

    expect(scrapeIndicationsFromDailyMed).toHaveBeenCalledWith('nonexistent-drug');
  });

  it('should throw InternalServerErrorException on any unexpected error', async () => {
    drugIndicationRepo.findByQuery.mockResolvedValue(null);

    (scrapeIndicationsFromDailyMed as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    await expect(createDrugIndicationUseCase.execute({ query: 'some-drug' }))
      .rejects
      .toThrow(InternalServerErrorException);
  });

});
