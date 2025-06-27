"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
const allowedArchitectures = ["clean", "layered"];
function validateConfig(config) {
    const errors = [];
    if (!config.projectName) {
        errors.push("projectName is required");
    }
    if (!config.backend) {
        errors.push("backend is required");
    }
    if (!config.frontend) {
        errors.push("frontend is required");
    }
    if (!config.database) {
        errors.push("database is required");
    }
    const architecture = config.architecture || "layered";
    if (!allowedArchitectures.includes(architecture)) {
        errors.push(`architecture must be one of ${allowedArchitectures.join(', ')}`);
    }
    if (errors.length) {
        throw new Error("Config validation failed: " + errors.join(", "));
    }
    return {
        projectName: config.projectName,
        backend: config.backend,
        frontend: config.frontend,
        database: config.database,
        architecture,
        preset: config.preset,
        enableAuth: config.enableAuth ?? false,
    };
}
