var versionHistoryData = [
    {
        v: "0.9.3", d: "2021-05-01", t:
            `
• Grappling hook can now attach to level end star. 
• Bug fix: Swarm Shield now destroys enemy projectiles (in addition to damaging and deflecting enemies). `
    },
    {
        v: "0.9.2", d: "2021-05-01", t:
            `
• Changed grappling hook to allow grabbing the underside of platforms.
• Fixed music not changing after failed run. `
    },
    {
        v: "0.9.1", d: "2021-05-01", t:
            `
• Added speedometer to lower-left of Rover's portrait in the sidebar.
• Increased enemy loot by 1 (after scaledown is applied).
• Speedrun timer now renders lower down when debug mode is on.
• Speedrun timer now respects options toggle. `
    },
    {
        v: "0.9", d: "2021-04-30", t:
            `The End Is Near

• Full release is approaching!
• The roster has finally been filled up. This pre-release version includes 4 of the 8 playable characters. 
• Character unlocks are now based on "stars" which you earn by completing levels. Characters become available for purchase based on how many characters have beaten the game. 
• Completed (and failed) runs now display a results screen along with individual level times. 
• Tiered achievements now have unique names. 
• Boss music added to each level's 5th zone. 
• Achievement values have been tweaked for balance. 
• Boss health has been tweaked for balance. 
• Fixed bug where some enemies didn't drop any Mooney. 
• Added a 1.5 second invulnerability period to the start of every level. `
    },
    {
        v: "0.8", d: "2021-04-23", t:
            `Gotta go fast!

• Achievements now have multiple unlock tiers for those of you who need more than 100% completion. 
• Speedrun timer! How fast can you go?
• The Options page has finally been enabled on the main menu. It's tied in with the pause menu for plenty of shared functionality. 
• Switched order of bosses around for better balance. 
• Fixed bug where player was fully healed at the start of every stage. 
• Fixed bug where clickable sidebar buttons were unclickable after first return to main menu. `
    },
    {
        v: "0.7", d: "2021-04-16", t:
            `What a save!

• The game now auto-saves achievement progress and character unlocks. 
• Enemy bullets and boss cores are now immune to EMPs. `
    },
    {
        v: "0.6", d: "2021-04-09", t:
            `This update has character!

• New characters can now be unlocked by earning achievements. `
    },
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