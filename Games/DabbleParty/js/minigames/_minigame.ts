abstract class MinigameBase {
    abstract backdropTile: ImageTile;
    abstract songId: string;
    abstract thumbnail: ImageTile;
    abstract controls: InstructionControl[];
    abstract title: string;
    abstract instructions: string[];
    sprites: Sprite[] = [];
    initialized: boolean = false;
    timer = -360;
    score = 0;

    isEnded = false;
    overlayTextSprite: Sprite | null = null;
    abstract Initialize(): void;
    abstract Update(): void;
    BaseUpdate(): void {
        if (!this.initialized) {
            camera.targetX = 0;
            camera.targetY = 0;
            camera.scale = 1;
            this.Initialize();
            camera.x = camera.targetX;
            camera.y = camera.targetY;
            this.initialized = true;
        }

        if (this.timer == -240) {
            this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][0], (s) => {
                s.x = camera.x;
                s.y = camera.y;
            });
            this.sprites.push(this.overlayTextSprite);
        }
        if (this.timer == -90) {
            if (this.overlayTextSprite) this.overlayTextSprite.isActive = false;
            this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][1], (s) => {
                s.x = camera.x;
                s.y = camera.y;
                s.Scale(0.95);
            }).Scale(2);
            this.sprites.push(this.overlayTextSprite);
        }
        if (this.timer == 0) {
            if (this.overlayTextSprite) this.overlayTextSprite.isActive = false;
        }

        this.timer++;
        for (let spr of this.sprites) {
            spr.age++;
            spr.Update();
        }
        this.Update();

        this.sprites = this.sprites.filter(a => a.isActive);
    }
    OnAfterDraw(camera: Camera): void {}
    OnBeforeDrawSprites(camera: Camera): void {}
    Draw(camera: Camera): void {
        this.backdropTile.Draw(camera, camera.x, camera.y, 1, 1, false, false, 0);
        this.OnBeforeDrawSprites(camera);
        for (let spr of this.sprites) {
            spr.Draw(camera);
        }
        this.OnAfterDraw(camera);
        this.DrawScore(camera);
    }
    SubmitScore(score: number): void {
        if (this.isEnded) return;
        
        // TODO
        console.log(score);

        this.isEnded = true;

        this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][2], (s) => {
            s.x = camera.x;
            s.y = camera.y;
        });
        this.sprites.push(this.overlayTextSprite);
    }

    DrawScore(camera: Camera): void {
        if (this.score <= 0) return;

        let fontSize = 24;
        if (this.isEnded) fontSize = 96;

        camera.ctx.font = `${fontSize}px ${"arial"}`;
        camera.ctx.textAlign = "right";

        camera.ctx.strokeStyle = "#FFF";
        camera.ctx.fillStyle = "#0006";
        let textWidth = camera.ctx.measureText(Math.floor(this.score).toString()).width;
        let width = Math.max(100, textWidth + 20);
        camera.ctx.fillRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize/4));
        if (this.isEnded) {
            camera.ctx.strokeRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize/4));
        }
        camera.ctx.fillStyle = "#FFF9";
        camera.ctx.fillText(Math.floor(this.score).toString(), camera.canvas.width - 5, camera.canvas.height - fontSize/4);
    }
}

class MinigameGenerator {
    static RandomGame(): MinigameBase {
        let games = [...minigames];
        let i = Math.floor(Math.random() * games.length);
        let game = games[i];
        return new game();
    }
}