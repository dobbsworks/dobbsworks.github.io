class Piggle extends Enemy {

    public height: number = 11;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    squishTimer = 0;

    animationSpeed = 0.2;
    frameRow = 0;
    turnAtLedges = true;
    bounceSoundId: string = "oink";

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            this.Patrol(0.3, this.turnAtLedges);
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    }
    
    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0,1,2,1,0,3,4,4,3];
        let frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        if (this.isInDeathAnimation) frame = 5;
        return {
            imageTile: tiles["pig"][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 3
        };
    }
}

class Hoggle extends Piggle {
    animationSpeed = 0.3;
    frameRow = 1;
    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            if (player && this.WaitForOnScreen()) {
                this.direction = (player.xMid < this.xMid ? -1 : 1);
                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.dx = 0.8;
                    this.dy = -0.7;
                }
                if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.dx = -0.8;
                    this.dy = -0.7;
                }
                this.dx += this.direction * 0.015;
                let maxSpeed = 1;
                if (Math.abs(this.dx) > maxSpeed) {
                    this.dx = this.direction * maxSpeed;
                }
            }

            this.ApplyGravity();
            this.ReactToWater();
        }
    }
}