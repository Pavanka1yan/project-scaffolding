import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export function renderTemplate(content: string, variables: Record<string, string>): string {
  return ejs.render(content, variables);
}

export async function copyTemplates(templateDir: string, destDir: string, variables: Record<string, string> = {}): Promise<void> {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyTemplates(srcPath, destPath, variables);
    } else {
      let content = await fs.promises.readFile(srcPath, 'utf-8');
      content = renderTemplate(content, variables);
      await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
      await fs.promises.writeFile(destPath, content);
    }
  }
}
