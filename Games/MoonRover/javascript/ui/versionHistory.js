var versionHistory = [
    {
        v: "0.1", d: "2021-03-07", t:
            `First officially numbered version! 
            
• Version history added to main menu (it's this right here!).
• Two flamethrowers added to the weapon pool.
• Enemies (and the player) now leave a smokey explosion behind on death.
• The player is now returned to the main menu on death (instead of respawning). `
    }
].map(a => {
    let lineBreak = "===============================";
    return lineBreak + "\n" + "v" + a.v + "          " + a.d + "\n"
        + lineBreak + "\n" + "\n" + a.t.split("\n").map(z => z + " ").join("\n") + "\n";
});