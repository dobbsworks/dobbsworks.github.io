class MinigameTest extends MinigameBase {
    title = "test";
    instructions = [];
    backdropTile: ImageTile = tiles["bgParty"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][0][0];
    controls: InstructionControl[] = [];
    songId = "silence";


    times: number[] = [];
    Initialize(): void {}



    Update(): void {
        this.times.push(+(new Date()));
        if (this.times.length > 200) this.times.shift();

        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            for (let i = 0; i < 5; i++) {
                let x = (Math.random() - 0.5) * 960;
                let y = (Math.random() - 0.5) * 540;
                let s = new SimpleSprite( x, y, tiles["boardArrow"][0][0], q => q.rotation += 0.03 );
                this.sprites.push(s)
            }
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            for (let i = 0; i < 5; i++) {
                if (this.sprites.length > 0)
                this.sprites.pop();
            }
        }
    }

    OnAfterDraw(camera: Camera): void {
        camera.ctx.font = `700 ${32}px ${"arial"}`;
        camera.ctx.fillStyle = "black";
        camera.ctx.textAlign = "left";
        
        camera.ctx.fillText("Press up/down to adjust sprite count.", 50, 300);
        camera.ctx.fillText("If you have >60 fps with 50 sprites you should be fine.", 50, 350);

        if (this.times.length > 1) {
            let totalTimeInMs = this.times[this.times.length - 1] - this.times[0];
            let frames = this.times.length - 1;
            let fps = (frames / totalTimeInMs * 1000).toFixed(0);
            camera.ctx.fillText("Estimated FPS: " + fps, 50, 450);
        }
        camera.ctx.fillText("Sprite count: " + this.sprites.length, 50, 500);
    }


    GetRemainingTicks(): number {
        return 60 * 60;// - this.timer;
    }
}