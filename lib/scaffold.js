const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const fs = require('fs');
const path = require('path');
const { copyTemplates } = require('./templateUtils');
const { generateStructure } = require('./structureGenerator');
const { validateConfig } = require('./configValidator');
const { loadConfig } = require('./configLoader');
const { loadPlugins, applyPlugins } = require('./pluginManager');

async function scaffoldProject(options) {
  try {
    const configFile = await loadConfig(options);

    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: configFile.projectName,
      },
      {
        type: 'input',
        name: 'backend',
        message: 'Backend technology:',
        default: configFile.backend,
      },
      {
        type: 'input',
        name: 'frontend',
        message: 'Frontend framework:',
        default: configFile.frontend,
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database:',
        default: configFile.database,
      },
      {
        type: 'input',
        name: 'apiType',
        message: 'API type (rest/graphql):',
        default: configFile.apiType || 'rest',
      },
      {
        type: 'input',
        name: 'architecture',
        message: 'Architecture pattern:',
        default: configFile.architecture || 'layered',
      },
      {
        type: 'confirm',
        name: 'enableAuth',
        message: 'Enable Azure AD authentication?',
        default: configFile.enableAuth || false,
      },
      {
        type: 'confirm',
        name: 'enableEf',
        message: 'Use EF Core?',
        default: configFile.enableEf || false,
      },
      {
        type: 'confirm',
        name: 'enableSwagger',
        message: 'Enable Swagger?',
        default: configFile.enableSwagger || false,
      },
      {
        type: 'confirm',
        name: 'enableCors',
        message: 'Enable CORS?',
        default: configFile.enableCors || false,
      },
    ];

    const answers = await prompt(questions);
    const finalConfig = validateConfig({ ...configFile, ...answers });

    const plugins = loadPlugins(finalConfig);

    let efProvider = '';
    let connectionString = '';
    if (/sql server/i.test(finalConfig.database)) {
      efProvider = 'UseSqlServer';
      if (finalConfig.enableEf) {
        connectionString = `Server=localhost;Database=${finalConfig.projectName};Trusted_Connection=True;TrustServerCertificate=True;`;
      }
    } else if (/postgres/i.test(finalConfig.database)) {
      efProvider = 'UseNpgsql';
      if (finalConfig.enableEf) {
        connectionString = `Host=localhost;Database=${finalConfig.projectName};Username=postgres;Password=postgres`;
      }
    }

    console.log('Scaffolding project with configuration:');
    console.log(JSON.stringify({ ...finalConfig, efProvider, connectionString }, null, 2));

    const baseTemplateDir = path.join(__dirname, '..', 'templates');
    const archTemplateDir = path.join(baseTemplateDir, finalConfig.architecture);
    const projectDir = path.join(process.cwd(), finalConfig.projectName);

    const context = {
      config: finalConfig,
      projectDir,
      templates: baseTemplateDir,
      variables: { ...finalConfig, efProvider, connectionString },
    };

    await applyPlugins(plugins, context);

    await copyTemplates(baseTemplateDir, projectDir, context.variables);
    if (fs.existsSync(archTemplateDir)) {
      await copyTemplates(archTemplateDir, projectDir, context.variables);
    }
    await generateStructure({
      projectName: finalConfig.projectName,
      architecture: finalConfig.architecture,
    });
    console.log(`\nProject scaffolded at ${projectDir}`);
  } catch (err) {
    console.error(`Initialization failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { scaffoldProject };
