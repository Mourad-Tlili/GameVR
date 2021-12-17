// importing the deno_mongo package from url
import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.28.0/mod.ts";

// inserting into the db
interface GameSchema {
  _id: { $oid: string };
  gameLiveScore: string;
  champName: string;
}

interface GameIDSchema {
  _id: { $oid: string };
  longId: BigInt;
}

// Create client
const client = new MongoClient();
// Connect to mongodb
await client.connect("mongodb://127.0.0.1:27017" || "");

// Specifying the database name
const dbname: string = "GameVR";
const db = client.database(dbname);

// Declare the collections here. Here we are using only one collection (i.e friends).
const GameCollection = db.collection<GameSchema>("games");
const GameIDCollection = db.collection<GameIDSchema>("gamesID");

export { db, GameCollection, GameIDCollection };
