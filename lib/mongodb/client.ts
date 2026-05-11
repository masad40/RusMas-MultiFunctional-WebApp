import { type Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error('Missing environment variable "MONGODB_URI"'),
    );
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const name = process.env.MONGODB_DB_NAME ?? "rusmas";
  return client.db(name);
}
