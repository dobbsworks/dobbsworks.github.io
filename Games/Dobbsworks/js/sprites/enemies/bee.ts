class BeeWithSunglasses extends Enemy {

    public height: number = 7;
    public width: number = 9;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    originalY = -1;
    anchor = null;

    patrolTimer = 0;

    Update(): void {
        if (this.originalY == -1) this.originalY = this.y;
        if (!this.WaitForOnScreen()) return;
        
        if (this.isTouchingLeftWall) {
            this.direction = 1;
            this.patrolTimer = 0;
            this.dx = 0;
        }
        if (this.isTouchingRightWall) {
            this.direction = -1;
            this.patrolTimer = 0;
            this.dx = 0;
        }

        this.patrolTimer++;
        if (this.patrolTimer > 200) {
            this.patrolTimer = 0;
            this.direction *= -1
        }

        this.dx += 0.03 * this.direction;
        let targetY = Math.sin(this.age / 30) + this.originalY;
        this.AccelerateVertically(0.02, targetY - this.y);
        this.dy *= 0.98;

        if (Math.abs(this.dx) > 0.3) {
            this.dx = this.direction * 0.3;
        }
        
        this.ApplyInertia();
        this.ReactToWater();
    }

    OnBounce(): void {
        this.ReplaceWithSprite(new DeadEnemy(this));
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 5) % 2;
        return {
            imageTile: tiles["bee"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 3
        };
    }
}