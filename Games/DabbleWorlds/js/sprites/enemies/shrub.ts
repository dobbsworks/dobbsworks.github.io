class Shrubbert extends Enemy {

    public height: number = 12;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    state: "normal" | "stunned" | "running" = "normal";
    stunTimer = 0;
    maxStun = 48;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.state == "stunned") {
            this.stunTimer++;
            this.dx = 0;
            if (this.stunTimer >= this.maxStun) {
                this.state = "running";
            }
        } else {
            let speed = this.state == "normal" ? 0.3 : 0.6;
            if (this.stackedOn) speed = 0.3;
            this.Patrol(speed, true);
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }
    
    OnBounce(): void {
        if (this.state == "normal") {
            this.state = "stunned";
            this.height -= 4;
            this.y += 4;
        } else {
            this.isActive = false;
            let deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frameRow = 0;
        if (this.state == "stunned") frameRow = 3;
        if (this.state == "running") frameRow = 1;

        let framesPerTile = this.state == "normal" ? 5 : 3;
        let frame = Math.floor(frameNum / framesPerTile) % 4;

        if (this.state == "stunned") {
            frame = Math.floor(this.stunTimer / (this.maxStun / 8)) % 8;
        }

        return {
            imageTile: tiles["shrub"][frame][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: this.state == "normal" ? 0 : 4
        };
    }
}