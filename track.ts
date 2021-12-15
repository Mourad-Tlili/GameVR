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

let j = sortedArray.length - 1;
let resultsData = await saveLastScore(sortedArray[j]);

if (resultsData == 1) {
  j--;
  let finishedGame = sortedArray.pop();
  console.log(finishedGame);
  console.log(`Game ${finishedGame} has FINISHED !`);
}

async function saveLastScore(game: Game) {
  const resultsArray: Game[] = [];
  while (game.gameTime >= 50) {
    const gameID = game.longId; //gameTime
    const isLiveAPI = await fetch(
      "https://sb1capi-altenar.biahosted.com/Sportsbook/GetEventExternalInfo?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&deviceType=Desktop&numformat=en&eventId=" +
        gameID
    );
    const timeScoreAPI = await fetch(
      "https://sb1capi-altenar.biahosted.com/Sportsbook/GetEventTrackerInfo?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&deviceType=Desktop&numformat=en&eventId=" +
        gameID
    );

    const isLiveData = await isLiveAPI.json();
    const timeScoreData = await timeScoreAPI.json();
    let isLive = isLiveData.Result.IsLive; //Live or no

    let liveScore = timeScoreData.Result.LiveScore; //Score from JSON
    let currentTime = timeScoreData.Result.LiveCurrentTime; //Time from JSON

    let gameResults = new Game(); //New Game

    gameResults.homeTeam = timeScoreData.Result.Competitors[0].Name; //HomeTeam in model
    gameResults.awayTeam = timeScoreData.Result.Competitors[1].Name; //AwayTeam in model
    gameResults.gameLiveScore = liveScore; //LiveScore in model
    gameResults.longId = gameID;
    gameResults.gameTime = currentTime;

    while (isLive) {
      let newResultsArray = upsert(resultsArray, gameResults);
      console.log(newResultsArray);
      console.log(newResultsArray.length);
      break;
    }
    if (!isLive) {
      console.log("Game Finished !");
      return 1;
    } else {
      console.log("Game Not finished YET  !");
    }
  }
  console.log("akal mel 90");
}

function upsert(resultsArray: Game[], game: Game) {
  // (1)
  const i = resultsArray.findIndex((_game) => _game.longId === game.longId);
  if (i > -1) {
    resultsArray[i] = game;
    console.log("------------------Override------------------");
  }
  // (2)
  else {
    resultsArray.push(game);
    console.log("------------------PUSH------------------");
  }
  return resultsArray;
}

//Delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}
