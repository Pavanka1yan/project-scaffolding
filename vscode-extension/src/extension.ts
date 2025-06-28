import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('internalScaffold.createProject', async () => {
    try {
      const config: any = {};

      config.projectName = await vscode.window.showInputBox({ prompt: 'Project name' });
      if (!config.projectName) { throw new Error('Project name is required'); }

      config.backend = await vscode.window.showQuickPick(['.NET 8', 'Node.js', 'None'], { placeHolder: 'Select backend' });
      if (!config.backend) { throw new Error('Backend technology is required'); }

      config.frontend = await vscode.window.showQuickPick(['React', 'Blazor', 'None'], { placeHolder: 'Select frontend framework' });
      if (!config.frontend) { throw new Error('Frontend framework is required'); }

      config.database = await vscode.window.showQuickPick(['SQL Server', 'Postgres', 'MongoDB', 'None'], { placeHolder: 'Select database' });
      if (!config.database) { throw new Error('Database selection is required'); }

      config.apiType = await vscode.window.showQuickPick(['rest', 'graphql'], { placeHolder: 'API type' }) ?? 'rest';
      config.architecture = await vscode.window.showQuickPick(['clean', 'layered', 'onion', 'ddd'], { placeHolder: 'Architecture pattern' }) ?? 'layered';

      const featureOptions = [{ label: 'Azure AD Auth' }];
      if (config.backend !== 'None') {
        featureOptions.push({ label: 'Entity Framework' });
        featureOptions.push({ label: 'Typed HTTP Clients' });
        featureOptions.push({ label: 'Swagger' });
        featureOptions.push({ label: 'CORS' });
      }

      const features = await vscode.window.showQuickPick(featureOptions, { canPickMany: true, placeHolder: 'Optional features' }) || [];

      config.enableAuth = features.some(f => f.label === 'Azure AD Auth');
      config.enableEf = features.some(f => f.label === 'Entity Framework');
      config.enableHttpClients = features.some(f => f.label === 'Typed HTTP Clients');
      config.enableSwagger = features.some(f => f.label === 'Swagger');
      config.enableCors = features.some(f => f.label === 'CORS');

      if (config.enableAuth) {
        config.azureTenantId = await vscode.window.showInputBox({ prompt: 'Azure Tenant ID', ignoreFocusOut: true }) ?? '';
        config.azureClientId = await vscode.window.showInputBox({ prompt: 'Azure Client ID', ignoreFocusOut: true }) ?? '';
        config.azureClientSecret = await vscode.window.showInputBox({ prompt: 'Azure Client Secret', password: true, ignoreFocusOut: true }) ?? '';
      }

      if (config.enableEf) {
        config.connectionString = await vscode.window.showInputBox({ prompt: 'Database connection string', ignoreFocusOut: true }) ?? '';
      }

      const tempFile = path.join(os.tmpdir(), `scaffold-${Date.now()}.json`);
      await fs.promises.writeFile(tempFile, JSON.stringify(config, null, 2));

      const terminal = vscode.window.createTerminal('Internal Scaffold');
      terminal.show();
      terminal.sendText(`npx internal-scaffold init --config "${tempFile}"`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Scaffolding failed: ${err.message}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
