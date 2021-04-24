class TimerHandler {

    frames = 0;
    fontSize = 18;
    displayed = true;

    ResetTimer() {
        this.frames = 0;
    }

    DrawTimer() {
        this.frames++;
        ctx.lineWidth = 5;
        ctx.font = this.fontSize + "px Courier New";
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        let text = this.GetTimerText();
        ctx.strokeText(text, canvas.width - 10, this.fontSize + 10);
        ctx.fillText(text, canvas.width - 10, this.fontSize + 10);
    }

    GetTimerText() {
        let totalSeconds = Math.floor(this.frames / 60);
        let minutes = Math.floor(totalSeconds / 60);
        let displaySeconds = totalSeconds % 60;
        if (displaySeconds < 10) displaySeconds = "0" + displaySeconds;
        if (minutes < 10) minutes = "0" + minutes;
        let milliSeconds = ((this.frames % 60) / 60).toFixed(2).substring(2);
        return `${minutes}:${displaySeconds}.${milliSeconds}`;
    }

}