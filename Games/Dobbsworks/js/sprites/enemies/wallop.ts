class Wallop extends Enemy {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    canSpinBounceOn = true;

    horizontalLookDirection: -1 | 1 = -1;
    verticalLookDirection: -1 | 1 = -1;
    canSeePlayer = false;
    moveDir: -1 | 0 | 1 = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        let players = currentMap.mainLayer.sprites.filter(a => a instanceof Player);

        for (let player of players) {
            let verticalDistance = this.yMid - player.yMid;
            let horizontalDistance = this.xMid - player.xMid;

            this.verticalLookDirection = verticalDistance > 0 ? -1 : 1;
            this.horizontalLookDirection = horizontalDistance > 0 ? -1 : 1;
            this.canSeePlayer = Math.abs(horizontalDistance) < 48 && verticalDistance < 0 && verticalDistance > -120;

            if (this.canSeePlayer && Math.abs(horizontalDistance) < 15) {
                this.moveDir = 1;
            }
        }


        if (this.isOnGround) this.moveDir = 0;
        if (this.moveDir == 1) this.dy += 0.3;

        if (this.dy > 3) this.dy = 3;

    }

    GetFrameData(frameNum: number): FrameData {
        let col = 0;
        if (this.canSeePlayer) {
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == 1) col = 5;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == 1) col = 4;
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == -1) col = 3;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == -1) col = 2;
        }
        if (this.moveDir != 0) col = 1;

        return {
            imageTile: tiles["wallop"][col][2],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}
class Wallopeño extends Enemy {

    public height: number = 6;
    public width: number = 6;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    canSpinBounceOn = true;

    state = 1;
    target: Sprite | null = null;

    dRotation = 0;
    _rotation = 0;
    walkCycleTimer = 0;
    walkWindUpTimer = 0;
    stareTimer = 0;
    resetTimer = 0;
    isSpinning = false;
    private get safeRotation(): number {
        return Math.round((this._rotation % 6) + 6) % 6;
    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (this.state != 3) this.ApplyGravity();

        if (this.state == 1) {
            // idle walk
            this.dRotation -= 0.01 * this.direction;
            if (this.dRotation > 0.5) this.dRotation = 0.5;
            if (this.dRotation < -0.5) this.dRotation = -0.5;
            this._rotation += this.dRotation;
            let theta = this.safeRotation / 6 * (Math.PI);
            this.dx = -this.dRotation * Math.sin(theta) * 1.67;
            this.walkCycleTimer++;
            if (this.walkCycleTimer == 34) {
                this.walkCycleTimer = 0;
                this.dRotation = 0;
                this._rotation = 0;
            }
            if (this.direction == 1 && this.touchedRightWalls.length > 0) {
                this.direction = -1;
            }
            if (this.direction == -1 && this.touchedLeftWalls.length > 0) {
                this.direction = 1;
            }

            // look in currect direction for player
            let p = this.layer.sprites.find(a => a instanceof Player &&
                ((this.direction == -1 && a.xMid < this.xMid && a.xMid > this.xMid - 50) ||
                    (this.direction == 1 && a.xMid > this.xMid && a.xMid < this.xMid + 50)) &&
                this.yMid > a.yMid && this.yMid < a.yMid + 80
            );
            if (p && this.isOnGround) {
                this.target = p;
                this.state = 2;
                this.stareTimer = 0;
                this._rotation = 0;
            }
        } else if (this.state == 2) {
            // stare at player, wiggle?
            if (this.isOnGround) this.stareTimer++;
            this.dx = 0;
            if (this.target && this.target.xMid < this.xMid) {
                this.direction = -1;
            } else {
                this.direction = 1;
            }
            if (this.stareTimer >= 120) {
                this.state = 3;
                this.stareTimer = 0;

                //launch
                if (this.target) {
                    let angle = Math.atan2(this.target.yMid - this.yMid, this.target.xMid - this.xMid);
                    let power = 2.5;
                    this.dx = power * Math.cos(angle);
                    this.dy = power * Math.sin(angle);
                }
            }
        } else if (this.state == 3) {
            // launching at player
            this._rotation += -this.direction * 0.5;
            if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0 || this.touchedCeilings.length > 0 || this.isOnGround) {
                this.state = 4;
                this.dx = 0; 
            }
        } else if (this.state == 4) {
            // falling 
            this._rotation += -this.direction * 0.2;
            if (this.isOnGround) {
                this._rotation = 0;
                this.state = 5;
                this.resetTimer = 0;
            }
        } else if (this.state == 5) {
            this.resetTimer++;
            if (this.resetTimer >= 30) {
                this.state = 1;
            }
        }
    }



    GetFrameData(frameNum: number): FrameData {
        let frame = this.safeRotation;
        let yOffset = 6;
        if (this.isSpinning) {
            if (frame == 2 || frame == 3 || frame == 4) yOffset = 7;
        }
        return {
            imageTile: tiles["wallop"][frame][this.direction == 1 ? 0 : 1],
            xFlip: false,
            yFlip: false,
            xOffset: 3 + Math.sin(this.stareTimer / 2) / 2,
            yOffset: yOffset
        };
    }
}
