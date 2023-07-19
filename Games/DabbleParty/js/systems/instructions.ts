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

class Instructions {
    constructor(private minigame: MinigameBase) {
    }

    timer = 0;

    Draw(camera: Camera): void {
        let myCam = new Camera(camera.canvas);
        let bgImage = tiles["bgInstructions"][0][0] as ImageTile;
        let offset = Math.sin((board?.timer || 0) / 240) * 96;
        bgImage.Draw(myCam, offset, 0, 1.2, 1.2, false, false, 0);
        //camera.ctx.drawImage(tiles["bgInstructions"][0][0].src, 0, 0);
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

        this.timer++;
        if (this.timer < 20) {
            let opacity = Math.max(0, Math.min(1, (20 - this.timer) / 20));
            camera.ctx.fillStyle = `rgba(0, 0, 0, ${opacity.toFixed(2)})`;
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    }
}