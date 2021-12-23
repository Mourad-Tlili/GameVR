import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import * as flags from "https://deno.land/std/flags/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Game } from "../Models/game.test.ts";
import { addGameID } from "../Controllers/addGameID.ts";
import { ifExists } from "../Controllers/ifExists.ts";
import { getGamesID } from "../Controllers/getGamesID.ts";
import { addGameCollect } from "../Controllers/addGameCollect.ts";
import { getSameGames } from "../Controllers/getSameGames.ts";
import pogo from "https://deno.land/x/pogo/main.ts";

import { serve } from "https://deno.land/std@0.79.0/http/server.ts"; //For Heroku
import { parse } from "https://deno.land/std/flags/mod.ts"; //For Heroku
const { args, exit } = Deno; //For Heroku

const router = new Router();
const app = new Application();
const DEFAULT_PORT = Number(config()["PORT"]) || 8000;
const argPort = flags.parse(args).port;
let PORT = argPort ? Number(argPort) : DEFAULT_PORT;

//const s = serve({ port: PORT }); //For Heroku

// Starting the server

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Game running on port ", PORT);
/* const server = pogo.server({ port: PORT });

server.router.get("/", () => {
  return "Game VR is Running ... ! !";
});
server.start(); */
await app.listen({ port: PORT });

const response = await fetch(
  "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
);
const testData = await response.json();
let variable = testData.Result.Items[0].Items.length;

/* 
//User Input !
const buf = new Uint8Array(1024);
console.log("Choose an Option : ");
console.log("1- Get Same Games  : ");
console.log("2- Run collect ID  : ");

const n = await Deno.stdin.read(buf);

if (n == Deno.EOF) {
  console.log("Standard input closed");
} else {
  let userInput = new TextDecoder().decode(buf.subarray(0, n));
  console.log("READ:", userInput);
  if (userInput == 1) {
    console.log("Same games function here ");

    let sameGamesArray = getSameGames("Kasimpasa vs. Fenerbahce");
    /*   gamesIdArray.then(function (value: any) {
    value.forEach(async function (valueID: any) { 
    sameGamesArray.then(function (value: any) {
      value.forEach(async function (game: any) {
        console.log("THIS IS RESULT ", game);
      });
    });
  } else if (userInput == 2) {
    mainFunc(testData, variable);
  } else {
    console.log("WRONG CHOICE !");
  }
} */
//mainFunc(testData, variable);

async function mainFunc(testData: any, variable: any) {
  while (testData.Result.Items[0].Items.length == variable) {
    const response = await fetch(
      "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
    );
    const data = await response.json();
    const liveGamesIdArray: BigInt[] = [];

    //Parsing data.
    for (let i = 0; i < data.Result.Items[0].Items.length; i++) {
      const allGames = data?.Result?.Items[0]?.Items[i]?.Events[0];

      const longId = allGames.Id;
      liveGamesIdArray.push(longId);
      // console.log(allGames.Competitors[0]);
      //console.log(allGames.Competitors[1]);
      console.log("liveGamesIdArray", liveGamesIdArray);
      let results = upsert(liveGamesIdArray, longId);

      let ifExistsVar = ifExists(results[i]);
      ifExistsVar.then(function (result: Number) {
        if (result == -1) {
          console.log(`This ID ${results[i]} exists already !`);
        } else {
          addGameID(results[i], results[i]);
        }
      });
    }
    console.log("-----------DELAY-----------");
    //console.log(obj.values());
    //convertData();
    await delay(6);
  }
}

function convertData() {
  let newGamesArray: Game[] = [];

  let gamesIdArray = getGamesID();
  //console.log(gamesIdArray);
  gamesIdArray.then(function (value: any) {
    value.forEach(async function (valueID: any) {
      let newGame = new Game();

      const response = await fetch(
        "https://sb1capi-altenar.biahosted.com/Sportsbook/GetEventTrackerInfo?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&deviceType=Desktop&numformat=en&eventId=" +
          valueID.longId
      );
      const data = await response.json();
      //Deno.writeTextFile("../results.txt", JSON.stringify(data.Result));

      newGame.longId = data.Result.EventId;
      newGame.gameTime = data.Result.LiveCurrentTime;
      newGame.gameDate = data.Result.EventDate;
      newGame.champName = data.Result.Name;
      newGame.homeTeam = data.Result.Competitors[0].Name;
      newGame.awayTeam = data.Result.Competitors[1].Name;
      newGame.gameLiveScore = data.Result.LiveScore;

      console.log("--------------------START--------------");
      console.log(newGame);
      console.log("--------------------END----------------");
      // @ts-ignore
      addGameCollect(newGame);
    });
  });
}

//Delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}

function upsert(resultsArray: any[], longId: BigInt) {
  // (1)
  const i = resultsArray.findIndex((_longId) => _longId === longId);
  if (i > -1) {
    resultsArray[i] = longId;
    //return 1;
    console.log("------------------Override------------------");
  }
  // (2)
  else {
    resultsArray.push(longId);
    console.log("------------------PUSH------------------");
    // return -1;
  }
  return resultsArray;
}
