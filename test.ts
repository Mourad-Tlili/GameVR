import { Game } from "./game.test.ts";

let newLiveGame = new Game();

const response = await fetch(
  "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
);
const liveGamesArray: Game[] = [];

const data = await response.json();
for (let i = 0; i < data.Result.Items[0].Items.length; i++) {
  //console.log(i);
  const allGames = data?.Result?.Items[0]?.Items[i]?.Events[0];
  //Deno.writeTextFile("./results.txt", JSON.stringify(allGames));
  //console.log(allGames.LiveScore);

  const longIdd = allGames.Id;
  const GameChamp = allGames.ChampName;
  const EventCode = allGames.EventCode;
  const LiveScore = allGames.LiveScore;
  const GameDate = allGames.EventDate;
  let timeVariable: any;
  if (allGames.LiveCurrentTime.length == 2) {
    timeVariable = allGames.LiveCurrentTime.substr(0, 1);
  } else {
    timeVariable = allGames.LiveCurrentTime.substr(0, 2);
  }
  const GameCurrentTime = Number(timeVariable);
  const HomeTeam = allGames.Competitors[0].Name;
  const AwayTeam = allGames.Competitors[1].Name;

  newLiveGame.longId = longIdd;
  newLiveGame.champName = GameChamp;
  newLiveGame.gameCode = EventCode;
  newLiveGame.gameLiveScore = LiveScore;
  newLiveGame.gameDate = GameDate;
  newLiveGame.gameTime = GameCurrentTime;
  newLiveGame.homeTeam = HomeTeam;
  newLiveGame.awayTeam = AwayTeam;

  //console.log(allGames);
  // console.log(allGames.HomeTeam);

  console.log(newLiveGame);

  // liveGamesArray.push(newLiveGame);
}
console.log(liveGamesArray);
