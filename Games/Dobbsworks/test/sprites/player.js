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
        _this.coyoteTimer = -1; // how long since not on ground
        _this.frameNum = 0;
        _this.jumpTimer = -1; // how long have we been ascending for current jump
        _this.throwTimer = -1; // how long since throwing something
        _this.swimTimer = -1; // how long since last swim
        _this.isClimbing = false;
        _this.isHanging = false;
        _this.climbCooldownTimer = -1; // how long since climbing (to avoid regrabbing ladder while climbing up)
        _this.respectsSolidTiles = true;
        _this.dxFromBumper = 0;
        _this.dyFromBumper = 0;
        _this.bumperTimer = 0;
        _this.isTouchingStickyWall = false;
        _this.wallClingDirection = -1;
        _this.canMotorHold = false;
        _this.maxBreath = 600;
        _this.currentBreath = 600;
        _this.breathTimer = 0; // current breath only recovers after breath timer runs out
        _this.replayHandler = new ReplayHandler();
        _this.neutralTimer = 0;
        _this.isRequired = true;
        _this.maxAllowed = 1;
        _this.heldItem = null;
        _this.targetDirection = 0;
        _this.props = ["x", "y", "dx", "dy", "isOnGround"];
        _this.history = [];
        _this.zIndex = 1;
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
        this.HandleBumpers();
        this.PlayerMovement(); // includes gravity
        this.HandleEnemies(); // includes gravity
        this.PlayerInertia();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        this.ReactToSpikes();
        this.PlayerItem();
        this.KeepInBounds();
        //console.log(this.x - oldX, this.y - oldY)
        this.frameNum += Math.max(Math.abs(this.dx / 4), Math.abs(this.dy / 4));
        // if (Math.abs(this.dx) > 1) {
        //     //debugMode = true;
        //     this.dx *= 0.5;
        // }
        this.HandleDoors();
        this.replayHandler.StoreFrame();
    };
    Player.prototype.PlayerMovement = function () {
        var _a, _b, _c, _d, _e;
        if (this.neutralTimer > 0)
            this.neutralTimer--;
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
                if (this.yBottom + this.floatingPointOffset > map.lavaLevel.currentY)
                    this.OnPlayerHurt();
            }
        }
        if (this.isInWater && !wasInWater) {
            if (waterTileAtFoot || (globalWaterHeight != -1 && globalWaterHeight < this.yBottom)) {
                this.dy = 0;
            }
            else {
                this.dy *= 0.5;
            }
        }
        this.HandleBreath(isLosingBreath);
        this.isInQuicksand = ((_c = this.layer.map) === null || _c === void 0 ? void 0 : _c.waterLayer.GetTileByPixel(this.xMid, this.yBottom - 0.1).tileType.isQuicksand) || false;
        if (this.isOnGround || this.isClimbing || ((this.isInWater || this.isInQuicksand) && this.heldItem == null) || this.isTouchingStickyWall || ((_d = this.heldItem) === null || _d === void 0 ? void 0 : _d.canHangFrom)) {
            this.coyoteTimer = 0;
        }
        if (!this.isOnGround)
            this.coyoteTimer++;
        var isJumpHeld = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false);
        if (this.jumpTimer > -1) {
            if (isJumpHeld || this.neutralTimer > 0)
                this.jumpTimer++;
            if (!isJumpHeld) {
                this.jumpTimer = -1;
                if (this.dy < -1)
                    this.dy = -1;
            }
            if (this.jumpTimer > 14)
                this.jumpTimer = -1;
        }
        //let isHoldingCruisingRocket = (this.heldItem && this.heldItem instanceof Rocket && this.heldItem.isRocketing);
        if (this.jumpTimer == -1 && !this.isClimbing) {
            this.ApplyGravity();
            if (isJumpHeld && this.dy > 0)
                this.dy *= 0.97;
            // can call this twice for "heavy" movement
            //this.ApplyGravity();
        }
        if (this.dy > 1.5)
            this.dy = 1.5;
        var isJumpInitialPressed = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true);
        if (this.jumpBufferTimer >= 0)
            this.jumpBufferTimer++;
        if (isJumpInitialPressed)
            this.jumpBufferTimer = 0;
        if (this.jumpBufferTimer > 3)
            this.jumpBufferTimer = -1;
        if (this.jumpBufferTimer > -1 && this.coyoteTimer < 5) {
            this.Jump();
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
        this.climbCooldownTimer++;
        var tileAtMid = this.layer.GetTileByPixel(this.xMid, this.yMid);
        var tileAtFoot = this.layer.GetTileByPixel(this.xMid, this.yBottom - 0.25);
        var isAtLadderTop = (tileAtFoot.tileType.isClimbable && ((_e = tileAtFoot.GetSemisolidNeighbor()) === null || _e === void 0 ? void 0 : _e.tileType.solidity) == Solidity.Top);
        var isTouchingLadder = tileAtMid.tileType.isClimbable || isAtLadderTop;
        if (upPressed && isTouchingLadder && this.climbCooldownTimer > 20 && this.heldItem == null) {
            this.isClimbing = true;
        }
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
            }
        }
        this.isHanging = false;
        if (this.touchedCeilings.some(function (a) { return a.tileType.isHangable; })) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, false) && this.heldItem == null) {
                this.isHanging = true;
                this.dy = 0;
                if (!leftPressed && this.dx < 0)
                    this.dx *= 0.8;
                if (!rightPressed && this.dx > 0)
                    this.dx *= 0.8;
            }
        }
        if (this.isTouchingStickyWall) {
            this.dx = 0;
            this.dy = 0;
        }
        else {
            if (this.isClimbing) {
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
                    var maxSpeed = 1.1;
                    // ORIGINAL: 1.0
                    var accel = this.isOnGround ? 0.06 : 0.035;
                    if (!KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                        maxSpeed = 0.75;
                        // ORIGINAL: 0.7
                    }
                    if (this.isInWater) {
                        maxSpeed = 0.5;
                    }
                    if (this.isHanging) {
                        maxSpeed = 0.5;
                    }
                    this.dx += this.targetDirection * accel;
                    // cap speed
                    if (this.dx * this.targetDirection > maxSpeed) {
                        this.dx = this.targetDirection * maxSpeed;
                    }
                }
            }
        }
        if (this.isInQuicksand) {
            this.dx *= 0.8;
            this.dy *= 0.8;
        }
        if (this.standingOn.some(function (a) { return !a.tileType.canWalkOn; }))
            this.dx = 0;
    };
    Player.prototype.Jump = function () {
        var _a;
        // very similar to Bounce()
        // if (this.jumpBufferTimer > 0) console.log("BUFFER JUMP", this.jumpBufferTimer);
        // if (this.coyoteTimer > 0) console.log("COYOTE TIME", this.coyoteTimer);
        this.jumpBufferTimer = -1;
        this.coyoteTimer = 999999;
        this.dy = Math.abs(this.dx) > 0.3 ? -1.5 : -1.2;
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
            audioHandler.PlaySound("jump", true);
        }
        if ((_a = this.heldItem) === null || _a === void 0 ? void 0 : _a.canHangFrom) {
            this.heldItem.framesSinceThrown = 1;
            this.heldItem = null;
        }
        this.jumpTimer = 0;
        this.isClimbing = false;
        this.climbCooldownTimer = 0;
        this.parentSprite = null;
        if (this.isTouchingStickyWall) {
            this.dx = -this.wallClingDirection * 1.1;
            this.dy = -1.1; // less than normal to make sure no single-wall scaling
            this.direction = this.wallClingDirection == 1 ? -1 : 1;
        }
        this.isTouchingStickyWall = false;
    };
    Player.prototype.Bounce = function () {
        // very similar to Jump()
        this.jumpBufferTimer = -1;
        this.coyoteTimer = 999999;
        this.dy = -1.5;
        this.jumpTimer = 0;
        this.isClimbing = false;
        this.parentSprite = null;
    };
    Player.prototype.HandleBreath = function (isLosingBreath) {
        if (isLosingBreath) {
            this.breathTimer = 120;
            this.currentBreath -= 1;
            if (this.currentBreath <= 0)
                this.OnPlayerHurt();
        }
        else {
            if (this.breathTimer > 0)
                this.breathTimer -= 1;
            if (this.breathTimer <= 0 && this.currentBreath < this.maxBreath)
                this.currentBreath += 4;
        }
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
    Player.prototype.HandleEnemies = function () {
        var sprites = this.layer.sprites;
        for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
            var sprite = sprites_1[_i];
            if (!(sprite instanceof Enemy))
                continue;
            var enemy = sprite;
            if (enemy.framesSinceThrown > 0 && enemy.framesSinceThrown < 25)
                continue; // can't bounce on items that have just been thrown
            if (enemy.canBeBouncedOn && this.xRight > enemy.x && this.x < enemy.xRight && this.yBottom > enemy.y && this.yBottom - 3 < enemy.y) {
                this.Bounce();
                enemy.OnBounce();
                enemy.SharedOnBounce();
            }
            else if (!enemy.isInDeathAnimation && this.xRight > enemy.x && this.x < enemy.xRight && this.yBottom > enemy.y && this.y < enemy.yBottom) {
                this.OnPlayerHurt();
            }
        }
    };
    Player.prototype.ReactToSpikes = function () {
        var _this = this;
        var isHurt = false;
        if (this.y > this.layer.GetMaxY()) {
            this.dy -= 3;
            isHurt = true;
        }
        if (this.standingOn.length > 0 && this.standingOn.every(function (a) { return a.tileType.hurtOnTop; }))
            isHurt = true;
        if (this.touchedLeftWalls.length > 0 && this.touchedLeftWalls.every(function (a) { return a instanceof LevelTile && a.tileType.hurtOnSides; }))
            isHurt = true;
        if (this.touchedRightWalls.length > 0 && this.touchedRightWalls.every(function (a) { return a instanceof LevelTile && a.tileType.hurtOnSides; }))
            isHurt = true;
        if (this.touchedCeilings.length > 0 && this.touchedCeilings.every(function (a) { return a.tileType.hurtOnBottom; }))
            isHurt = true;
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
        if (!this.isActive)
            return;
        this.isActive = false;
        // log player death
        var newDeathCount = StorageService.IncrementDeathCounter(currentLevelId);
        var deadPlayer = new DeadPlayer(this, newDeathCount);
        this.layer.sprites.push(deadPlayer);
        audioHandler.PlaySound("dead", true);
    };
    Player.prototype.PlayerInertia = function () {
        if (this.isOnGround) {
            if (this.targetDirection == 0) {
                this.dx *= 0.90;
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
            if (this.dxFromPlatform > 0) {
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
        var _a;
        this.throwTimer++;
        var startedHolding = false;
        var isInCannon = this.layer.sprites.some(function (a) { return a instanceof Cannon && a.holdingPlayer; });
        if (!this.heldItem
            && KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)
            && !this.isClimbing
            && !this.isHanging
            && !isInCannon
            && this.throwTimer > 20) {
            // try to grab item?
            for (var _i = 0, _b = this.layer.sprites.filter(function (a) { return a.canBeHeld; }); _i < _b.length; _i++) {
                var sprite = _b[_i];
                if (sprite.age < 30)
                    continue; // can't grab items that just spawned (prevent grabbing shell after shell jump)
                if (this.IsGoingToOverlapSprite(sprite)) {
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
                for (var _c = 0, _d = this.layer.sprites.filter(function (a) { return a.canHangFrom && a.framesSinceThrown > 30; }); _c < _d.length; _c++) {
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
                this.heldItem.Update();
            }
            if (this.heldItem.canBeHeld) {
                this.heldItem.x = this.x + this.width / 2 - this.heldItem.width / 2;
                this.heldItem.y = this.y - this.heldItem.height;
                this.heldItem.dx = 0;
                this.heldItem.dy = 0;
                this.heldItem.dxFromPlatform = 0;
                this.heldItem.dyFromPlatform = 0;
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
                }
            }
            else if (this.heldItem.canHangFrom) {
                if (this.isOnCeiling) {
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
    Player.prototype.HandleDoors = function () {
        var _this = this;
        var _a;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && this.isOnGround) {
            // find overlap door
            var door = this.layer.sprites.find(function (a) { return a instanceof Door && a.IsGoingToOverlapSprite(_this); });
            if (door) {
                var doorExit = door.GetPairedDoor();
                if (doorExit) {
                    (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.StartDoorTransition(this, door, doorExit);
                }
            }
        }
    };
    Player.prototype.GetFrameData = function (frameNum) {
        var xFlip = this.direction == -1;
        var actualFrame = Math.floor(this.frameNum) % 2;
        var row = this.heldItem ? 1 : 0;
        var tile = tiles["dobbs"][0][row];
        if (this.dx != 0) {
            tile = tiles["dobbs"][1 + actualFrame][row];
        }
        if (!this.isOnGround) {
            if (this.isInWater && this.heldItem == null) {
                if (this.swimTimer <= 2)
                    tile = tiles["dobbs"][2][3];
                else if (this.swimTimer < 12)
                    tile = tiles["dobbs"][1][3];
                else
                    tile = tiles["dobbs"][2][3];
            }
            else {
                tile = tiles["dobbs"][3][row];
            }
        }
        if (this.isOnGround && this.targetDirection == 0 && !this.heldItem) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                tile = tiles["dobbs"][2][2];
            }
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                tile = tiles["dobbs"][3][2];
            }
        }
        if (this.isClimbing) {
            tile = tiles["dobbs"][0][3];
            xFlip = actualFrame % 2 == 0;
        }
        if (this.isHanging) {
            tile = tiles["dobbs"][3][actualFrame % 2 ? 1 : 3];
        }
        if (this.isTouchingStickyWall) {
            tile = tiles["dobbs"][0][4];
        }
        return {
            imageTile: tile,
            xFlip: xFlip,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
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
    function DeadPlayer(player, deathCount) {
        var _this = _super.call(this, player.x, player.y, player.layer, []) || this;
        _this.deathCount = deathCount;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = false;
        _this.dx = player.dx;
        _this.dy = player.dy - 1;
        return _this;
    }
    DeadPlayer.prototype.Update = function () {
        this.ApplyGravity();
        this.MoveByVelocity();
        if (this.age > 60) {
            if (editorHandler.isEditorAllowed) {
                editorHandler.SwitchToEditMode();
            }
            else {
                editorHandler.SwitchToEditMode();
                editorHandler.SwitchToPlayMode();
            }
        }
    };
    DeadPlayer.prototype.GetFrameData = function (frameNum) {
        var tileCol = Math.floor(frameNum / 5) % 4;
        return {
            imageTile: tiles["dead"][tileCol][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    };
    DeadPlayer.prototype.OnAfterDraw = function (camera) {
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
