import { Game } from "../Models/game.test.ts";

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
for (let j = sortedArray.length - 1; j >= 0; j--) {
  //console.log(sortedArray[j].gameTime);
  if ((await saveLastScore(sortedArray[sortedArray.length - 1])) == 1) {
    let finishedGame = sortedArray.pop();
    j--;
    console.log(`Game ${finishedGame} Finished`);
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
  let counter = 0;

  if (game.gameTime >= 20) {
    let stopWatch = 0;

    while (game.gameTime != undefined) {
      // console.log(typeof game.gameTime);

      const gameID = game.longId; //gameTime
      const response = await fetch(
        "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
      );
      const data = await response.json();
      //Open File
      for (let i = 0; i < data.Result.Items[0].Items.length; i++) {
        var allGames = data?.Result?.Items[0]?.Items[i]?.Events[0];
        if (allGames.ChampId == game.leagueID && allGames.Id == game.longId) {
          console.log(allGames.Name);
          console.log(allGames.LiveScore);
          console.log("GAME TIMEEEEE ", game.gameTime);
          game.homeTeam = allGames.Competitors[0];
          game.awayTeam = allGames.Competitors[1];

          if (typeof allGames.LiveScore != "string") {
            console.log("wfe !!!!!!!!!!!!!!!!!!!");
          }

          let z = allGames.LiveCurrentTime.split("'");
          // console.log(z[0]);

          let d = Number(z[0]); //From JSON

          //console.log(typeof d);
          game.gameTime = d;

          //console.log(game.gameTime);

          // console.log("TYPE-------" + typeof game.gameTime);

          game.gameLiveScore = allGames.LiveScore; //To keep the game Live with exact time.
        }
        //ADDING RESULTS TO ARRAY BEFORE WRITING IN FILE (ONLY write in file the last added value in this array for every GAME !! )

        //resultsArray.push(game);
        //ADD function here if(game exist in resultsArray then override it)
      }

      let x;
      if (game.gameTime == x) {
        stopWatch++;
      } else {
        stopWatch = 0;
      }
      x = game.gameTime;

      if (stopWatch == 200) {
        break;
      }

      upsert(resultsArray, game);
    }
    /* if (game.gameTime == undefined) {
      return 1;
    } */
    Deno.writeTextFile(
      "./results.txt",
      JSON.stringify(resultsArray[resultsArray.length - 1]),
      {
        append: true,
      }
    );
    //Write only one time issue ! THIS CODE SHOULD NOT BE HERE !
  } else {
    console.log("Akal mel 90");
    return -1;
  }
}

function upsert(resultsArray: any[], game: Game) {
  // (1)
  const i = resultsArray.findIndex((_game) => _game === game);
  if (i > -1) {
    resultsArray[i] = game;
    //return 1;

    console.log("------------------Override------------------", game.gameTime);
  }
  // (2)
  else {
    resultsArray.push(game);
    console.log("------------------PUSH------------------");
    // return -1;
  }
  //console.log("Results Array Length 137 " + resultsArray.length);
  //console.log(resultsArray);
  //  console.log(resultsArray);

  return resultsArray;
}
/* 
function IfGameExistInArray(resultsArray: any[], game: Game) {
  for (var i = resultsArray.length; i < 0; i--) {
    if (resultsArray[i].longId == game.longId) {
      resultsArray[i] = game;
    } else {
      resultsArray.push(game);
    }
    return resultsArray;
  }
} */
//Delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}
