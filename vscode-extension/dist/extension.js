"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('internalScaffold.createProject', async () => {
        var _a, _b, _c, _d, _e, _f;
        try {
            const config = {};
            config.projectName = await vscode.window.showInputBox({ prompt: 'Project name' });
            if (!config.projectName) {
                throw new Error('Project name is required');
            }
            config.backend = await vscode.window.showQuickPick(['.NET 8', 'Node.js', 'None'], { placeHolder: 'Select backend' });
            if (!config.backend) {
                throw new Error('Backend technology is required');
            }
            config.frontend = await vscode.window.showQuickPick(['React', 'Blazor', 'None'], { placeHolder: 'Select frontend framework' });
            if (!config.frontend) {
                throw new Error('Frontend framework is required');
            }
            config.database = await vscode.window.showQuickPick(['SQL Server', 'Postgres', 'MongoDB', 'None'], { placeHolder: 'Select database' });
            if (!config.database) {
                throw new Error('Database selection is required');
            }
            config.apiType = (_a = await vscode.window.showQuickPick(['rest', 'graphql'], { placeHolder: 'API type' })) !== null && _a !== void 0 ? _a : 'rest';
            config.architecture = (_b = await vscode.window.showQuickPick(['clean', 'layered', 'onion', 'ddd'], { placeHolder: 'Architecture pattern' })) !== null && _b !== void 0 ? _b : 'layered';
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
                config.azureTenantId = (_c = await vscode.window.showInputBox({ prompt: 'Azure Tenant ID', ignoreFocusOut: true })) !== null && _c !== void 0 ? _c : '';
                config.azureClientId = (_d = await vscode.window.showInputBox({ prompt: 'Azure Client ID', ignoreFocusOut: true })) !== null && _d !== void 0 ? _d : '';
                config.azureClientSecret = (_e = await vscode.window.showInputBox({ prompt: 'Azure Client Secret', password: true, ignoreFocusOut: true })) !== null && _e !== void 0 ? _e : '';
            }
            if (config.enableEf) {
                config.connectionString = (_f = await vscode.window.showInputBox({ prompt: 'Database connection string', ignoreFocusOut: true })) !== null && _f !== void 0 ? _f : '';
            }
            const tempFile = path.join(os.tmpdir(), `scaffold-${Date.now()}.json`);
            await fs.promises.writeFile(tempFile, JSON.stringify(config, null, 2));
            const terminal = vscode.window.createTerminal('Internal Scaffold');
            terminal.show();
            terminal.sendText(`npx internal-scaffold init --config "${tempFile}"`);
        }
        catch (err) {
            vscode.window.showErrorMessage(`Scaffolding failed: ${err.message}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
