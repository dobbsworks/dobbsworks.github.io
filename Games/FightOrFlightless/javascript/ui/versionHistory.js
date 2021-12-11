var versionHistoryData = [
    {v: "0.0.4", d: "2021-12-10", t: "Abort? Retry? Fail?", c: [
        "Added logic to scenarios to handle wins/losses. Prompts for retry on a loss.",
        "Added a rough HP meter. For now, south pole takes 10 hits to go down.",
        "Snowmen now prioritize targets based on remaining travel distance to the south pole.",
        "Trapped enemies will be instantly sent back to their spawn point."
    ]}, 
    {v: "0.0.3", d: "2021-11-26", t: "Rome Wasn't Build Instantly", c: [
        "Towers now have a time for building to complete",
        "For testing, you can now play built maps immediately from the editor"
    ]}, 
    {v: "0.0.2", d: "2021-11-19", t: "The Second Update", c: [
        "New enemy type: seal! Faster in water, slower on land",
        "Some enemies remain submerged while on water tiles, and can't be attacked while underwater",
        "Snowballs now have a fancy arc and shadow!",
    ]}, 
    {v: "0.0.1", d: "2021-11-06", t: "The Version Update", c: [
        "Adding version history, wow!",
        "Current project allows creating, exporting, and playing levels",
    ]}
];

var versionHistory = versionHistoryData.map(a => 
    "<h2>" + a.v + " - " + a.t + "</h2>" +
    "\n<ul>" + 
    a.c.map(change => "<li>" + change + "</li>").join("") + 
    "</ul>"
).join("\n\n");

var versionNumber = versionHistoryData[0].v;

function OnClickExitVersionHistory() {
    document.getElementById("versionHistory").style.display = "none";
    new MainMenu().LoadMainMenu();
}