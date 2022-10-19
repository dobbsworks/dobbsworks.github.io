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
        
        let speed = 0.2;
        this.dx = speed * this.direction;

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
                this.dy -= 0.01;
                if (this.dy < -0.2) this.dy = -0.2;
            } else {
                if (this.dy > 0) {
                    this.dy -= 0.02;
                    if (this.dy < 0) this.dy = 0;
                } else if (this.dy < 0) {
                    this.dy += 0.01;
                    if (this.dy > 0) this.dy = 0;
                }
            }
            this.wasPlayerOnLastFrame = playerStandingOn;
        }

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