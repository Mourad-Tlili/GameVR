import { GameCollection, GameSchema } from "../helpers/dbconnect.ts";
import { Game } from "../Models/game.test.ts";
import { ifExists } from "./ifExists.ts";
// This is the function that adds a friend to the database.
export const addGameCollect = async (game: GameSchema) => {
  try {
    const ifExistsVar = ifExists(game.longId);

   if(ifExistsVar.then(function(result){
return result }) == 1){ 
      const gameInserted = await GameCollection.insertOne(game);
      console.log("SUCCES !");

    
    console.log("---------------------INSERTED----------------", gameInserted);
 }else{
  console.log("****** GAME EXIST IN DB *********")
} 
   catch (e) {
    // when the insertion fails

    console.log(e);
  }
  
};
}