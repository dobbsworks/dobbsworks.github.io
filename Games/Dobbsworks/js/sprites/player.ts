class Player extends Sprite {

    public height: number = 9;
    public width: number = 5;
    public direction: -1 | 1 = 1;
    private jumpBufferTimer: number = -1; // how long since initial jump tap
    public coyoteTimer: number = 999; // how long since not on ground // start this value above threshold so that player cannot immediately jump if starting in air, must hit ground first
    private frameNum: number = 0;
    public jumpTimer: number = -1; // how long have we been ascending for current jump
    public throwTimer: number = 999; // how long since throwing something
    private swimTimer: number = -1; // how long since last swim
    public isClimbing: boolean = false;
    public isHanging: boolean = false;
    public isSliding: boolean = false;
    public justLanded: boolean = false;
    public slideDirection: -1 | 1 = 1;
    private currentSlope = 0;
    private climbCooldownTimer: number = -1; // how long since climbing (to avoid regrabbing ladder while climbing up)
    respectsSolidTiles = true;
    private dxFromBumper = 0;
    private dyFromBumper = 0;
    private bumperTimer = 0;
    public isSpinJumping = false;
    private isTouchingStickyWall = false;
    private wallClingDirection: -1 | 1 = -1;
    private wallDragDirection: -1 | 1 | 0 = 0;
    canMotorHold = false;

    twinkleCount = 0;
    twinleTimer = 0;

    public maxBreath: number = 600;
    public currentBreath: number = 600;
    private breathTimer: number = 0; // current breath only recovers after breath timer runs out

    private iFrames: number = 0;

    public replayHandler = new ReplayHandler();
    public neutralTimer = 0;
    public forcedJumpTimer = 0;

    isRequired = true;
    maxAllowed = 1;

    public heldItem: Sprite | null = null;
    public yoyoTarget: SpinningYoyo | null = null;
    public yoyoTimer = 0;

    private targetDirection: -1 | 0 | 1 = 0;

    private props = ["x", "y", "dx", "dy", "isOnGround"];
    private history: any[] = [];
    zIndex = 1;
    protected moveSpeed = 1.2;

    private floatFramesLeftForThisJump = 0;
    public isFloating = false;
    private maxFloatDuration = 100;
    protected canPlayerFloatJump = false;
    protected sourceImageOffset = 0;

    LogProps(): void {
        let obj: any = {}
        for (let propName of this.props) {
            obj[propName] = (<any>this)[propName];
        }
        this.history.push(obj);
    }

    LoadHistory(): void {
        let history = this.history.pop();
        for (let propName of this.props) {
            (<any>this)[propName] = history[propName];
        }
    }

    Update(): void {
        let oldX = this.x;
        let oldY = this.y;
        this.LogProps();
        //this.x += 0.1;
        //this.HandleBumpers();
        if (this.iFrames > 0) this.iFrames--;
        this.PlayerMovement(); // includes gravity
        this.PlayerItem();
        this.HandleEnemies(); // includes gravity
        this.PlayerInertia();
        this.PushByAutoscroll();
        let wasOnGround = this.isOnGround;
        this.ReactToPlatformsAndSolids();
        this.justLanded = !wasOnGround && this.isOnGround;
        this.SlideDownSlopes();
        if (!this.yoyoTarget || !this.yoyoTarget.isActive) this.MoveByVelocity();
        this.UpdateHeldItemLocation();
        this.ReactToSpikes();
        this.KeepInBounds();
        //console.log(this.x - oldX, this.y - oldY)
        this.frameNum += Math.max(Math.abs(this.dx / 4), Math.abs(this.dy / 4));
        // if (Math.abs(this.dx) > 1) {
        //     //debugMode = true;
        //     this.dx *= 0.5;
        // }
        if (!this.yoyoTarget) this.HandleDoors();
        if (KeyboardHandler.IsKeyPressed(KeyAction.Reset, true) && this.age > 1 && !levelGenerator) this.OnPlayerDead(false);
        this.replayHandler.StoreFrame()

        if (this.twinkleCount > 0) {
            if (this.twinleTimer <= 0) {
                this.twinkleCount--;
                this.twinleTimer = 4;
                let twinkle = new Twinkle(this.x + Math.random() * this.width - 5, this.yBottom - Math.random() * 5, this.layer, []);
                this.layer.sprites.push(twinkle);
            } else {
                this.twinleTimer--;
            }
        }
    }

    PlayerMovement(): void {
        if (this.yoyoTimer > 0) {
            this.yoyoTimer--;
            return;
        }
        if (this.neutralTimer > 0) this.neutralTimer--;
        if (this.forcedJumpTimer > 0) this.forcedJumpTimer--;

        if (this.GetTotalDy() > 0) {
            if (this.touchedRightWalls.some(a => a instanceof LevelTile && a.tileType.isJumpWall) && KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
                this.wallDragDirection = 1;
                this.direction = 1;
            }
            if (this.touchedLeftWalls.some(a => a instanceof LevelTile && a.tileType.isJumpWall) && KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
                this.wallDragDirection = -1;
                this.direction = -1;
            }
        }

        if (this.touchedRightWalls.some(a => a instanceof LevelTile && a.tileType.isStickyWall)) {
            this.isTouchingStickyWall = true;
            this.wallClingDirection = 1;
            this.direction = 1;
        }
        if (this.touchedLeftWalls.some(a => a instanceof LevelTile && a.tileType.isStickyWall)) {
            this.isTouchingStickyWall = true;
            this.wallClingDirection = -1;
            this.direction = -1;
        }

        let wasInWater = this.isInWater;
        let waterLayerAtMid = this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.yMid).tileType || TileType.Air;
        let waterTileAtFoot = this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.yBottom - 0.1).tileType || TileType.Air;
        this.isInWater = waterLayerAtMid.isSwimmable || waterTileAtFoot.isSwimmable || currentMap.playerWaterMode;
        this.isInWaterfall = waterLayerAtMid.isWaterfall;
        let isLosingBreath = (waterLayerAtMid.drainsAir || waterTileAtFoot.drainsAir);
        this.swimTimer++;

        // global water

        let map = this.layer.map;
        let globalWaterHeight = -1;
        if (map) {
            if (map.waterLevel.currentY !== -1) {
                if (this.yBottom + this.floatingPointOffset > map.waterLevel.currentY) this.isInWater = true;
                globalWaterHeight = map.waterLevel.currentY;
            }
            if (map.purpleWaterLevel.currentY !== -1) {
                if (this.yBottom + this.floatingPointOffset > map.purpleWaterLevel.currentY) {
                    this.isInWater = true;
                    isLosingBreath = true;
                }
                if (globalWaterHeight == -1 || globalWaterHeight > map.purpleWaterLevel.currentY) {
                    globalWaterHeight = map.purpleWaterLevel.currentY;
                }
            }
            if (map.lavaLevel.currentY !== -1) {
                if (this.yBottom + this.floatingPointOffset > map.lavaLevel.currentY) {
                    this.dy -= 3;
                    this.OnPlayerHurt();
                }
            }
        }


        if (this.isInWater && !wasInWater) {
            if ((waterTileAtFoot?.isSwimmable) || (globalWaterHeight !== -1 && globalWaterHeight < this.yBottom)) {
                this.dy = 0;
            } else {
                this.dy *= 0.5;
            }
        }


        this.HandleBreath(isLosingBreath);

        this.isInQuicksand = this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.yBottom - 0.1).tileType.isQuicksand || false;

        if (this.isOnGround || this.isClimbing || ((this.isInWater || this.isInQuicksand) && this.heldItem == null) || this.isTouchingStickyWall || (this.heldItem?.canHangFrom)) {
            if (this.age > 1) this.coyoteTimer = 0;
            this.isSpinJumping = false;
            this.floatFramesLeftForThisJump = 0;
        }
        this.coyoteTimer++;

        let isJumpHeld = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false);
        if (this.jumpTimer > -1) {
            if (this.windDy > 0) this.jumpTimer += this.windDy;
            if (isJumpHeld || this.forcedJumpTimer > 0) this.jumpTimer++;
            if (!isJumpHeld && this.forcedJumpTimer <= 0) {
                this.jumpTimer = -1;
                if (this.dy < -1) this.dy = -1;
            }
            // below controls how many frames of upward velocity we get

            let numJumpFrames = 18;
            if (this.jumpTimer > numJumpFrames) this.jumpTimer = -1;
            // jumptimer 14
        }

        if (this.isFloating) {
            if (isJumpHeld) {
                this.dy = 0;
                this.floatFramesLeftForThisJump--;
                if (this.floatFramesLeftForThisJump <= 0) this.isFloating = false;
            } else {
                this.isFloating = false;
                this.floatFramesLeftForThisJump = 0;
            }
        } else {
            if (this.jumpTimer == -1 && !this.isClimbing) {
                this.ApplyGravity();
                if (isJumpHeld && this.dy > 0) this.dy *= 0.97;
                // can call this twice for "heavy" movement
                //this.ApplyGravity();
            }
        }
        if (this.dy > this.maxDY) this.dy = this.maxDY;
        if (this.dy > this.maxDY / 2.5 && this.wallDragDirection != 0) this.dy = this.maxDY / 2.5;

        let isJumpInitialPressed = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) /*&& this.forcedJumpTimer <= 0*/;
        if (this.jumpBufferTimer >= 0) this.jumpBufferTimer++;
        if (isJumpInitialPressed) this.jumpBufferTimer = 0;
        if (this.jumpBufferTimer > 3) this.jumpBufferTimer = -1;

        let spinJumper = <SpinRing>this.layer.sprites.find(a => a instanceof SpinRing && a.Overlaps(this) && a.allowsSpinJump);

        if (this.jumpBufferTimer > -1 && (this.coyoteTimer < 5 || this.IsNeighboringWallJumpTiles() || (spinJumper && this.heldItem == null)) && this.forcedJumpTimer <= 0) {
            if (spinJumper) {
                this.isSpinJumping = true;
                audioHandler.PlaySound("spinRing", true);
                this.twinkleCount = 4;
                spinJumper.OnPlayerUseSpinRing();
                this.Jump();
                if (spinJumper.direction.x != 0) {
                    this.dx = 1.5 * spinJumper.direction.x;
                    this.dy = -0.5;
                    player.neutralTimer = 20;
                    player.forcedJumpTimer = 20;
                }
                if (spinJumper.direction == Direction.Down) {
                    this.dx = 0;
                    this.dy = 2;
                }
            } else {
                this.isSpinJumping = false;
                this.Jump();
            }
            this.isSliding = false;
        }

        if ((this.isInWater && (!waterLayerAtMid.isSwimmable && globalWaterHeight > this.yMid) && !currentMap.playerWaterMode)) {
            // break through water surface
            if (isJumpHeld && this.dy < 0) this.dy = -1.3;
            else if (this.dy < 0) this.dy = 0;
        }

        let upPressed = KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && !(this.neutralTimer > 0);
        let downPressed = KeyboardHandler.IsKeyPressed(KeyAction.Down, false) && !(this.neutralTimer > 0);
        let leftPressed = KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && !(this.neutralTimer > 0);
        let rightPressed = KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && !(this.neutralTimer > 0);

        if (leftPressed && this.dx > 0) this.isSliding = false;
        if (rightPressed && this.dx < 0) this.isSliding = false;
        if (upPressed) this.isSliding = false;

        this.climbCooldownTimer++;
        let tileAtMid = this.layer.GetTileByPixel(this.xMid, this.yMid);
        let tileAtFoot = this.layer.GetTileByPixel(this.xMid, this.yBottom - 0.25);
        let isAtLadderTop = (tileAtFoot.tileType.isClimbable && tileAtFoot.GetSemisolidNeighbor()?.tileType.solidity == Solidity.Top);
        let isTouchingLadder = tileAtMid.tileType.isClimbable || isAtLadderTop;
        if (upPressed && isTouchingLadder && this.climbCooldownTimer > 20 && this.heldItem == null) {
            this.isClimbing = true;
            this.isSliding = false;
        }
        let wasClimbing = this.isClimbing;
        if (!isTouchingLadder) {
            this.isClimbing = false;
        }

        // climb down through ladder
        if (downPressed && this.heldItem == null) {
            let standingOnPassThroughs = this.standingOn.every(a => a.tileType.solidity == Solidity.Top || a.tileType.solidity == Solidity.None);
            let centerStandingOnClimbable = this.layer.GetTileByPixel(this.xMid, this.yBottom + 1).tileType.isClimbable
            if (standingOnPassThroughs && centerStandingOnClimbable) {
                this.y += 0.1;
                this.isClimbing = true;
                this.isOnGround = false;
                this.isSliding = false;
            }
        }

        this.isHanging = false;
        if (this.touchedCeilings.some(a => a.tileType.isHangable)) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, false) && this.heldItem == null) {
                this.isHanging = true;
                this.dxFromPlatform = 0;
                this.isSliding = false;
                this.dy = 0;
                if (!leftPressed && this.dx < 0) this.dx *= 0.8;
                if (!rightPressed && this.dx > 0) this.dx *= 0.8;

                let conveyorSpeeds = this.touchedCeilings.map(a => a.tileType.conveyorSpeed).filter(a => a !== 0);
                if (conveyorSpeeds.length) this.dxFromPlatform = -Math.max(...conveyorSpeeds);
            }
        }


        if (this.isTouchingStickyWall) {
            this.dx = 0;
            this.dy = 0;
            this.isSliding = false;
        } else if (this.wallDragDirection != 0) {
            if (this.isOnGround) {
                this.wallDragDirection = 0;
            } else if (this.wallDragDirection == -1 && KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
                this.wallDragDirection = 0;
            } else if (this.wallDragDirection == 1 && KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
                this.wallDragDirection = 0;
            }
            else {
                if (!this.IsNeighboringWallJumpTiles()) this.wallDragDirection = 0;
            }
        } else if (!this.isSliding) {
            if (this.isClimbing) {
                this.dxFromPlatform = 0;
                this.parentSprite = null;
                let canClimbUp = this.layer.GetTileByPixel(this.xMid, this.yMid - 0.5).tileType.isClimbable;
                if (!canClimbUp && isAtLadderTop) canClimbUp = true;
                this.dy = 0;
                this.dx = 0;
                if (upPressed && !downPressed && canClimbUp) this.dy = -0.5;
                if (!upPressed && downPressed) this.dy = 0.5;
                if (leftPressed && !rightPressed) this.dx = -0.5;
                if (!leftPressed && rightPressed) this.dx = 0.5;
                if (this.isOnGround) this.isClimbing = false;
            } else {
                let downPressedWhileOnGround = KeyboardHandler.IsKeyPressed(KeyAction.Down, false) && this.isOnGround;
                this.targetDirection = 0;
                if (leftPressed && !rightPressed) {
                    if (!downPressedWhileOnGround) this.targetDirection = -1;
                    this.direction = -1;
                } else if (!leftPressed && rightPressed) {
                    if (!downPressedWhileOnGround) this.targetDirection = 1;
                    this.direction = 1;
                }
                if (this.targetDirection) {
                    let maxSpeed = this.moveSpeed;
                    if (this.currentSlope !== 0 && (this.currentSlope * this.targetDirection) < 0) {
                        // running up a slope
                        let absSlope = Math.abs(this.currentSlope);
                        let speedRatio = absSlope >= 2 ? 0.5 : (absSlope >= 1 ? 0.8 : 0.9);
                        maxSpeed *= speedRatio;
                    }
                    // ORIGINAL: 1.0
                    let accel = this.isOnGround ? 0.06 : 0.035;
                    if (this.IsOnIce()) accel = 0.025;
                    if (!KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                        maxSpeed = this.moveSpeed * 0.7;
                        // ORIGINAL: 0.7
                        // NEXT 0.75
                    }
                    if (this.isInWater) {
                        maxSpeed = 0.5;
                    }
                    if (this.isHanging) {
                        maxSpeed = 0.5;
                    }

                    let shouldCapSpeed = (leftPressed || rightPressed) && this.dxFromWind == 0;
                    // only add speed when below max speed
                    if (this.dx * this.targetDirection < maxSpeed) {
                        this.dx += this.targetDirection * accel;
                    }
                    if (shouldCapSpeed) {
                        if (Math.abs(this.dx) > maxSpeed) {
                            this.dx = maxSpeed * (this.dx > 0 ? 1 : -1);
                        }
                    }

                    // this.dx += this.targetDirection * accel;
                    // // cap speed
                    // if (Math.abs(this.dx) > maxSpeed) {
                    //     this.dx = maxSpeed * (this.dx > 0 ? 1 : -1);
                    // }
                }
            }
        }

        if (this.isInWater && Math.abs(this.dy) > this.moveSpeed) {
            this.dy *= 0.9;
        }

        if (this.isInQuicksand) {
            this.dx *= 0.8;
            this.dy *= 0.8;
        }

        if (this.standingOn.some(a => !a.tileType.canWalkOn)) this.dx = 0;

        if (this.dy > 0 && isJumpHeld && this.canPlayerFloatJump && !this.isFloating && this.floatFramesLeftForThisJump > 0) {
            let isInCannon = this.layer.sprites.some(a => a instanceof RedCannon && a.heldPlayer == this);
            let tappedJumpThisFrame = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true);
            if (!isInCannon && (this.forcedJumpTimer <= 0 || tappedJumpThisFrame)) {
                this.isFloating = true;
            }
        }
        if (this.isOnGround || this.isClimbing || wasClimbing || this.isInWater || this.isInQuicksand) {
            this.RefreshFloatTimer();
        }
    }

    RefreshFloatTimer(): void {
        this.floatFramesLeftForThisJump = this.maxFloatDuration;
    }

    SlideDownSlopes() {
        this.currentSlope = 0;
        let slopeDown = 0;
        if (this.standingOn.length) {
            if (this.standingOn.every(a => a.tileType.solidity instanceof SlopeSolidity)) {
                let slopes = (<SlopeSolidity[]>(this.standingOn.map(a => a.tileType.solidity)));
                this.slideDirection = slopes[0].horizontalSolidDirection == 1 ? -1 : 1;
                slopeDown = Math.max(...slopes.map(a => a.absoluteSlope));
                this.currentSlope = Math.max(...slopes.map(a => a.absoluteSlope * -a.horizontalSolidDirection * a.verticalSolidDirection));

                if (Math.abs(this.currentSlope) == 2) {
                    // let slopeSlideSpeed = 0.1;
                    // this.dx += this.slideDirection * slopeSlideSpeed / 2;
                    // this.dy += slopeSlideSpeed;
                    this.isSliding = true;
                }

                if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                    this.isSliding = true;
                }
            }
        }

        if (this.isSliding) {
            if (slopeDown == 0) {
                this.dx *= 0.97;
                if (Math.abs(this.dx) < 0.2) this.isSliding = false;
            } else {
                if (Math.abs(this.dx) < 2) {
                    this.dx += this.slideDirection * 0.05 * slopeDown;
                    this.dy += 0.05 * slopeDown;
                }
            }
        }
    }

    Jump(): void {
        // very similar to Bounce()
        // if (this.jumpBufferTimer > 0) console.log("BUFFER JUMP", this.jumpBufferTimer);
        // if (this.coyoteTimer > 0) console.log("COYOTE TIME", this.coyoteTimer);
        this.jumpBufferTimer = -1;
        this.coyoteTimer = 999999;
        this.dy = (Math.abs(this.dx) > 0.3 || this.isSpinJumping) ? -1.5 : -1.2;

        let isOnSlime = this.standingOn.some(a => !a.tileType.canJumpFrom);
        if (this.parentSprite instanceof Splatform) {
            isOnSlime = true;
            if (this.standingOn.every(a => !a.tileType.canJumpFrom)) {
                // ONLY standing on slime tiles
                this.parentSprite.PlayerAttemptJump();
            }
        }
        if (this.isInWater) {
            this.swimTimer = 0;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) this.dy = -0.2;
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) this.dy = -0.8;
            else this.dy = -0.5;
            audioHandler.PlaySound("swim", true);
        } else {
            if (isOnSlime) {
                audioHandler.PlaySound("stuck-jump", true);
            } else {
                audioHandler.PlaySound("jump", true);
            }
        }
        if (this.heldItem?.canHangFrom) {
            this.heldItem.framesSinceThrown = 1;
            this.heldItem = null;
            this.dy = -1.5;
        }
        this.jumpTimer = 0;
        this.isClimbing = false;
        this.climbCooldownTimer = 0;
        if (!isOnSlime) this.parentSprite = null;

        let jumpWallLeft = this.IsNeighboringWallJumpTilesSide(-1);
        let jumpWallRight = this.IsNeighboringWallJumpTilesSide(1);


        if (this.isTouchingStickyWall || this.wallDragDirection != 0 || jumpWallLeft || jumpWallRight) {
            this.dx = -this.wallClingDirection * this.moveSpeed;
            this.dy = -1.1; // less than normal to make sure no single-wall scaling
            this.direction = this.wallClingDirection == 1 ? -1 : 1;
            this.wallDragDirection = 0;

            if (jumpWallLeft) {
                this.dx = this.moveSpeed;
                this.direction = 1;
            }
            if (jumpWallRight) {
                this.dx = -this.moveSpeed;
                this.direction = -1;
            }
        }
        if (this.currentSlope !== 0) {
            this.dx += this.currentSlope / 2;
        }
        this.isTouchingStickyWall = false;

        if (isOnSlime) {
            this.dy = 0;
            this.jumpTimer = -1;
        }
        this.RefreshFloatTimer();
    }

    Bounce(): void {
        // very similar to Jump()
        this.jumpBufferTimer = -1;
        this.coyoteTimer = 999999;
        this.dy = -1.5;
        this.jumpTimer = 0;
        this.isClimbing = false;
        this.parentSprite = null;
        this.RefreshFloatTimer();
    }

    HandleBreath(isLosingBreath: boolean): void {
        if (isLosingBreath) {
            this.breathTimer = 120;
            this.currentBreath -= 1;
            if (this.currentBreath <= 0) this.OnPlayerDead(true);
        } else {
            if (this.breathTimer > 0) this.breathTimer -= 1;
            if (this.breathTimer <= 0 && this.currentBreath < this.maxBreath) this.currentBreath += 4;
        }
    }

    IsNeighboringWallJumpTiles(): boolean {
        return this.IsNeighboringWallJumpTilesSide(-1) || this.IsNeighboringWallJumpTilesSide(1);
    }

    IsNeighboringWallJumpTilesSide(direction: -1 | 1): boolean {
        if (this.direction == -1) {
            if (this.x % this.layer.tileWidth > 0.1) return false;
        }
        if (this.direction == 1) {
            let xInTile = (this.x + this.width) % this.layer.tileWidth;
            if (xInTile < 11.9 && xInTile !== 0) return false;
        }
        let x = direction == 1 ? this.xRight + 0.1 : this.x - 0.1;
        return !this.isOnGround && ([
            this.layer.GetTileByPixel(x, this.y).GetSemisolidNeighbor(),
            this.layer.GetTileByPixel(x, this.yBottom).GetSemisolidNeighbor(),
        ].some(a => (a?.tileType == TileType.WallJumpLeft && direction == -1) || (a?.tileType == TileType.WallJumpRight && direction == 1)));
    }

    HandleBumpers(): void {
        // maybe todo:
        // check all 4 corners, then for each bumper in that list see if center to center dist < 8.5 (p.wid/2 + tile.wid/2)
        // if couble bump, cancel conflicts
        let tileAtMid = this.layer.GetTileByPixel(this.xMid, this.yMid);
        if (tileAtMid.tileType.isBumper) {
            let bumperAngle = Math.atan2(this.yMid - (tileAtMid.tileY + 0.5) * this.layer.tileHeight, this.xMid - (tileAtMid.tileX + 0.5) * this.layer.tileWidth);
            bumperAngle += 2 * Math.PI;
            bumperAngle *= 8 / (2 * Math.PI); // [0, 8)
            bumperAngle = +(bumperAngle.toFixed(0));
            bumperAngle /= 8 / (2 * Math.PI);
            this.dxFromBumper = Math.cos(bumperAngle) * 1.5;
            this.dyFromBumper = Math.sin(bumperAngle) * 1.5;
            this.jumpTimer = 0;
            this.jumpBufferTimer = -1;
            this.coyoteTimer = 999999;
            this.isClimbing = false;
            this.bumperTimer = 8;
        } else {
            this.bumperTimer--;
        }
        if (this.bumperTimer > 0) {
            this.dx = this.dxFromBumper;
            this.dy = this.dyFromBumper;
        }
    }

    PushByAutoscroll(): void {
        if (camera.isAutoscrollingHorizontally) {
            if (this.x < camera.GetLeftCameraEdge() && this.dx < camera.autoscrollX) this.dx = camera.autoscrollX
            if (this.xRight > camera.GetRightCameraEdge() && this.dx > camera.autoscrollX) this.dx = camera.autoscrollX
        }
    }

    KeepInBounds(): void {
        if (this.x < 0) {
            this.x = 0;
            if (this.dx < 0) this.dx = 0;
        }
        let maxX = this.layer.tiles.length * this.layer.tileWidth;
        if (this.xRight > maxX) {
            this.x = maxX - this.width;
            if (this.dx > 0) this.dx = 0;
        }

        if (camera.isAutoscrollingHorizontally || camera.isAutoscrollingVertically) {
            let leftEdge = camera.GetLeftCameraEdge();
            if (this.x < leftEdge) {
                if (this.isTouchingRightWall && camera.autoscrollX > 0) this.OnPlayerDead(false);
                else this.x = leftEdge;
            }
            let rightEdge = camera.GetRightCameraEdge();
            if (this.xRight > rightEdge) {
                if (this.isTouchingLeftWall && camera.autoscrollX < 0) this.OnPlayerDead(false);
                else this.x = rightEdge - this.width;
            }

            if (camera.autoscrollY > 0) {
                // scrolling down
                if (this.yBottom < camera.GetTopCameraEdge() - 24 && this.standingOn.length) {
                    // more than two tiles above screen, standing on surface
                    this.OnPlayerDead(false);
                }
            }

            if (this.y > camera.GetBottomCameraEdge() + 12) {
                // more than one tile below screen edge
                this.OnPlayerDead(false);
            }

        }
    }

    HandleEnemies(): void {
        let sprites = this.layer.sprites;
        for (let sprite of sprites) {
            let isHorizontalOverlap = this.xRight > sprite.x && this.x < sprite.xRight;

            //let aboutToOverlapFromAbove = this.yBottom > sprite.y && this.yBottom - 3 < sprite.y;
            let currentlyAbove = this.yBottom <= sprite.y + 3 || this.parentSprite == sprite;
            let projectedBelow = this.yBottom + this.GetTotalDy() > sprite.y + sprite.GetTotalDy();
            let aboutToOverlapFromAbove = currentlyAbove && projectedBelow;
            if (!aboutToOverlapFromAbove && sprite instanceof RollingSnailShell) {
                aboutToOverlapFromAbove = this.yBottom > sprite.y && this.yBottom - 3 < sprite.y;
            }

            let landingOnTop = aboutToOverlapFromAbove && isHorizontalOverlap;

            if (sprite instanceof Enemy) {

                if (sprite.framesSinceThrown > 0 && sprite.framesSinceThrown < 25) continue; // can't bounce on items that have just been thrown
                if (landingOnTop && sprite.canBeBouncedOn) {
                    this.Bounce();
                    if (this.isSpinJumping) {
                        sprite.OnSpinBounce();
                    } else {
                        sprite.OnBounce();
                    }
                    sprite.SharedOnBounce(); //enemy-specific method
                } else if (landingOnTop && sprite.canSpinBounceOn && this.isSpinJumping) {
                    this.Bounce();
                    audioHandler.PlaySound("spinBounce", true);

                    let particle = new Pow(this.x, this.y, this.layer, []);
                    particle.x = this.xMid - particle.width / 2;
                    particle.y = this.yBottom - particle.height / 2;
                    this.layer.sprites.push(particle);

                } else if (sprite.canStandOn && currentlyAbove && isHorizontalOverlap) {

                } else if (!sprite.isInDeathAnimation && this.xRight > sprite.x && this.x < sprite.xRight && this.yBottom > sprite.y && this.y < sprite.yBottom) {
                    if (this.isSliding && sprite.killedByProjectiles) {
                        sprite.isActive = false;
                        let deadSprite = new DeadEnemy(sprite);
                        this.layer.sprites.push(deadSprite);
                    } else {
                        if (sprite.damagesPlayer) {
                            this.OnPlayerHurt();
                        }
                    }
                }
            } else if (sprite instanceof Player && sprite !== this && sprite.Overlaps(this)) {
                // bumping in to a DOOPLICATE
                this.OnPlayerDead(false).dooplicateDeath = true;
                (sprite as Player).OnPlayerDead(false).dooplicateDeath = true;
            } else {
                if (landingOnTop && sprite.canBeBouncedOn) {
                    this.Bounce();
                    sprite.OnBounce();
                }
            }
        }
    }

    ReactToSpikes(): void {
        let isHurt = false;
        let isDead = false;
        if (this.y > this.layer.GetMaxY() + 5) {
            this.dy -= 3;
            this.OnPlayerDead(true);
            return;
        }

        if (this.standingOn.length > 0 && this.standingOn.every(a => a.tileType.hurtOnTop)) {
            isHurt = true;
            if (this.standingOn.every(a => a.tileType.instaKill)) isDead = true;
        }
        if (this.touchedLeftWalls.length > 0 && this.touchedLeftWalls.every(a => a instanceof LevelTile && a.tileType.hurtOnRight)) {
            isHurt = true;
            if (this.touchedLeftWalls.every(a => a instanceof LevelTile && a.tileType.instaKill)) isDead = true;
        }
        if (this.touchedRightWalls.length > 0 && this.touchedRightWalls.every(a => a instanceof LevelTile && a.tileType.hurtOnLeft)) {
            isHurt = true;
            if (this.touchedRightWalls.every(a => a instanceof LevelTile && a.tileType.instaKill)) isDead = true;
        }
        if (this.touchedCeilings.length > 0 && this.touchedCeilings.every(a => a.tileType.hurtOnBottom)) {
            isHurt = true;
            if (this.touchedCeilings.every(a => a.tileType.instaKill)) isDead = true;
        }
        if (isDead) {
            this.dy -= 3;
            this.OnPlayerDead(true);
            return;
        }
        if (!isHurt) {
            let tiles: LevelTile[] = [];
            [this.x, this.xRight].forEach(x => {
                [this.y, this.yBottom].forEach(y => {
                    tiles.push(this.layer.GetTileByPixel(x, y));
                })
            });
            tiles = tiles.filter(Utility.OnlyUnique);
            if (tiles.some(a => a.tileType.hurtOnOverlap)) isHurt = true;
            else if (tiles.some(a => a.GetWireNeighbor()?.tileType.hurtOnOverlap)) isHurt = true;
            else if (tiles.some(a => a.GetWaterNeighbor()?.tileType.hurtOnOverlap)) isHurt = true;
        }
        if (isHurt) {
            this.OnPlayerHurt();
        }
    }

    OnPlayerHurt(): void {
        if (this.heldItem && this.heldItem instanceof GoldHeart) return;
        if (this.iFrames == 0) {
            let nextHeart = this.layer.sprites.find(a => a instanceof ExtraHitHeartSmall && a.parent == this);
            if (nextHeart) {
                this.iFrames += 130;
                audioHandler.PlaySound("hurt", true);
                // hurt heart animation
                let childHeart = <ExtraHitHeartSmall>this.layer.sprites.find(a => a instanceof ExtraHitHeartSmall && a.parent == nextHeart);
                if (childHeart) childHeart.parent = this;
                nextHeart.isActive = false;
                nextHeart.ReplaceWithSpriteType(ExtraHitHeartSmallLoss);
            } else {
                this.OnPlayerDead(true);
            }
        }
    }

    OnPlayerDead(canRespawn: boolean): DeadPlayer {
        if (!this.isActive) {
            return <DeadPlayer>(this.layer.sprites.find(a => a instanceof DeadPlayer));
        }

        this.OnDead();
        this.isActive = false;
        audioHandler.PlaySound("dead", true);
        if (this.isDuplicate) {
            let deadPlayer = new DeadPlayer(this, -1, false);
            this.layer.sprites.push(deadPlayer);
            deadPlayer.isDuplicate = true;
            return deadPlayer;
        } else {
            // log player death
            let newDeathCount = StorageService.IncrementDeathCounter(currentLevelListing?.level.code || "");
            let deadPlayer = new DeadPlayer(this, newDeathCount, canRespawn);
            this.layer.sprites.push(deadPlayer);
            editorHandler.bankedCheckpointTime += this.age;
            if (levelGenerator) levelGenerator.bankedClearTime += this.age;
            camera.autoscrollX = 0;
            camera.autoscrollY = 0;
            return deadPlayer;
        }
    }

    IsOnIce(): boolean {
        return this.standingOn.length > 0 && this.standingOn.some(a => a.tileType.isSlippery);
    }

    PlayerInertia(): void {
        if (this.isSliding) return;
        if (this.isOnGround) {
            if (this.targetDirection == 0) {
                if (this.IsOnIce()) {
                    this.dx *= 0.99;
                } else {
                    this.dx *= 0.90;
                }
                if (Math.abs(this.dx) < 0.1) this.dx = 0;
            }
        } else if (this.isInWater) {
            if (Math.abs(this.dx) > 0.8) this.dx *= 0.9;
        }
        if (!this.parentSprite) {
            if (this.dyFromPlatform > 0) {
                this.dyFromPlatform = 0;
            } else {
                this.dyFromPlatform *= 0.90;
                if (Math.abs(this.dyFromPlatform) < 0.015) this.dyFromPlatform = 0;
            }
            if (Math.abs(this.dxFromPlatform) > 0) {
                if ((this.targetDirection == -1 && this.dxFromPlatform > 0)
                    || (this.targetDirection == 1 && this.dxFromPlatform < 0)) {
                    this.dxFromPlatform *= 0.9;
                }
            }
            if (this.isOnGround) {
                this.dxFromPlatform *= 0.90;
            }
            if (Math.abs(this.dxFromPlatform) < 0.02) this.dxFromPlatform = 0;
        }
    }

    PlayerItem(): void {
        this.throwTimer++;
        let startedHolding = false;
        let isInCannon = this.layer.sprites.some(a => a instanceof RedCannon && a.heldPlayer == this);
        if (!this.heldItem
            && KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)
            && !this.isClimbing
            && !this.isHanging
            && !isInCannon
            && this.throwTimer > 20) {
            // try to grab item?

            for (let sprite of this.layer.sprites.filter(a => a.canBeHeld)) {
                if (sprite.age < 10) continue; // can't grab items that just spawned (prevent grabbing shell after shell jump)

                if (this.IsGoingToOverlapSprite(sprite)) {
                    this.heldItem = sprite;
                    startedHolding = true;

                    audioHandler.PlaySound("pick-up", true);
                    break;
                }
            }

            if (this.heldItem == null) {
                // check for items we can hang from
                let myX = this.x + this.GetTotalDx();
                let myY = this.y + this.GetTotalDy();
                for (let sprite of this.layer.sprites.filter(a => a.canHangFrom && (a.framesSinceThrown > 30 || a.framesSinceThrown == -1))) {
                    // special overlap logic for y coords:
                    let spriteX = sprite.x + sprite.GetTotalDx();
                    let spriteYBottom = sprite.yBottom + sprite.GetTotalDy();
                    let isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
                    let isYOverlap = Math.abs(spriteYBottom - myY) < 2.5;
                    if (isXOverlap && isYOverlap) {
                        this.heldItem = sprite;
                        startedHolding = true;
                        audioHandler.PlaySound("pick-up", true);
                        break;
                    }
                }
            }

            if (!this.heldItem) {
                // no sprite to grab, maybe a tile to grab?

                let grabbableFloor = this.standingOn.find(a => a.tileType.pickUpSprite);
                if (grabbableFloor) {
                    let spriteType = <SpriteType>grabbableFloor.tileType.pickUpSprite;
                    this.heldItem = new spriteType(this.x, this.y, this.layer, []);
                    this.layer.sprites.push(this.heldItem);
                    startedHolding = true;
                    audioHandler.PlaySound("pick-up", true);
                    this.layer.SetTile(grabbableFloor.tileX, grabbableFloor.tileY, TileType.Air);
                }

            }

        }
        if (isInCannon) this.heldItem = null;
        if (this.heldItem) {
            if (this.parentSprite == this.heldItem) {
                this.parentSprite = null;
            }
            this.heldItem.parentSprite = null;
            if (!this.heldItem.updatedThisFrame) {
                this.heldItem.updatedThisFrame = true;
                // move rocket above head before first update
                if (this.heldItem instanceof Rocket && !this.heldItem.isRocketing) this.UpdateHeldItemLocation();

                this.heldItem.updatedThisFrame = true;
                this.heldItem.SharedUpdate();
                this.heldItem.Update();
                if (this.heldItem instanceof Enemy) {
                    this.heldItem.EnemyUpdate();
                }
            }
            if (this.heldItem && this.heldItem.canBeHeld) {
                this.UpdateHeldItemLocation();

                if (!startedHolding && !KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                        this.heldItem.OnUpThrow(this, this.direction);
                    } else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                        this.heldItem.OnDownThrow(this, this.direction);
                    } else {
                        this.heldItem.OnThrow(this, this.direction);
                    }
                    this.heldItem.GentlyEjectFromSolids();

                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                    this.throwTimer = 0;
                    audioHandler.PlaySound("throw", true);
                    this.isSpinJumping = false;

                }
            } else if (this.heldItem && this.heldItem.canHangFrom) {
                if (this.isOnCeiling) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                } else if (this.isOnGround) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                } else {
                    this.x = this.heldItem.xMid - this.width / 2;
                    this.y = this.heldItem.yBottom;
                    this.dx = this.heldItem.dx;
                    this.dy = this.heldItem.dy;
                    this.dxFromPlatform = 0;
                    this.dyFromPlatform = 0;
                    this.GentlyEjectFromSolids();

                    if (!KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                        this.heldItem.framesSinceThrown = 1;
                        this.heldItem = null;
                    }

                    if (this.heldItem) {
                        let xDistanceFromTarget = Math.abs(this.heldItem.xMid - this.width / 2 - this.x);
                        let yDistanceFromTarget = Math.abs(this.heldItem.yBottom - this.y);
                        if (xDistanceFromTarget > 2 || yDistanceFromTarget > 2) {
                            this.heldItem.framesSinceThrown = 1;
                            this.heldItem = null;


                        }
                    }
                }
            }

            if (!this.heldItem?.isActive) this.heldItem = null;
        }

    }

    UpdateHeldItemLocation(): void {
        if (this.heldItem && this.heldItem.canBeHeld) {
            this.heldItem.x = this.x + this.width / 2 - this.heldItem.width / 2;
            this.heldItem.y = this.y - this.heldItem.height;
            this.heldItem.dx = 0;
            this.heldItem.dy = 0;
            this.heldItem.dxFromPlatform = 0;
            this.heldItem.dyFromPlatform = 0;
        }
    }

    HandleDoors(): void {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && this.isOnGround) {
            // find overlap door
            let door = <Door>this.layer.sprites.find(a => a instanceof Door &&
                a.IsGoingToOverlapSprite(this) &&
                Math.abs(a.yBottom - this.yBottom) < 2
            );
            if (door) {
                let doorExit = door.GetPairedDoor();
                if (doorExit) {
                    this.parentSprite = null;
                    this.layer.map?.StartDoorTransition(this, door, doorExit);
                }
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let sourceImage = "dobbs";
        let sourceImageOffset = this.sourceImageOffset;
        if (this.iFrames > 64) {
            if (Math.floor(this.iFrames / 8) % 2 == 0) sourceImage = "dobbsGhost";
        } else if (this.iFrames > 0) {
            if (Math.floor(this.iFrames / 4) % 2 == 0) sourceImage = "dobbsGhost";
        }

        if (this.heldItem && this.heldItem instanceof GoldHeart) {
            if (Math.floor(this.age / 8) % 2 == 0) sourceImage = "dobbsGhost";
        }


        let isInCannon = this.layer.sprites.some(a => a instanceof RedCannon && a.heldPlayer == this);
        if (isInCannon) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }

        let xFlip = this.direction == -1;
        let actualFrame = Math.floor(this.frameNum) % 2;

        let row = this.heldItem ? 1 : 0;
        let tile = tiles[sourceImage][0 + sourceImageOffset][row];
        if (this.dx != 0) {
            tile = tiles[sourceImage][1 + actualFrame + sourceImageOffset][row]
        }
        if (!this.isOnGround) {
            if (this.isInWater && this.heldItem == null) {
                if (this.swimTimer <= 2) tile = tiles[sourceImage][2 + sourceImageOffset][3];
                else if (this.swimTimer < 12) tile = tiles[sourceImage][1 + sourceImageOffset][3];
                else tile = tiles[sourceImage][2 + sourceImageOffset][3];
            } else {
                tile = tiles[sourceImage][3 + sourceImageOffset][row];

                if (this.isSpinJumping) {
                    let spinTiles = [
                        tiles[sourceImage][3 + sourceImageOffset][row],
                        tiles[sourceImage][0 + sourceImageOffset][3],
                        tiles[sourceImage][3 + sourceImageOffset][row],
                        tiles[sourceImage][1 + sourceImageOffset][4],
                    ];
                    tile = spinTiles[Math.floor(frameNum / 4) % 4];
                    if (Math.floor(frameNum / 4) % 4 == 2) xFlip = !xFlip;
                }
            }
        }

        if (this.isOnGround && this.targetDirection == 0 && !this.heldItem) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                tile = tiles[sourceImage][2 + sourceImageOffset][2];
            } else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                tile = tiles[sourceImage][3 + sourceImageOffset][2];
            }
        }

        if (this.isClimbing) {
            tile = tiles[sourceImage][0 + sourceImageOffset][3];
            xFlip = actualFrame % 2 == 0;
        }

        if (this.isHanging) {
            tile = tiles[sourceImage][3 + sourceImageOffset][actualFrame % 2 ? 1 : 3];
        }

        if (this.isSliding) {
            tile = tiles[sourceImage][3 + sourceImageOffset][row];
        }

        if (this.isTouchingStickyWall || this.wallDragDirection != 0) {
            tile = tiles[sourceImage][0 + sourceImageOffset][4];
        }

        return {
            imageTile: tile,
            xFlip: xFlip,
            yFlip: false,
            xOffset: 1,
            yOffset: this.isFloating ? Math.sin(this.floatFramesLeftForThisJump / 20) / 2 : 0
        };
    }

    OnAfterDraw(camera: Camera): void {
        let ctx = camera.ctx;
        if (this.currentBreath < this.maxBreath) {
            let x = (this.x - camera.x - 3) * camera.scale + camera.canvas.width / 2;
            let y = (this.y - camera.y) * camera.scale + camera.canvas.height / 2;
            let fillRatio = this.currentBreath / this.maxBreath;
            ctx.fillStyle = "#48F";
            ctx.strokeStyle = "#DDD";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 6, -Math.PI / 2, 2 * Math.PI * fillRatio - Math.PI / 2, false);
            ctx.fill();
            ctx.stroke();

        }
    }
}

