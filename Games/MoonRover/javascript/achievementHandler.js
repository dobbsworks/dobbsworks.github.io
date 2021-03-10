class AchievementHandler {
    achievements = {
        demo: new Achievement(0,
            "Sample Achievement",
            "Have %0 Mooney in your inventory",
            [10],
            (vars) => { return loot >= vars[0] }
        )
    }

    displays = [];
    displayTimes = [20, 340, 360];

    Initialize() {
    }

    Update() {
        let currentDisplay = this.displays[0];
        if (currentDisplay) {
            currentDisplay.timer++;
        }
        for (let achieve of Object.values(this.achievements)) {
            let achieved = achieve.CheckForUnlock();
            if (achieved) {
                this.displays.push({ achievement: achieve, timer: 0 })
            }
        }
    }

    Draw() {
        let currentDisplay = this.displays[0];
        if (currentDisplay) {
            let name = currentDisplay.achievement.name;
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
            let width = Math.max(100, textWidth + margin * 2);
            let x = canvas.width - width;
            let y = canvas.height - height * ratio;
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = "white";
            ctx.fillText(name, x + margin, y + margin + fontSize);

            let tiles = tileset.achievements.tiles;
            tiles[0].Draw(ctx, x - tiles[0].width, y, 1);
            let index = currentDisplay.achievement.imageIndex;
            tiles[index].Draw(ctx, x - tiles[0].width, y, 1);
        }
    }

}

class Achievement {
    constructor(id, name, descr, variables, unlockFunc) {
        this.id = id;
        this.name = name;
        this.variables = variables;
        this.unlockFunc = unlockFunc;

        let formattedDescr = descr;
        for (let i = 0; i < variables.length; i++) {
            formattedDescr = formattedDescr.replace("%" + i, variables[i]);
        }
        this.descr = formattedDescr + " ";
    }
    imageIndex = 2;
    unlocked = false;
    unlockedTimestamp = null;

    CheckForUnlock() {
        if (this.unlocked) return false;
        let achieved = this.unlockFunc(this.variables);
        if (achieved) {
            this.unlocked = true;
            this.unlockedTimestamp = new Date();
        }
        return achieved;
    }
}