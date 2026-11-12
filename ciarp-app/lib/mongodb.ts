import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

declare global {
  var mongodbClient: MongoClient | undefined;
  var mongodbClientPromise: Promise<MongoClient> | undefined;
}

function getClient(): MongoClient {
  if (!uri || !dbName) {
    throw new Error("MongoDB environment variables are not configured");
  }

  if (!globalThis.mongodbClient) {
    globalThis.mongodbClient = new MongoClient(uri);
  }

  return globalThis.mongodbClient;
}

export async function closeMongoDb(): Promise<void> {
  if (globalThis.mongodbClient) {
    await globalThis.mongodbClient.close();
    globalThis.mongodbClient = undefined;
    globalThis.mongodbClientPromise = undefined;
  }
}

export function getMongoDbReference(): Db {
  return getClient().db(dbName as string);
}

export async function getMongoDb(): Promise<Db> {
  if (!globalThis.mongodbClientPromise) {
    globalThis.mongodbClientPromise = getClient().connect();
  }

  const client = await globalThis.mongodbClientPromise;
  return client.db(dbName as string);
}
