const path = require('path');

function getPackagePlugins() {
  try {
    const pkg = require(path.resolve(process.cwd(), 'package.json'));
    if (pkg.internalScaffold && Array.isArray(pkg.internalScaffold.plugins)) {
      return pkg.internalScaffold.plugins;
    }
  } catch (err) {
    // ignore
  }
  return [];
}

function loadPlugins(config) {
  const names = [...getPackagePlugins(), ...(config.plugins || [])];
  const plugins = [];
  for (const name of names) {
    try {
      const mod = require(require.resolve(name, { paths: [process.cwd()] }));
      if (typeof mod.apply === 'function') {
        plugins.push({ name, apply: mod.apply });
      } else {
        console.warn(`Plugin ${name} does not export apply()`);
      }
    } catch (err) {
      console.warn(`Failed to load plugin ${name}: ${err.message}`);
    }
  }
  return plugins;
}

async function applyPlugins(plugins, context) {
  for (const plugin of plugins) {
    await plugin.apply(context);
  }
}

module.exports = { loadPlugins, applyPlugins };
