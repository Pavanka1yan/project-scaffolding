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
    expect(result.enableAuth).toBe(false);
    expect(result.enableEf).toBe(false);
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
});
