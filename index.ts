import { Game } from "./game.model.ts";
//import { writeFileStr } from "https://deno.land/std@0.51.0/fs/mod.ts";

const response = await fetch(
  "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=0&categoryids=0&champids=1000012358&group=AllEvents&outrightsDisplay=none&marketTypeIds=1%2C18&couponType=0&hasLiveStream=false"
);
const data = await response.json();

const newGame = new Game();
let gameArray: Game[] = [];

for (var i = 0; i < data.Result.Items[0].Events.length; i++) {
  const longIdd = data.Result.Items[0].Events[i].Id;
  const GameChamp = data.Result.Items[0].Events[i].ChampName;
  const EventCode = data.Result.Items[0].Events[i].EventCode;
  const LiveScore = data.Result.Items[0].Events[i].LiveScore;
  const GameDate = data.Result.Items[0].Events[i].EventDate;

  newGame.gameCode = EventCode;
  newGame.gameLiveScore = LiveScore;
  newGame.champName = GameChamp;
  newGame.gameDate = GameDate;
  newGame.longId = longIdd;

  if (data.Result.Items[0].Events[i].LiveCurrentTime.length == 2) {
    const timenoww = data.Result.Items[0].Events[i].LiveCurrentTime.substr(
      0,
      1
    );

    var timeNow = Number(timenoww);
    newGame.gameTime = timeNow;
    //console.log(newGame);
    // console.log("Timenow : " + timeNow);
    //console.log(data.Result.Items[0].Events[i].LiveCurrentTime);
    // console.log("Event code : " + EventCode);
    // console.log("Score now : " + LiveScore);
  } else if (data.Result.Items[0].Events[i].LiveCurrentTime.length == 3) {
    const timenoww = data.Result.Items[0].Events[i].LiveCurrentTime.substr(
      0,
      2
    );
    var timeNow = Number(timenoww);
    newGame.gameTime = timeNow;
    //  console.log(newGame);

    /*
  console.log("Event code : " + EventCode);
  console.log("Timenow : " + timeNow);
  console.log("Score now : " + LiveScore);
*/
  } else {
    console.log(data.Result.Items[0].Events[i].LiveCurrentTime);
  }

  for (var j = 0; j < data.Result.Items[0].Events[i].Competitors.length; j++) {
    if (data.Result.Items[0].Events[i].Competitors[j].Order == 1) {
      newGame.homeTeam = data.Result.Items[0].Events[i].Competitors[j].Name;
    } else {
      newGame.awayTeam = data.Result.Items[0].Events[i].Competitors[j].Name;
    }
  }
  gameArray.push(newGame);
  /*
//console.log(gameArray[i])
gameArray.sort(function(a, b): any {
  return <any>b.gameTime - <any>a.gameTime;
});
*/
  //console.log(gameArray[i]);

  if ((gameArray[i].gameTime as number) < 90) {
    const restTime = 90 - <number>gameArray[i].gameTime;
    console.log(restTime);
    console.log("Read time rest in secondes " + restTime * 9);
    //writeFileStr("./results.txt", gameArray[i].gameLiveScore);
    const convertedGameToString = JSON.stringify(gameArray[i]);

    Deno.writeTextFile("./results.txt", convertedGameToString);
    console.log(gameArray[i].gameLiveScore);
  } else if (
    (gameArray[i].gameTime as number) > 90 ||
    (gameArray[i].gameTime as number) == 90
  ) {
    const convertedGameToString = JSON.stringify(gameArray[i]);

    Deno.writeTextFile("./results.txt", convertedGameToString);
    console.log(gameArray[i].gameLiveScore);

    console.log("fel dkika : ", gameArray[i].gameTime);
    while (gameArray[i] !== undefined) {
      const response = await fetch(
        "https://sb1-geteventdetailsapi-altenar.biahosted.com/Sportsbook/GetEventDetails?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&eventId=" +
          gameArray[i].longId +
          "&sportId=270"
      );
      const data = await response.json();
      for (var k = 0; k < data.Result.Items[0].Events.length; k++) {
        newGame.gameLiveScore = data.Result.Items[0].Events[k].LiveScore;
        console.log("boucle API " + k);
        console.log(newGame.gameLiveScore);
      }
    }
  } else {
    console.log("shay");
  }
  gameArray.push(newGame);
  console.log(gameArray);
}
