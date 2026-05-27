const DEFAULTS = {
  PORT: 3000,
  DATABASE_URL: "mysql://root:root@localhost:3306/blog_db",
  JWT_SECRET: "change-me-in-production",
  JWT_EXPIRES_IN: "1d",
  NODE_ENV: "development",
} as const;

type EnvStringKey = "DATABASE_URL" | "JWT_SECRET" | "JWT_EXPIRES_IN" | "NODE_ENV";

const readString = (key: EnvStringKey, fallback: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    return fallback;
  }

  if (value.trim() === "") {
    throw new Error(`Environment variable ${key} must not be empty.`);
  }

  return value;
};

const readPort = (): number => {
  const value = process.env.PORT;
  if (value === undefined) {
    return DEFAULTS.PORT;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error("Environment variable PORT must be an integer between 1 and 65535.");
  }

  return parsed;
};

export const env = {
  PORT: readPort(),
  NODE_ENV: readString("NODE_ENV", DEFAULTS.NODE_ENV),
  DATABASE_URL: readString("DATABASE_URL", DEFAULTS.DATABASE_URL),
  JWT_SECRET: readString("JWT_SECRET", DEFAULTS.JWT_SECRET),
  JWT_EXPIRES_IN: readString("JWT_EXPIRES_IN", DEFAULTS.JWT_EXPIRES_IN),
} as const;
