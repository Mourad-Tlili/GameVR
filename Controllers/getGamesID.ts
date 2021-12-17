import { GameIDCollection } from "../helpers/dbconnect.ts";

// This is the function that gets the data of a friend from the database.
export const getGamesID: any = async () => {
  try {
    const data = await GameIDCollection.find({}).toArray();

    if (data) {
      console.log(
        "----------------------THIS IS RETURNED DATA----------------------"
      );
      return data;
    } else {
      return 0;
    }
  } catch (e) {
    // if some error occured while searching the db
    console.log("s");
  }
};
