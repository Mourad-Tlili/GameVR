import { GameCollection } from "../helpers/dbconnect.ts";
import { Game } from "../Models/game.test.ts";
// This is the function that adds a friend to the database.
export const addGame = async (context: any, game: Game) => {
  try {
    // inserting into the db
    const gameInserted = await GameCollection.insertOne(game);
    console.log("SUCCES !");

    // sending the response
    //    const decoder = new TextDecoder();

    console.log("---------------------INSERTED----------------", gameInserted);
    context.response = gameInserted;
  } catch (e) {
    // when the insertion fails

    console.log(e);
  }
};
