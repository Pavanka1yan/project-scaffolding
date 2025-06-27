#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const fs = require('fs');
const path = require('path');
const { copyTemplates } = require('../lib/templateUtils');
const { generateStructure } = require('../lib/structureGenerator');
const { validateConfig } = require('../lib/configValidator');

async function scaffoldProject(options) {
  try {
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
      {
        type: 'input',
        name: 'architecture',
        message: 'Architecture pattern:',
        default: config.architecture || 'layered',
      },
      {
        type: 'confirm',
        name: 'enableAuth',
        message: 'Enable Azure AD authentication?',
        default: config.enableAuth || false,
      },
    ];

    const answers = await prompt(questions);
    const finalConfig = validateConfig({ ...config, ...answers });

    console.log('Scaffolding project with configuration:');
    console.log(JSON.stringify(finalConfig, null, 2));

    const templateDir = path.join(__dirname, '..', 'templates');
    const projectDir = path.join(process.cwd(), finalConfig.projectName);

    await copyTemplates(templateDir, projectDir, finalConfig);
    await generateStructure({
      projectName: finalConfig.projectName,
      architecture: finalConfig.architecture
    });
    console.log(`\nProject scaffolded at ${projectDir}`);
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
    .option('-p, --preset <name>', 'Preset name to load')
    .action(scaffoldProject);

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(`CLI failed: ${err.message}`);
  process.exit(1);
});
