/**
 * Local MongoDB without Docker (development only).
 * Downloads a mongod binary on first run and keeps data in ./.data/mongo between runs.
 *   npm run db:local   → mongodb://127.0.0.1:27017/finalyear_labs
 */
import { mkdirSync } from "node:fs";
import { MongoMemoryServer } from "mongodb-memory-server-core";

const dbPath = new URL("../.data/mongo", import.meta.url);
mkdirSync(dbPath, { recursive: true });

const server = await MongoMemoryServer.create({
  instance: { port: 27017, ip: "127.0.0.1", dbPath: decodeURIComponent(dbPath.pathname.replace(/^\/([A-Za-z]:)/, "$1")), storageEngine: "wiredTiger" },
  binary: { version: "8.0.4" },
});

console.log(`MongoDB running at ${server.getUri()}finalyear_labs  (Ctrl+C to stop)`);

const stop = async () => {
  await server.stop({ doCleanup: false });
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
