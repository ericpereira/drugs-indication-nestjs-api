import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DrugIndication } from 'libs/core/drug-indication/entities/drug-indication.entity';
import { DrugIndicationDTO, DrugIndicationRepository } from 'libs/core/drug-indication/interfaces/drug-indication.interface';

@Injectable()
export class DrugIndicationRepositoryImpl implements DrugIndicationRepository {
  constructor(@InjectModel('DrugIndication') private drugIndicationModel: Model<DrugIndication>) {}

  async create(drugIndication: DrugIndicationDTO): Promise<DrugIndication> {
    return this.drugIndicationModel.create(drugIndication);
  }

  async findAll(): Promise<DrugIndication[]> {
    return this.drugIndicationModel.find().exec();
  }

  async findById(id: string): Promise<DrugIndication | null> {
    return this.drugIndicationModel.findById(id).exec();
  }

  async findByQuery(query: string): Promise<DrugIndication | null> {
    return this.drugIndicationModel.findOne({ rawText: new RegExp(`^${query}$`, 'i') }).exec();
  }  

  async update(id: string, drugIndicationData: Partial<DrugIndication>): Promise<DrugIndication | null> {
    const updatedDrugIndication = await this.drugIndicationModel
      .findByIdAndUpdate(id, drugIndicationData, { new: true })
      .exec();
    return updatedDrugIndication ? updatedDrugIndication : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.drugIndicationModel.findByIdAndDelete(id).exec();
    return result != null;
  }
}
