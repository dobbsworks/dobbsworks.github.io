class SaveHandler {
    SaveGame() {
        let saveObj = this.GetBlankSaveFile();

        saveObj.unlockedChars = characters.filter(a => a.unlocked).map(a => a.name);

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
        saveObj.achievementProgress.currentStars = achievementHandler.currentStars;

        // options
        saveObj.options.showTimer = timerHandler.displayed;
        saveObj.options.musicVolume = audioHandler.GetMusicVolume();
        saveObj.options.sfxVolume = audioHandler.GetSfxVolume();

        localStorage.moonroversave = JSON.stringify(saveObj);
    }

    GetBlankSaveFile() {
        return {
            unlockedChars: [],
            achievements: {},
            achievementProgress: {},
            options: {}
        }
    }

    DeleteSave() {
        // Lock characters
        characters.filter(a => !a.initiallyUnlocked).forEach(a => a.unlocked = false);

        // Lock achievements
        Object.values(achievementHandler.achievements).forEach(a => {
            let newUnlockArray = achievementHandler.tiers.map(x => false);
            let newUnlockTimeArray = achievementHandler.tiers.map(x => null);
            a.unlocked = newUnlockArray;
            a.unlockedTimestamp = newUnlockTimeArray;
        });

        // Lock achievement progress
        achievementHandler.lifetimeLoot = 0;
        achievementHandler.lifetimeKills = 0;
        achievementHandler.lifetimeRunCompletes = 0;
        achievementHandler.currentStars = 0;
        this.SaveGame();
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
        achievementHandler.currentStars = saveFile.achievementProgress.currentStars || 0;

        // options
        if (saveFile.options) {
            timerHandler.displayed = saveFile.options.showTimer;
            audioHandler.SetMusicVolume(saveFile.options.musicVolume);
            audioHandler.SetSfxVolume(saveFile.options.sfxVolume);
        }
    }
}