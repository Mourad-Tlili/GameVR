import { Game } from "../Models/game.test";

const champsId: string[] = [
  "1000012356",
  "1000012359",
  "1000012360",
  "1000012357",
  "1000012351",
  "1000012358",
];

let newLiveGame = new Game();

for (let i = 0; i < champsId.length; i++) {
  console.log(champsId[i]);

  const response = await fetch(
    "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&deviceType=Desktop&numformat=en&sportids=0&categoryids=0&champids=" +
      champsId[i] +
      "&group=AllEvents&outrightsDisplay=none&marketTypeIds=1&couponType=0&hasLiveStream=false"
  );
  const data = await response.json();
  const allGames = data.Result.Items[0].Events[i];
  //console.log(allGames);

  const liveGamesArray: Game[] = [];
  if (allGames != undefined) {
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

    //console.log(newLiveGame);

    liveGamesArray.push(newLiveGame);
  } else {
    console.log("E league mafeha hatta torh live taoa !");
  }
  console.log(liveGamesArray);
}
