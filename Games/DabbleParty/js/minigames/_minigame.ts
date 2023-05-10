abstract class MinigameBase {
    backdropTile: ImageTile = tiles["forest"][0][0];
    sprites: Sprite[] = [];
    initialized: boolean = false;
    timer = -360;

    isEnded = false;
    overlayTextSprite: Sprite | null = null;
    abstract Initialize(): void;
    abstract Update(): void;
    BaseUpdate(): void {
        if (!this.initialized) {
            this.Initialize();
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
            spr.Update();
        }
        this.Update();

        this.sprites = this.sprites.filter(a => a.isActive);
    }
    Draw(camera: Camera): void {
        this.backdropTile.Draw(camera, camera.x, camera.y, 1, 1, false, false, 0);
        for (let spr of this.sprites) {
            spr.Draw(camera);
        }
    }
    SubmitScore(score: number): void {
        // TODO
        console.log(score);

        this.isEnded = true;

        this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][2], (s) => {
            s.x = camera.x;
            s.y = camera.y;
        });
        this.sprites.push(this.overlayTextSprite);
    }
}

