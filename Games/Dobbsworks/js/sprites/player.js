"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 5;
        _this.direction = 1;
        _this.jumpBufferTimer = -1; // how long since initial jump tap
        _this.coyoteTimer = 999; // how long since not on ground // start this value above threshold so that player cannot immediately jump if starting in air, must hit ground first
        _this.frameNum = 0;
        _this.jumpTimer = -1; // how long have we been ascending for current jump
        _this.throwTimer = 999; // how long since throwing something
        _this.swimTimer = -1; // how long since last swim
        _this.isClimbing = false;
        _this.isHanging = false;
        _this.isSliding = false;
        _this.justLanded = false;
        _this.slideDirection = 1;
        _this.currentSlope = 0;
        _this.climbCooldownTimer = -1; // how long since climbing (to avoid regrabbing ladder while climbing up)
        _this.respectsSolidTiles = true;
        _this.dxFromBumper = 0;
        _this.dyFromBumper = 0;
        _this.bumperTimer = 0;
        _this.isSpinJumping = false;
        _this.isTouchingStickyWall = false;
        _this.wallClingDirection = -1;
        _this.wallDragDirection = 0;
        _this.canMotorHold = false;
        _this.twinkleCount = 0;
        _this.twinleTimer = 0;
        _this.maxBreath = 600;
        _this.currentBreath = 600;
        _this.breathTimer = 0; // current breath only recovers after breath timer runs out
        _this.iFrames = 0;
        _this.replayHandler = new ReplayHandler();
        _this.neutralTimer = 0;
        _this.forcedJumpTimer = 0;
        _this.isRequired = true;
        _this.maxAllowed = 1;
        _this.heldItem = null;
        _this.yoyoTarget = null;
        _this.yoyoTimer = 0;
        _this.targetDirection = 0;
        _this.props = ["x", "y", "dx", "dy", "isOnGround"];
        _this.history = [];
        _this.zIndex = 1;
        _this.moveSpeed = 1.2;
        _this.floatFramesLeftForThisJump = 0;
        _this.isFloating = false;
        _this.maxFloatDuration = 100;
        _this.canPlayerFloatJump = false;
        _this.sourceImageOffset = 0;
        return _this;
    }
    Player.prototype.LogProps = function () {
        var obj = {};
        for (var _i = 0, _a = this.props; _i < _a.length; _i++) {
            var propName = _a[_i];
            obj[propName] = this[propName];
        }
        this.history.push(obj);
    };
    Player.prototype.LoadHistory = function () {
        var history = this.history.pop();
        for (var _i = 0, _a = this.props; _i < _a.length; _i++) {
            var propName = _a[_i];
            this[propName] = history[propName];
        }
    };
    Player.prototype.Update = function () {
        var oldX = this.x;
        var oldY = this.y;
        this.LogProps();
        //this.x += 0.1;
        //this.HandleBumpers();
        if (this.iFrames > 0)
            this.iFrames--;
        this.PlayerMovement(); // includes gravity
        this.PlayerItem();
        this.HandleEnemies(); // includes gravity
        this.PlayerInertia();
        this.PushByAutoscroll();
        var wasOnGround = this.isOnGround;
        this.ReactToPlatformsAndSolids();
        this.justLanded = !wasOnGround && this.isOnGround;
        this.SlideDownSlopes();
        if (!this.yoyoTarget || !this.yoyoTarget.isActive)
            this.MoveByVelocity();
        this.UpdateHeldItemLocation();
        this.ReactToSpikes();
        this.KeepInBounds();
        //console.log(this.x - oldX, this.y - oldY)
        this.frameNum += Math.max(Math.abs(this.dx / 4), Math.abs(this.dy / 4));
        // if (Math.abs(this.dx) > 1) {
        //     //debugMode = true;
        //     this.dx *= 0.5;
        // }
        if (!this.yoyoTarget)
            this.HandleDoors();
        if (KeyboardHandler.IsKeyPressed(KeyAction.Reset, true) && this.age > 1 && !levelGenerator)
            this.OnPlayerDead(false);
        this.replayHandler.StoreFrame();
        if (this.twinkleCount > 0) {
            if (this.twinleTimer <= 0) {
                this.twinkleCount--;
                this.twinleTimer = 4;
                var twinkle = new Twinkle(this.x + Math.random() * this.width - 5, this.yBottom - Math.random() * 5, this.layer, []);
                this.layer.sprites.push(twinkle);
            }
            else {
                this.twinleTimer--;
            }
        }
    };
    Player.prototype.PlayerMovement = function () {
        var _this = this;
        var _a, _b, _c, _d, _e;
        if (this.yoyoTimer > 0) {
            this.yoyoTimer--;
            return;
        }
        if (this.neutralTimer > 0)
            this.neutralTimer--;
        if (this.forcedJumpTimer > 0)
            this.forcedJumpTimer--;
        if (this.GetTotalDy() > 0) {
            if (this.touchedRightWalls.some(function (a) { return a instanceof LevelTile && a.tileType.isJumpWall; }) && KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
                this.wallDragDirection = 1;
                this.direction = 1;
            }
            if (this.touchedLeftWalls.some(function (a) { return a instanceof LevelTile && a.tileType.isJumpWall; }) && KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
                this.wallDragDirection = -1;
                this.direction = -1;
            }
        }
        if (this.touchedRightWalls.some(function (a) { return a instanceof LevelTile && a.tileType.isStickyWall; })) {
            this.isTouchingStickyWall = true;
            this.wallClingDirection = 1;
            this.direction = 1;
        }
        if (this.touchedLeftWalls.some(function (a) { return a instanceof LevelTile && a.tileType.isStickyWall; })) {
            this.isTouchingStickyWall = true;
            this.wallClingDirection = -1;
            this.direction = -1;
        }
        var wasInWater = this.isInWater;
        var waterLayerAtMid = ((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.waterLayer.GetTileByPixel(this.xMid, this.yMid).tileType) || TileType.Air;
        var waterTileAtFoot = ((_b = this.layer.map) === null || _b === void 0 ? void 0 : _b.waterLayer.GetTileByPixel(this.xMid, this.yBottom - 0.1).tileType) || TileType.Air;
        this.isInWater = waterLayerAtMid.isSwimmable || waterTileAtFoot.isSwimmable || currentMap.playerWaterMode;
        this.isInWaterfall = waterLayerAtMid.isWaterfall;
        var isLosingBreath = (waterLayerAtMid.drainsAir || waterTileAtFoot.drainsAir);
        this.swimTimer++;
        // global water
        var map = this.layer.map;
        var globalWaterHeight = -1;
        if (map) {
            if (map.waterLevel.currentY !== -1) {
                if (this.yBottom + this.floatingPointOffset > map.waterLevel.currentY)
                    this.isInWater = true;
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
            if ((waterTileAtFoot === null || waterTileAtFoot === void 0 ? void 0 : waterTileAtFoot.isSwimmable) || (globalWaterHeight !== -1 && globalWaterHeight < this.yBottom)) {
                this.dy = 0;
            }
            else {
                this.dy *= 0.5;
            }
        }
        this.HandleBreath(isLosingBreath);
        this.isInQuicksand = ((_c = this.layer.map) === null || _c === void 0 ? void 0 : _c.waterLayer.GetTileByPixel(this.xMid, this.yBottom - 0.1).tileType.isQuicksand) || false;
        if (this.isOnGround || this.isClimbing || ((this.isInWater || this.isInQuicksand) && this.heldItem == null) || this.isTouchingStickyWall || ((_d = this.heldItem) === null || _d === void 0 ? void 0 : _d.canHangFrom)) {
            if (this.age > 1)
                this.coyoteTimer = 0;
            this.isSpinJumping = false;
            this.floatFramesLeftForThisJump = 0;
        }
        this.coyoteTimer++;
        var isJumpHeld = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false);
        if (this.jumpTimer > -1) {
            if (this.windDy > 0)
                this.jumpTimer += this.windDy;
            if (isJumpHeld || this.forcedJumpTimer > 0)
                this.jumpTimer++;
            if (!isJumpHeld && this.forcedJumpTimer <= 0) {
                this.jumpTimer = -1;
                if (this.dy < -1)
                    this.dy = -1;
            }
            // below controls how many frames of upward velocity we get
            var numJumpFrames = 18;
            if (this.jumpTimer > numJumpFrames)
                this.jumpTimer = -1;
            // jumptimer 14
        }
        if (this.isFloating) {
            if (isJumpHeld) {
                this.dy = 0;
                this.floatFramesLeftForThisJump--;
                if (this.floatFramesLeftForThisJump <= 0)
                    this.isFloating = false;
            }
            else {
                this.isFloating = false;
                this.floatFramesLeftForThisJump = 0;
            }
        }
        else {
            if (this.jumpTimer == -1 && !this.isClimbing) {
                this.ApplyGravity();
                if (isJumpHeld && this.dy > 0)
                    this.dy *= 0.97;
                // can call this twice for "heavy" movement
                //this.ApplyGravity();
            }
        }
        if (this.dy > this.maxDY)
            this.dy = this.maxDY;
        if (this.dy > this.maxDY / 2.5 && this.wallDragDirection != 0)
            this.dy = this.maxDY / 2.5;
        var isJumpInitialPressed = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) /*&& this.forcedJumpTimer <= 0*/;
        if (this.jumpBufferTimer >= 0)
            this.jumpBufferTimer++;
        if (isJumpInitialPressed)
            this.jumpBufferTimer = 0;
        if (this.jumpBufferTimer > 3)
            this.jumpBufferTimer = -1;
        var spinJumper = this.layer.sprites.find(function (a) { return a instanceof SpinRing && a.Overlaps(_this) && a.allowsSpinJump; });
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
            }
            else {
                this.isSpinJumping = false;
                this.Jump();
            }
            this.isSliding = false;
        }
        if ((this.isInWater && (!waterLayerAtMid.isSwimmable && globalWaterHeight > this.yMid) && !currentMap.playerWaterMode)) {
            // break through water surface
            if (isJumpHeld && this.dy < 0)
                this.dy = -1.3;
            else if (this.dy < 0)
                this.dy = 0;
        }
        var upPressed = KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && !(this.neutralTimer > 0);
        var downPressed = KeyboardHandler.IsKeyPressed(KeyAction.Down, false) && !(this.neutralTimer > 0);
        var leftPressed = KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && !(this.neutralTimer > 0);
        var rightPressed = KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && !(this.neutralTimer > 0);
        if (leftPressed && this.dx > 0)
            this.isSliding = false;
        if (rightPressed && this.dx < 0)
            this.isSliding = false;
        if (upPressed)
            this.isSliding = false;
        this.climbCooldownTimer++;
        var tileAtMid = this.layer.GetTileByPixel(this.xMid, this.yMid);
        var tileAtFoot = this.layer.GetTileByPixel(this.xMid, this.yBottom - 0.25);
        var isAtLadderTop = (tileAtFoot.tileType.isClimbable && ((_e = tileAtFoot.GetSemisolidNeighbor()) === null || _e === void 0 ? void 0 : _e.tileType.solidity) == Solidity.Top);
        var isTouchingLadder = tileAtMid.tileType.isClimbable || isAtLadderTop;
        if (upPressed && isTouchingLadder && this.climbCooldownTimer > 20 && this.heldItem == null) {
            this.isClimbing = true;
            this.isSliding = false;
        }
        var wasClimbing = this.isClimbing;
        if (!isTouchingLadder) {
            this.isClimbing = false;
        }
        // climb down through ladder
        if (downPressed && this.heldItem == null) {
            var standingOnPassThroughs = this.standingOn.every(function (a) { return a.tileType.solidity == Solidity.Top || a.tileType.solidity == Solidity.None; });
            var centerStandingOnClimbable = this.layer.GetTileByPixel(this.xMid, this.yBottom + 1).tileType.isClimbable;
            if (standingOnPassThroughs && centerStandingOnClimbable) {
                this.y += 0.1;
                this.isClimbing = true;
                this.isOnGround = false;
                this.isSliding = false;
            }
        }
        this.isHanging = false;
        if (this.touchedCeilings.some(function (a) { return a.tileType.isHangable; })) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, false) && this.heldItem == null) {
                this.isHanging = true;
                this.dxFromPlatform = 0;
                this.isSliding = false;
                this.dy = 0;
                if (!leftPressed && this.dx < 0)
                    this.dx *= 0.8;
                if (!rightPressed && this.dx > 0)
                    this.dx *= 0.8;
                var conveyorSpeeds = this.touchedCeilings.map(function (a) { return a.tileType.conveyorSpeed; }).filter(function (a) { return a !== 0; });
                if (conveyorSpeeds.length)
                    this.dxFromPlatform = -Math.max.apply(Math, conveyorSpeeds);
            }
        }
        if (this.isTouchingStickyWall) {
            this.dx = 0;
            this.dy = 0;
            this.dxFromWind = 0;
            this.dyFromWind = 0;
            this.dxFromPlatform = 0;
            this.dyFromPlatform = 0;
            this.isSliding = false;
        }
        else if (this.wallDragDirection != 0) {
            if (this.isOnGround) {
                this.wallDragDirection = 0;
            }
            else if (this.wallDragDirection == -1 && KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
                this.wallDragDirection = 0;
            }
            else if (this.wallDragDirection == 1 && KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
                this.wallDragDirection = 0;
            }
            else {
                if (!this.IsNeighboringWallJumpTiles())
                    this.wallDragDirection = 0;
            }
        }
        else if (!this.isSliding) {
            if (this.isClimbing) {
                this.dxFromPlatform = 0;
                this.parentSprite = null;
                var canClimbUp = this.layer.GetTileByPixel(this.xMid, this.yMid - 0.5).tileType.isClimbable;
                if (!canClimbUp && isAtLadderTop)
                    canClimbUp = true;
                this.dy = 0;
                this.dx = 0;
                if (upPressed && !downPressed && canClimbUp)
                    this.dy = -0.5;
                if (!upPressed && downPressed)
                    this.dy = 0.5;
                if (leftPressed && !rightPressed)
                    this.dx = -0.5;
                if (!leftPressed && rightPressed)
                    this.dx = 0.5;
                if (this.isOnGround)
                    this.isClimbing = false;
            }
            else {
                var downPressedWhileOnGround = KeyboardHandler.IsKeyPressed(KeyAction.Down, false) && this.isOnGround;
                this.targetDirection = 0;
                if (leftPressed && !rightPressed) {
                    if (!downPressedWhileOnGround)
                        this.targetDirection = -1;
                    this.direction = -1;
                }
                else if (!leftPressed && rightPressed) {
                    if (!downPressedWhileOnGround)
                        this.targetDirection = 1;
                    this.direction = 1;
                }
                if (this.targetDirection) {
                    var maxSpeed = this.moveSpeed;
                    if (this.currentSlope !== 0 && (this.currentSlope * this.targetDirection) < 0) {
                        // running up a slope
                        var absSlope = Math.abs(this.currentSlope);
                        var speedRatio = absSlope >= 2 ? 0.5 : (absSlope >= 1 ? 0.8 : 0.9);
                        maxSpeed *= speedRatio;
                    }
                    // ORIGINAL: 1.0
                    var accel = this.isOnGround ? 0.06 : 0.035;
                    if (this.IsOnIce())
                        accel = 0.025;
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
                    var shouldCapSpeed = (leftPressed || rightPressed) && this.dxFromWind == 0;
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
        if (this.standingOn.some(function (a) { return !a.tileType.canWalkOn; })) {
            this.dx = 0;
            this.dxFromWind = 0;
        }
        if (this.dy > 0 && isJumpHeld && this.canPlayerFloatJump && !this.isFloating && this.floatFramesLeftForThisJump > 0) {
            var isInCannon = this.layer.sprites.some(function (a) { return a instanceof RedCannon && a.heldPlayer == _this; });
            var tappedJumpThisFrame = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true);
            if (!isInCannon && (this.forcedJumpTimer <= 0 || tappedJumpThisFrame)) {
                this.isFloating = true;
            }
        }
        if (this.isOnGround || this.isClimbing || wasClimbing || this.isInWater || this.isInQuicksand) {
            this.RefreshFloatTimer();
        }
    };
    Player.prototype.RefreshFloatTimer = function () {
        this.floatFramesLeftForThisJump = this.maxFloatDuration;
    };
    Player.prototype.SlideDownSlopes = function () {
        this.currentSlope = 0;
        var slopeDown = 0;
        if (this.standingOn.length) {
            if (this.standingOn.every(function (a) { return a.tileType.solidity instanceof SlopeSolidity; })) {
                var slopes = (this.standingOn.map(function (a) { return a.tileType.solidity; }));
                this.slideDirection = slopes[0].horizontalSolidDirection == 1 ? -1 : 1;
                slopeDown = Math.max.apply(Math, slopes.map(function (a) { return a.absoluteSlope; }));
                this.currentSlope = Math.max.apply(Math, slopes.map(function (a) { return a.absoluteSlope * -a.horizontalSolidDirection * a.verticalSolidDirection; }));
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
                if (Math.abs(this.dx) < 0.2)
                    this.isSliding = false;
            }
            else {
                if (Math.abs(this.dx) < 2) {
                    this.dx += this.slideDirection * 0.05 * slopeDown;
                    this.dy += 0.05 * slopeDown;
                }
            }
        }
    };
    Player.prototype.Jump = function () {
        var _a;
        // very similar to Bounce()
        // if (this.jumpBufferTimer > 0) console.log("BUFFER JUMP", this.jumpBufferTimer);
        // if (this.coyoteTimer > 0) console.log("COYOTE TIME", this.coyoteTimer);
        this.jumpBufferTimer = -1;
        this.coyoteTimer = 999999;
        this.dy = (Math.abs(this.dx) > 0.3 || this.isSpinJumping) ? -1.5 : -1.2;
        var isOnSlime = this.standingOn.some(function (a) { return !a.tileType.canJumpFrom; });
        if (this.parentSprite instanceof Splatform) {
            isOnSlime = true;
            if (this.standingOn.every(function (a) { return !a.tileType.canJumpFrom; })) {
                // ONLY standing on slime tiles
                this.parentSprite.PlayerAttemptJump();
            }
        }
        if (this.isInWater) {
            this.swimTimer = 0;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
                this.dy = -0.2;
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false))
                this.dy = -0.8;
            else
                this.dy = -0.5;
            audioHandler.PlaySound("swim", true);
        }
        else {
            if (isOnSlime) {
                audioHandler.PlaySound("stuck-jump", true);
            }
            else {
                audioHandler.PlaySound("jump", true);
            }
        }
        if ((_a = this.heldItem) === null || _a === void 0 ? void 0 : _a.canHangFrom) {
            this.heldItem.framesSinceThrown = 1;
            this.heldItem = null;
            this.dy = -1.5;
        }
        this.jumpTimer = 0;
        this.isClimbing = false;
        this.climbCooldownTimer = 0;
        if (!isOnSlime)
            this.parentSprite = null;
        var jumpWallLeft = this.IsNeighboringWallJumpTilesSide(-1);
        var jumpWallRight = this.IsNeighboringWallJumpTilesSide(1);
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
    };
    Player.prototype.Bounce = function () {
        // very similar to Jump()
        this.jumpBufferTimer = -1;
        this.coyoteTimer = 999999;
        this.dy = -1.5;
        this.jumpTimer = 0;
        this.isClimbing = false;
        this.parentSprite = null;
        this.RefreshFloatTimer();
    };
    Player.prototype.HandleBreath = function (isLosingBreath) {
        if (isLosingBreath) {
            this.breathTimer = 120;
            this.currentBreath -= 1;
            if (this.currentBreath <= 0)
                this.OnPlayerDead(true);
        }
        else {
            if (this.breathTimer > 0)
                this.breathTimer -= 1;
            if (this.breathTimer <= 0 && this.currentBreath < this.maxBreath)
                this.currentBreath += 4;
        }
    };
    Player.prototype.IsNeighboringWallJumpTiles = function () {
        return this.IsNeighboringWallJumpTilesSide(-1) || this.IsNeighboringWallJumpTilesSide(1);
    };
    Player.prototype.IsNeighboringWallJumpTilesSide = function (direction) {
        if (this.direction == -1) {
            if (this.x % this.layer.tileWidth > 0.1)
                return false;
        }
        if (this.direction == 1) {
            var xInTile = (this.x + this.width) % this.layer.tileWidth;
            if (xInTile < 11.9 && xInTile !== 0)
                return false;
        }
        var x = direction == 1 ? this.xRight + 0.1 : this.x - 0.1;
        return !this.isOnGround && ([
            this.layer.GetTileByPixel(x, this.y).GetSemisolidNeighbor(),
            this.layer.GetTileByPixel(x, this.yBottom).GetSemisolidNeighbor(),
        ].some(function (a) { return ((a === null || a === void 0 ? void 0 : a.tileType) == TileType.WallJumpLeft && direction == -1) || ((a === null || a === void 0 ? void 0 : a.tileType) == TileType.WallJumpRight && direction == 1); }));
    };
    Player.prototype.HandleBumpers = function () {
        // maybe todo:
        // check all 4 corners, then for each bumper in that list see if center to center dist < 8.5 (p.wid/2 + tile.wid/2)
        // if couble bump, cancel conflicts
        var tileAtMid = this.layer.GetTileByPixel(this.xMid, this.yMid);
        if (tileAtMid.tileType.isBumper) {
            var bumperAngle = Math.atan2(this.yMid - (tileAtMid.tileY + 0.5) * this.layer.tileHeight, this.xMid - (tileAtMid.tileX + 0.5) * this.layer.tileWidth);
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
        }
        else {
            this.bumperTimer--;
        }
        if (this.bumperTimer > 0) {
            this.dx = this.dxFromBumper;
            this.dy = this.dyFromBumper;
        }
    };
    Player.prototype.PushByAutoscroll = function () {
        if (camera.isAutoscrollingHorizontally) {
            if (this.x < camera.GetLeftCameraEdge() && this.dx < camera.autoscrollX)
                this.dx = camera.autoscrollX;
            if (this.xRight > camera.GetRightCameraEdge() && this.dx > camera.autoscrollX)
                this.dx = camera.autoscrollX;
        }
    };
    Player.prototype.KeepInBounds = function () {
        if (this.x < 0) {
            this.x = 0;
            if (this.dx < 0)
                this.dx = 0;
        }
        var maxX = this.layer.tiles.length * this.layer.tileWidth;
        if (this.xRight > maxX) {
            this.x = maxX - this.width;
            if (this.dx > 0)
                this.dx = 0;
        }
        if (camera.isAutoscrollingHorizontally || camera.isAutoscrollingVertically) {
            var leftEdge = camera.GetLeftCameraEdge();
            if (this.x < leftEdge) {
                if (this.isTouchingRightWall && camera.autoscrollX > 0)
                    this.OnPlayerDead(false);
                else
                    this.x = leftEdge;
            }
            var rightEdge = camera.GetRightCameraEdge();
            if (this.xRight > rightEdge) {
                if (this.isTouchingLeftWall && camera.autoscrollX < 0)
                    this.OnPlayerDead(false);
                else
                    this.x = rightEdge - this.width;
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
    };
    Player.prototype.HandleEnemies = function () {
        var sprites = this.layer.sprites;
        for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
            var sprite = sprites_1[_i];
            var isHorizontalOverlap = this.xRight > sprite.x && this.x < sprite.xRight;
            //let aboutToOverlapFromAbove = this.yBottom > sprite.y && this.yBottom - 3 < sprite.y;
            var currentlyAbove = this.yBottom <= sprite.y + 3 || this.parentSprite == sprite;
            var projectedBelow = this.yBottom + this.GetTotalDy() > sprite.y + sprite.GetTotalDy();
            var aboutToOverlapFromAbove = currentlyAbove && projectedBelow;
            if (!aboutToOverlapFromAbove && sprite instanceof RollingSnailShell) {
                aboutToOverlapFromAbove = this.yBottom > sprite.y && this.yBottom - 3 < sprite.y;
            }
            var landingOnTop = aboutToOverlapFromAbove && isHorizontalOverlap;
            if (sprite instanceof Enemy) {
                if (sprite.framesSinceThrown >= 0 && sprite.framesSinceThrown < 25)
                    continue; // can't bounce on items that have just been thrown
                if (landingOnTop && sprite.canBeBouncedOn) {
                    this.Bounce();
                    if (this.isSpinJumping) {
                        sprite.OnSpinBounce();
                    }
                    else {
                        sprite.OnBounce();
                    }
                    sprite.SharedOnBounce(); //enemy-specific method
                }
                else if (landingOnTop && sprite.canSpinBounceOn && this.isSpinJumping) {
                    this.Bounce();
                    audioHandler.PlaySound("spinBounce", true);
                    var particle = new Pow(this.x, this.y, this.layer, []);
                    particle.x = this.xMid - particle.width / 2;
                    particle.y = this.yBottom - particle.height / 2;
                    this.layer.sprites.push(particle);
                }
                else if (sprite.canStandOn && currentlyAbove && isHorizontalOverlap) {
                }
                else if (!sprite.isInDeathAnimation && this.xRight > sprite.x && this.x < sprite.xRight && this.yBottom > sprite.y && this.y < sprite.yBottom) {
                    if (this.isSliding && sprite.killedByProjectiles) {
                        sprite.isActive = false;
                        var deadSprite = new DeadEnemy(sprite);
                        this.layer.sprites.push(deadSprite);
                    }
                    else {
                        if (sprite.damagesPlayer) {
                            this.OnPlayerHurt();
                        }
                    }
                }
            }
            else if (sprite instanceof Player && sprite !== this && sprite.Overlaps(this)) {
                // bumping in to a DOOPLICATE
                this.OnPlayerDead(false).dooplicateDeath = true;
                sprite.OnPlayerDead(false).dooplicateDeath = true;
            }
            else {
                if (landingOnTop && sprite.canBeBouncedOn) {
                    this.Bounce();
                    sprite.OnBounce();
                }
            }
        }
    };
    Player.prototype.ReactToSpikes = function () {
        var _this = this;
        var isHurt = false;
        var isDead = false;
        if (this.y > this.layer.GetMaxY() + 5) {
            this.dy -= 3;
            this.OnPlayerDead(true);
            return;
        }
        if (this.standingOn.length > 0 && this.standingOn.every(function (a) { return a.tileType.hurtOnTop; })) {
            isHurt = true;
            if (this.standingOn.every(function (a) { return a.tileType.instaKill; }))
                isDead = true;
        }
        if (this.touchedLeftWalls.length > 0 && this.touchedLeftWalls.every(function (a) { return a instanceof LevelTile && a.tileType.hurtOnRight; })) {
            isHurt = true;
            if (this.touchedLeftWalls.every(function (a) { return a instanceof LevelTile && a.tileType.instaKill; }))
                isDead = true;
        }
        if (this.touchedRightWalls.length > 0 && this.touchedRightWalls.every(function (a) { return a instanceof LevelTile && a.tileType.hurtOnLeft; })) {
            isHurt = true;
            if (this.touchedRightWalls.every(function (a) { return a instanceof LevelTile && a.tileType.instaKill; }))
                isDead = true;
        }
        if (this.touchedCeilings.length > 0 && this.touchedCeilings.every(function (a) { return a.tileType.hurtOnBottom; })) {
            isHurt = true;
            if (this.touchedCeilings.every(function (a) { return a.tileType.instaKill; }))
                isDead = true;
        }
        if (isDead) {
            this.dy -= 3;
            this.OnPlayerDead(true);
            return;
        }
        if (!isHurt) {
            var tiles_1 = [];
            [this.x, this.xRight].forEach(function (x) {
                [_this.y, _this.yBottom].forEach(function (y) {
                    tiles_1.push(_this.layer.GetTileByPixel(x, y));
                });
            });
            tiles_1 = tiles_1.filter(Utility.OnlyUnique);
            if (tiles_1.some(function (a) { return a.tileType.hurtOnOverlap; }))
                isHurt = true;
            else if (tiles_1.some(function (a) { var _a; return (_a = a.GetWireNeighbor()) === null || _a === void 0 ? void 0 : _a.tileType.hurtOnOverlap; }))
                isHurt = true;
            else if (tiles_1.some(function (a) { var _a; return (_a = a.GetWaterNeighbor()) === null || _a === void 0 ? void 0 : _a.tileType.hurtOnOverlap; }))
                isHurt = true;
        }
        if (isHurt) {
            this.OnPlayerHurt();
        }
    };
    Player.prototype.OnPlayerHurt = function () {
        var _this = this;
        if (this.heldItem && this.heldItem instanceof GoldHeart)
            return;
        if (this.iFrames == 0) {
            var nextHeart_1 = this.layer.sprites.find(function (a) { return a instanceof ExtraHitHeartSmall && a.parent == _this; });
            if (nextHeart_1) {
                this.iFrames += 130;
                audioHandler.PlaySound("hurt", true);
                // hurt heart animation
                var childHeart = this.layer.sprites.find(function (a) { return a instanceof ExtraHitHeartSmall && a.parent == nextHeart_1; });
                if (childHeart)
                    childHeart.parent = this;
                nextHeart_1.isActive = false;
                nextHeart_1.ReplaceWithSpriteType(ExtraHitHeartSmallLoss);
            }
            else {
                this.OnPlayerDead(true);
            }
        }
    };
    Player.prototype.OnPlayerDead = function (canRespawn) {
        if (!this.isActive) {
            return (this.layer.sprites.find(function (a) { return a instanceof DeadPlayer; }));
        }
        this.OnDead();
        this.isActive = false;
        audioHandler.PlaySound("dead", true);
        if (this.isDuplicate) {
            var deadPlayer = new DeadPlayer(this, -1, false);
            this.layer.sprites.push(deadPlayer);
            deadPlayer.isDuplicate = true;
            return deadPlayer;
        }
        else {
            // log player death
            var newDeathCount = StorageService.IncrementDeathCounter((currentLevelListing === null || currentLevelListing === void 0 ? void 0 : currentLevelListing.level.code) || "");
            var deadPlayer = new DeadPlayer(this, newDeathCount, canRespawn);
            this.layer.sprites.push(deadPlayer);
            editorHandler.bankedCheckpointTime += this.age;
            if (levelGenerator)
                levelGenerator.bankedClearTime += this.age;
            camera.autoscrollX = 0;
            camera.autoscrollY = 0;
            return deadPlayer;
        }
    };
    Player.prototype.IsOnIce = function () {
        return this.standingOn.length > 0 && this.standingOn.some(function (a) { return a.tileType.isSlippery; });
    };
    Player.prototype.PlayerInertia = function () {
        if (this.isSliding)
            return;
        if (this.isOnGround) {
            if (this.targetDirection == 0) {
                if (this.IsOnIce()) {
                    this.dx *= 0.99;
                }
                else {
                    this.dx *= 0.90;
                }
                if (Math.abs(this.dx) < 0.1)
                    this.dx = 0;
            }
        }
        else if (this.isInWater) {
            if (Math.abs(this.dx) > 0.8)
                this.dx *= 0.9;
        }
        if (!this.parentSprite) {
            if (this.dyFromPlatform > 0) {
                this.dyFromPlatform = 0;
            }
            else {
                this.dyFromPlatform *= 0.90;
                if (Math.abs(this.dyFromPlatform) < 0.015)
                    this.dyFromPlatform = 0;
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
            if (Math.abs(this.dxFromPlatform) < 0.02)
                this.dxFromPlatform = 0;
        }
    };
    Player.prototype.PlayerItem = function () {
        var _this = this;
        var _a;
        this.throwTimer++;
        var startedHolding = false;
        var isInCannon = this.layer.sprites.some(function (a) { return a instanceof RedCannon && a.heldPlayer == _this; });
        if (!this.heldItem
            && KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)
            && !this.isClimbing
            && !this.isHanging
            && !isInCannon
            && this.throwTimer > 20) {
            // try to grab item?
            for (var _i = 0, _b = this.layer.sprites.filter(function (a) { return a.canBeHeld; }); _i < _b.length; _i++) {
                var sprite = _b[_i];
                if (sprite.age < 10)
                    continue; // can't grab items that just spawned (prevent grabbing shell after shell jump)
                if (this.IsGoingToOverlapSprite(sprite)) {
                    sprite = sprite.OnPickup();
                    this.heldItem = sprite;
                    startedHolding = true;
                    audioHandler.PlaySound("pick-up", true);
                    break;
                }
            }
            if (this.heldItem == null) {
                // check for items we can hang from
                var myX = this.x + this.GetTotalDx();
                var myY = this.y + this.GetTotalDy();
                for (var _c = 0, _d = this.layer.sprites.filter(function (a) { return a.canHangFrom && (a.framesSinceThrown > 30 || a.framesSinceThrown == -1); }); _c < _d.length; _c++) {
                    var sprite = _d[_c];
                    // special overlap logic for y coords:
                    var spriteX = sprite.x + sprite.GetTotalDx();
                    var spriteYBottom = sprite.yBottom + sprite.GetTotalDy();
                    var isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
                    var isYOverlap = Math.abs(spriteYBottom - myY) < 2.5;
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
                var grabbableFloor = this.standingOn.find(function (a) { return a.tileType.pickUpSprite; });
                if (grabbableFloor) {
                    var spriteType = grabbableFloor.tileType.pickUpSprite;
                    this.heldItem = new spriteType(this.x, this.y, this.layer, []);
                    this.layer.sprites.push(this.heldItem);
                    startedHolding = true;
                    audioHandler.PlaySound("pick-up", true);
                    this.layer.SetTile(grabbableFloor.tileX, grabbableFloor.tileY, TileType.Air);
                }
            }
        }
        if (isInCannon)
            this.heldItem = null;
        if (this.heldItem) {
            if (this.parentSprite == this.heldItem) {
                this.parentSprite = null;
            }
            this.heldItem.parentSprite = null;
            if (!this.heldItem.updatedThisFrame) {
                this.heldItem.updatedThisFrame = true;
                // move rocket above head before first update
                if (this.heldItem instanceof Rocket && !this.heldItem.isRocketing)
                    this.UpdateHeldItemLocation();
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
                    }
                    else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                        this.heldItem.OnDownThrow(this, this.direction);
                    }
                    else {
                        this.heldItem.OnThrow(this, this.direction);
                    }
                    this.heldItem.GentlyEjectFromSolids();
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                    this.throwTimer = 0;
                    audioHandler.PlaySound("throw", true);
                    this.isSpinJumping = false;
                }
            }
            else if (this.heldItem && this.heldItem.canHangFrom) {
                if (this.isOnCeiling) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                }
                else if (this.isOnGround) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                }
                else {
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
                        var xDistanceFromTarget = Math.abs(this.heldItem.xMid - this.width / 2 - this.x);
                        var yDistanceFromTarget = Math.abs(this.heldItem.yBottom - this.y);
                        if (xDistanceFromTarget > 2 || yDistanceFromTarget > 2) {
                            this.heldItem.framesSinceThrown = 1;
                            this.heldItem = null;
                        }
                    }
                }
            }
            if (!((_a = this.heldItem) === null || _a === void 0 ? void 0 : _a.isActive))
                this.heldItem = null;
        }
    };
    Player.prototype.UpdateHeldItemLocation = function () {
        if (this.heldItem && this.heldItem.canBeHeld) {
            this.heldItem.x = this.x + this.width / 2 - this.heldItem.width / 2;
            this.heldItem.y = this.y - this.heldItem.height;
            this.heldItem.dx = 0;
            this.heldItem.dy = 0;
            this.heldItem.dxFromPlatform = 0;
            this.heldItem.dyFromPlatform = 0;
        }
    };
    Player.prototype.HandleDoors = function () {
        var _this = this;
        var _a;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && this.isOnGround) {
            // find overlap door
            var door = this.layer.sprites.find(function (a) { return a instanceof Door &&
                a.IsGoingToOverlapSprite(_this) &&
                Math.abs(a.yBottom - _this.yBottom) < 2; });
            if (door) {
                var doorExit = door.GetPairedDoor();
                if (doorExit) {
                    this.parentSprite = null;
                    (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.StartDoorTransition(this, door, doorExit);
                }
            }
        }
    };
    Player.prototype.GetFrameData = function (frameNum) {
        var _this = this;
        var sourceImage = "dobbs";
        var sourceImageOffset = this.sourceImageOffset;
        if (this.iFrames > 64) {
            if (Math.floor(this.iFrames / 8) % 2 == 0)
                sourceImage = "dobbsGhost";
        }
        else if (this.iFrames > 0) {
            if (Math.floor(this.iFrames / 4) % 2 == 0)
                sourceImage = "dobbsGhost";
        }
        if (this.heldItem && this.heldItem instanceof GoldHeart) {
            if (Math.floor(this.age / 8) % 2 == 0)
                sourceImage = "dobbsGhost";
        }
        var isInCannon = this.layer.sprites.some(function (a) { return a instanceof RedCannon && a.heldPlayer == _this; });
        if (isInCannon) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        var xFlip = this.direction == -1;
        var actualFrame = Math.floor(this.frameNum) % 2;
        var row = this.heldItem ? 1 : 0;
        var tile = tiles[sourceImage][0 + sourceImageOffset][row];
        if (this.dx != 0) {
            tile = tiles[sourceImage][1 + actualFrame + sourceImageOffset][row];
        }
        if (!this.isOnGround) {
            if (this.isInWater && this.heldItem == null) {
                if (this.swimTimer <= 2)
                    tile = tiles[sourceImage][2 + sourceImageOffset][3];
                else if (this.swimTimer < 12)
                    tile = tiles[sourceImage][1 + sourceImageOffset][3];
                else
                    tile = tiles[sourceImage][2 + sourceImageOffset][3];
            }
            else {
                tile = tiles[sourceImage][3 + sourceImageOffset][row];
                if (this.isSpinJumping) {
                    var spinTiles = [
                        tiles[sourceImage][3 + sourceImageOffset][row],
                        tiles[sourceImage][0 + sourceImageOffset][3],
                        tiles[sourceImage][3 + sourceImageOffset][row],
                        tiles[sourceImage][1 + sourceImageOffset][4],
                    ];
                    tile = spinTiles[Math.floor(frameNum / 4) % 4];
                    if (Math.floor(frameNum / 4) % 4 == 2)
                        xFlip = !xFlip;
                }
            }
        }
        if (this.isOnGround && this.targetDirection == 0 && !this.heldItem) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                tile = tiles[sourceImage][2 + sourceImageOffset][2];
            }
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
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
    };
    Player.prototype.OnAfterDraw = function (camera) {
        var ctx = camera.ctx;
        if (this.currentBreath < this.maxBreath) {
            var x = (this.x - camera.x - 3) * camera.scale + camera.canvas.width / 2;
            var y = (this.y - camera.y) * camera.scale + camera.canvas.height / 2;
            var fillRatio = this.currentBreath / this.maxBreath;
            ctx.fillStyle = "#48F";
            ctx.strokeStyle = "#DDD";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 6, -Math.PI / 2, 2 * Math.PI * fillRatio - Math.PI / 2, false);
            ctx.fill();
            ctx.stroke();
        }
    };
    return Player;
}(Sprite));
var DeadPlayer = /** @class */ (function (_super) {
    __extends(DeadPlayer, _super);
    function DeadPlayer(player, deathCount, canRespawn) {
        var _this = _super.call(this, player.x, player.y, player.layer, []) || this;
        _this.deathCount = deathCount;
        _this.canRespawn = canRespawn;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = false;
        _this.imageOffset = 0;
        _this.dooplicateDeath = false;
        if (player instanceof HoverPlayer)
            _this.imageOffset = 1;
        _this.dx = player.dx;
        _this.dy = Math.max(0, player.dy) - 1;
        return _this;
    }
    DeadPlayer.prototype.Update = function () {
        var _this = this;
        var accel = 0.04;
        var maxSpeed = 2;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
            this.dx -= accel;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
            this.dx += accel;
        if (this.dx > maxSpeed)
            this.dx = maxSpeed;
        if (this.dx < -maxSpeed)
            this.dx = -maxSpeed;
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
                }
                else {
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
            var overlappingWings = this.layer.sprites.filter(function (a) { return a instanceof ReviveWings && _this.Overlaps(a); });
            if (this.age <= 60 && overlappingWings.length > 0 && this.canRespawn) {
                audioHandler.PlaySound("respawn", true);
                var newPlayer = this.ReplaceWithSpriteType(this.imageOffset == 1 ? HoverPlayer : Player);
                var wings = overlappingWings[0];
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
    };
    DeadPlayer.prototype.GetFrameData = function (frameNum) {
        var tileCol = Math.floor(frameNum / 5) % 4;
        return {
            imageTile: tiles["dead"][tileCol][this.imageOffset],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    };
    DeadPlayer.prototype.OnAfterDraw = function (camera) {
        if (this.deathCount == -1)
            return;
        var ctx = camera.ctx;
        var fontsize = 16;
        ctx.fillStyle = "#0008";
        ctx.fillRect(camera.canvas.width - 90, 0, 90, 20 + fontsize);
        var imageTile = tiles["dead"][0][0];
        imageTile.DrawToScreen(ctx, camera.canvas.width - 70, 10, 2);
        ctx.textAlign = "right";
        ctx.font = fontsize + "px grobold";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.lineWidth = 4;
        ctx.strokeText(this.deathCount.toString(), camera.canvas.width - 10, 10 + fontsize);
        ctx.fillText(this.deathCount.toString(), camera.canvas.width - 10, 10 + fontsize);
    };
    return DeadPlayer;
}(Sprite));
var HoverPlayer = /** @class */ (function (_super) {
    __extends(HoverPlayer, _super);
    function HoverPlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canPlayerFloatJump = true;
        _this.sourceImageOffset = 4;
        _this.moveSpeed = 1;
        return _this;
    }
    return HoverPlayer;
}(Player));
