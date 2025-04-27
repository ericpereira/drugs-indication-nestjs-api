import { mapIndicationToICD10 } from './indication-mapper';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

jest.mock('cohere-ai', () => ({
  CohereClient: jest.fn().mockImplementation(() => ({
    chat: jest.fn()
  }))
}));

describe('mapIndicationToICD10', () => {
  const mockChat = jest.fn();
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
    process.env.COHERE_API_KEY = 'test-api-key';
    (CohereClient as jest.Mock).mockImplementation(() => ({
      chat: mockChat
    }));
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully map indication to ICD-10 code', async () => {
    // MOCK OF SUCCESSFUL ANSWER
    const mockResponse = {
      text: JSON.stringify({
        code: 'J18.9',
        description: 'Pneumonia, unspecified'
      })
    };
    mockChat.mockResolvedValue(mockResponse);

    const result = await mapIndicationToICD10('Pneumonia');
    
    expect(CohereClient).toHaveBeenCalledWith({
      token: 'test-api-key'
    });
    expect(mockChat).toHaveBeenCalledWith({
      model: 'command-a-03-2025',
      message: expect.stringContaining('Pneumonia'),
      responseFormat: {
        type: 'json_object'
      }
    });
    expect(result).toEqual(mockResponse.text);
  });

  it('should return null when Cohere API throws an error', async () => {
    // API ERROR MOCK
    mockChat.mockRejectedValue(new Error('API Error'));

    const result = await mapIndicationToICD10('Invalid indication');
    
    expect(result).toBeNull();
  });

  it('should handle UNMAPPABLE response', async () => {
    // Non -mapeable response mock
    const mockResponse = {
      text: JSON.stringify({
        code: 'UNMAPPABLE',
        description: 'Condition cannot be mapped'
      })
    };
    mockChat.mockResolvedValue(mockResponse);

    const result = await mapIndicationToICD10('Some rare condition');
    
    expect(result).toEqual(mockResponse.text);
  });

  it('should handle multiple indications in array', async () => {
    // MOCK OF MULTIPLE INDICATIONS
    const mockResponse = {
      text: JSON.stringify([
        { code: 'J18.9', description: 'Pneumonia' },
        { code: 'R50.9', description: 'Fever' }
      ])
    };
    mockChat.mockResolvedValue(mockResponse);

    const result = await mapIndicationToICD10('Pneumonia with fever');
    
    expect(JSON.parse(result)).toHaveLength(2);
  });

  it('should use empty API key if not in env', async () => {
    delete process.env.COHERE_API_KEY;
    await mapIndicationToICD10('Test');
    
    expect(CohereClient).toHaveBeenCalledWith({
      token: ''
    });
  });
});