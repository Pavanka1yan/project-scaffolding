import { vol } from 'memfs';
import * as fs from 'fs';
import path from 'path';

jest.mock('fs', () => require('memfs').fs);

const { generateStructure } = require('../lib/structureGenerator');

describe('generateStructure', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('creates layered structure', async () => {
    await generateStructure({ projectName: 'proj', architecture: 'layered' });
    const base = path.resolve(process.cwd(), 'proj');
    expect(vol.existsSync(path.join(base, 'src/controllers'))).toBe(true);
    expect(vol.existsSync(path.join(base, 'src/services'))).toBe(true);
  });

  it('creates onion structure', async () => {
    await generateStructure({ projectName: 'onionProj', architecture: 'onion' });
    const base = path.resolve(process.cwd(), 'onionProj');
    expect(vol.existsSync(path.join(base, 'src/domain'))).toBe(true);
    expect(vol.existsSync(path.join(base, 'src/web'))).toBe(true);
  });
});
