class Bullet extends Sprite {
    public height: number = 4;
    public width: number = 4;
    respectsSolidTiles = false;
    rolls = true;
    canBeHeld = false;

    targetDx = 0;
    targetDy = 0;
    hurtsEnemies = true;

    OnStrikeEnemy(enemy: Enemy): void {
        this.isActive = false;
    }

    Update(): void {
        if (this.isTouchingLeftWall || this.isTouchingRightWall || this.isOnGround || this.isOnCeiling) {
            this.isActive = false;
        }
        if (this.parentSprite) {
            this.isActive = false;
        }
        if (!this.IsOnScreen()) {
            this.isActive = false;
        }

        this.dx = this.targetDx;
        this.dy = this.targetDy;

        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 10) % 4;
        return {
            imageTile: tiles["bullet"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}