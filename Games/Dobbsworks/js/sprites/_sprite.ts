abstract class Sprite {
    constructor(
        public x: number,
        public y: number,
        public layer: LevelLayer,
        editorProps: number[]
    ) { }

    public isActive: boolean = true;

    public get yBottom(): number { return +((this.y + this.height).toFixed(3)); }
    public get xRight(): number { return +((this.x + this.width).toFixed(3)); }
    public get xMid(): number { return +((this.x + this.width / 2).toFixed(3)); }
    public get yMid(): number { return +((this.y + this.height / 2).toFixed(3)); }

    public locked: boolean = false;
    public updatedThisFrame: boolean = false;
    public dx: number = 0;
    public dy: number = 0;

    public dxFromPlatform: number = 0;
    public dyFromPlatform: number = 0;

    public ledgeGrabDistance = 3;

    public abstract height: number;
    public abstract width: number;
    public isOnGround: boolean = true;
    public standingOn: LevelTile[] = [];

    public touchedCeilings: (LevelTile)[] = [];
    public touchedLeftWalls: (LevelTile | Sprite)[] = [];
    public touchedRightWalls: (LevelTile | Sprite)[] = [];

    public get isOnCeiling(): boolean { return this.touchedCeilings.length > 0 }
    public get isTouchingLeftWall(): boolean { return this.touchedLeftWalls.length > 0 }
    public get isTouchingRightWall(): boolean { return this.touchedRightWalls.length > 0 }
    public isInWater: boolean = false;
    public isInWaterfall: boolean = false;
    public isInQuicksand: boolean = false;
    public floatsInWater: boolean = false;
    public floatingPointOffset: number = 0;
    public slowFall: boolean = false;
    public gustUpTimer: number = 0; // number of frames remaining to assume is in updraft
    public canMotorHold: boolean = true;

    public age: number = 0;
    public framesSinceThrown: number = 0;
    public isPlatform: boolean = false;
    public isSolidBox: boolean = false;
    public parentSprite: Sprite | null = null;
    public abstract respectsSolidTiles: boolean;
    public canBeHeld: boolean = false;
    public canHangFrom: boolean = false;
    public canBeBouncedOn: boolean = false;
    public hurtsEnemies: boolean = false;
    onScreenTimer: number = 0;

    // used for editor
    public anchor: Direction | null = Direction.Down;
    public maxAllowed: number = -1; // -1 for no limit
    public isRequired: boolean = false;


    protected rotation: number = 0; // used for animating round objects
    public rolls: boolean = false;
    public isPowerSource: boolean = false;
    public zIndex: number = 0; //draw order
    public maxDY = 2;

    GetPowerPoints(): Pixel[] { return [{ xPixel: this.xMid, yPixel: this.yMid }]; }

    abstract Update(): void;

    abstract GetFrameData(frameNum: number): FrameData | FrameData[];

    public OnStrikeEnemy(enemy: Enemy): void { }

    public GetTotalDx(): number {
        let ret = this.dx;
        ret += this.dxFromPlatform;
        return ret;
    }
    public GetTotalDy(): number {
        let ret = this.dy;
        ret += this.dyFromPlatform;
        return ret;
    }

    SharedUpdate(): void {
        this.age++;
        this.framesSinceThrown++;
        this.gustUpTimer--;

        // if (this.isPlatform) {
        //     let riders = this.layer.sprites.filter(a => a.parentSprite == this);
        //     for (let rider of riders) {
        //         rider.isOnGround = true;
        //         rider.y = this.y - rider.height;
        //         if (rider.GetTotalDy() > this.GetTotalDy()) {
        //             rider.dyFromPlatform = this.GetTotalDy();
        //             rider.dy = 0;
        //         }
        //         rider.dxFromPlatform = this.dx;
        //     }
        // }
    }

    ApplyGravity(): void {
        if (this instanceof Enemy && this.stackedOn) return;

        // move towards maxFallSpeed at rate of fallAccel
        let targetFallSpeed = this.maxDY;
        // ORGINAL: 1.5
        let fallAccel = 0.09;
        // ORIGINAL: 0.05
        // NEXT 0.07

        if (this.slowFall || (this instanceof Player && this.heldItem?.slowFall)) {
            targetFallSpeed = 0.4;
        }

        if (this.isInWater && !this.isInWaterfall) {
            if (this.floatsInWater) {
                targetFallSpeed = -0.8;
                fallAccel = 0.03;
            } else {
                targetFallSpeed = 0.6;
                fallAccel = 0.02;
            }
        }

        if (this.isInQuicksand) {
            targetFallSpeed = 0.1;
            fallAccel = 0.05;
        }

        if (this.gustUpTimer > 0) {
            targetFallSpeed = -0.8;
            if (this instanceof Player) {
                if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, false) || KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                    targetFallSpeed = -1.5;
                } else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                    targetFallSpeed = -0.3;
                }
                if (this.heldItem?.slowFall) {
                    targetFallSpeed = -2;
                }
            }
        }

        // adjust dy
        if (Math.abs(this.dy - targetFallSpeed) < fallAccel) {
            // speeds are close, just set value
            this.dy = targetFallSpeed;
        } else {
            if (this.dy > targetFallSpeed) this.dy -= Math.abs(fallAccel);
            else this.dy += Math.abs(fallAccel);
        }
    }

    OnBounce(): void { }

    OnThrow(thrower: Sprite, direction: -1 | 1) {
        this.dx = direction * 1 + thrower.GetTotalDx();
        this.dy = -1;
    }

    OnUpThrow(thrower: Sprite, direction: -1 | 1) {
        this.dx = (direction * 1) * 0 + thrower.GetTotalDx();
        this.dy = -2;
    }

    OnDownThrow(thrower: Sprite, direction: -1 | 1) {
        this.dx = (direction * 1) / 4 + thrower.GetTotalDx();
        this.dy = 0;
    }

    private IsOnScreen(): boolean {
        return (this.xRight + 10 > camera.x - camera.canvas.width / 2 / camera.scale)
            && (this.x - 10 < camera.x + camera.canvas.width / 2 / camera.scale)
            && (this.yBottom + 10 > camera.y - camera.canvas.height / 2 / camera.scale)
            && (this.y - 10 < camera.y + camera.canvas.height / 2 / camera.scale);
    }

    WaitForOnScreen(): boolean {
        if (this.onScreenTimer <= 2) {
            if (this.IsOnScreen()) {
                this.onScreenTimer += 1;
            }
        }
        return this.onScreenTimer >= 2;
    }

    ApplyInertia(): void {
        let inertiaRatio = this.rolls ? 0.99 : 0.94;
        if (this.isOnGround) {
            this.dx *= inertiaRatio;
            if (Math.abs(this.dx) < 0.015) this.dx = 0;
        }
        if (!this.parentSprite) {
            if (this.dyFromPlatform > 0) {
                this.dyFromPlatform = 0;
            } else {
                this.dyFromPlatform *= inertiaRatio;
                if (Math.abs(this.dyFromPlatform) < 0.015) this.dyFromPlatform = 0;
            }
            if (this.dxFromPlatform > 0) {
                this.dxFromPlatform *= inertiaRatio;
            }
            if (this.isOnGround) {
                this.dxFromPlatform *= inertiaRatio;
            }
            if (Math.abs(this.dxFromPlatform) < 0.015) this.dxFromPlatform = 0;
        }
    }

    private ReactToPlatforms(): void {
        // this velocity stored separately to better manage momentum jumps
        if (this.parentSprite) {
            // currently on platform, see if still valid
            if (this.xRight < this.parentSprite.x) this.parentSprite = null;
            else if (this.x > this.parentSprite.xRight) this.parentSprite = null;
            // else if (Math.abs(this.yBottom - this.parentSprite.y) > 0.1) {
            //     this.parentSprite = null;
            // }
        }

        for (let sprite of this.layer.sprites) {
            if ((sprite.isPlatform || sprite.isSolidBox) && this.IsGoingToOverlapSprite(sprite)) {
                if (sprite.isSolidBox) {
                    if ((this.xRight <= sprite.x && this.GetTotalDx() > sprite.GetTotalDx())
                        || (this.x >= sprite.xRight && this.GetTotalDx() < sprite.GetTotalDx())) {
                        // block from side
                        if (this.y < sprite.yBottom && this.yBottom > sprite.y) {
                            this.dxFromPlatform = sprite.GetTotalDx();
                            this.dx = 0;
                            if (this.x < sprite.x) {
                                this.touchedRightWalls.push(sprite);
                            } else {
                                this.touchedLeftWalls.push(sprite);
                            }
                            this.x = (this.x < sprite.x) ? (sprite.x - this.width) : (sprite.x + sprite.width);
                        }
                    }
                    if (this.y > sprite.yBottom && this.GetTotalDy() < sprite.GetTotalDy() &&
                        (this.x < sprite.xRight && this.xRight > sprite.x)) {
                        // block from bottom
                        this.dyFromPlatform = sprite.GetTotalDy();
                        this.dy = 0;
                        this.y = sprite.yBottom;
                    }
                }
                if (sprite.isPlatform || sprite.isSolidBox) {
                    let areSpritesMovingTowards = (this.GetTotalDy() >= sprite.GetTotalDy());
                    let isCurrentlyAbove = (this.yBottom - 0.1 <= sprite.y);
                    if (areSpritesMovingTowards && isCurrentlyAbove && (this.x < sprite.xRight && this.xRight > sprite.x)) {
                        this.parentSprite = sprite;
                    }
                }
            }
        }
        if (this.parentSprite) {
            if (!this.parentSprite.isActive) this.parentSprite = null;
        }
        if (this.parentSprite) {
            this.isOnGround = true;
            //this.y = this.parentSprite.y - this.height;
            //if (this.GetTotalDy() > this.parentSprite.GetTotalDy()) {
            this.dyFromPlatform = this.parentSprite.GetTotalDy();
            this.dy = 0;
            //}
            for (let ground of this.standingOn) {
                let yPixel = ground.GetTopPixel();
                if (this.yBottom > yPixel) {
                    this.y = yPixel - this.height;
                    this.dyFromPlatform = 0;
                }
            }
            this.dxFromPlatform = this.parentSprite.dx;
            if (this.isOnCeiling && this.dyFromPlatform < 0) {
                this.dyFromPlatform = 0;
                this.dxFromPlatform = 0;
                this.parentSprite = null;
            }
        }
    }

    protected waterMinDy = 0.5;
    ReactToWater(): void {
        let wasInWater = this.isInWater;
        this.isInWater = this.IsInWater();
        let changingWaterState = (this.isInWater == !wasInWater);
        if (changingWaterState) {
            let oldDx = this.dx;
            let oldDy = this.dy;
            this.dy /= 2;
            this.dx /= 2;

            let minDx = 0.1;
            let minDy = this.waterMinDy;
            if (Math.abs(this.dx) < minDx && Math.abs(oldDx) >= minDx) {
                this.dx = minDx * (this.dx < 0 ? -1 : 1);
            }
            if (Math.abs(this.dy) < minDy && Math.abs(oldDy) >= minDy) {
                this.dy = minDy * (this.dy < 0 ? -1 : 1);
            }
            if (Math.abs(oldDx) < minDx) {
                this.dx = oldDx * (this.dx < 0 ? -1 : 1);
            }
            if (Math.abs(oldDy) < minDy) {
                this.dy = oldDy * (this.dy < 0 ? -1 : 1);
            }
        }

        this.isInQuicksand = this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.yBottom + this.floatingPointOffset).tileType.isQuicksand || false;
        if (this.isInQuicksand) {
            this.dx *= 0.8;
            this.dy *= 0.8;
        }
    }

    IsGoingToOverlapSprite(sprite: Sprite): boolean {
        if (this == sprite) return false;
        let myX = this.x + this.GetTotalDx();
        let spriteX = sprite.x + sprite.GetTotalDx();
        let myY = this.y + this.GetTotalDy();
        let spriteY = sprite.y + sprite.GetTotalDy();
        let isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
        let isYOverlap = myY <= spriteY + sprite.height && myY + this.height >= spriteY;
        return isXOverlap && isYOverlap;
    }

    Overlaps(sprite: Sprite): boolean {
        if (this == sprite) return false;
        let myX = this.x;
        let spriteX = sprite.x;
        let myY = this.y;
        let spriteY = sprite.y;
        let isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
        let isYOverlap = myY <= spriteY + sprite.height && myY + this.height >= spriteY;
        return isXOverlap && isYOverlap;
    }

    IsInWater(): boolean {
        if (currentMap.spriteWaterMode) return true;
        let waterLayerAtMid = this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.yMid + this.floatingPointOffset).tileType || TileType.Air;
        this.isInWaterfall = waterLayerAtMid.isWaterfall;
        if (waterLayerAtMid.isSwimmable) return true;

        let map = this.layer.map;
        let inGlobalWater = false
        if (map) {
            [map.waterLevel, map.purpleWaterLevel].forEach(a => {
                if (a.currentY !== -1) {
                    if (this.yBottom + this.floatingPointOffset > a.currentY) inGlobalWater = true;
                }
            });
        }
        if (inGlobalWater) return true;

        return this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.yBottom + this.floatingPointOffset).tileType.isSwimmable || false;
    }


    ReactToPlatformsAndSolids(): void {
        if (!this.parentSprite) this.isOnGround = false;
        this.standingOn = [];
        this.touchedCeilings = [];
        this.touchedLeftWalls = [];
        this.touchedRightWalls = [];
        this.ReactToSolids();
        this.ReactToPlatforms();
    }

    private ReactToSolids(): void {
        if (this.GetTotalDy() >= 0) { // moving down
            let grounds = this.GetHeightOfSolid(0, 1);
            if (grounds.yPixel > -1) {
                // -0 was originally -1?
                if (this.yBottom + this.GetTotalDy() > grounds.yPixel - 0 && this.GetTotalDy() >= 0) {
                    // upcoming position is below ground line
                    this.isOnGround = true;
                    this.standingOn = grounds.tiles;
                    if (this.parentSprite && this.parentSprite.GetTotalDy() > 0) this.parentSprite = null;

                    let conveyorSpeed = Math.max(...this.standingOn.map(a => a.tileType.conveyorSpeed));
                    if (conveyorSpeed) this.dxFromPlatform = conveyorSpeed;

                    this.dy = grounds.yPixel - this.y - this.height;
                    if (this.dy < 0) this.dy = 0;
                    this.dyFromPlatform = 0;
                    if (this.rolls) {
                        let solidTile = this.layer.GetTileByPixel(this.xMid, this.yBottom);
                        let solidity = solidTile.tileType.solidity;
                        if (solidity instanceof SlopeSolidity) {
                            this.dx -= solidity.horizontalSolidDirection * 0.02;
                        }
                    }
                }
            }
        }
        if (this.GetTotalDy() <= 0 || (this instanceof Enemy && this.stackedOn)) { // moving up
            let ceilings = this.GetHeightOfSolid(0, -1);
            let ceilingHeight = ceilings.yPixel;
            if (ceilingHeight > -1) {
                if (this.y + this.GetTotalDy() <= ceilingHeight && this.GetTotalDy() <= 0) {
                    this.touchedCeilings.push(...ceilings.tiles);
                    this.dy = ceilingHeight - this.y;
                    if (this.dy > 0) this.dy = 0;
                    this.dyFromPlatform = 0;
                }
            }
        }

        function ReactToHorizontalSolid(sprite: Sprite, direction: -1 | 1) {
            let walls = sprite.GetDistanceOfWall(sprite.GetTotalDy(), direction);
            let wallLocation = walls.x;
            if (wallLocation > -1) {
                let isInWall = sprite.xRight + sprite.GetTotalDx() > wallLocation;
                if (direction == -1) isInWall = sprite.x + sprite.GetTotalDx() < wallLocation;
                if (isInWall) {
                    let nextTileYPixel = Math.floor((sprite.y + sprite.height + sprite.GetTotalDy()) / sprite.layer.tileHeight) * sprite.layer.tileHeight;
                    let heightToNextTile = sprite.y + sprite.height - nextTileYPixel;
                    let wallLocationIfALittleHigher = sprite.GetDistanceOfWall(sprite.GetTotalDy() - sprite.ledgeGrabDistance, direction).x;
                    if (sprite.GetTotalDy() >= 0 && heightToNextTile <= sprite.ledgeGrabDistance && wallLocationIfALittleHigher !== wallLocation) {
                        // ledge grab!
                        //console.log("LEDGE GRAB", heightToNextTile);
                        sprite.y -= heightToNextTile;
                        sprite.dy = 0;
                    } else {
                        // definitely hit a wall
                        sprite.dx = wallLocation - (sprite.x + (direction == 1 ? sprite.width : 0));
                        sprite.dxFromPlatform = 0;
                        if (direction == -1) sprite.touchedLeftWalls = walls.tiles;
                        if (direction == 1) sprite.touchedRightWalls = walls.tiles;
                    }
                }
            }
        }
        if (this.GetTotalDx() > 0) { // moving right
            ReactToHorizontalSolid(this, 1);
        } else if (this.GetTotalDx() < 0) { // moving left
            ReactToHorizontalSolid(this, -1);
        }

        // Slopes
        let footTile = this.layer.GetTileByPixel(this.xMid, this.yBottom - 1);
        if (footTile) {
            if (!(footTile.tileType.solidity instanceof SlopeSolidity) || footTile.tileType.solidity.verticalSolidDirection == -1) {
                // foot tile is not a |\ or /| slope
                // we may have fallen through slightly, let's check the tile at midpoint
                footTile = this.layer.GetTileByPixel(this.xMid, this.yMid);
            }

            let solidity = footTile.tileType.solidity;
            if (solidity instanceof SlopeSolidity && solidity.verticalSolidDirection == 1) {
                // is sloping floor
                if (solidity.GetIsPointInSolidSide(this.xMid, this.yBottom, this.layer, footTile)) {
                    let targetY = solidity.GetSlopePoint(this.xMid, this.layer, footTile);
                    let heightToScootUp = this.yBottom - targetY;
                    let ceilingHeight = this.GetHeightOfSolid(0, -1).yPixel;
                    if (ceilingHeight > -1) {
                        let headRoom = this.y - ceilingHeight;
                        if (heightToScootUp > headRoom) {
                            let overshoot = heightToScootUp - headRoom;
                            this.y += overshoot;
                            this.x -= overshoot * solidity.horizontalSolidDirection;
                            this.touchedCeilings.push(footTile);
                        }
                    }
                    if (this.rolls) {
                        this.dy = -heightToScootUp;
                    } else {
                        this.y -= heightToScootUp;
                    }
                    this.parentSprite = null;
                    //if (this.dy > 0) this.dy = 0;
                    this.isOnGround = true;
                }
            }
        }
        let centerTopTile = this.layer.GetTileByPixel(this.xMid, this.y);
        if (centerTopTile) {
            let solidity = centerTopTile.tileType.solidity;
            if (solidity instanceof SlopeSolidity && solidity.verticalSolidDirection == -1) {
                // is sloping ceiling
                if (solidity.GetIsPointInSolidSide(this.xMid, this.y, this.layer, centerTopTile)) {
                    let targetY = solidity.GetSlopePoint(this.xMid, this.layer, centerTopTile);
                    let heightToScootDown = targetY - this.y;
                    let floorHeight = this.GetHeightOfSolid(0, 1).yPixel;
                    if (floorHeight > -1) {
                        let footRoom = floorHeight - this.yBottom;
                        if (heightToScootDown > footRoom) {
                            let overshoot = heightToScootDown - footRoom;
                            this.y -= overshoot;
                            this.x -= overshoot * solidity.horizontalSolidDirection;
                        }
                    }
                    this.y = targetY;
                    this.touchedCeilings.push(centerTopTile);
                    if (this.dy < 0) this.dy = 0;
                }
            }
        }
    }

    MoveByVelocity(): void {
        this.PushOutOfSlopes();
        this.x += this.GetTotalDx();
        this.y += this.GetTotalDy();
        this.x = +(this.x.toFixed(3));
        this.y = +(this.y.toFixed(3));

        if (this.parentSprite) {
            this.y = this.parentSprite.y - this.height;
        }
        if (this.isPlatform && this.GetTotalDy() > 0) {
            for (let sprite of this.layer.sprites.filter(a => a.parentSprite == this)) {
                sprite.y += this.GetTotalDy();
            }
        }
    }

    GentlyEjectFromSolids() {
        // Push out of solid walls and then reset velocity
        let oldDx = this.dx;
        let oldDy = this.dy;
        if (this.dx == 0) {
            this.dx = 0.001;
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
            this.dx = -0.001;
        }
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        this.dx = oldDx;
        this.dy = oldDy;
    }

    PushOutOfSlopes() {
        if (this.GetTotalDx() != 0 && this.respectsSolidTiles) {
            let footTiles = [this.layer.GetTileByPixel(this.x, this.yBottom), this.layer.GetTileByPixel(this.xRight, this.yBottom)];
            for (let footTile of footTiles) {
                let footTileSolidity = footTile.tileType.solidity;
                if (footTileSolidity instanceof SlopeSolidity && this.isOnGround) {
                    if (footTileSolidity.verticalSolidDirection == 1 && footTileSolidity.horizontalSolidDirection * this.GetTotalDx() > 0) {
                        if (footTileSolidity.GetIsPointInSolidSide(this.xMid, this.yBottom, this.layer, footTile)) {
                            // may need to duplicate the headroom rollback for ceilings
                            let headRoom = this.y - this.GetHeightOfSolid(0, -1).yPixel;
                            let heightToScootUp = this.GetTotalDx() * footTileSolidity.horizontalSolidDirection;
                            if (heightToScootUp > headRoom) {
                                let yOvershoot = heightToScootUp - headRoom;
                                this.y += yOvershoot;
                                this.x -= yOvershoot * footTileSolidity.horizontalSolidDirection
                                //console.log("overshoot2", heightToScootUp, headRoom)
                            }
                            if (this.rolls) {
                                this.dy = -this.GetTotalDx() * footTileSolidity.horizontalSolidDirection;
                            } else {
                                this.y -= this.GetTotalDx() * footTileSolidity.horizontalSolidDirection;
                                // does this need to be changed for steeper slopes?
                            }
                            //console.log("push out of slopes")
                        }
                    }
                }
            }
            // maybe todo, might want to do similar corner based checks for ceiling instead of mid based
            let headTile = this.layer.GetTileByPixel(this.xMid, this.y);
            let headTileSolidity = headTile.tileType.solidity;
            if (headTileSolidity instanceof SlopeSolidity && this.isOnCeiling) {
                if (headTileSolidity.verticalSolidDirection == -1 && headTileSolidity.horizontalSolidDirection * this.GetTotalDx() > 0) {
                    if (headTileSolidity.GetIsPointInSolidSide(this.x + this.GetTotalDx(), this.y + this.GetTotalDy(), this.layer, headTile)) {
                        this.y += this.GetTotalDx() * headTileSolidity.horizontalSolidDirection;
                    }
                }
            }
        }
    }


    GetHeightOfSolid(xOffset: number, direction: 1 | -1): { tiles: LevelTile[], yPixel: number } {
        let bottomY = this.y + (direction == 1 ? this.height : 0);
        let pixelsToCheck = [this.xMid, this.x, this.xRight - 0.01];
        let tileIndexContainingYOfInterest = Math.floor(bottomY / this.layer.tileHeight)
        let startRowIndex = tileIndexContainingYOfInterest;

        let grounds: { tile: LevelTile, yPixel: number }[] = [];
        let middleSlopeSolidity: SlopeSolidity | null = null;
        let middleSlopeRowIndex: number = -1;
        for (let xPixel of pixelsToCheck) {
            let colIndex = Math.floor((xPixel + xOffset) / this.layer.tileWidth);

            for (let rowIndex = startRowIndex; rowIndex !== startRowIndex + 2 * direction; rowIndex += direction) {
                // only checking next few rows
                if (!this.layer.tiles[colIndex]) continue;
                if (middleSlopeSolidity && rowIndex == middleSlopeRowIndex) {
                    // if we're checking the column towards the slope's fat solid side
                    if ((xPixel - this.xMid) * middleSlopeSolidity.horizontalSolidDirection > 0) {
                        continue;
                    }
                }
                let tile = this.layer.tiles[colIndex][rowIndex];
                let yPixelOfEdge = (rowIndex + (direction == 1 ? 0 : 1)) * this.layer.tileHeight;

                let semisolidTile = this.layer.map?.semisolidLayer.tiles[colIndex][rowIndex];
                [semisolidTile, tile].forEach(t => {
                    if (t && t.tileType.solidity == Solidity.Top) {
                        if (direction === 1 && bottomY <= yPixelOfEdge) {
                            grounds.push({ tile: t, yPixel: yPixelOfEdge });
                        }
                    }
                    if (t && t.tileType.solidity == Solidity.Bottom) {
                        if (direction === -1 && bottomY >= yPixelOfEdge) {
                            grounds.push({ tile: t, yPixel: yPixelOfEdge });
                        }
                    }
                })

                if (tile && tile.tileType.solidity == Solidity.Block) {
                    let preceedingNeighbor = this.layer.GetTileByIndex(colIndex, rowIndex - direction);
                    let preceedingSolidity = preceedingNeighbor.tileType.solidity;
                    if (preceedingSolidity instanceof SlopeSolidity &&
                        preceedingSolidity.verticalSolidDirection == direction) {
                        continue;
                    }

                    // Bumped floor/ceil
                    grounds.push({ tile: tile, yPixel: yPixelOfEdge });
                }

                if (tile && xPixel === this.xMid && tile.tileType.solidity instanceof SlopeSolidity) {
                    let hitSolidSlope = tile.tileType.solidity.verticalSolidDirection == direction;
                    if (hitSolidSlope) {
                        let slopePoint = tile.tileType.solidity.GetSlopePoint(xPixel, this.layer, tile);
                        grounds.push({ tile: tile, yPixel: slopePoint });
                        middleSlopeSolidity = tile.tileType.solidity;
                        middleSlopeRowIndex = rowIndex;
                    }
                }
            }
        }
        if (grounds.length) {
            if (direction == 1) {
                // looking down
                let closestGround = Math.min(...grounds.map(a => a?.yPixel));
                let tiles = grounds.filter(a => a.yPixel === closestGround && a.tile).map(a => a.tile).filter(Utility.OnlyUnique);
                return { tiles: tiles, yPixel: closestGround };
            } else {
                let closestGround = Math.max(...grounds.map(a => a?.yPixel));
                let tiles = grounds.filter(a => a.yPixel === closestGround && a.tile).map(a => a.tile).filter(Utility.OnlyUnique);
                return { tiles: tiles, yPixel: closestGround };
            }
        }
        return { tiles: [], yPixel: -999999 };
    }

    GetDistanceOfWall(yOffset: number, direction: 1 | -1): { tiles: LevelTile[], x: number } {
        let startingX = this.xMid;
        let spriteSidePixel = direction == 1 ? this.xRight : this.x;
        let footHeight = this.yBottom - 0.01;
        let pixelsToCheck = [this.y, footHeight];
        if (this.height > this.layer.tileHeight) {
            for (let y = this.y + this.layer.tileHeight; y < footHeight; y += this.layer.tileHeight) {
                pixelsToCheck.push(y);
            }
        }
        pixelsToCheck.push()
        let startColIndex = Math.ceil(startingX / this.layer.tileWidth);
        if (direction == -1) startColIndex--;

        let wallPixels = [];

        for (let yPixel of pixelsToCheck) {
            let rowIndex = Math.floor((yPixel + yOffset) / this.layer.tileHeight);

            for (let colIndex = startColIndex; colIndex !== startColIndex + 2 * direction; colIndex += direction) {
                // only checking next few cols
                if (!this.layer.tiles[colIndex]) continue;
                let tile = this.layer.GetTileByIndex(colIndex, rowIndex);
                let semisolidTile = this.layer.map?.semisolidLayer.tiles[colIndex][rowIndex];
                let pixel = (colIndex + (direction == 1 ? 0 : 1)) * this.layer.tileWidth;

                [semisolidTile, tile].forEach(t => {
                    if (t && t.tileType.solidity == Solidity.LeftWall) {
                        if (direction === -1 && spriteSidePixel >= pixel) {
                            wallPixels.push({ tile: t, x: pixel });
                        }
                    }
                    if (t && t.tileType.solidity == Solidity.RightWall) {
                        if (direction === 1 && spriteSidePixel <= pixel) {
                            wallPixels.push({ tile: t, x: pixel });
                        }
                    }
                })

                if (tile && tile.tileType.solidity == Solidity.Block) {
                    let preceedingNeighbor = this.layer.GetTileByIndex(colIndex - direction, rowIndex);
                    let preceedingSolidity = preceedingNeighbor.tileType.solidity;
                    if (preceedingSolidity instanceof SlopeSolidity &&
                        preceedingSolidity.horizontalSolidDirection == direction) {
                        continue;
                    }

                    // Bumped wall
                    wallPixels.push({ tile: tile, x: pixel });
                }
            }
        }
        if (wallPixels.length) {
            let retPixel = direction == 1 ? Math.min(...wallPixels.map(a => a.x)) : Math.max(...wallPixels.map(a => a.x));
            return { tiles: wallPixels.filter(a => a.x === retPixel).map(a => a.tile), x: retPixel };
        }
        return { x: -1, tiles: [] };
    }

    GetThumbnail(): ImageTile {
        let frameData = this.GetFrameData(0);
        if (this instanceof CameraLockHorizontal) {
            frameData = {
                imageTile: tiles["camera"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }
        }
        if (this instanceof CameraScrollTrigger) {
            frameData = {
                imageTile: tiles["camera"][this.frameCol][1],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }
        }
        if (this instanceof CameraZoomTrigger) {
            frameData = {
                imageTile: tiles["camera"][this.frameCol][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }
        }
        let imageTile = ('xFlip' in frameData) ? frameData.imageTile : frameData[frameData.length - 1].imageTile;
        return imageTile;
    }

    ReplaceWithSprite(newSprite: Sprite): Sprite {
        this.layer.sprites.push(newSprite);
        this.layer.sprites = this.layer.sprites.filter(a => a != this);
        newSprite.x = this.x;
        newSprite.y = this.y;
        newSprite.dx = this.dx;
        newSprite.dy = this.dy;
        this.isActive = false;
        return newSprite;
    }

    ReplaceWithSpriteType(newSpriteType: SpriteType): Sprite {
        let newSprite = new newSpriteType(this.x, this.y, this.layer, []);
        return this.ReplaceWithSprite(newSprite);
    }

    OnAfterDraw(camera: Camera): void { }
}