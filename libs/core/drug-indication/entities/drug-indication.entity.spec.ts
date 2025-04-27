import { DrugIndication } from './drug-indication.entity';
import { Indications } from '../interfaces/drug-indication.interface';

describe('DrugIndication Entity', () => {
  it('should create a DrugIndication with required properties', () => {
    const id = 'test-id';
    const drugName = 'Aspirin';
    const rawText = 'Used to reduce pain, fever, or inflammation.';

    const drugIndication = new DrugIndication(id, drugName, rawText);

    expect(drugIndication.drugName).toBe(drugName);
    expect(drugIndication.rawText).toBe(rawText);
    expect(drugIndication.indications).toBeUndefined();
  });

  it('should create a DrugIndication with indications', () => {
    const id = 'test-id-2';
    const drugName = 'Ibuprofen';
    const rawText = 'Nonsteroidal anti-inflammatory drug (NSAID).';
    const indications: Indications[] = [
      { code: 'R50.9', description: 'Fever, unspecified' },
      { code: 'M79.1', description: 'Myalgia' }
    ];

    const drugIndication = new DrugIndication(id, drugName, rawText, indications);

    expect(drugIndication.drugName).toBe(drugName);
    expect(drugIndication.rawText).toBe(rawText);
    expect(drugIndication.indications).toEqual(indications);
  });

  it('should allow indications to be null', () => {
    const id = 'test-id-3';
    const drugName = 'Paracetamol';
    const rawText = 'Pain reliever and a fever reducer.';

    const drugIndication = new DrugIndication(id, drugName, rawText, null);

    expect(drugIndication.drugName).toBe(drugName);
    expect(drugIndication.rawText).toBe(rawText);
    expect(drugIndication.indications).toBeNull();
  });
});
