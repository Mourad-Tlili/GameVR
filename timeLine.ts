/* timeLine();

function timeLine() {
  setTimeout(function () {
    console.log("YES ! ");
  }, 1000);
}
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}
function resetAtMidnight() {
  var now = new Date();
  var night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(), // the next day, ...
    11,
    47,
    0 // ...at 00:00:00 hours
  );
  var msToMidnight = night.getTime() - now.getTime();
  //console.log(msToMidnight);

  setInterval(function () {
    console.log("YES its now ! "); //      <-- This is the function being called at midnight.

    resetAtMidnight();
    console.log("Finished ! "); //      Then, reset again next midnight.
  }, msToMidnight);
}
resetAtMidnight();
