#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const inquirer = require('inquirer');
const prompt = inquirer.prompt || (inquirer.default && inquirer.default.prompt);
const fs = require('fs');
const path = require('path');

async function generateStructure(config) {
  const baseDir = path.resolve(process.cwd(), config.projectName || 'my-app');
  const arch = (config.architecture || '').toLowerCase();
  const structures = {
    layered: ['controllers', 'services', 'repositories', 'models'],
    clean: ['domain', 'application', 'infrastructure', 'presentation'],
  };

  const folders = structures[arch];
  if (!folders) {
    console.warn(`Unknown architecture '${config.architecture}'. No structure generated.`);
    return;
  }

  await fs.promises.mkdir(baseDir, { recursive: true });
  for (const folder of folders) {
    const fullPath = path.join(baseDir, folder);
    await fs.promises.mkdir(fullPath, { recursive: true });
    await fs.promises.writeFile(path.join(fullPath, '.gitkeep'), '');
  }
}

async function scaffoldProject(options) {
  try {
    let config = {};
    if (options.config) {
      const configPath = path.resolve(process.cwd(), options.config);
      const raw = await fs.promises.readFile(configPath, 'utf-8');
      config = JSON.parse(raw);
    }

    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: config.projectName,
      },
      {
        type: 'input',
        name: 'backend',
        message: 'Backend technology:',
        default: config.backend,
      },
      {
        type: 'input',
        name: 'frontend',
        message: 'Frontend framework:',
        default: config.frontend,
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database:',
        default: config.database,
      },
    ];

    const answers = await prompt(questions);
    const finalConfig = { ...config, ...answers };

    console.log('Scaffolding project with configuration:');
    console.log(JSON.stringify(finalConfig, null, 2));

    await generateStructure(finalConfig);
    console.log('Project structure generated.');
  } catch (err) {
    console.error(`Initialization failed: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  const program = new Command();

  program
    .name('internal-scaffold')
    .description('Internal project scaffolding tool')
    .version('0.1.0');

  program
    .command('init')
    .description('Initialize a new project')
    .option('-c, --config <path>', 'Path to config JSON')
    .action(scaffoldProject);

  await program.parseAsync(process.argv);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`CLI failed: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { generateStructure };
