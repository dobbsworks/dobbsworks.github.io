class Angler extends Enemy {
    public height: number = 9;
    public width: number = 9;
    public respectsSolidTiles: boolean = true;

    public disguise: FrameData | null = null;
    public revealTimer = 0;

    OnMapLoad(): void {
        // check for disguise
        let sprite = this.layer.sprites.find(a => a.x < this.xMid && a.xRight > this.xMid && a.y < this.yBottom + 6 && a.yBottom > this.yBottom + 6);
        if (sprite) {
            sprite.isActive = false;
            let fd = sprite.GetFrameData(0);
            if ('xFlip' in fd) {
                this.disguise = fd;
            } else {
                this.disguise = fd[0];
            }
            if (this.disguise.imageTile == tiles["empty"][0][0]) {
                this.disguise = null;
                sprite.isActive = true;
            }
        }
    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        this.isInWater = this.IsInWater();

        let p = this.layer.sprites.find(a => a instanceof Player);
        if (p) {
            if (this.disguise) {
                this.damagesPlayer = false;
                if (this.revealTimer == 0) {
                    let playerDistance = Math.sqrt( (this.xMid - p.xMid)**2 + (this.yMid - p.yMid)**2);
                    if (playerDistance < 18) {
                        this.revealTimer = 1;
                        audioHandler.PlaySound("reveal", true);
                    }
                } else {
                    this.revealTimer++;
                    if (this.revealTimer >= 120) {
                        this.damagesPlayer = true;
                        this.disguise = null;
                    }
                }
            } else {
                let targetX = p.xMid;
                let targetY = this.isInWater ? p.yMid : this.yMid;
    
                let theta = Math.atan2(targetY - this.yMid, targetX - this.xMid);
                let targetSpeed = 1.0;
                let accel = 0.010;
                this.AccelerateHorizontally(accel, targetSpeed * Math.cos(theta));
                this.AccelerateVertically(accel, targetSpeed * Math.sin(theta));
                this.direction = p.xMid < this.xMid ? -1 : 1;
            }
        }

        if (!this.isInWater) {
            if (!this.isInWater && this.dy < 0) this.dy = 0;
            this.ApplyGravity();
            this.ApplyInertia();
        }
    }

    GetFrameData(frameNum: number): FrameData[] {

        let frames = [1,2,3,2,1,0];
        let frame = frames[Math.floor(frameNum / 5) % frames.length];
        let ret = [{
            imageTile: tiles["angler"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        }];

        if (this.disguise) {
            if (Math.floor(this.revealTimer / 5) % 2 == 0) {
                ret = [this.disguise];
            }
        }

        if (editorHandler.isInEditMode) {
            ret.push({
                imageTile: tiles["itemWrapper"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 1.5,
                yOffset: -9
            });
        }

        return ret;
    }
}