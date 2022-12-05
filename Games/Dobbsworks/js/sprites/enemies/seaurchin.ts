class Lurchin extends Enemy {

    public height: number = 24;
    public width: number = 24;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    canSpinBounceOn = true;

    facing: Direction = Direction.Left;
    wallPauseTimer = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        let speed = this.isInWater ? 0.4 : 0.25;
        if (!this.isInWater) this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        let isChangingDirection = true;
        if (this.facing == Direction.Left && this.touchedLeftWalls.length) {
            this.facing = Direction.Up;
            if (!this.isInWater) this.facing = Direction.Right;
        } else if (this.facing == Direction.Up && (this.touchedCeilings.length || !this.isInWater)) {
            this.facing = Direction.Right;
        } else if (this.facing == Direction.Right && this.touchedRightWalls.length) {
            this.facing = Direction.Down;
        } else if (this.facing == Direction.Down && this.isOnGround) {
            this.facing = Direction.Left;
        } else {
            isChangingDirection = false;
        }

        if (isChangingDirection) {
            this.wallPauseTimer = 20;
            this.dx = 0;
            this.dy = 0;
        }

        if (this.wallPauseTimer > 0) {
            this.wallPauseTimer--;
        } else {
            this.dx = this.facing.x * speed;
            this.dy = this.facing.y * speed;
        }
        
        if (this.facing == Direction.Left) this.direction = -1;
        if (this.facing == Direction.Right) this.direction = 1;
    }


    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1];
        let frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle-egg-big"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }
}