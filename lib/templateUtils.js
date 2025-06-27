const fs = require('fs');
const path = require('path');

async function copyTemplates(templateDir, destDir, variables = {}) {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyTemplates(srcPath, destPath, variables);
    } else {
      let content = await fs.promises.readFile(srcPath, 'utf-8');
      content = content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const k = key.trim();
        return Object.prototype.hasOwnProperty.call(variables, k) ? variables[k] : '';
      });
      await fs.promises.writeFile(destPath, content);
    }
  }
}

module.exports = { copyTemplates };
