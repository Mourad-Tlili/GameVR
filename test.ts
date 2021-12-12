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
console.log(sortedArray);
let multiple = false;
for (let j = sortedArray.length - 1; j > 0; j--) {
  console.log(sortedArray[j].gameTime);
  saveLastScore(sortedArray[j]);
  saveLastScore(sortedArray[j - 1]);
  //NEED SOLUTION HERE TO ITERATE NEXT GAME AFTER FINISHING ONE !
}
async function saveLastScore(game: Game) {
  /*   if (game.gameTime == NaN) {
    return;
  } */
  const resultsArray: Game[] = [];

  if (game.gameTime >= 70) {
    while (game.gameTime != undefined) {
      const gameID = game.longId; //gameTime
      const response = await fetch(
        "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
      );
      const data = await response.json();
      //Open File
      const file = Deno.openSync("./results.txt", {
        create: true,
        append: true,
      });

      for (let i = 0; i < data.Result.Items[0].Items.length; i++) {
        const allGames = data?.Result?.Items[0]?.Items[i]?.Events[0];
        if (allGames.ChampId == game.leagueID && allGames.Id == game.longId) {
          console.log(allGames.Name);
          console.log(allGames.LiveScore);
          console.log(game.gameTime);

          game.homeTeam = allGames.Competitors[0];
          game.homeTeam = allGames.Competitors[1];
          game.gameTime = allGames.LiveCurrentTime;

          game.gameLiveScore = allGames.LiveScore; //To keep the game Live with exact time.
        }
        //ADDING RESULTS TO ARRAY BEFORE WRITING IN FILE (ONLY write in file the last added value in this array for every GAME !! )
        resultsArray.push(game);
      }
    }
    //Write only one time issue ! THIS CODE SHOULD NOT BE HERE !
    Deno.writeTextFile(
      "./results.txt",
      JSON.stringify(resultsArray[resultsArray.length - 1]),
      {
        append: true,
      }
    );
  } else {
    console.log("Akal mel 90");
  }
  return;
}

//Delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}

/* function undefinedGames(game: Game) {
  const response = await fetch(
    "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
  );
  const data = await response.json();
} */
