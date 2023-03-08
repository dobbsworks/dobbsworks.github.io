class SapphireSnail extends Enemy {

    public height: number = 11;
    public width: number = 10;
    respectsSolidTiles = false;
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;

    frame = 0;
    wasPlayerOnLastFrame = false;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.ApplyInertia();
        this.ReactToWater();
        
        this.AccelerateHorizontally(0.01, 0.2 * this.direction);

        this.frame++;

        if (this.stackedOn) {
            // don't change velocity based on player
            this.ApplyGravity();
        } else {
            let playerStandingOn = player && player.parentSprite == this;
            if (playerStandingOn) {
                this.frame += 1;
                if (!this.wasPlayerOnLastFrame) {
                    this.dy = 0.4;
                }
                this.AccelerateVertically(0.01, -0.2);
            } else {
                if (this.dy > 0) {
                    this.AccelerateVertically(0.02, 0);
                } else if (this.dy < 0) {
                    this.AccelerateVertically(0.01, 0);
                }
            }
            if (Math.abs(this.dx) > 0.3) this.dx *= 0.95;
            if (Math.abs(this.dy) > 0.3) this.dy *= 0.95;
            this.wasPlayerOnLastFrame = playerStandingOn;
        }
        this.ReactToVerticalWind();
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(this.frame / 10) % 2;
        return {
            imageTile: tiles["sapphireSnail"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    }
}