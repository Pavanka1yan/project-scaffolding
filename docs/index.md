---
title: Internal Project Scaffolding
---

<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; }
  h1, h2, h3 { color: #333; }
</style>

# Internal Project Scaffolding Tool

The Internal Project Scaffolding Tool bootstraps new projects with a consistent folder structure, sample code and optional integrations. It can be used directly from the command line or through the provided VS Code extension.

## Getting Started

### Using the CLI

Run the generator with `npx` and follow the prompts:

```bash
npx internal-scaffold init
```

You will be asked for:

1. **Project name**
2. **Backend framework** (\*.NET 8\* or \*Node.js\*)
3. **Frontend framework** (\*React\* or \*Blazor\*)
4. **Database** (SQL Server, Postgres or MongoDB)
5. **API style** (REST or GraphQL)
6. **Architecture pattern** (Clean, Layered, Onion, DDD)
7. **Optional features** such as authentication, Entity Framework, typed HTTP clients, Swagger and CORS

To use a configuration file:

```bash
npx internal-scaffold init --config path/to/config.json
```

A typical config looks like:

```json
{
  "projectName": "sample-app",
  "backend": "dotnet",
  "frontend": "react",
  "database": "sqlserver",
  "architecture": "clean",
  "enableAuth": true,
  "enableEf": true,
  "enableSwagger": true
}
```

### Presets

Pass the `--preset` option to load one of the JSON files in the `presets/` directory:

```bash
npx internal-scaffold init --preset react-admin
```

### VS Code Extension

A companion extension is located in the `vscode-extension/` folder. Build it with:

```bash
cd vscode-extension
npm install
npm run compile
```

Package the extension using `vsce package` and install the resulting `.vsix` file. Run **Create Internal Project** from the command palette and the extension will collect your options, create a temporary config file and invoke the CLI in a terminal.

### Output Example

```
/MyApp
  /api
    Controllers/
    Services/
    Models/
    Repositories/
    Program.cs
    appsettings.json
  /ui
    /src
      components/
      pages/
      App.tsx
      index.tsx
    tailwind.config.js
  docker-compose.yml
  azure-pipelines.yml
  README.md
```

### Verifying your Setup

After running the generated services, open the React UI. The home page shows a
status checklist by calling the `/status` API endpoint to confirm that features
like the database connection and authentication are working.

The `configs/` directory contains additional ready‑made configuration files for common combinations of backend, frontend and database.

---

Built with ❤️ by the Developer Experience Team
