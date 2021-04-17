class AchievementHandler {
    tiers = [
        "Bronze", "Silver", "Gold"
    ];

    achievements = {
        beatGame: new Achievement(
            "Good Boy!",
            "Beat the game %0 time(s)",
            [[1], [10], [25]],
            (vars) => { return this.lifetimeRunCompletes >= vars[0] }
        ),
        beatGameMulticharacter: new Achievement(
            "Hopper To It",
            "Beat the game as %0 different characters",
            [[2], [3], [4]], //TODO, need more characters!
            (vars) => { return this.completeRunCharacters.length >= vars[0] }
        ),
        loot: new Achievement(
            "On A Budget",
            "Have %0 Mooney in your inventory",
            [[300], [400], [500]],
            (vars) => { return loot >= vars[0] }
        ),
        shopAll: new Achievement(
            "Bargain Hunter",
            "Purchase %0 weapons/upgrades in one shopping trip",
            [[3], [4], [5]],
            (vars) => {
                return shopHandler.buysThisVisit >= vars[0];
            }
        ),
        weaponBuys: new Achievement(
            "Buyer's Remorse",
            "Purchase %0 weapons in one run",
            [[6], [7], [9]],
            (vars) => {
                return shopHandler.weaponBuysThisRun >= vars[0];
            }
        ),
        upgradeWeapon: new Achievement(
            "This Is My Boomstick",
            "Upgrade a single weapon %0 times in one run",
            [[4], [5], [6]],
            (vars) => {
                return Math.max(weaponHandler.inventory.map(x => x.level)) - 1 >= vars[0];
            }
        ),
        ramming: new Achievement(
            "Ramming Speed",
            "Deal %0 damage with a shield bash",
            [[2], [3], [4]],
            (vars) => {
                return this.shieldBashDamage >= vars[0];
            }
        ),
        quickfire: new Achievement(
            "Fried Circuits",
            "Ignite %0 robots in %1 seconds",
            [[3, 5], [4, 4], [5, 3]],
            (vars) => {
                let now = new Date();
                let targetTime = vars[1] * 1000;
                return this.ignitionTimes.filter(a => now - a < targetTime).length >= vars[0]
            }
        ),
        highspeed: new Achievement(
            "Gotta Go Fast",
            "Maintain a speed of %0 units/second for %1 seconds",
            [[16, 2], [18, 2.5], [20, 3]],
            (vars) => {
                let requiredVal = vars[0];
                let requiredCount = vars[1] * 60;
                return this.playerSpeeds.length >= requiredCount &&
                    this.playerSpeeds.slice(-requiredCount).every(x => x >= requiredVal);
            }
        ),
        lifetimeLoot: new Achievement(
            "Coin Collector",
            "Collect %0 Mooney across all runs",
            [[5000], [10000], [20000]],
            (vars) => {
                return this.lifetimeLoot >= vars[0];
            }
        ),
        lifetimeKills: new Achievement(
            "Beggin' For Scraps",
            "Destroy %0 robots across all runs",
            [[500], [1500], [3000]],
            (vars) => {
                return this.lifetimeKills >= vars[0];
            }
        )
    }

    ignitionTimes = [];
    playerSpeeds = [];
    shieldBashDamage = 0;
    lifetimeLoot = 0;
    lifetimeKills = 0;
    lifetimeRunCompletes = 0;
    completeRunCharacters = [];

    displays = [];
    // controls pop-up alert speed
    displayTimes = [20, 340, 360];

    Initialize() {
    }

    RunReset() {
        this.ignitionTimes = []
        this.playerSpeeds = []
        this.shieldBashDamage = 0;
    }

    Update() {
        let currentDisplay = this.displays[0];
        if (currentDisplay) {
            currentDisplay.timer++;
            if (currentDisplay.timer >= this.displayTimes[2]) {
                this.displays.splice(0, 1);
            }
        }
        for (let achieve of Object.values(this.achievements)) {
            let achievedTiers = achieve.CheckForUnlock();
            for (let achievedTier of achievedTiers) {
                this.displays.push({
                    achievement: achieve,
                    tier: achievedTier,
                    timer: 0
                });
                this.CheckForCharacterUnlocks();
                saveHandler.SaveGame();
            }
        }
    }

    CheckForCharacterUnlocks() {
        for (let lockedChar of characters.filter(a => !a.unlocked)) {
            let allRequiredAchievesUnlocked = lockedChar.
                achievementGate.every(achieveName => this.
                    achievements[achieveName].unlocked[0]);
            if (allRequiredAchievesUnlocked) {
                lockedChar.unlocked = true;
                this.displays.push({ character: lockedChar, timer: 0 })
            }
        }
    }

    Draw() {
        //TODO tiers
        let currentDisplay = this.displays[0];
        if (currentDisplay) {
            let name = currentDisplay.achievement ?
                currentDisplay.achievement.name :
                currentDisplay.character.name + " unlocked!";
            let timer = currentDisplay.timer;

            let ratio = 0;
            if (timer < this.displayTimes[0]) ratio = timer / this.displayTimes[0];
            else if (timer < this.displayTimes[1]) ratio = 1.0;
            else ratio = (this.displayTimes[2] - timer) / (this.displayTimes[2] - this.displayTimes[1])

            let fontSize = 16;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = "#020a2e";
            ctx.textAlign = "left";
            let textWidth = ctx.measureText(name).width
            let margin = 10;
            let height = fontSize + margin * 2;
            let width = Math.max(150, textWidth + margin * 2);
            let x = canvas.width - width;
            let y = canvas.height - height * ratio;
            ctx.fillRect(x - 10, y, width + 10, height);
            ctx.fillStyle = "white";
            ctx.fillText(name, x + margin, y + margin + fontSize);

            let tiles = tileset.achievements.tiles;
            tiles[0].Draw(ctx, x - tiles[0].width, y, 1);
            if (currentDisplay.achievement) {
                let index = currentDisplay.achievement.imageIndex;
                tiles[index].Draw(ctx, x - tiles[0].width, y, 1);
            } else {
                let image = document.getElementById(currentDisplay.character.imageId + "-lit");
                ctx.drawImage(image, x - tiles[0].width - 5, y, image.width / 2, image.height / 2);
            }
        }
    }
}

class Achievement {
    constructor(name, descr, variables, unlockFunc) {
        this.name = name;
        this.variables = variables;
        this.unlockFunc = unlockFunc;

        this.descr = [];
        for (let tierIndex of [0, 1, 2]) {

            let formattedDescr = descr;
            for (let i = 0; i < variables.length; i++) {
                formattedDescr = formattedDescr.replace("%" + i, variables[tierIndex][i]);
            }
            this.descr.push(formattedDescr + " ");
        }
    }
    imageIndex = 2;
    unlocked = [false, false, false];
    unlockedTimestamp = [null, null, null];
    manualUnlock = false;

    CheckForUnlock() {
        let unlockedTiers = [];
        for (let unlockTier of [0]) { // TODO tiers
            if (this.unlocked[unlockTier]) continue;
            let achieved = this.unlockFunc(this.variables[unlockTier]);
            if (achieved) {
                this.unlocked[unlockTier] = true;
                this.unlockedTimestamp[unlockTier] = new Date();
                audioHandler.PlaySound("powerup-04");
                unlockedTiers.push(unlockTier);
            }
        }
        return unlockedTiers;
    }
}