import "server-only";
import { z } from "zod";

const optional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: optional,
  MONGODB_DB: optional,
  AUTH_SECRET: optional,
  RATE_LIMIT_SALT: optional,
  ANALYTICS_TZ: z.string().default("Asia/Kolkata"),
  ANALYTICS_RETENTION_DAYS: z.coerce.number().int().positive().default(730),
  WHATSAPP_DEFAULT_NUMBER: optional,
  WHATSAPP_SALES_NUMBER: optional,
  WHATSAPP_AI_NUMBER: optional,
  WHATSAPP_WEB_NUMBER: optional,
  WHATSAPP_ECOMMERCE_NUMBER: optional,
  WHATSAPP_SUPPORT_NUMBER: optional,
  WHATSAPP_CUSTOM_NUMBER: optional,
  GOOGLE_SITE_VERIFICATION: optional,
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

export function env(): ServerEnv {
  if (!cached) cached = schema.parse(process.env);
  return cached;
}

export const isProd = () => env().NODE_ENV === "production";

/** Returns a required secret, failing loudly in production and falling back to a dev-only value locally. */
export function requireSecret(name: "AUTH_SECRET" | "RATE_LIMIT_SALT"): string {
  const value = env()[name];
  if (value && value.length >= 32) return value;
  if (isProd()) {
    throw new Error(`${name} must be set to at least 32 characters in production.`);
  }
  return `dev-only-insecure-${name}-change-me-0123456789abcdef`;
}
