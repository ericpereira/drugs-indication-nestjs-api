import { DrugIndicationRepositoryImpl } from './drug-indication.repository.impl';
import { DrugIndication } from 'libs/core/drug-indication/entities/drug-indication.entity';
import { Model, Document, Types, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

type MockDrugIndicationType = DrugIndication & Document<unknown, any, any> & {
  _id: Types.ObjectId;
  __v?: number;
  save: jest.Mock;
  toObject: jest.Mock;
};

type DrugIndicationModel = jest.Mocked<Model<DrugIndication>>;

const createMockQuery = <T>(resolveValue: T) => {
  const mockQuery = {
    exec: jest.fn().mockResolvedValue(resolveValue),
    lean: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    equals: jest.fn().mockReturnThis(),
  } as unknown as Query<T, any, {}, any, 'find'>;
  
  return mockQuery;
};

describe('DrugIndicationRepositoryImpl', () => {
  let drugIndicationRepository: DrugIndicationRepositoryImpl;
  let drugIndicationModel: DrugIndicationModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrugIndicationRepositoryImpl,
        {
          provide: getModelToken('DrugIndication'),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            lean: jest.fn(),
          },
        },
      ],
    }).compile();

    drugIndicationRepository = module.get<DrugIndicationRepositoryImpl>(DrugIndicationRepositoryImpl);
    drugIndicationModel = module.get<DrugIndicationModel>(getModelToken('DrugIndication'));
  });

  it('should be defined', () => {
    expect(drugIndicationRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new drug indication', async () => {
      const drugIndicationDTO = {
        drugName: 'Aspirin',
        rawText: 'Dupixent',
        indications: [{ code: 'A01', description: 'Headache' }],
      };

      const mockDrugIndication: MockDrugIndicationType = {
        ...drugIndicationDTO,
        _id: new Types.ObjectId(),
        __v: 0,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue(drugIndicationDTO),
        $isNew: false,
        $isDeleted: jest.fn().mockReturnValue(false),
      } as any;

      // Correcting the mock typing
      drugIndicationModel.create.mockResolvedValue(mockDrugIndication as any);

      const result = await drugIndicationRepository.create(drugIndicationDTO);

      expect(drugIndicationModel.create).toHaveBeenCalledWith(drugIndicationDTO);
      expect(result).toEqual(mockDrugIndication);
    });
  });

  describe('findAll', () => {
    it('should return all drug indications', async () => {
      const mockDrugIndications: MockDrugIndicationType[] = [
        {
          _id: new Types.ObjectId(),
          drugName: 'Aspirin',
          rawText: 'Dupixent',
          indications: [{ code: 'A01', description: 'Headache' }],
          __v: 0,
          save: jest.fn(),
          toObject: jest.fn().mockReturnThis(),
        } as any
      ];

      drugIndicationModel.find.mockImplementation(() => 
        createMockQuery(mockDrugIndications)
      );

      const result = await drugIndicationRepository.findAll();

      expect(drugIndicationModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockDrugIndications);
    });
  });

  describe('findById', () => {
    it('should find a drug indication by id', async () => {
      const mockDrugIndication: MockDrugIndicationType = {
        _id: '123',
        drugName: 'Aspirin',
        rawText: 'Dupixent',
        indications: [{ code: 'A01', description: 'Headache' }],
        __v: 0,
        save: jest.fn(),
        toObject: jest.fn().mockReturnThis(),
      } as any;

      drugIndicationModel.findById.mockImplementation(() => 
        createMockQuery(mockDrugIndication)
      );

      const result = await drugIndicationRepository.findById('123');

      expect(drugIndicationModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockDrugIndication);
    });

    it('should return null if drug indication not found', async () => {
      drugIndicationModel.findById.mockImplementation(() => 
        createMockQuery(null)
      );

      const result = await drugIndicationRepository.findById('123');

      expect(drugIndicationModel.findById).toHaveBeenCalledWith('123');
      expect(result).toBeNull();
    });
  });

  describe('findByQuery', () => {
    it('should find a drug indication by query', async () => {
      const mockDrugIndication: MockDrugIndicationType = {
        _id: new Types.ObjectId(),
        drugName: 'Aspirin',
        rawText: 'Dupixent',
        indications: [{ code: 'A01', description: 'Headache' }],
        __v: 0,
        save: jest.fn(),
        toObject: jest.fn().mockReturnThis(),
      } as any;

      drugIndicationModel.findOne.mockImplementation(() => 
        createMockQuery(mockDrugIndication)
      );

      const result = await drugIndicationRepository.findByQuery('Dupixent');

      expect(drugIndicationModel.findOne).toHaveBeenCalledWith({
        rawText: new RegExp('^Dupixent$', 'i'),
      });
      expect(result).toEqual(mockDrugIndication);
    });

    it('should return null if drug indication not found by query', async () => {
      const mockDrugIndication: MockDrugIndicationType = {
        _id: new Types.ObjectId(),
        drugName: 'Aspirin',
        rawText: 'Omeprazole',
        indications: [{ code: 'A01', description: 'Headache' }],
        __v: 0,
        save: jest.fn(),
        toObject: jest.fn().mockReturnThis(),
      } as any;

      drugIndicationModel.findById.mockImplementation(() => 
        createMockQuery(mockDrugIndication)
      );

      const result = await drugIndicationRepository.findByQuery('Dupixent');
      expect(result).toBe(undefined);
    });
  });

  describe('update', () => {
    it('should update a drug indication', async () => {
      const mockUpdatedDrugIndication: MockDrugIndicationType = {
        _id: '123',
        drugName: 'Updated Aspirin',
        rawText: 'Dupixent',
        indications: [{ code: 'A01', description: 'Headache' }],
        __v: 0,
        save: jest.fn(),
        toObject: jest.fn().mockReturnThis(),
      } as any;

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUpdatedDrugIndication),
        lean: jest.fn().mockReturnThis(),
      };
      
      drugIndicationModel.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      const result = await drugIndicationRepository.update('123', {
        drugName: 'Updated Aspirin',
      });

      expect(drugIndicationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { drugName: 'Updated Aspirin' },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedDrugIndication);
    });


    // todo: fix this test in the future
    // it('should return null if drug indication not found for update', async () => {
    //   const mockUpdatedDrugIndication: MockDrugIndicationType = {
    //     _id: '123',
    //     drugName: 'Updated Aspirin',
    //     rawText: 'Dupixent',
    //     indications: [{ code: 'A01', description: 'Headache' }],
    //     __v: 0,
    //     save: jest.fn(),
    //     toObject: jest.fn().mockReturnThis(),
    //   } as any;

    //   const mockQuery = {
    //     exec: jest.fn().mockResolvedValue(null),
    //     lean: jest.fn().mockReturnThis(),
    //   };
      
    //   drugIndicationModel.findByIdAndUpdate.mockReturnValue(mockQuery as any);
      
    //   // drugIndicationModel.findByIdAndUpdate.mockResolvedValue(null);
      
    //   const result = await drugIndicationRepository.update('666', {
    //     drugName: 'Updated Aspirin',
    //   });



    //   // expect(drugIndicationModel.findByIdAndUpdate).toHaveBeenCalledWith(
    //   //   '1234',
    //   //   { drugName: 'Updated Aspirin' },
    //   //   { new: true }
    //   // );
    //   expect(result).toHaveBeenCalled();
    //   expect(result).toBeNull();
    // });
  });

  describe('delete', () => {
    it('should delete a drug indication by id', async () => {
      const mockUpdatedDrugIndication: MockDrugIndicationType = {
        _id: '123',
        drugName: 'Updated Aspirin',
        rawText: 'Dupixent',
        indications: [{ code: 'A01', description: 'Headache' }],
        __v: 0,
        save: jest.fn(),
        toObject: jest.fn().mockReturnThis(),
      } as any;

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUpdatedDrugIndication),
        lean: jest.fn().mockReturnThis(),
      };
      
      drugIndicationModel.findByIdAndDelete.mockReturnValue(mockQuery as any);

      const result = await drugIndicationRepository.delete('123');

      expect(drugIndicationModel.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toBe(true);
    });

    it('should return false if drug indication not found for delete', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
        lean: jest.fn().mockReturnThis(),
      };
    
      drugIndicationModel.findByIdAndDelete.mockReturnValue(mockQuery as any);
    
      const result = await drugIndicationRepository.delete('1234');
      expect(result).toBe(false);
    });
    
  });
});