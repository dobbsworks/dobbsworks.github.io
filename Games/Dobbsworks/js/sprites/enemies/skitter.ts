class Skitter extends Enemy {
    public height: number = 8;
    public width: number = 8;
    public respectsSolidTiles = true;
    canBeBouncedOn = true;

    unhideTimer = 0;
    isHiding = false;
    isClimbing = false;

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        let players = this.layer.sprites.filter(a => a instanceof Player);
        players.sort((a, b) => Math.abs(a.xMid - this.xMid) + Math.abs(a.yMid - this.yMid) - Math.abs(b.xMid - this.xMid) - Math.abs(b.yMid - this.yMid));
        if (players.length > 0) {
            let p = players[0] as Player;
            let isPlayerFacing = (p.direction == 1 && p.xRight <= this.x) || (p.direction == -1 && p.x >= this.xRight);

            if (isPlayerFacing) {
                this.unhideTimer = 0;
            } else {
                this.unhideTimer++;
            }

            this.isHiding = this.unhideTimer < 20;

            if (!this.isHiding) {
                this.direction = (p.xMid < this.xMid ? -1 : 1);
                this.AccelerateHorizontally(0.3, 0.5 * this.direction);

                if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0) {
                    this.dy += - 0.1;
                    if (this.dy < -0.5) this.dy = -0.5;
                    this.isClimbing = true;
                } else {
                    this.isClimbing = false;
                }
            }
        } else {
            this.isClimbing = false;
            this.isHiding = true;
        }

        if (!this.isClimbing) {
            this.ApplyGravity();
        }
        if (this.isClimbing && this.isHiding) {
            this.dy *= 0.9;
        }
        this.ApplyInertia();
        this.ReactToWater();
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 20) % 2;
        if (this.isHiding) col = 2;
        let xOffset = 2;
        let yOffset = 4;

        if (this.isClimbing) {
            col += 3;
            xOffset = this.direction == 1 ? 4 : 0;
            yOffset = 2;
        }

        return {
            imageTile: tiles["skitter"][col][0],
            xFlip: this.direction == -1,
            yFlip: false,
            xOffset: xOffset,
            yOffset: yOffset
        };
    }

}