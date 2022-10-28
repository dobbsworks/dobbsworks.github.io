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
        let overlappingSprites = this.layer.sprites.filter(a => a.Overlaps(this));
        for (let sprite of overlappingSprites) {
            let deltaY = sprite.yMid - this.yMid;
            let deltaX = sprite.xMid - this.xMid;
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // vertical bounce
                if (deltaY > 0) {
                    // bounce down
                    sprite.dy = bounceSpeed;
                    this.springTimers[1] = timerResetValue;
                } else {
                    // bounce up
                    sprite.dy = -bounceSpeed * 1.6;
                    this.springTimers[3] = timerResetValue;
                }
            } else {
                // horizontal bounce
                sprite.dy -= 0.3;
                if (sprite instanceof Enemy) {
                    sprite.direction = sprite.direction == -1 ? 1 : -1;
                }
                if (deltaX > 0) {
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