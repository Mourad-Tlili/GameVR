// importing the deno_mongo package from url
import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.28.0/mod.ts";

// inserting into the db
interface GameSchema {
  gameTime?: Number;
  gameCode?: Number;
  gameDate?: string;
  champName?: string;
  homeTeam?: string;
  awayTeam?: string;
  gameLiveScore?: string;
}

/*       newGame.gameCode = data.Result.EventId;
      newGame.gameTime = data.Result.LiveCurrentTime;
      newGame.gameDate = data.Result.EventDate;
      newGame.champName = data.Result.Name;
      newGame.homeTeam = data.Result.Competitors[0].Name;
      newGame.awayTeam = data.Result.Competitors[1].Name;
      newGame.gameLiveScore = data.Result.LiveScore; */

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

export { db, GameCollection, GameIDCollection, GameSchema };
