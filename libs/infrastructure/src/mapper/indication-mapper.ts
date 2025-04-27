import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { CohereClient } from "cohere-ai";
dotenv.config();

export async function mapIndicationToICD10(indication: string): Promise<any | null> {
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || '',
  });

  const prompt = `
You are a medical coding assistant. Map the following drug indication to the most appropriate ICD-10 code.
If the condition cannot be mapped, say "UNMAPPABLE". I have more than one indication, return an array with all indications.
Respond in JSON format only with fields: code and description.

Indication: "${indication}"
`;

console.log('prompt', prompt)

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
      responseFormat: {
        type: "json_object"
      },
    });
  
    const result = response?.text;
    return result;
  } catch (e) {
    return null;
  }
}