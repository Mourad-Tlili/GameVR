import { GameCollection } from "../helpers/dbconnect.ts";
import { Game } from "../Models/game.test.ts";
// This is the function that adds a friend to the database.
export const addManyGames = async (games: Game[]) => {
  try {
    // inserting into the db
    const gameInserted = await GameCollection.insertMany(games);
    console.log("SUCCES !");

    // sending the response
    //    const decoder = new TextDecoder();

    console.log(
      "---------------------INSERTED-Many-Games----------------",
      gameInserted
    );
  } catch (e) {
    // when the insertion fails

    console.log(e);
  }
};
