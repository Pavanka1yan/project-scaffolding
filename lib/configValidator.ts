export interface ScaffoldConfig {
  projectName?: string;
  backend?: string;
  frontend?: string;
  database?: string;
  architecture?: string;
  apiType?: string;
  preset?: string;
  enableAuth?: boolean;
  enableEf?: boolean;
  enableHttpClients?: boolean;
  enableSwagger?: boolean;
  enableCors?: boolean;
  plugins?: string[];
}

export interface ValidatedConfig {
  projectName: string;
  backend: string;
  frontend: string;
  database: string;
  architecture: string;
  apiType: string;
  preset?: string;
  enableAuth: boolean;
  enableEf: boolean;
  enableHttpClients: boolean;
  enableSwagger: boolean;
  enableCors: boolean;
  plugins: string[];
}

// supported architecture patterns for project generation
const allowedArchitectures = ["clean", "layered", "onion", "ddd"];
const allowedApiTypes = ["rest", "graphql"];

export function validateConfig(config: ScaffoldConfig): ValidatedConfig {
  const errors: string[] = [];
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
    projectName: config.projectName!,
    backend: config.backend!,
    frontend: config.frontend!,
    database: config.database!,
    architecture,
    apiType,
    preset: config.preset,
    enableAuth: config.enableAuth ?? false,
    enableEf: config.enableEf ?? false,
    enableHttpClients: config.enableHttpClients ?? false,
    enableSwagger: config.enableSwagger ?? false,
    enableCors: config.enableCors ?? false,
    plugins: config.plugins ?? [],
  };
}
