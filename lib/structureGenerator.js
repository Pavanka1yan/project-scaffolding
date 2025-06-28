const fs = require('fs');
const path = require('path');

function getArchitectureTree(name) {
  const trees = {
    clean: {
      src: {
        domain: {},
        application: {},
        infrastructure: {},
        interfaces: {}
      },
      tests: {}
    },
    layered: {
      src: {
        controllers: {},
        services: {},
        models: {},
        repositories: {}
      }
    },
    onion: {
      src: {
        domain: {},
        application: {},
        infrastructure: {},
        web: {}
      },
      tests: {}
    },
    ddd: {
      src: {
        domain: {},
        application: {},
        infrastructure: {},
        api: {},
        shared: {}
      },
      tests: {}
    }
  };
  return trees[name.toLowerCase()] || trees.layered;
}

async function createTree(baseDir, tree) {
  for (const [name, value] of Object.entries(tree)) {
    const target = path.join(baseDir, name);
    if (typeof value === 'string') {
      await fs.promises.mkdir(path.dirname(target), { recursive: true });
      await fs.promises.writeFile(target, value);
    } else {
      await fs.promises.mkdir(target, { recursive: true });
      await createTree(target, value);
    }
  }
}

async function generateStructure(config) {
  const projectDir = path.resolve(process.cwd(), config.projectName);
  const tree = getArchitectureTree(config.architecture || 'layered');
  await createTree(projectDir, tree);
}

module.exports = { generateStructure };
