import { GameIDCollection } from "../helpers/dbconnect.ts";
// This is the function that adds a friend to the database.
export const addGameID = async (context: any, longId: BigInt) => {
  try {
    // inserting into the db
    console.log("test");
    const gameInserted = await GameIDCollection.insertOne({ longId: longId });
    console.log("SUCCES !");

    // sending the response

    console.log("---------------------INSERTED----------------", gameInserted);
  } catch (e) {
    // when the insertion fails

    console.log(e);
  }
};
