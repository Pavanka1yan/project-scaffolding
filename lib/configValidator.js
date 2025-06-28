"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
// supported architecture patterns for project generation
const allowedArchitectures = ["clean", "layered", "onion", "ddd"];
const allowedApiTypes = ["rest", "graphql"];
function validateConfig(config) {
    var _a, _b, _c, _d, _e;
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
    const apiType = config.apiType || "rest";
    if (!allowedApiTypes.includes(apiType)) {
        errors.push(`apiType must be one of ${allowedApiTypes.join(', ')}`);
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
        apiType,
        preset: config.preset,
        enableAuth: (_a = config.enableAuth) !== null && _a !== void 0 ? _a : false,
        enableEf: (_b = config.enableEf) !== null && _b !== void 0 ? _b : false,
        enableHttpClients: (_c = config.enableHttpClients) !== null && _c !== void 0 ? _c : false,
        enableSwagger: (_d = config.enableSwagger) !== null && _d !== void 0 ? _d : false,
        enableCors: (_e = config.enableCors) !== null && _e !== void 0 ? _e : false,
    };
}
