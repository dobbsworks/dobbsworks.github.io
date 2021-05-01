class TimerHandler {

    frames = 0;
    fontSize = 18;
    displayed = false;
    splits = [];

    ResetTimer() {
        this.frames = 0;
        this.splits = [];
    }

    MarkSplit() {
        this.splits.push({
            name: levelHandler.GetLevelName(), 
            zone: levelHandler.currentZone,
            level: levelHandler.currentLevel,
            frames: this.frames,
            segment: this.splits.length ? this.frames - this.splits[this.splits.length - 1].frames : this.frames,
            baseName: levelHandler.levels[levelHandler.currentLevel - 1].name
        });
    }

    DrawTimer() {
        this.frames++;
        ctx.lineWidth = 5;
        ctx.font = this.fontSize + "px Courier New";
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        let text = this.GetTimerText(2);
        ctx.strokeText(text, canvas.width - 10, this.fontSize + 10);
        ctx.fillText(text, canvas.width - 10, this.fontSize + 10);
    }

    GetTimerText(precision) {
        return this.FramesToText(this.frames, precision);
    }

    FramesToText(frames, precision) {
        let totalSeconds = Math.floor(frames / 60);
        let minutes = Math.floor(totalSeconds / 60);
        let displaySeconds = totalSeconds % 60;
        if (displaySeconds < 10) displaySeconds = "0" + displaySeconds;
        if (minutes < 10) minutes = "0" + minutes;
        let milliSeconds = ((frames % 60) / 60).toFixed(precision).substring(2);
        return `${minutes}:${displaySeconds}.${milliSeconds}`;
    }

}