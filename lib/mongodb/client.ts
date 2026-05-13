import { type Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error('Missing environment variable "MONGODB_URI"'),
    );
  }
  
  if (!clientPromise) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    clientPromise = client.connect();
  }
  
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const name = process.env.MONGODB_DB_NAME ?? "rusmas";
  return client.db(name);
}
