class SpringBox extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    canBeHeld = false;

    springTimers: number[] = [0, 0, 0, 0];
    //                      right, down, left, up

    Update(): void {
        this.ApplyInertia();
        this.MoveByVelocity();

        for (let i = 0; i < this.springTimers.length; i++) {
            if (this.springTimers[i] > -1) this.springTimers[i]--;
        }

        let bounceSpeed = 2;
        let timerResetValue = 30;
        let overlappingSprites = this.layer.sprites.filter(a => a.CanInteractWithSpringBox() && a.Overlaps(this));
        for (let sprite of overlappingSprites) {

            if (player && player.heldItem == sprite) continue;

            // check if sprite is fully in a quadrant relative to spring's center
            // if so, use closest corner to calculate direction
            // otherwise:
            //      check if sprite is full in a half, then go that way
            // otherotherwise: use sprite center

            let springDirection: Direction | null = null;
            let cornerDeadSpace = 1;

            if (sprite.x >= this.xMid) {
                // on right
                let deltaX = sprite.x - this.xMid;
                if (sprite.yBottom <= this.yMid) {
                    // up right
                    let deltaY = Math.abs(sprite.yBottom - this.yMid);
                    springDirection = (deltaX > deltaY) ? Direction.Right : Direction.Up;
                    if (Math.abs(deltaX - deltaY) < cornerDeadSpace) springDirection = null;
                } else if (sprite.y >= this.yMid) {
                    // down right
                    let deltaY = Math.abs(sprite.y - this.yMid);
                    springDirection = (deltaX > deltaY) ? Direction.Right : Direction.Down;
                    if (Math.abs(deltaX - deltaY) < cornerDeadSpace) springDirection = null;
                } else {
                    // fully right
                    springDirection = Direction.Right;
                }
            } else if (sprite.xRight <= this.xMid) {
                // on left
                let deltaX = this.xMid - this.xRight;
                if (sprite.yBottom <= this.yMid) {
                    // up left
                    let deltaY = Math.abs(sprite.yBottom - this.yMid);
                    springDirection = (deltaX > deltaY) ? Direction.Left : Direction.Up;
                    if (Math.abs(deltaX - deltaY) < cornerDeadSpace) springDirection = null;
                } else if (sprite.y >= this.yMid) {
                    // down left
                    let deltaY = Math.abs(sprite.y - this.yMid);
                    springDirection = (deltaX > deltaY) ? Direction.Left : Direction.Down;
                    if (Math.abs(deltaX - deltaY) < cornerDeadSpace) springDirection = null;
                } else {
                    // fully left
                    springDirection = Direction.Left;
                }
            } else if (sprite.yBottom <= this.yMid) {
                // fully above
                springDirection = Direction.Up;
            } else if (sprite.y >= this.yMid) {
                // fully below
                springDirection = Direction.Down;
            } else {
                // somewhere in the middle, uh oh
                springDirection = Direction.Right;
            }

            if (springDirection == null) continue;

            if (springDirection == Direction.Down) {
                // bounce down
                sprite.dy = bounceSpeed;
                this.springTimers[1] = timerResetValue;
            } else if (springDirection == Direction.Up) {
                // bounce up
                sprite.dy = -bounceSpeed * 1.6;
                this.springTimers[3] = timerResetValue;
            } else {
                // horizontal bounce
                sprite.dy -= 0.3;
                if (sprite instanceof Enemy) {
                    sprite.direction = springDirection == Direction.Right ? 1 : -1;
                }
                if (springDirection == Direction.Right) {
                    // bounce right
                    this.springTimers[0] = timerResetValue;
                    this.LaunchSprite(sprite, 1);
                } else {
                    // bounce left
                    this.springTimers[2] = timerResetValue;
                    this.LaunchSprite(sprite, -1);
                }
            }
            audioHandler.PlaySound("boing", true);
        }

    }

    GetFrameData(frameNum: number): FrameData[] {
        if (frameNum == 0) {
            return [{
                imageTile: tiles["springbox"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }]
        }

        let sides = [0, 1, 2, 3].map(a => {
            let timer = this.springTimers[a];
            let offset = [1, 2, 3, 4, 5, 6, 6, 5, 4, 4, 5, 6, 6, 5, 4,
                4, 5, 5, 4, 3, 3, 4, 4, 3, 2, 2, 3, 3, 2, 1][timer] || 0;
            return {
                imageTile: tiles["springbox"][a][1],
                xFlip: false,
                yFlip: false,
                xOffset: (a == 0 || a == 2) ? (a == 0 ? -offset : offset) : 0,
                yOffset: !(a == 0 || a == 2) ? (a == 1 ? -offset : offset) : 0
            }
        })

        return [...sides, {
            imageTile: tiles["springbox"][1][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }];
    }
}