const fs = require('fs');
const path = require('path');

async function loadConfig(options) {
  let config = {};
  if (options.preset) {
    const presetPath = path.join(__dirname, '..', 'presets', `${options.preset}.json`);
    const presetRaw = await fs.promises.readFile(presetPath, 'utf-8');
    config = JSON.parse(presetRaw);
  }
  if (options.config) {
    const configPath = path.resolve(process.cwd(), options.config);
    const raw = await fs.promises.readFile(configPath, 'utf-8');
    config = { ...config, ...JSON.parse(raw) };
  }
  return config;
}

module.exports = { loadConfig };
