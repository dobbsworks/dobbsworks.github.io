class Rocket extends Sprite {

    public height: number = 5;
    public width: number = 14;
    respectsSolidTiles = true;
    canBeHeld = true;
    direction: -1 | 1 = 1;
    isRocketing = false;
    canHangFrom = false;


    Update(): void {
        if (this.isRocketing) {
            let targetDx = this.direction * 1.5;
            this.dx += 0.1 * (targetDx > 0 ? 1 : -1);
            if (Math.abs(this.dx) > Math.abs(targetDx)) this.dx = targetDx;
            if (this.isTouchingLeftWall || this.isTouchingRightWall) {
                this.ReplaceWithSprite(new DeadEnemy(this));
            }
        } else {
            if (player) {
                let jumpHeld = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false);
                if (player.heldItem == this ) {
                    this.direction = player.direction;
                }
                if (player.heldItem == this && player.dy > 0 && player.standingOn.length == 0 && jumpHeld) {
                    this.isRocketing = true;
                    this.canHangFrom = true;
                    this.canBeHeld = false;
                    audioHandler.PlaySound("rocket", false);
                } else {
                    this.ApplyInertia();
                    this.ApplyGravity();
                }
            }
        }

        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["rocket"][0][0],
            xFlip: this.direction == -1,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    }
}