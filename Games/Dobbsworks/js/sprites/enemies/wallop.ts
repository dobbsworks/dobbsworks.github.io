class Wallop extends Enemy {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WallopSlider; }

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    killedByProjectiles = false;
    canBeBouncedOn = false;
    canSpinBounceOn = true;
    isSolidBox = true;

    horizontalLookDirection: -1 | 1 = -1;
    verticalLookDirection: -1 | 1 = -1;
    canSeePlayer = false;
    frameRow = 2;
    waitTimer = 0;

    watchDirections: Direction[] = [Direction.Down, Direction.Up];
    moveDirection: Direction | null = null;

    maxSpeed = 2.0;
    accel = 0.2;

    directLookDistance = 120;
    directActiveDistance = 120;
    peripheryLookDistance = 48;
    peripheryActiveDistance = 24;

    collideSound = "thump";

    initialized = false;
    Initialize(): void {
        this.initialized = true;
        if (this.watchDirections.length == 1) {
            // only looking down, for example
            if (this.IsTileSolid(this.watchDirections[0])) {
                this.watchDirections[0] = this.watchDirections[0].Opposite();
            }
        }
    }

    IsTileSolid(dir: Direction): boolean {
        let xs = [this.xMid];
        let ys = [this.yMid];

        if (this.width > 12 && dir.x == 0) xs = [this.xMid, this.x + 1, this.xRight - 1];
        if (this.height > 12 && dir.y == 0) ys = [this.yMid, this.y + 1, this.yBottom - 1];

        for (let x of xs) for (let y of ys) {
            let tileInDirection = this.layer.GetTileByPixel(x + dir.x * (6 + this.width / 2), y + dir.y * (6 + this.height/2));
            if (tileInDirection.tileType.solidity.IsSolidInDirection(dir)) return true;
        }
        return false;
    }

    Update(): void {
        if (!this.initialized) this.Initialize();
        if (!this.WaitForOnScreen()) return;

        this.dxFromPlatform = 0;
        if (!this.moveDirection) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
        let players = currentMap.mainLayer.sprites.filter(a => a instanceof Player);

        if (this.waitTimer > 0) {
            this.waitTimer--;
        } else if (this.moveDirection == null) {
            for (let player of players) {
                let verticalDistance = player.yMid - this.yMid;
                let horizontalDistance = player.xMid - this.xMid;
                this.verticalLookDirection = verticalDistance < 0 ? -1 : 1;
                this.horizontalLookDirection = horizontalDistance < 0 ? -1 : 1;

                this.canSeePlayer = false;
                for (let dir of this.watchDirections) {
                    let directDistance = verticalDistance * dir.y + horizontalDistance * dir.x;
                    let peripheryDistance = verticalDistance * dir.x + horizontalDistance * dir.y;
                    let canSee = Math.abs(peripheryDistance) < this.peripheryLookDistance &&
                        directDistance > 0 &&
                        directDistance < this.directLookDistance;
                    if (canSee) this.canSeePlayer = true;

                    let canActivate = Math.abs(peripheryDistance) < this.peripheryActiveDistance &&
                        directDistance > 0 &&
                        directDistance < this.directActiveDistance;
                    if (canActivate) {
                        if (!this.IsTileSolid(dir)) {
                            this.moveDirection = dir;
                            break;
                        }
                    }
                }
            }
        }

        if (this.moveDirection != null) {
            if (this.moveDirection == Direction.Up) this.parentSprite = null;
            if (this.isBlocked(this.moveDirection)) {
                this.OnSlam(this.moveDirection);
                if (this.moveDirection.x == 0) this.dy = 0;
                if (this.moveDirection.y == 0) this.dx = 0;
                this.moveDirection = null;
                this.watchDirections = this.watchDirections.map(a => a.Opposite());
                this.waitTimer = 30;
                audioHandler.PlaySound(this.collideSound, false);
            }
        }

        if (this.moveDirection) {
            this.dx += this.accel * this.moveDirection.x;
            this.dy += this.accel * this.moveDirection.y;
        }
        if (this.dy > this.maxSpeed) this.dy = this.maxSpeed;
        if (this.dy < -this.maxSpeed) this.dy = -this.maxSpeed;
        if (this.dx > this.maxSpeed) this.dx = this.maxSpeed;
        if (this.dx < -this.maxSpeed) this.dx = -this.maxSpeed;

    }

    OnSlam(dir: Direction): void { }

    GetFrameData(frameNum: number): FrameData[] {
        let col = 0;
        if (this.moveDirection) {
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == 1) col = 5;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == 1) col = 4;
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == -1) col = 3;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == -1) col = 2;
        } else if (this.canSeePlayer) col = 1;

        let ret: FrameData[] = [];

        if (editorHandler.isInEditMode) {
            if (this.watchDirections.indexOf(Direction.Down) > -1) {
                ret.push({ imageTile: tiles["editor"][3][9], xFlip: false, yFlip: false, xOffset: 0, yOffset: 12 });
                ret.push({ imageTile: tiles["editor"][4][9], xFlip: false, yFlip: false, xOffset: 0, yOffset: -12 });
            }
            if (this.watchDirections.indexOf(Direction.Left) > -1) {
                ret.push({ imageTile: tiles["editor"][1][9], xFlip: false, yFlip: false, xOffset: 12, yOffset: 0 });
                ret.push({ imageTile: tiles["editor"][2][9], xFlip: false, yFlip: false, xOffset: -12, yOffset: 0 });
            }
        }

        ret.push({
            imageTile: tiles["wallop"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        });

        return ret;
    }
}

