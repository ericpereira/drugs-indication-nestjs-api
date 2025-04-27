import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Indications } from '../interfaces/drug-indication.interface';

@Schema()
export class DrugIndication {
  @Prop()
  drugName: string;

  @Prop()
  rawText: string;

  @Prop({ type: [{ code: String, description: String }] })
  indications?: Indications[] | null | undefined;

  constructor(
    id: string,
    drugName: string,
    rawText: string,
    indications?: Indications[] | null
  ) {
    this.drugName = drugName;
    this.rawText = rawText;
    this.indications = indications;
  }
}

export type DrugIndicationDocument = DrugIndication & Document;

export const DrugIndicationSchema = SchemaFactory.createForClass(DrugIndication);
