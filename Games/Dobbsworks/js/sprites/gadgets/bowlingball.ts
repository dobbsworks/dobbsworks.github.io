class BowlingBall extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = true;
    isHeavy = true;

    floatsInWater = false;
    hurtsEnemies = false;


    OnStrikeEnemy(enemy: Enemy): void {
        this.dx *= 0.8;
        audioHandler.PlaySound("pins", true);
    }

    OnThrow(thrower: Sprite, direction: -1 | 1) {
        this.dy = 0;
        if (thrower instanceof Player) {
            this.dx = direction * 0.5 + thrower.GetTotalDx();
            thrower.dx += -1 * direction;
        } else {
            this.dx = direction * 1 + thrower.GetTotalDx();
        }
    }

    OnUpThrow(thrower: Sprite, direction: -1 | 1) {
        this.dx = (direction * 1) * 0 + thrower.GetTotalDx();
        this.dy = -1;
    }

    OnDownThrow(thrower: Sprite, direction: -1 | 1) {
        this.dx = (direction * 1) / 4 + thrower.GetTotalDx();
        this.dy = 2;
        if (thrower instanceof Player) {
            thrower.dy -= 2;
        }
    }

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        } else {
            this.rotation -= this.GetTotalDx() / 2
        }
        this.ReactToPlatformsAndSolids();
        this.ReactToVerticalWind();
        this.MoveByVelocity();

        this.hurtsEnemies = this.GetTotalDx() > 0.2;
        if (this.GetTotalDx() < 0.2) {
            this.rolls = false;
            this.ApplyInertia();
            this.rolls = true;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let totalFrames = Object.keys(tiles["bowlingball"]).length;
        let rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        let frame = (Math.floor(rot / (Math.PI * 2) * totalFrames) || 0);
        if (frame < 0) frame = 0;
        return {
            imageTile: tiles["bowlingball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}