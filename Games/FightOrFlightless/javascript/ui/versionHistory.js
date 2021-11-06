var versionHistoryData = [
    {v: "0.0.1", d: "2021-11-06", t: "The Version Update", c: [
        "Adding version history, wow!",
        "Current project allows creating, exporting, and playing levels",
    ]}
];

var versionHistory = versionHistoryData.map(a => 
    a.t + "\n<ul>" + a.c.map(change => "<li>" + change + "</li>").join("") + "</ul>"
).join("\n\n");

var versionNumber = versionHistoryData[0].v;

function OnClickExitVersionHistory() {
    document.getElementById("versionHistory").style.display = "none";
    new MainMenu().LoadMainMenu();
}