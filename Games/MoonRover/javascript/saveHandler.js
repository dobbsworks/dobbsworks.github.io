class SaveHandler {
    SaveGame() {
        let saveObj = {
            unlockedChars: characters.filter(a => a.unlocked).map(a => a.name),
            achievements: {},
            achievementProgress: {}
        }

        // unlocked achievements
        for (let achievementName of Object.keys(achievementHandler.achievements)) {
            let currentData = achievementHandler.achievements[achievementName];
            saveObj.achievements[achievementName] = {
                unlocked: currentData.unlocked,
                unlockedTimestamp: currentData.unlockedTimestamp,
            }
        }

        // achieve progress
        saveObj.achievementProgress.lifetimeLoot = achievementHandler.lifetimeLoot;
        saveObj.achievementProgress.lifetimeKills = achievementHandler.lifetimeKills;
        saveObj.achievementProgress.lifetimeRunCompletes = achievementHandler.lifetimeRunCompletes;

        localStorage.moonroversave = JSON.stringify(saveObj);
    }

    LoadGame() {
        if (!localStorage.moonroversave) return;
        let saveFile = JSON.parse(localStorage.moonroversave);

        characters.forEach(c => {
            if (saveFile.unlockedChars.indexOf(c.name) > -1) {
                c.unlocked = true;
            }
        });

        // unlocked achievements
        for (let achievementName of Object.keys(saveFile.achievements)) {
            let achieve = achievementHandler.achievements[achievementName];
            achieve.unlocked = saveFile.achievements[achievementName].unlocked;
            achieve.unlockedTimestamp = saveFile.achievements[achievementName].unlockedTimestamp;
        }

        // achieve progress
        achievementHandler.lifetimeLoot = saveFile.achievementProgress.lifetimeLoot;
        achievementHandler.lifetimeKills = saveFile.achievementProgress.lifetimeKills;
        achievementHandler.lifetimeRunCompletes = saveFile.achievementProgress.lifetimeRunCompletes;
    }
}