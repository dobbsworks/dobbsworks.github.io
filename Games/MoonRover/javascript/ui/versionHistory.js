var versionHistoryData = [
    {
        v: "0.5", d: "2021-03-28", t:
            `Boss fights!

• Each level now ends with a unique boss fight!
• Added a few new achievements to unlock. 
• Zones now get slightly larger as you get further in the game, allowing for more enemies. `
    },
    {
        v: "0.4", d: "2021-03-19", t:
            `The more stuff update!

• Two new enemies to give you trouble, good luck!
• Added enemy spawn rules - different robots spawn in levels based on your current progress.
• New weapon: Kinetic Launcher - pellets bounce off of walls and enemies . 
• New weapon: Propulsion Engine - doesn't deal much damage, but great for getting around fast. 
• New weapon: Supermatter Flinger - sends enemies flying! `
    },
    {
        v: "0.3", d: "2021-03-14", t:
            `This update is the bomb!

• Added a new system to allow weapon pellets to trigger a different weapon's pellets. This allows for grenade/bomb type weapons.
• New weapon: Lode Stone - shorts out enemies for a short period and attracts coins. 
• New weapon: Ferrous Wheel - lob this bomb at enemies to create a pulse of magnetic energy. 
• New weapon: Fire Bomb - this bomb explodes into flames, dealing slow burn damage to all enemies in the blast. 
• Levels now spawn floating coins, allowing you to pick up some extra cash. 
• Disabled buy button on new weapons if you already have 4 weapons. (Thanks, MMFan). `
    },
    {
        v: "0.2", d: "2021-03-09", t:
            `The best offense is a good defense!

• Purchased weapons now reset after death. (Thanks, MMFan)
• New weapon: Bubble Shield - deals ramming damage based on your speed. 
• New weapon: Swarm Shield - creates orbiting projectiles that collide with enemies. 
• Achievement engine is in place! Only a sample achievement for now, and it doesn't save between games. 
• Cleaned up the transition into the shop with a fade-in/out. 
• New button layout for main menu to prep for future submenus. `
    },
    {
        v: "0.1", d: "2021-03-07", t:
            `First officially numbered version! 
            
• Version history added to main menu (it's this right here!).
• New weapon: Flamethrower - hit an enemy with multiple flames to ignite them. Burning enemies take damage over time. 
• New weapon: Solar Flare - fires tight bursts of flames. 
• Enemies (and the player) now leave a smokey explosion behind on death.
• The player is now returned to the main menu on death (instead of respawning). `
    }
];
var versionHistory = versionHistoryData.map(a => {
    let lineBreak = "===============================";
    return lineBreak + "\n" + "v" + a.v + "          " + a.d + "\n"
        + lineBreak + "\n" + "\n" + a.t.split("\n").map(z => z + " ").join("\n") + "\n";
});
var versionNumber = versionHistoryData[0].v;