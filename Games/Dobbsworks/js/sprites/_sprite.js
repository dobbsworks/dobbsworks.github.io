"use strict";
var Sprite = /** @class */ (function () {
    function Sprite(x, y, layer, editorProps) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.isActive = true;
        this.locked = false;
        this.updatedThisFrame = false;
        this.dx = 0;
        this.dy = 0;
        this.dxFromPlatform = 0;
        this.dyFromPlatform = 0;
        this.ledgeGrabDistance = 3;
        this.isOnGround = true;
        this.standingOn = [];
        this.touchedCeilings = [];
        this.touchedLeftWalls = [];
        this.touchedRightWalls = [];
        this.isInWater = false;
        this.isInWaterfall = false;
        this.isInQuicksand = false;
        this.floatsInWater = false;
        this.floatingPointOffset = 0;
        this.slowFall = false;
        this.gustUpTimer = 0; // number of frames remaining to assume is in updraft
        this.canMotorHold = true;
        this.isExemptFromSilhoutte = false;
        this.age = 0;
        this.framesSinceThrown = 0;
        this.isPlatform = false;
        this.isSolidBox = false;
        this.parentSprite = null;
        this.canBeHeld = false;
        this.canHangFrom = false;
        this.canBeBouncedOn = false;
        this.hurtsEnemies = false;
        this.onScreenTimer = 0;
        // used for editor
        this.anchor = Direction.Down;
        this.maxAllowed = -1; // -1 for no limit
        this.isRequired = false;
        this.rotation = 0; // used for animating round objects
        this.rolls = false;
        this.isPowerSource = false;
        this.zIndex = 0; //draw order
        this.maxDY = 2;
        this.waterMinDy = 0.5;
    }
    Object.defineProperty(Sprite.prototype, "yBottom", {
        get: function () { return +((this.y + this.height).toFixed(3)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "xRight", {
        get: function () { return +((this.x + this.width).toFixed(3)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "xMid", {
        get: function () { return +((this.x + this.width / 2).toFixed(3)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "yMid", {
        get: function () { return +((this.y + this.height / 2).toFixed(3)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isOnCeiling", {
        get: function () { return this.touchedCeilings.length > 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isTouchingLeftWall", {
        get: function () { return this.touchedLeftWalls.length > 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isTouchingRightWall", {
        get: function () { return this.touchedRightWalls.length > 0; },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.GetPowerPoints = function () { return [{ xPixel: this.xMid, yPixel: this.yMid }]; };
    Sprite.prototype.OnStrikeEnemy = function (enemy) { };
    Sprite.prototype.GetTotalDx = function () {
        var ret = this.dx;
        ret += this.dxFromPlatform;
        return ret;
    };
    Sprite.prototype.GetTotalDy = function () {
        var ret = this.dy;
        ret += this.dyFromPlatform;
        return ret;
    };
    Sprite.prototype.SharedUpdate = function () {
        this.age++;
        this.framesSinceThrown++;
        this.gustUpTimer--;
        if (!this.respectsSolidTiles)
            this.isOnGround = false;
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
    };
    Sprite.prototype.ApplyGravity = function () {
        var _a, _b;
        if (this instanceof Enemy && this.stackedOn)
            return;
        // move towards maxFallSpeed at rate of fallAccel
        var targetFallSpeed = this.maxDY;
        // ORGINAL: 1.5
        var fallAccel = 0.09;
        // ORIGINAL: 0.05
        // NEXT 0.07
        if (this.slowFall || (this instanceof Player && ((_a = this.heldItem) === null || _a === void 0 ? void 0 : _a.slowFall))) {
            targetFallSpeed = 0.4;
        }
        if (this.isInWater && !this.isInWaterfall) {
            if (this.floatsInWater) {
                targetFallSpeed = -0.8;
                fallAccel = 0.03;
            }
            else {
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
                }
                else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                    targetFallSpeed = -0.3;
                }
                if ((_b = this.heldItem) === null || _b === void 0 ? void 0 : _b.slowFall) {
                    targetFallSpeed = -2;
                }
            }
        }
        // adjust dy
        if (Math.abs(this.dy - targetFallSpeed) < fallAccel) {
            // speeds are close, just set value
            this.dy = targetFallSpeed;
        }
        else {
            if (this.dy > targetFallSpeed)
                this.dy -= Math.abs(fallAccel);
            else
                this.dy += Math.abs(fallAccel);
        }
    };
    Sprite.prototype.OnBounce = function () { };
    Sprite.prototype.OnThrow = function (thrower, direction) {
        this.dx = direction * 1 + thrower.GetTotalDx();
        this.dy = -1;
    };
    Sprite.prototype.OnUpThrow = function (thrower, direction) {
        this.dx = (direction * 1) * 0 + thrower.GetTotalDx();
        this.dy = -2;
    };
    Sprite.prototype.OnDownThrow = function (thrower, direction) {
        this.dx = (direction * 1) / 4 + thrower.GetTotalDx();
        this.dy = 0;
    };
    Sprite.prototype.IsOnScreen = function () {
        return (this.xRight + 10 > camera.x - camera.canvas.width / 2 / camera.scale)
            && (this.x - 10 < camera.x + camera.canvas.width / 2 / camera.scale)
            && (this.yBottom + 10 > camera.y - camera.canvas.height / 2 / camera.scale)
            && (this.y - 10 < camera.y + camera.canvas.height / 2 / camera.scale);
    };
    Sprite.prototype.WaitForOnScreen = function () {
        if (this.onScreenTimer <= 2) {
            if (this.IsOnScreen()) {
                this.onScreenTimer += 1;
            }
        }
        return this.onScreenTimer >= 2;
    };
    Sprite.prototype.ApplyInertia = function () {
        var inertiaRatio = this.rolls ? 0.99 : 0.94;
        if (this.isOnGround) {
            this.dx *= inertiaRatio;
            if (Math.abs(this.dx) < 0.015)
                this.dx = 0;
        }
        if (!this.parentSprite) {
            if (this.dyFromPlatform > 0) {
                this.dyFromPlatform = 0;
            }
            else {
                this.dyFromPlatform *= inertiaRatio;
                if (Math.abs(this.dyFromPlatform) < 0.015)
                    this.dyFromPlatform = 0;
            }
            if (this.dxFromPlatform > 0) {
                this.dxFromPlatform *= inertiaRatio;
            }
            if (this.isOnGround) {
                this.dxFromPlatform *= inertiaRatio;
            }
            if (Math.abs(this.dxFromPlatform) < 0.015)
                this.dxFromPlatform = 0;
        }
    };
    Sprite.prototype.ReactToPlatforms = function () {
        // this velocity stored separately to better manage momentum jumps
        if (this.parentSprite) {
            // currently on platform, see if still valid
            if (this.xRight < this.parentSprite.x)
                this.parentSprite = null;
            else if (this.x > this.parentSprite.xRight)
                this.parentSprite = null;
            // else if (Math.abs(this.yBottom - this.parentSprite.y) > 0.1) {
            //     this.parentSprite = null;
            // }
        }
        for (var _i = 0, _a = this.layer.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
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
                            }
                            else {
                                this.touchedLeftWalls.push(sprite);
                            }
                            this.x = (this.x < sprite.x) ? (sprite.x - this.width) : (sprite.x + sprite.width);
                        }
                    }
                    if (this.y > sprite.yMid && this.GetTotalDy() <= sprite.GetTotalDy() &&
                        (this.x < sprite.xRight && this.xRight > sprite.x)) {
                        // block from bottom
                        if (this.standingOn.length == 0 && this instanceof Player && this.heldItem !== sprite) {
                            var groundPixel = this.GetHeightOfSolid(0, 1).yPixel;
                            this.dyFromPlatform = sprite.GetTotalDy();
                            this.dy = 0;
                            this.y = sprite.yBottom;
                            if (groundPixel == -1 || groundPixel == -999999) {
                                // far from ground
                            }
                            else {
                                if (this.yBottom + this.GetTotalDy() > groundPixel) {
                                    // don't allow fan to push through floor
                                    this.y = groundPixel - this.height;
                                    this.dyFromPlatform = 0;
                                }
                            }
                        }
                    }
                }
                if (sprite.isPlatform || sprite.isSolidBox) {
                    var areSpritesMovingTowards = (this.GetTotalDy() >= sprite.GetTotalDy());
                    var isCurrentlyAbove = (this.yBottom - 0.1 <= sprite.y);
                    if (areSpritesMovingTowards && isCurrentlyAbove && (this.x < sprite.xRight && this.xRight > sprite.x)) {
                        this.parentSprite = sprite;
                    }
                }
            }
        }
        if (this.parentSprite) {
            if (!this.parentSprite.isActive)
                this.parentSprite = null;
        }
        if (this.parentSprite) {
            this.isOnGround = true;
            //this.y = this.parentSprite.y - this.height;
            //if (this.GetTotalDy() > this.parentSprite.GetTotalDy()) {
            this.dyFromPlatform = this.parentSprite.GetTotalDy();
            this.dy = 0;
            //}
            for (var _b = 0, _c = this.standingOn; _b < _c.length; _b++) {
                var ground = _c[_b];
                var yPixel = ground.GetTopPixel();
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
    };
    Sprite.prototype.ReactToWater = function () {
        var _a;
        var wasInWater = this.isInWater;
        this.isInWater = this.IsInWater();
        var changingWaterState = (this.isInWater == !wasInWater);
        if (changingWaterState) {
            var oldDx = this.dx;
            var oldDy = this.dy;
            this.dy /= 2;
            this.dx /= 2;
            var minDx = 0.1;
            var minDy = this.waterMinDy;
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
        this.isInQuicksand = ((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.waterLayer.GetTileByPixel(this.xMid, this.yBottom + this.floatingPointOffset).tileType.isQuicksand) || false;
        if (this.isInQuicksand) {
            this.dx *= 0.8;
            this.dy *= 0.8;
        }
    };
    Sprite.prototype.IsGoingToOverlapSprite = function (sprite) {
        if (this == sprite)
            return false;
        var myX = this.x + this.GetTotalDx();
        var spriteX = sprite.x + sprite.GetTotalDx();
        var myY = this.y + this.GetTotalDy();
        var spriteY = sprite.y + sprite.GetTotalDy();
        var isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
        var isYOverlap = myY <= spriteY + sprite.height && myY + this.height >= spriteY;
        return isXOverlap && isYOverlap;
    };
    Sprite.prototype.Overlaps = function (sprite) {
        if (this == sprite)
            return false;
        var myX = this.x;
        var spriteX = sprite.x;
        var myY = this.y;
        var spriteY = sprite.y;
        var isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
        var isYOverlap = myY <= spriteY + sprite.height && myY + this.height >= spriteY;
        return isXOverlap && isYOverlap;
    };
    Sprite.prototype.IsInWater = function () {
        var _this = this;
        var _a, _b;
        if (currentMap.spriteWaterMode)
            return true;
        var waterLayerAtMid = ((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.waterLayer.GetTileByPixel(this.xMid, this.yMid + this.floatingPointOffset).tileType) || TileType.Air;
        this.isInWaterfall = waterLayerAtMid.isWaterfall;
        if (waterLayerAtMid.isSwimmable)
            return true;
        var map = this.layer.map;
        var inGlobalWater = false;
        if (map) {
            [map.waterLevel, map.purpleWaterLevel].forEach(function (a) {
                if (a.currentY !== -1) {
                    if (_this.yBottom + _this.floatingPointOffset > a.currentY)
                        inGlobalWater = true;
                }
            });
        }
        if (inGlobalWater)
            return true;
        return ((_b = this.layer.map) === null || _b === void 0 ? void 0 : _b.waterLayer.GetTileByPixel(this.xMid, this.yBottom + this.floatingPointOffset).tileType.isSwimmable) || false;
    };
    Sprite.prototype.ReactToPlatformsAndSolids = function () {
        if (!this.parentSprite)
            this.isOnGround = false;
        this.standingOn = [];
        this.touchedCeilings = [];
        this.touchedLeftWalls = [];
        this.touchedRightWalls = [];
        this.ReactToSolids();
        this.ReactToPlatforms();
    };
    Sprite.prototype.ReactToSolids = function () {
        var _a;
        if (this.GetTotalDy() >= 0) { // moving down
            var grounds = this.GetHeightOfSolid(0, 1);
            if (grounds.yPixel > -1) {
                // -0 was originally -1?
                if (this.yBottom + this.GetTotalDy() > grounds.yPixel - 0 && this.GetTotalDy() >= 0) {
                    // upcoming position is below ground line
                    this.isOnGround = true;
                    this.standingOn = grounds.tiles;
                    if (this.parentSprite && this.parentSprite.GetTotalDy() > 0)
                        this.parentSprite = null;
                    var conveyorSpeed = Math.max.apply(Math, this.standingOn.map(function (a) { return a.tileType.conveyorSpeed; }));
                    if (conveyorSpeed)
                        this.dxFromPlatform = conveyorSpeed;
                    this.dy = grounds.yPixel - this.y - this.height;
                    if (this.dy < 0)
                        this.dy = 0;
                    this.dyFromPlatform = 0;
                    if (this.rolls) {
                        var solidTile = this.layer.GetTileByPixel(this.xMid, this.yBottom + 0.1);
                        var solidity = solidTile.tileType.solidity;
                        if (solidity instanceof SlopeSolidity) {
                            this.dx -= solidity.horizontalSolidDirection * 0.02;
                        }
                    }
                }
            }
        }
        if (this.GetTotalDy() <= 0 || (this instanceof Enemy && this.stackedOn)) { // moving up
            var ceilings = this.GetHeightOfSolid(0, -1);
            var ceilingHeight = ceilings.yPixel;
            if (ceilingHeight > -1) {
                if (this.y + this.GetTotalDy() <= ceilingHeight && this.GetTotalDy() <= 0) {
                    (_a = this.touchedCeilings).push.apply(_a, ceilings.tiles);
                    this.dy = ceilingHeight - this.y;
                    if (this.dy > 0)
                        this.dy = 0;
                    this.dyFromPlatform = 0;
                }
            }
        }
        function ReactToHorizontalSolid(sprite, direction) {
            var walls = sprite.GetDistanceOfWall(sprite.GetTotalDy(), direction);
            var wallLocation = walls.x;
            if (wallLocation > -1) {
                var isInWall = sprite.xRight + sprite.GetTotalDx() > wallLocation;
                if (direction == -1)
                    isInWall = sprite.x + sprite.GetTotalDx() < wallLocation;
                if (isInWall) {
                    var nextTileYPixel = Math.floor((sprite.y + sprite.height + sprite.GetTotalDy()) / sprite.layer.tileHeight) * sprite.layer.tileHeight;
                    var heightToNextTile = sprite.y + sprite.height - nextTileYPixel;
                    var wallLocationIfALittleHigher = sprite.GetDistanceOfWall(sprite.GetTotalDy() - sprite.ledgeGrabDistance, direction).x;
                    var isHigherWallFarther = (wallLocationIfALittleHigher < wallLocation && direction == -1) ||
                        ((wallLocationIfALittleHigher == -1 || wallLocationIfALittleHigher > wallLocation) && direction == 1);
                    if (sprite.GetTotalDy() >= 0 && heightToNextTile <= sprite.ledgeGrabDistance && isHigherWallFarther) {
                        // ledge grab!
                        //console.log("LEDGE GRAB", wallLocationIfALittleHigher < wallLocation);
                        sprite.y -= heightToNextTile;
                        sprite.dy = 0;
                    }
                    else {
                        // definitely hit a wall
                        sprite.dx = wallLocation - (sprite.x + (direction == 1 ? sprite.width : 0));
                        sprite.dxFromPlatform = 0;
                        if (direction == -1)
                            sprite.touchedLeftWalls = walls.tiles;
                        if (direction == 1)
                            sprite.touchedRightWalls = walls.tiles;
                    }
                }
            }
        }
        if (this.GetTotalDx() > 0) { // moving right
            ReactToHorizontalSolid(this, 1);
        }
        else if (this.GetTotalDx() < 0) { // moving left
            ReactToHorizontalSolid(this, -1);
        }
        // Slopes
        var footTile = this.layer.GetTileByPixel(this.xMid, this.yBottom - 1);
        if (footTile) {
            if (!(footTile.tileType.solidity instanceof SlopeSolidity) || footTile.tileType.solidity.verticalSolidDirection == -1) {
                // foot tile is not a |\ or /| slope
                // we may have fallen through slightly, let's check the tile at midpoint
                footTile = this.layer.GetTileByPixel(this.xMid, this.yMid);
            }
            var solidity = footTile.tileType.solidity;
            if (solidity instanceof SlopeSolidity && solidity.verticalSolidDirection == 1) {
                // is sloping floor
                if (solidity.GetIsPointInSolidSide(this.xMid, this.yBottom, this.layer, footTile)) {
                    var targetY = solidity.GetSlopePoint(this.xMid, this.layer, footTile);
                    var heightToScootUp = this.yBottom - targetY;
                    var ceilingHeight = this.GetHeightOfSolid(0, -1).yPixel;
                    if (ceilingHeight > -1) {
                        var headRoom = this.y - ceilingHeight;
                        if (heightToScootUp > headRoom) {
                            var overshoot = heightToScootUp - headRoom;
                            this.y += overshoot;
                            this.x -= overshoot * solidity.horizontalSolidDirection;
                            this.touchedCeilings.push(footTile);
                        }
                    }
                    if (this.rolls) {
                        this.dy = -heightToScootUp;
                        this.dx -= solidity.horizontalSolidDirection * 0.02;
                    }
                    else {
                        this.y -= heightToScootUp;
                    }
                    this.parentSprite = null;
                    //if (this.dy > 0) this.dy = 0;
                    this.isOnGround = true;
                }
            }
        }
        var centerTopTile = this.layer.GetTileByPixel(this.xMid, this.y);
        if (centerTopTile) {
            var solidity = centerTopTile.tileType.solidity;
            if (solidity instanceof SlopeSolidity && solidity.verticalSolidDirection == -1) {
                // is sloping ceiling
                if (solidity.GetIsPointInSolidSide(this.xMid, this.y, this.layer, centerTopTile)) {
                    var targetY = solidity.GetSlopePoint(this.xMid, this.layer, centerTopTile);
                    var heightToScootDown = targetY - this.y;
                    var floorHeight = this.GetHeightOfSolid(0, 1).yPixel;
                    if (floorHeight > -1) {
                        var footRoom = floorHeight - this.yBottom;
                        if (heightToScootDown > footRoom) {
                            var overshoot = heightToScootDown - footRoom;
                            this.y -= overshoot;
                            this.x -= overshoot * solidity.horizontalSolidDirection;
                        }
                    }
                    this.y = targetY;
                    this.touchedCeilings.push(centerTopTile);
                    if (this.dy < 0)
                        this.dy = 0;
                }
            }
        }
    };
    Sprite.prototype.MoveByVelocity = function () {
        var _this = this;
        this.PushOutOfSlopes();
        this.x += this.GetTotalDx();
        this.y += this.GetTotalDy();
        this.x = +(this.x.toFixed(3));
        this.y = +(this.y.toFixed(3));
        if (this.parentSprite) {
            this.y = this.parentSprite.y - this.height;
        }
        if (this.isPlatform && this.GetTotalDy() > 0) {
            for (var _i = 0, _a = this.layer.sprites.filter(function (a) { return a.parentSprite == _this; }); _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.y += this.GetTotalDy();
            }
        }
    };
    Sprite.prototype.GentlyEjectFromSolids = function () {
        // Push out of solid walls and then reset velocity
        var oldDx = this.dx;
        var oldDy = this.dy;
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
    };
    Sprite.prototype.PushOutOfSlopes = function () {
        if (this.GetTotalDx() != 0 && this.respectsSolidTiles) {
            var footTiles = [this.layer.GetTileByPixel(this.x, this.yBottom), this.layer.GetTileByPixel(this.xRight, this.yBottom)];
            for (var _i = 0, footTiles_1 = footTiles; _i < footTiles_1.length; _i++) {
                var footTile = footTiles_1[_i];
                var footTileSolidity = footTile.tileType.solidity;
                if (footTileSolidity instanceof SlopeSolidity && this.isOnGround) {
                    if (footTileSolidity.verticalSolidDirection == 1 && footTileSolidity.horizontalSolidDirection * this.GetTotalDx() > 0) {
                        if (footTileSolidity.GetIsPointInSolidSide(this.xMid, this.yBottom, this.layer, footTile)) {
                            // may need to duplicate the headroom rollback for ceilings
                            var headRoom = this.y - this.GetHeightOfSolid(0, -1).yPixel;
                            var heightToScootUp = this.GetTotalDx() * footTileSolidity.horizontalSolidDirection;
                            if (heightToScootUp > headRoom) {
                                var yOvershoot = heightToScootUp - headRoom;
                                this.y += yOvershoot;
                                this.x -= yOvershoot * footTileSolidity.horizontalSolidDirection;
                                //console.log("overshoot2", heightToScootUp, headRoom)
                            }
                            if (this.rolls) {
                                this.dy = -this.GetTotalDx() * footTileSolidity.horizontalSolidDirection;
                            }
                            else {
                                this.y -= this.GetTotalDx() * footTileSolidity.horizontalSolidDirection;
                                // does this need to be changed for steeper slopes?
                            }
                            //console.log("push out of slopes")
                        }
                    }
                }
            }
            // maybe todo, might want to do similar corner based checks for ceiling instead of mid based
            var headTile = this.layer.GetTileByPixel(this.xMid, this.y);
            var headTileSolidity = headTile.tileType.solidity;
            if (headTileSolidity instanceof SlopeSolidity && this.isOnCeiling) {
                if (headTileSolidity.verticalSolidDirection == -1 && headTileSolidity.horizontalSolidDirection * this.GetTotalDx() > 0) {
                    if (headTileSolidity.GetIsPointInSolidSide(this.x + this.GetTotalDx(), this.y + this.GetTotalDy(), this.layer, headTile)) {
                        this.y += this.GetTotalDx() * headTileSolidity.horizontalSolidDirection;
                    }
                }
            }
        }
    };
    Sprite.prototype.GetHeightOfSolid = function (xOffset, direction) {
        var _a, _b;
        var bottomY = this.y + (direction == 1 ? this.height : 0);
        var pixelsToCheck = [this.xMid, this.x, this.xRight - 0.01];
        var tileIndexContainingYOfInterest = Math.floor(bottomY / this.layer.tileHeight);
        var startRowIndex = tileIndexContainingYOfInterest;
        var grounds = [];
        var middleSlopeSolidity = null;
        var middleSlopeRowIndex = -1;
        for (var _i = 0, pixelsToCheck_1 = pixelsToCheck; _i < pixelsToCheck_1.length; _i++) {
            var xPixel = pixelsToCheck_1[_i];
            var colIndex = Math.floor((xPixel + xOffset) / this.layer.tileWidth);
            var _loop_1 = function (rowIndex) {
                // only checking next few rows
                if (!this_1.layer.tiles[colIndex])
                    return "continue";
                if (middleSlopeSolidity && rowIndex == middleSlopeRowIndex) {
                    // if we're checking the column towards the slope's fat solid side
                    if ((xPixel - this_1.xMid) * middleSlopeSolidity.horizontalSolidDirection > 0) {
                        return "continue";
                    }
                }
                var tile = this_1.layer.tiles[colIndex][rowIndex];
                var yPixelOfEdge = (rowIndex + (direction == 1 ? 0 : 1)) * this_1.layer.tileHeight;
                if ((_a = this_1.layer.map) === null || _a === void 0 ? void 0 : _a.semisolidLayer.tiles[colIndex]) {
                    var semisolidTile = (_b = this_1.layer.map) === null || _b === void 0 ? void 0 : _b.semisolidLayer.tiles[colIndex][rowIndex];
                    [semisolidTile, tile].forEach(function (t) {
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
                    });
                }
                if (tile) {
                    var isSolid = tile.tileType.solidity == Solidity.Block;
                    if (!isSolid && this_1 instanceof Player)
                        isSolid = tile.tileType.solidity == Solidity.SolidForPlayer;
                    if (!isSolid && !(this_1 instanceof Player))
                        isSolid = tile.tileType.solidity == Solidity.SolidForNonplayer;
                    if (isSolid) {
                        var preceedingNeighbor = this_1.layer.GetTileByIndex(colIndex, rowIndex - direction);
                        var preceedingSolidity = preceedingNeighbor.tileType.solidity;
                        if (preceedingSolidity instanceof SlopeSolidity &&
                            preceedingSolidity.verticalSolidDirection == direction) {
                            return "continue";
                        }
                        // Bumped floor/ceil
                        grounds.push({ tile: tile, yPixel: yPixelOfEdge });
                    }
                }
                if (tile && xPixel === this_1.xMid && tile.tileType.solidity instanceof SlopeSolidity) {
                    var hitSolidSlope = tile.tileType.solidity.verticalSolidDirection == direction;
                    if (hitSolidSlope) {
                        var slopePoint = tile.tileType.solidity.GetSlopePoint(xPixel, this_1.layer, tile);
                        grounds.push({ tile: tile, yPixel: slopePoint });
                        middleSlopeSolidity = tile.tileType.solidity;
                        middleSlopeRowIndex = rowIndex;
                    }
                }
            };
            var this_1 = this;
            for (var rowIndex = startRowIndex; rowIndex !== startRowIndex + 2 * direction; rowIndex += direction) {
                _loop_1(rowIndex);
            }
        }
        if (grounds.length) {
            if (direction == 1) {
                // looking down
                var closestGround_1 = Math.min.apply(Math, grounds.map(function (a) { return a === null || a === void 0 ? void 0 : a.yPixel; }));
                var tiles_1 = grounds.filter(function (a) { return a.yPixel === closestGround_1 && a.tile; }).map(function (a) { return a.tile; }).filter(Utility.OnlyUnique);
                return { tiles: tiles_1, yPixel: closestGround_1 };
            }
            else {
                var closestGround_2 = Math.max.apply(Math, grounds.map(function (a) { return a === null || a === void 0 ? void 0 : a.yPixel; }));
                var tiles_2 = grounds.filter(function (a) { return a.yPixel === closestGround_2 && a.tile; }).map(function (a) { return a.tile; }).filter(Utility.OnlyUnique);
                return { tiles: tiles_2, yPixel: closestGround_2 };
            }
        }
        return { tiles: [], yPixel: -999999 };
    };
    Sprite.prototype.GetDistanceOfWall = function (yOffset, direction) {
        var _a, _b;
        var startingX = this.xMid;
        var spriteSidePixel = direction == 1 ? this.xRight : this.x;
        var footHeight = this.yBottom - 0.01;
        var pixelsToCheck = [this.y, footHeight];
        if (this.height > this.layer.tileHeight) {
            for (var y = this.y + this.layer.tileHeight; y < footHeight; y += this.layer.tileHeight) {
                pixelsToCheck.push(y);
            }
        }
        pixelsToCheck.push();
        var startColIndex = Math.ceil(startingX / this.layer.tileWidth);
        if (direction == -1)
            startColIndex--;
        var wallPixels = [];
        for (var _i = 0, pixelsToCheck_2 = pixelsToCheck; _i < pixelsToCheck_2.length; _i++) {
            var yPixel = pixelsToCheck_2[_i];
            var rowIndex = Math.floor((yPixel + yOffset) / this.layer.tileHeight);
            var _loop_2 = function (colIndex) {
                // only checking next few cols
                if (!this_2.layer.tiles[colIndex])
                    return "continue";
                var tile = this_2.layer.GetTileByIndex(colIndex, rowIndex);
                var semisolidTile = null;
                if ((_a = this_2.layer.map) === null || _a === void 0 ? void 0 : _a.semisolidLayer.tiles[colIndex]) {
                    semisolidTile = (_b = this_2.layer.map) === null || _b === void 0 ? void 0 : _b.semisolidLayer.tiles[colIndex][rowIndex];
                }
                var pixel = (colIndex + (direction == 1 ? 0 : 1)) * this_2.layer.tileWidth;
                [semisolidTile, tile].filter(function (a) { return a; }).forEach(function (t) {
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
                });
                if (tile) {
                    var isSolid = tile.tileType.solidity == Solidity.Block;
                    if (!isSolid && this_2 instanceof Player)
                        isSolid = tile.tileType.solidity == Solidity.SolidForPlayer;
                    if (!isSolid && !(this_2 instanceof Player))
                        isSolid = tile.tileType.solidity == Solidity.SolidForNonplayer;
                    if (isSolid) {
                        var preceedingNeighbor = this_2.layer.GetTileByIndex(colIndex - direction, rowIndex);
                        var preceedingSolidity = preceedingNeighbor.tileType.solidity;
                        if (preceedingSolidity instanceof SlopeSolidity &&
                            preceedingSolidity.horizontalSolidDirection == direction) {
                            return "continue";
                        }
                        // Bumped wall
                        wallPixels.push({ tile: tile, x: pixel });
                    }
                }
            };
            var this_2 = this;
            for (var colIndex = startColIndex; colIndex !== startColIndex + 2 * direction; colIndex += direction) {
                _loop_2(colIndex);
            }
        }
        if (wallPixels.length) {
            var retPixel_1 = direction == 1 ? Math.min.apply(Math, wallPixels.map(function (a) { return a.x; })) : Math.max.apply(Math, wallPixels.map(function (a) { return a.x; }));
            return { tiles: wallPixels.filter(function (a) { return a.x === retPixel_1; }).map(function (a) { return a.tile; }), x: retPixel_1 };
        }
        return { x: -1, tiles: [] };
    };
    Sprite.prototype.GetThumbnail = function () {
        var frameData = this.GetFrameData(0);
        if (this instanceof CameraLockHorizontal) {
            frameData = {
                imageTile: tiles["camera"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        if (this instanceof CameraScrollTrigger) {
            frameData = {
                imageTile: tiles["camera"][this.frameCol][1],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        if (this instanceof CameraZoomTrigger) {
            frameData = {
                imageTile: tiles["camera"][this.frameCol][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        var imageTile = ('xFlip' in frameData) ? frameData.imageTile : frameData[frameData.length - 1].imageTile;
        return imageTile;
    };
    Sprite.prototype.AccelerateHorizontally = function (acceleration, targetDx) {
        this.dx += acceleration * (targetDx > this.dx ? 1 : -1);
        if (this.dx > targetDx && targetDx >= 0 && Math.abs(this.dx - targetDx) < acceleration)
            this.dx = targetDx;
        if (this.dx < targetDx && targetDx <= 0 && Math.abs(this.dx - targetDx) < acceleration)
            this.dx = targetDx;
        if (this instanceof SapphireSnail && debugMode)
            console.log(acceleration, targetDx, this.dx);
    };
    Sprite.prototype.AccelerateVertically = function (acceleration, targetDy) {
        this.dy += acceleration * (targetDy > this.dy ? 1 : -1);
        if (this.dy > targetDy && targetDy >= 0 && Math.abs(this.dy - targetDy) < acceleration)
            this.dy = targetDy;
        if (this.dy < targetDy && targetDy <= 0 && Math.abs(this.dy - targetDy) < acceleration)
            this.dy = targetDy;
    };
    Sprite.prototype.ReplaceWithSprite = function (newSprite) {
        var _this = this;
        this.layer.sprites.push(newSprite);
        this.layer.sprites = this.layer.sprites.filter(function (a) { return a != _this; });
        newSprite.x = this.x + this.width / 2 - newSprite.width / 2;
        newSprite.y = this.y + this.height / 2 - newSprite.height / 2;
        newSprite.dx = this.dx;
        newSprite.dy = this.dy;
        this.isActive = false;
        return newSprite;
    };
    Sprite.prototype.ReplaceWithSpriteType = function (newSpriteType) {
        var newSprite = new newSpriteType(this.x, this.y, this.layer, []);
        return this.ReplaceWithSprite(newSprite);
    };
    Sprite.prototype.OnBeforeDraw = function (camera) { };
    Sprite.prototype.OnAfterDraw = function (camera) { };
    return Sprite;
}());
