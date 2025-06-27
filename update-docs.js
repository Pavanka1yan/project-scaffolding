const { readFileSync, writeFileSync } = require("fs");

const readme = readFileSync('README.md', 'utf8');

const header = `---\ntitle: Internal Project Scaffolding\n---\n\n<style>\n  body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; }\n  h1, h2, h3 { color: #333; }\n</style>\n\n`;

writeFileSync('docs/index.md', header + readme);
console.log('docs/index.md updated');
