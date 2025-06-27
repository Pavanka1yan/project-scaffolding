export interface ScaffoldConfig {
  projectName?: string;
  backend?: string;
  frontend?: string;
  database?: string;
  architecture?: string;
  preset?: string;
  enableAuth?: boolean;
  enableEf?: boolean;
}

export interface ValidatedConfig {
  projectName: string;
  backend: string;
  frontend: string;
  database: string;
  architecture: string;
  preset?: string;
  enableAuth: boolean;
  enableEf: boolean;
}

const allowedArchitectures = ["clean", "layered"];

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

  if (errors.length) {
    throw new Error("Config validation failed: " + errors.join(", "));
  }

  return {
    projectName: config.projectName!,
    backend: config.backend!,
    frontend: config.frontend!,
    database: config.database!,
    architecture,
    preset: config.preset,
    enableAuth: config.enableAuth ?? false,
    enableEf: config.enableEf ?? false,
  };
}
