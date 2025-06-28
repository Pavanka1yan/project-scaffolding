const { Command } = require('commander');
const { scaffoldProject } = require('./scaffold');

async function run(argv = process.argv) {
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

  return program.parseAsync(argv);
}

module.exports = { run };
