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
                credited: currentData.credited
            }
        }

        // achieve progress
        saveObj.achievementProgress.lifetimeLoot = achievementHandler.lifetimeLoot;
        saveObj.achievementProgress.lifetimeKills = achievementHandler.lifetimeKills;
        saveObj.achievementProgress.lifetimeRunCompletes = achievementHandler.lifetimeRunCompletes;
        saveObj.achievementProgress.currentStars = achievementHandler.currentStars;
        saveObj.achievementProgress.unclaimedStars = achievementHandler.unclaimedStars;
        saveObj.achievementProgress.completeRunCharacters = achievementHandler.completeRunCharacters;

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
            let newCreditedArray = achievementHandler.tiers.map(x => false);
            a.unlocked = newUnlockArray;
            a.unlockedTimestamp = newUnlockTimeArray;
            a.credited = newCreditedArray;
        });

        // Lock achievement progress
        achievementHandler.lifetimeLoot = 0;
        achievementHandler.lifetimeKills = 0;
        achievementHandler.lifetimeRunCompletes = 0;
        achievementHandler.currentStars = 0;
        achievementHandler.unclaimedStars = 0;
        achievementHandler.completeRunCharacters = [];
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
            achieve.credited = saveFile.achievements[achievementName].credited || [false, false, false];
        }

        // achieve progress
        achievementHandler.lifetimeLoot = saveFile.achievementProgress.lifetimeLoot;
        achievementHandler.lifetimeKills = saveFile.achievementProgress.lifetimeKills;
        achievementHandler.lifetimeRunCompletes = saveFile.achievementProgress.lifetimeRunCompletes;
        achievementHandler.currentStars = saveFile.achievementProgress.currentStars || 0;
        achievementHandler.unclaimedStars = saveFile.achievementProgress.unclaimedStars || 0;
        achievementHandler.completeRunCharacters = saveFile.achievementProgress.completeRunCharacters || [];

        // options
        if (saveFile.options) {
            timerHandler.displayed = saveFile.options.showTimer;
            audioHandler.SetMusicVolume(saveFile.options.musicVolume);
            audioHandler.SetSfxVolume(saveFile.options.sfxVolume);
        }

        // star credits (backwards compatibility)
        let newStars = achievementHandler.CreditAchieves();
        if (newStars > 0) {
            achievementHandler.currentStars += newStars;
            this.SaveGame();
        }
        if (achievementHandler.unclaimedStars > 0) {
            achievementHandler.currentStars += achievementHandler.unclaimedStars;
            achievementHandler.unclaimedStars = 0;
            this.SaveGame();
        }
    }

    ExportSave() {
        let exportedData = this.Encrypt(localStorage.moonroversave, 3);
        let copyTextInput = document.getElementById("saveFileInput");
        setTimeout(() => {
            copyTextInput.value = exportedData;
            copyTextInput.select();
            copyTextInput.setSelectionRange(0, 99999); /* For mobile devices */
            document.execCommand("copy");
        },100)
    }

    ImportSave() {
        let inputSave = prompt("Paste your save file and press OK:");
        try {
            let decrypted = this.Encrypt(inputSave, -3);
            let parsed = JSON.parse(decrypted); // parsing to make sure file is ok
            localStorage.moonroversave = decrypted;
            this.LoadGame();
            return true;
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    Encrypt(text, magnitude) {
        let ret = "";
        let chars = `!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./`;
        for (let c of text.split('')) {
            let index = chars.indexOf(c);
            if (index === -1) {
                ret += c;
            } else {
                let newIndex = (index + magnitude) % (chars.length);
                if (newIndex < 0) newIndex += chars.length;
                ret += chars[newIndex];
            }
        }
        return ret;
    }
}