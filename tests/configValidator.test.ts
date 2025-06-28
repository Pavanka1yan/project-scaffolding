import { validateConfig, ScaffoldConfig } from '../lib/configValidator';

describe('validateConfig', () => {
  it('applies defaults and returns validated config', () => {
    const input: ScaffoldConfig = {
      projectName: 'test',
      backend: 'node',
      frontend: 'react',
      database: 'sqlite'
    };
    const result = validateConfig(input);
    expect(result.architecture).toBe('layered');
    expect(result.apiType).toBe('rest');
    expect(result.enableAuth).toBe(false);
    expect(result.enableEf).toBe(false);
    expect(result.enableHttpClients).toBe(false);
    expect(result.enableSwagger).toBe(false);
    expect(result.enableCors).toBe(false);
    expect(result.plugins).toEqual([]);
  });

  it('throws if required fields missing', () => {
    expect(() => validateConfig({} as ScaffoldConfig)).toThrow('Config validation failed');
  });

  it('throws for invalid architecture', () => {
    const input: ScaffoldConfig = {
      projectName: 'a',
      backend: 'b',
      frontend: 'c',
      database: 'd',
      architecture: 'wrong'
    };
    expect(() => validateConfig(input)).toThrow('architecture');
  });

  it('throws for invalid apiType', () => {
    const input: ScaffoldConfig = {
      projectName: 'a',
      backend: 'b',
      frontend: 'c',
      database: 'd',
      apiType: 'soap'
    };
    expect(() => validateConfig(input)).toThrow('apiType');
  });
});
