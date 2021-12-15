import { Game } from "./game.test.ts";

let x = true;
while (x == true) {
  console.log("Delay 10s");
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
    console.log(upsert(liveGamesIdArray, longId));
  }
}

//Delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 10000));
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
