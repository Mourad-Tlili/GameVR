import { GameIDCollection } from "../helpers/dbconnect.ts";

// This is the function that gets the data of a friend from the database.
export const ifExists: any = async (id: BigInt) => {
  try {
    const data = await GameIDCollection.findOne(
      { longId: id },
      { noCursorTimeout: false }
    );
    if (data) {
      return -1;
    } else {
      return 1;
    }
  } catch (e) {
    // if some error occured while searching the db
    console.log(e);
  }
};
