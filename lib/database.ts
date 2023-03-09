import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri: string = process.env.NEXT_PUBLIC_MONGODB_URI as string;
const options: MongoClientOptions = {};

let mongoClient: MongoClient | null = null;
let database: Db | null = null;

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

export async function connectToDatabase(): Promise<{
  mongoClient: MongoClient;
  database: Db;
}> {
  try {
    if (mongoClient && database) {
      return { mongoClient, database };
    }
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClient) {
        mongoClient = await MongoClient.connect(uri, options);
        global._mongoClient = mongoClient;
      } else {
        mongoClient = global._mongoClient;
      }
    } else {
      mongoClient = await MongoClient.connect(uri, options);
    }

    if (!mongoClient) throw new Error("Couldn't connect to MongoDB database");

    database = mongoClient.db(process.env.NEXT_PUBLIC_MONGODB_DATABASE);
    return { mongoClient, database };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
