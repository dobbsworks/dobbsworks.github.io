class Control {
    constructor(public tileIndex: number) {}
    static Button = new Control(0);
    static Move = new Control(1);
    static Horizontal = new Control(2);
    static Vertical = new Control(3);
    static Up = new Control(4);
    static Down = new Control(5);
}

class InstructionControl {
    constructor(public control: Control, public text: string) {}
}

class Instructions extends BoardCutScene {
    Update(): void {
        if (this.timer == 1) {
            audioHandler.SetBackgroundMusic("lobby");
            camera.targetScale = 1;
        }
        this.timer++;
        if (this.timer < 20) {
            this.overlayOpacity = Math.max(0, Math.min(1, (20 - this.timer) / 20));
        }
        if (this.timer > 120 && this.doneTimer == 0 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            if (board && board.isSpectateMode) {
                this.doneTimer = 1;
            }
        }

        if (this.doneTimer > 0) {
            this.doneTimer++;
            this.overlayOpacity = Math.max(0, Math.min(1, (this.doneTimer - 1) / 20));
        }
        if (this.doneTimer > 25) {
            this.isDone = true;
            audioHandler.SetBackgroundMusic("silence");
            // set minigame
            currentMinigame = this.minigame;
        }
    }
    constructor(public minigame: MinigameBase) {
        super();
    }

    timer = 0;
    doneTimer = 0;
    overlayOpacity = 1;

    Draw(camera: Camera): void {
        let myCam = new Camera(camera.canvas);
        let bgImage = tiles["bgInstructions"][0][0] as ImageTile;
        let offset = Math.sin((board?.timer || 0) / 240) * 96;
        bgImage.Draw(myCam, offset, 0, 1.2, 1.2, false, false, 0);
        camera.ctx.drawImage(tiles["instructionsPanel"][0][0].src, 0, 100);
        camera.ctx.drawImage(tiles["instructionsBoard"][0][0].src, 30, 380);
        camera.ctx.drawImage(this.minigame.thumbnail.src, this.minigame.thumbnail.xSrc, this.minigame.thumbnail.ySrc, 480, 270, 50, 111, 480, 270);

        camera.ctx.font = `800 ${36}px ${"arial"}`;
        camera.ctx.textAlign = "left";
        camera.ctx.fillStyle = "#FFF";
        camera.ctx.fillText(this.minigame.title, 45, 70);
        
        camera.ctx.font = `800 ${18}px ${"arial"}`;
        camera.ctx.textAlign = "left";
        camera.ctx.fillStyle = "#000";
        camera.ctx.fillText("Controls", 600, 190);

        camera.ctx.fillRect(600, 200, 300, 3);

        camera.ctx.font = `400 ${18}px ${"arial"}`;
        let y = 220;
        for (let control of this.minigame.controls) {
            let buttonIndex = control.control.tileIndex;
            let buttonImage = tiles["controls"][buttonIndex][0];
            camera.ctx.drawImage(buttonImage.src, buttonImage.xSrc, buttonImage.ySrc, 29, 29, 600, y, 29, 29);
            camera.ctx.fillText(control.text, 640, y + 21);
            y += 35;
        }
        
        y = 448;
        camera.ctx.fillStyle = "#FFF";
        camera.ctx.textAlign = "center";
        for (let instruction of this.minigame.instructions) {
            camera.ctx.fillText(instruction, 420, y);
            y += 27;
        }

        if (board && board.isSpectateMode) {
            camera.ctx.fillStyle = "#000";
            camera.ctx.textAlign = "left";
            camera.ctx.font = `800 ${18}px ${"arial"}`;
            camera.ctx.fillText("Wait for the host's", 700, 470);
            camera.ctx.fillText("countdown, then press", 700, 490);
            camera.ctx.fillText("A to start the game!", 700, 510);
        }

        if (this.overlayOpacity > 0) {
            camera.ctx.fillStyle = `rgba(0, 0, 0, ${this.overlayOpacity.toFixed(2)})`;
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    }
}