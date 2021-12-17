import { GameCollection } from "../helpers/dbconnect.ts";

// This is the function that gets the data of a friend from the database.
export const getSameGames: any = async (sameGame: string) => {
  try {
    const data = await GameCollection.find({ champName: sameGame }).toArray();

    if (data) {
      return data;
    } else {
      return 0;
    }
  } catch (e) {
    // if some error occured while searching the db
    console.log(e);
  }
};