class WallopPlatform extends Wallop {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WallopPlatformSlider; }
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;
    canSpinBounceOn = false;
    frameRow = 3;
    isSolidBox = true;
}

class WallopSlider extends Wallop {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return Wallop; }
    watchDirections: Direction[] = [Direction.Left, Direction.Right];
}
class WallopPlatformSlider extends WallopPlatform {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WallopPlatform; }
    watchDirections: Direction[] = [Direction.Left, Direction.Right];
}

class BigWallop extends Wallop {
    width = 36;
    height = 36;
    frameRow = 0;
    maxSpeed = 2.0;
    accel = 0.025;
    peripheryLookDistance = 60;
    peripheryActiveDistance = 36;
    watchDirections: Direction[] = [Direction.Down];
    collideSound = "bigcrash";
    public static get clockwiseRotationSprite(): (SpriteType | null) { return BigWallopSlider; }

    OnSlam(dir: Direction): void {
        if (this.IsOnScreen()) {
            camera.shakeTimerX = 50 * Math.abs(dir.x);
            camera.shakeTimerY = 50 * Math.abs(dir.y);
        }
    }

    GetFrameData(frameNum: number): FrameData[] {
        let col = 0;
        if (this.moveDirection) {
            col = 2;
        } else if (this.canSeePlayer) {
            col = 1;
        }
        
        let ret: FrameData[] = [];

        if (editorHandler.isInEditMode) {
            if (this.watchDirections.indexOf(Direction.Down) > -1) {
                ret.push({ imageTile: tiles["editor"][3][9], xFlip: false, yFlip: false, xOffset: -12, yOffset: 12 });
                ret.push({ imageTile: tiles["editor"][4][9], xFlip: false, yFlip: false, xOffset: -12, yOffset: -36 });
            }
            if (this.watchDirections.indexOf(Direction.Left) > -1) {
                ret.push({ imageTile: tiles["editor"][1][9], xFlip: false, yFlip: false, xOffset: 12, yOffset: -12 });
                ret.push({ imageTile: tiles["editor"][2][9], xFlip: false, yFlip: false, xOffset: -36, yOffset: -12 });
            }
        }

        ret.push({
            imageTile: tiles["bigWallop"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        });
        return ret;
    }
}
class BigWallopSlider extends BigWallop {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return BigWallop; }
    watchDirections: Direction[] = [Direction.Left, Direction.Right];
}
class BigWallopPlatform extends BigWallop {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return BigWallopPlatformSlider; }
    watchDirections: Direction[] = [Direction.Down];
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;
    canSpinBounceOn = false;
    frameRow = 1;
    isSolidBox = true;
}
class BigWallopPlatformSlider extends BigWallopPlatform {
    public static get clockwiseRotationSprite(): (SpriteType | null) { return BigWallopPlatform; }
    watchDirections: Direction[] = [Direction.Left, Direction.Right];
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
    maxStareTimer = 50;
    resetTimer = 0;
    isSpinning = false;
    private get safeRotation(): number {
        return Math.round((this._rotation % 6) + 6) % 6;
    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (this.state != 3) this.ApplyGravity();
        this.ApplyInertia();

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
                audioHandler.PlaySound("throw", true);
            }
        } else if (this.state == 2) {
            // stare at player, wiggle?
            this.dx = 0;
            if (this.isOnGround) {
                this.stareTimer++;
            } else {
                this.state = 4;
            }
            this._rotation += this.direction * 0.25;
            if (this.target && this.target.xMid < this.xMid) {
                this.direction = -1;
            } else {
                this.direction = 1;
            }
            if (this.stareTimer >= this.maxStareTimer) {
                this.state = 3;
                this.stareTimer = 0;

                //launch
                if (this.target) {
                    let angle = Math.atan2(this.target.yMid - this.yMid, this.target.xMid - this.xMid);
                    let power = 2.0;
                    this.dx = power * Math.cos(angle);
                    this.dy = power * Math.sin(angle);
                    audioHandler.PlaySound("bwump", true);
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
            yOffset: yOffset + Math.sin(this.stareTimer / this.maxStareTimer * (Math.PI)) * 5
        };
    }
}
