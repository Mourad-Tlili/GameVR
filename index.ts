


import { Game } from "./game.model.ts";

const response = await fetch("https://sb1capi-altenar.biahosted.com/Sportsbook/GetLivenow?timezoneOffset=-60&langId=39&skinName=dreamsbet365&configId=1&culture=fr-FR&deviceType=Desktop&numformat=en&sportId=270&showAllEvents=false");
const data = await response.json();

const newGame = new Game();
  let gameArray: Game[] = [];

for (var i=0; i<data.Result.Items[0].Events.length; i++) {
  
const longIdd =  data.Result.Items[0].Events[i].Id; 
const GameChamp = data.Result.Items[0].Events[i].ChampName;
const EventCode = data.Result.Items[0].Events[i].EventCode;
const LiveScore = data.Result.Items[0].Events[i].LiveScore;
const GameDate =  data.Result.Items[0].Events[i].EventDate

newGame.gameCode = EventCode;
newGame.gameLiveScore = LiveScore;
newGame.champName = GameChamp;
newGame.gameDate = GameDate;
newGame.longId = longIdd;

if(data.Result.Items[0].Events[i].LiveCurrentTime.length == 2){
  const timenoww = data.Result.Items[0].Events[i].LiveCurrentTime.substr(0,1);
  
  var timeNow = Number(timenoww);
  newGame.gameTime = timeNow;
  //console.log(newGame);
 // console.log("Timenow : " + timeNow);
//console.log(data.Result.Items[0].Events[i].LiveCurrentTime);
 // console.log("Event code : " + EventCode);
 // console.log("Score now : " + LiveScore);

}else if(data.Result.Items[0].Events[i].LiveCurrentTime.length == 3) {
    const timenoww = data.Result.Items[0].Events[i].LiveCurrentTime.substr(0,2);
      var timeNow = Number(timenoww);
        newGame.gameTime = timeNow;
//  console.log(newGame);

/*
  console.log("Event code : " + EventCode);
  console.log("Timenow : " + timeNow);
  console.log("Score now : " + LiveScore);
*/

}else{
  console.log(data.Result.Items[0].Events[i].LiveCurrentTime);
}

for (var j=0; j<data.Result.Items[0].Events[i].Competitors.length; j++) {

  if(data.Result.Items[0].Events[i].Competitors[j].Order == 1){

newGame.homeTeam = data.Result.Items[0].Events[i].Competitors[j].Name;
   
  }else{
    
 newGame.awayTeam = data.Result.Items[0].Events[i].Competitors[j].Name
  }
  

}
 gameArray.push(newGame);
/*
//console.log(gameArray[i])
gameArray.sort(function(a, b): any {
  return <any>b.gameTime - <any>a.gameTime;
});
*/
console.log(gameArray[i]);

if(gameArray[i].gameTime as number < 90){

  const restTime = 90-<number>gameArray[i].gameTime
console.log(restTime)

}else if ((gameArray[i].gameTime as number > 90) || (gameArray[i].gameTime as number == 90)) {
console.log("fel 90+");
  while(gameArray[i] !== undefined){

  const response = await fetch("https://sb1capi-altenar.biahosted.com/Sportsbook/GetLivenow?timezoneOffset=-60&langId=39&skinName=dreamsbet365&configId=1&culture=fr-FR&deviceType=Desktop&numformat=en&sportId=270&showAllEvents=false&eventId="+gameArray[i].longId);
  const data = await response.json();  
  
  for (var k=0; k<data.Result.Items[0].Events.length; k++) {

  newGame.gameLiveScore = data.Result.Items[0].Events[k].LiveScore;
console.log("boucle API " + k)
console.log(newGame.gameLiveScore);

  }
  }
}else{
  console.log("shay");
}
gameArray.push(newGame);
console.log(gameArray);

}







