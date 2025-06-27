"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacePlaceholders = replacePlaceholders;
exports.copyTemplates = copyTemplates;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function replacePlaceholders(content, variables) {
    return content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const k = key.trim();
        return Object.prototype.hasOwnProperty.call(variables, k) ? variables[k] : '';
    });
}
async function copyTemplates(templateDir, destDir, variables = {}) {
    await fs_1.default.promises.mkdir(destDir, { recursive: true });
    const entries = await fs_1.default.promises.readdir(templateDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path_1.default.join(templateDir, entry.name);
        const destPath = path_1.default.join(destDir, entry.name);
        if (entry.isDirectory()) {
            await copyTemplates(srcPath, destPath, variables);
        }
        else {
            let content = await fs_1.default.promises.readFile(srcPath, 'utf-8');
            content = replacePlaceholders(content, variables);
            await fs_1.default.promises.mkdir(path_1.default.dirname(destPath), { recursive: true });
            await fs_1.default.promises.writeFile(destPath, content);
        }
    }
}
