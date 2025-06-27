# Internal Project Scaffolding Tool

[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://your-username.github.io/project-scaffolding/)

## 📦 Overview

The Internal Project Scaffolding Tool is designed to bootstrap internal application projects with minimal effort and maximum consistency. It provides a guided, config-driven experience to generate complete project structures, including backend, frontend, and DevOps components — all tailored to your choices.

This tool helps teams quickly set up new projects by automating:
- Authentication & Authorization
- Database integration
- API layers and routing
- UI framework setup (React + Tailwind)
- CI/CD pipelines
- Environment configurations
- Linting and formatting rules
- Code structure based on selected architecture (e.g., Clean Architecture, Onion Architecture, etc.)

---

## 🧠 Features

- 📋 CLI-based or Web UI setup
- 📁 Auto-generated folder structures (via `generateStructure`)
- 🔐 Auth (MSAL, OAuth2, custom)
- 🗃️ DB setup (SQL Server, Postgres, MongoDB)
- 🧱 Architecture patterns (Layered, DDD, Microservice-ready)
- ⚙️ Optional services (Hangfire, Swagger, Health checks, etc.)
- 🌐 Typed HTTP clients with Refit ([example](docs/refit-http-clients.md))
- 📦 Package.json, Dockerfile, `.editorconfig`, `.gitignore`
- 🚀 Azure DevOps/GitHub Actions CI templates
- 🧪 Testing setup (xUnit, Jest, Playwright)
- 🎨 UI with ShadCN + TailwindCSS (React Frontend)

---

## 🛠️ Usage

### Option 1: CLI Tool

```bash
npx internal-scaffold init
```

You will be prompted for:
1. Project Name
2. Backend Tech (e.g., .NET 8, Node.js)
3. Frontend Tech (e.g., React, Blazor)
4. Database (SQL Server, Postgres, MongoDB)
5. Auth Type
6. Architecture Pattern
7. Optional Features

---

## 🧾 Output Example

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

---

## 📐 Config-Driven Approach

Define your default setup in `scaffold.config.json`:

```json
{
  "projectName": "TalentHub",
  "frontend": "React",
  "backend": ".NET 8",
  "database": "SQL Server",
  "auth": "MSAL",
  "enableAuth": true,
  "enableEf": true,
  "enableHttpClients": true,
  "architecture": "Clean",
  "features": ["Hangfire", "Swagger", "HealthCheck"],
  "serviceUrls": {
    "MyApi": "https://example.com"
  }
}
```
Any optional flag (such as `enableAuth` or `enableEf`) removes all related files and packages when set to `false`. For instance, with `enableAuth: false` there will be no authentication configuration or dependencies anywhere in the generated project.


Set the environment variable `REACT_APP_ENABLE_AUTH=true` in the React app to toggle authentication.

Then run:
```bash
npx internal-scaffold init --config scaffold.config.json
```

---

## 💡 Future Roadmap

- VSCode extension for scaffolding UI
- Plugin system for custom features
- Enterprise boilerplate templates
- AI assistant (via Codex) for feature guidance

---

## 📄 GitHub Pages Setup

This repository includes a workflow that publishes the contents of the `docs` directory to GitHub Pages. Make sure Pages is enabled for the repo or set `enablement: true` in `.github/workflows/pages.yml` so the workflow can enable it automatically.

---

## 🔐 Internal Usage Only

This is an internal tool for rapid scaffolding and prototyping across teams. It is not intended for public use.

> Built with ❤️ by the Developer Experience Team
