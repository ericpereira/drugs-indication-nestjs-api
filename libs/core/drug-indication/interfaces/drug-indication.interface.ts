import { DrugIndication } from "../entities/drug-indication.entity";

export interface Indications {
  code: string,
  description: string
}

export interface DrugIndicationDTO {
  drugName: string;
  rawText: string;
  indications: Indications[] | null;
};

export interface DrugIndicationRepository {
  create(drugIndication: DrugIndicationDTO): Promise<DrugIndication>;
  findById(id: string): Promise<DrugIndication | null>;
  findByQuery(query: string): Promise<DrugIndication | null>;
  update(id: string, data: Partial<DrugIndication>): Promise<DrugIndication | null>;
  delete(id: string): Promise<boolean>;
}