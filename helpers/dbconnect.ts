// importing the deno_mongo package from url
import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.28.0/mod.ts";

// inserting into the db
interface GameSchema {
  gameTime?: Number;
  longId?: Number;
  gameDate?: string;
  champName?: string;
  homeTeam?: string;
  awayTeam?: string;
  gameLiveScore?: string;
}

interface GameIDSchema {
  _id: { $oid: string };
  longId: BigInt;
}

// Create client
const client = new MongoClient();
// Connect to mongodb
//await client.connect("mongodb://127.0.0.1:27017" || "");
//mongodb+srv://<username>:<password>@cluster0.pawj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
await client.connect(
  "mongodb+srv://mimou:Mimou123@cluster0.pawj3.mongodb.net/GameVR?retryWrites=true&w=majority&authMechanism=SCRAM-SHA-1" ||
    ""
);

// Specifying the database name
const dbname: string = "GameVR";
const db = client.database(dbname);

// Declare the collections here. Here we are using only one collection (i.e friends).
const GameCollection = db.collection<GameSchema>("games");
const GameIDCollection = db.collection<GameIDSchema>("gamesID");
// @ts-ignore
export { db, GameCollection, GameIDCollection, GameSchema };
