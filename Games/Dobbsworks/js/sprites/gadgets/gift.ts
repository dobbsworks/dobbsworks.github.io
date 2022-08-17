class Gift extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = true;
    isInThrowMode = false; 
    isBreaking = false;
    contents: SpriteType = Key;
    breakTimer = 0;
    maxBreakTime = 20;

    Update(): void {
        let oldDx = this.GetTotalDx();
        if (!this.isBreaking) {
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
            this.MoveByVelocity();
        }
        let newDx = this.GetTotalDx();
        let horizontalChange = Math.abs(newDx - oldDx) > 0.2;

        if (this.isInWater) this.isInThrowMode = false;
        if (this.isInThrowMode && (this.isOnCeiling || this.isOnGround)) this.isBreaking = true;
        if (this.isInThrowMode && horizontalChange && (this.isTouchingLeftWall || this.isTouchingRightWall)) this.isBreaking = true;

        if (this.isBreaking) {
            if (this.breakTimer == 0) {
                let newSprite = new this.contents(this.x, this.y, this.layer, []);
                this.layer.sprites.push(newSprite);
                newSprite.GentlyEjectFromSolids();
                this.canBeHeld = false;
            }

            this.breakTimer++;

            if (this.breakTimer >= this.maxBreakTime) {
                this.isActive = false;
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = 0;
        if (this.breakTimer) {
            let time = Math.min(this.maxBreakTime, this.breakTimer);
            frame = Math.ceil(4 * time / this.maxBreakTime) + 1;
        }
        return {
            imageTile: tiles["gift"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnThrow(thrower: Sprite, direction: -1 | 1) {
        this.isInThrowMode = true;
        super.OnThrow(thrower, direction);
    }

    OnUpThrow(thrower: Sprite, direction: -1 | 1) {
        this.isInThrowMode = true;
        super.OnUpThrow(thrower, direction);
    }
}