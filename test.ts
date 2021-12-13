import { Game } from "./game.test.ts";

const response = await fetch(
  "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
);
const data = await response.json();

const liveGamesArray: Game[] = [];
//const undefinedGames: Game[] = [];
//Parsing data.
for (let i = 0; i < data.Result.Items[0].Items.length; i++) {
  const allGames = data?.Result?.Items[0]?.Items[i]?.Events[0];
  //Deno.writeTextFile("./results.txt", JSON.stringify(allGames));
  let newLiveGame = new Game();

  const longIdd = allGames.Id;
  const GameChamp = allGames.ChampName;
  const EventCode = allGames.EventCode;
  const LiveScore = allGames.LiveScore;
  const GameDate = allGames.EventDate;
  const leagueID = allGames.ChampId;

  let timeVariable: any;
  if (allGames.LiveCurrentTime.length == 2) {
    timeVariable = allGames.LiveCurrentTime.substr(0, 1);
  } else {
    timeVariable = allGames.LiveCurrentTime.substr(0, 2);
  }
  const GameCurrentTime = Number(timeVariable);

  const HomeTeam = allGames.Competitors[0].Name;
  const AwayTeam = allGames.Competitors[1].Name;

  //Adding data to class Game
  newLiveGame.longId = longIdd;
  newLiveGame.champName = GameChamp;
  newLiveGame.gameCode = EventCode;
  newLiveGame.gameLiveScore = LiveScore;
  newLiveGame.gameDate = GameDate;
  newLiveGame.gameTime = GameCurrentTime;
  newLiveGame.homeTeam = HomeTeam;
  newLiveGame.awayTeam = AwayTeam;
  newLiveGame.leagueID = leagueID;

  liveGamesArray.unshift(newLiveGame);
}
//sorting array
let sortedArray = liveGamesArray.sort(
  ({ gameTime: a }, { gameTime: b }) => a.valueOf() - b.valueOf()
);

//console.log(sortedArray);
//let multiple = false; //Solution to try !
for (let j = sortedArray.length - 1; j > 0; j--) {
  //console.log(sortedArray[j].gameTime);
  if ((await saveLastScore(sortedArray[j])) == 1) {
    sortedArray.pop();
    console.log("Game Finished !");
  }

  //saveLastScore(sortedArray[j - 1]);
  //NEED SOLUTION HERE TO ITERATE NEXT GAME AFTER FINISHING ONE !
}
async function saveLastScore(game: Game) {
  /*   if (game.gameTime == NaN) {
    return;
  } */
  const resultsArray: Game[] = [];

  const file = Deno.openSync("./results.txt", {
    create: true,
    append: true,
  });

  if (game.gameTime >= 10) {
    while (game.gameTime != undefined) {
      const gameID = game.longId; //gameTime
      const response = await fetch(
        "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
      );
      const data = await response.json();
      //Open File
      for (let i = 0; i < data.Result.Items[0].Items.length; i++) {
        const allGames = data?.Result?.Items[0]?.Items[i]?.Events[0];
        if (allGames.ChampId == game.leagueID && allGames.Id == game.longId) {
          /*       console.log(allGames.Name);
          console.log(allGames.LiveScore);
          console.log(game.gameTime); */

          game.homeTeam = allGames.Competitors[0];
          game.homeTeam = allGames.Competitors[1];
          game.gameTime = allGames.LiveCurrentTime;

          game.gameLiveScore = allGames.LiveScore; //To keep the game Live with exact time.
        }
        //ADDING RESULTS TO ARRAY BEFORE WRITING IN FILE (ONLY write in file the last added value in this array for every GAME !! )

        //resultsArray.push(game);
        //ADD function here if(game exist in resultsArray then override it)

        upsert(resultsArray, game);
      }
    }
    //Write only one time issue ! THIS CODE SHOULD NOT BE HERE !
    /*   Deno.writeTextFile(
      "./results.txt",
      JSON.stringify(resultsArray[resultsArray.length - 1]),
      {
        append: true,
      }
    ); */
    return 1;
  } else {
    console.log("Akal mel 90");
    return -1;
  }
  return 0;
}

function upsert(resultsArray: any[], game: Game) {
  // (1)
  const i = resultsArray.findIndex((_game) => _game === game);
  if (i > -1) {
    resultsArray[i] = game;
    //return 1;
    console.log("------------------Override------------------");
  }
  // (2)
  else {
    resultsArray.push(game);
    console.log("------------------PUSH------------------");
    // return -1;
  }
  console.log(resultsArray.length);
}

function IfGameExistInArray(resultsArray: any[], game: Game) {
  for (var i = resultsArray.length; i < 0; i--) {
    if (resultsArray[i].longId == game.longId) {
      resultsArray[i] = game;
    } else {
      resultsArray.push(game);
    }
    return resultsArray;
  }
}
//Delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}
