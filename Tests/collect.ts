import { Game } from "../Models/game.test.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { addGameID } from "../Controllers/addGameID.ts";
import { ifExists } from "../Controllers/ifExists.ts";
import { getGamesID } from "../Controllers/getGamesID.ts";

const response = await fetch(
  "https://sb1capi-altenar.biahosted.com/Sportsbook/GetLiveEvents?timezoneOffset=-60&langId=39&skinName=dreamsbet365_21&configId=1&culture=fr-FR&countryCode=TN&deviceType=Desktop&numformat=en&sportids=270&categoryids=0&champids=0&group=Championship&outrightsDisplay=none&couponType=0&filterSingleNodes=2&hasLiveStream=false"
);
const testData = await response.json();
let variable = testData.Result.Items[0].Items.length;

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
  //convertData();
  //console.log(obj.values());

  await delay(60);
}

function convertData() {
  let res = getGamesID().then(function (result: any) {
    if (result) {
      return result;
    } else {
      return 0;
    }
  });
  return res;
}

/* TimeLine();

function timeLine() {
  setTimeout(function () {
    ConvertData();
  }, 1000);
} */

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
