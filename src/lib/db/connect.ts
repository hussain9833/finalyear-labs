import "server-only";
import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "@/lib/env";

mongoose.set("strictQuery", true);
// Strips `$`-prefixed operators from filter objects built from user input.
mongoose.set("sanitizeFilter", true);

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as unknown as { __mongoose?: Cache };
const cache: Cache = globalForMongoose.__mongoose ?? { conn: null, promise: null };
globalForMongoose.__mongoose = cache;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("MONGODB_URI is not configured.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export function isDatabaseConfigured() {
  return Boolean(env().MONGODB_URI);
}

export async function connectDB() {
  if (cache.conn) return cache.conn;
  const { MONGODB_URI, MONGODB_DB } = env();
  if (!MONGODB_URI) throw new DatabaseNotConfiguredError();

  if (!cache.promise) {
    // Opt-in: some local networks (common on Windows) refuse SRV lookups from Node's resolver,
    // breaking mongodb+srv:// URIs. MONGODB_DNS_SERVERS="8.8.8.8,1.1.1.1" works around it.
    const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean);
    if (dnsServers?.length) dns.setServers(dnsServers);
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
