class Baseball extends Sprite {

    public height: number = 8;
    public width: number = 8;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = true;

    isInThrowMode = false;
    throwDirection: -1|1 = 1;
    floatsInWater = true;
    hurtsEnemies = false;


    OnStrikeEnemy(enemy: Enemy): void {
        this.isInThrowMode = false;
        this.dy -= 2;
        this.dx *= 0.5;
    }

    Update(): void {
        this.hurtsEnemies = this.isInThrowMode;
        if (this.isInThrowMode) {
            this.dx = this.throwDirection * 1.5;
            if (this.isInWater) this.dx *= 0.5;
        } else {
            this.ApplyGravity();
            this.ApplyInertia();
        }
        this.ReactToWater();

        if (this.isOnGround || this.isTouchingLeftWall || this.isTouchingRightWall) {
            this.isInThrowMode = false;
        }
        if (this.parentSprite) {
            this.isInThrowMode = false;
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx())/2;
        } else {
            this.rotation -= this.GetTotalDx()/2
        }

        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }

    GetFrameData(frameNum: number): FrameData {
        let totalFrames = Object.keys(tiles["baseball"]).length;
        let rot = ((this.rotation % (Math.PI*2)) + (Math.PI*2)) % (Math.PI*2);
        let frame = Math.floor(rot / (Math.PI*2) * totalFrames) || 1;
        if (frame < 0) frame = 0;
        return {
            imageTile: tiles["baseball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
    
    OnThrow(thrower: Sprite, direction: -1|1) {
        this.isInThrowMode = true;
        this.throwDirection = direction;
        this.dy = 0;
    }
}