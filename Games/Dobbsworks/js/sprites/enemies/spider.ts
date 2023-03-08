class Spurpider extends Enemy {

    public height: number = 8;
    public width: number = 8;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    

    state: "rest" | "drop" | "pause" | "rise" = "rest";

    targetY = -9999;
    pauseTimer = 0;
    riseTimer = 0;
    riseDys = [-1, -1.5, -1, -1, -0.5, -0.5, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0, -0.5];
    squishTimer = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {

            if (this.state == "rest") {
                this.targetY = this.y;
                let isPlayerNearAndBelow = this.layer.sprites.some(p => p instanceof Player && Math.abs(this.x - p.x) < 20 && p.y > this.y - 3 && p.y < this.y + 150);
                if (isPlayerNearAndBelow) {
                    this.state = "drop";
                    this.dy += 0.05;
                }
            }

            if (this.state == "drop" && this.dy == 0) this.state = "pause";
            if (this.state == "drop") {
                this.dy += 0.05;
                if (this.dy > 1.5) this.dy = 1.5;
            }

            if (this.state == "pause") {
                this.pauseTimer++;
                if (this.pauseTimer > 30) {
                    this.state = "rise";
                    this.pauseTimer = 0;
                }
            }

            if (this.state == "rise") {
                this.riseTimer = (this.riseTimer + 1) % this.riseDys.length;
                this.dy = this.riseDys[Math.floor(this.riseTimer / 2)] / 1;

                if (this.y < this.targetY) {
                    this.state = "rest";
                    this.y = this.targetY;
                    this.dy = 0;
                }
            }

            this.ReactToWater();
            this.ReactToVerticalWind();
        }
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.OnDead();
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frameCol = 0;
        if (!this.isInDeathAnimation) {
            if (this.dy > 0) frameCol = 1;
            if (this.dy < 0) frameCol = 2;
            if (this.state == "rest") frameCol = 3;
        }

        return {
            imageTile: tiles["spider"][frameCol][this.isInDeathAnimation ? 1 : 0],
            xFlip: Math.floor((frameNum % 20) / 10) == 0,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }
}