class DeadPlayer extends Sprite {
    height = 9;
    width = 9;
    respectsSolidTiles = false;
    imageOffset = 0;
    dooplicateDeath = false;

    constructor(player: Player, private deathCount: number, public canRespawn: boolean) {
        super(player.x, player.y, player.layer, []);

        if (player instanceof HoverPlayer) this.imageOffset = 1;

        this.dx = player.dx;
        this.dy = Math.max(0, player.dy) - 1;
    }

    Update(): void {
        let accel = 0.04;
        let maxSpeed = 2;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) this.dx -= accel;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) this.dx += accel;
        if (this.dx > maxSpeed) this.dx = maxSpeed;
        if (this.dx < -maxSpeed) this.dx = -maxSpeed;
        this.ApplyGravity();
        this.MoveByVelocity();
        if (this.isDuplicate && this.age > 60) {
            this.ReplaceWithSpriteType(Poof);
        }
        if (!this.isDuplicate) {
            if (this.age > 45) {
                currentMap.fadeOutRatio = (this.age - 45) / 14;
            }
            if (this.age > 60) {
                if (levelGenerator) {
                    this.isActive = false;
                    levelGenerator.OnLose();
                } else {
                    editorHandler.SwitchToEditMode(true);
                    editorHandler.SwitchToPlayMode();
                    if (camera.target) {
                        camera.x = camera.target.xMid;
                        camera.y = camera.target.yMid;
                    }
                    camera.targetX = camera.x;
                    camera.targetY = camera.y;
                }
            }

            let overlappingWings = this.layer.sprites.filter(a => a instanceof ReviveWings && this.Overlaps(a));
            if (this.age <= 60 && overlappingWings.length > 0 && this.canRespawn) {
                audioHandler.PlaySound("respawn", true);
                let newPlayer = this.ReplaceWithSpriteType(this.imageOffset == 1 ? HoverPlayer : Player);
                let wings = overlappingWings[0];
                wings.isActive = false;
                newPlayer.x = wings.xMid - newPlayer.width / 2;
                newPlayer.y = wings.yMid - newPlayer.height / 2;
                newPlayer.dx = 0;
                newPlayer.dy = 0;
                camera.target = newPlayer;
                camera.targetX = newPlayer.xMid;
                camera.targetY = newPlayer.yBottom - 12;
                camera.AdjustCameraTargetForMapBounds();
                camera.transitionTimer = 30;
                currentMap.fadeOutRatio = 0;
            }
        }

    }
    GetFrameData(frameNum: number): FrameData | FrameData[] {
        let tileCol = Math.floor(frameNum / 5) % 4

        return {
            imageTile: tiles["dead"][tileCol][this.imageOffset],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    }

    OnAfterDraw(camera: Camera): void {
        if (this.deathCount == -1) return;
        let ctx = camera.ctx;
        let fontsize = 16;

        ctx.fillStyle = "#0008";
        ctx.fillRect(camera.canvas.width - 90, 0, 90, 20 + fontsize);

        let imageTile = <ImageTile>tiles["dead"][0][0];
        imageTile.DrawToScreen(ctx, camera.canvas.width - 70, 10, 2);

        ctx.textAlign = "right";
        ctx.font = `${fontsize}px grobold`;
        ctx.strokeStyle = "black"
        ctx.fillStyle = "white"
        ctx.lineWidth = 4;
        ctx.strokeText(this.deathCount.toString(), camera.canvas.width - 10, 10 + fontsize);
        ctx.fillText(this.deathCount.toString(), camera.canvas.width - 10, 10 + fontsize);
    }
}

class HoverPlayer extends Player {
    protected canPlayerFloatJump = true;
    protected sourceImageOffset = 4;
    protected moveSpeed = 1;
}