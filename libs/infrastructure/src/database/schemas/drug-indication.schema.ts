import { Schema } from 'mongoose';

export const DrugIndicationSchema = new Schema({
  drugName: { type: String, required: true, unique: true },
  rawText: { type: String, required: true },
  indications: [
    {
      code: { type: String, required: true },
      description: { type: String, required: true }
    }
  ]
},{
  timestamps: true
}
);
