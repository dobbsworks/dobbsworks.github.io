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
            this.ReactToPlatformsAndSolids();
            this.AccelerateHorizontally(0.1, this.direction * 1.5);
            if (this.isTouchingLeftWall || this.isTouchingRightWall) {
                this.ReplaceWithSprite(new DeadEnemy(this));
                if (player && player.heldItem == this) player.heldItem = null;
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
                    this.ReactToPlatformsAndSolids();
                }
            }
        }

        this.ReactToWater();
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