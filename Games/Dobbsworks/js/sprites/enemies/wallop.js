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
var Wallop = /** @class */ (function (_super) {
    __extends(Wallop, _super);
    function Wallop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.killedByProjectiles = false;
        _this.canBeBouncedOn = false;
        _this.canSpinBounceOn = true;
        _this.isSolidBox = true;
        _this.horizontalLookDirection = -1;
        _this.verticalLookDirection = -1;
        _this.canSeePlayer = false;
        _this.frameRow = 2;
        _this.waitTimer = 0;
        _this.watchDirections = [Direction.Down, Direction.Up];
        _this.moveDirection = null;
        _this.maxSpeed = 2.0;
        _this.accel = 0.2;
        _this.directLookDistance = 120;
        _this.directActiveDistance = 120;
        _this.peripheryLookDistance = 48;
        _this.peripheryActiveDistance = 24;
        _this.collideSound = "thump";
        _this.initialized = false;
        return _this;
    }
    Object.defineProperty(Wallop, "clockwiseRotationSprite", {
        get: function () { return WallopSlider; },
        enumerable: false,
        configurable: true
    });
    Wallop.prototype.Initialize = function () {
        this.initialized = true;
        if (this.watchDirections.length == 1) {
            // only looking down, for example
            if (this.IsTileSolid(this.watchDirections[0])) {
                this.watchDirections[0] = this.watchDirections[0].Opposite();
            }
        }
    };
    Wallop.prototype.IsTileSolid = function (dir) {
        var xs = [this.xMid];
        var ys = [this.yMid];
        if (this.width > 12 && dir.x == 0)
            xs = [this.xMid, this.x + 1, this.xRight - 1];
        if (this.height > 12 && dir.y == 0)
            ys = [this.yMid, this.y + 1, this.yBottom - 1];
        for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
            var x = xs_1[_i];
            for (var _a = 0, ys_1 = ys; _a < ys_1.length; _a++) {
                var y = ys_1[_a];
                var tileInDirection = this.layer.GetTileByPixel(x + dir.x * (6 + this.width / 2), y + dir.y * (6 + this.height / 2));
                if (tileInDirection.tileType.solidity.IsSolidInDirection(dir))
                    return true;
            }
        }
        return false;
    };
    Wallop.prototype.Update = function () {
        if (!this.initialized)
            this.Initialize();
        if (!this.WaitForOnScreen())
            return;
        this.dxFromPlatform = 0;
        if (!this.moveDirection) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
        var players = currentMap.mainLayer.sprites.filter(function (a) { return a instanceof Player; });
        if (this.waitTimer > 0) {
            this.waitTimer--;
        }
        else if (this.moveDirection == null) {
            for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                var player_1 = players_1[_i];
                var verticalDistance = player_1.yMid - this.yMid;
                var horizontalDistance = player_1.xMid - this.xMid;
                this.verticalLookDirection = verticalDistance < 0 ? -1 : 1;
                this.horizontalLookDirection = horizontalDistance < 0 ? -1 : 1;
                this.canSeePlayer = false;
                for (var _a = 0, _b = this.watchDirections; _a < _b.length; _a++) {
                    var dir = _b[_a];
                    var directDistance = verticalDistance * dir.y + horizontalDistance * dir.x;
                    var peripheryDistance = verticalDistance * dir.x + horizontalDistance * dir.y;
                    var canSee = Math.abs(peripheryDistance) < this.peripheryLookDistance &&
                        directDistance > 0 &&
                        directDistance < this.directLookDistance;
                    if (canSee)
                        this.canSeePlayer = true;
                    var canActivate = Math.abs(peripheryDistance) < this.peripheryActiveDistance &&
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
            if (this.moveDirection == Direction.Up)
                this.parentSprite = null;
            if (this.isBlocked(this.moveDirection)) {
                this.OnSlam(this.moveDirection);
                if (this.moveDirection.x == 0)
                    this.dy = 0;
                if (this.moveDirection.y == 0)
                    this.dx = 0;
                this.moveDirection = null;
                this.watchDirections = this.watchDirections.map(function (a) { return a.Opposite(); });
                this.waitTimer = 30;
                audioHandler.PlaySound(this.collideSound, false);
            }
        }
        if (this.moveDirection) {
            this.dx += this.accel * this.moveDirection.x;
            this.dy += this.accel * this.moveDirection.y;
        }
        if (this.dy > this.maxSpeed)
            this.dy = this.maxSpeed;
        if (this.dy < -this.maxSpeed)
            this.dy = -this.maxSpeed;
        if (this.dx > this.maxSpeed)
            this.dx = this.maxSpeed;
        if (this.dx < -this.maxSpeed)
            this.dx = -this.maxSpeed;
    };
    Wallop.prototype.OnSlam = function (dir) { };
    Wallop.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.moveDirection) {
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == 1)
                col = 5;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == 1)
                col = 4;
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == -1)
                col = 3;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == -1)
                col = 2;
        }
        else if (this.canSeePlayer)
            col = 1;
        var ret = [];
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
    };
    return Wallop;
}(Enemy));
var WallopPlatform = /** @class */ (function (_super) {
    __extends(WallopPlatform, _super);
    function WallopPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.canSpinBounceOn = false;
        _this.frameRow = 3;
        _this.isSolidBox = true;
        return _this;
    }
    Object.defineProperty(WallopPlatform, "clockwiseRotationSprite", {
        get: function () { return WallopPlatformSlider; },
        enumerable: false,
        configurable: true
    });
    return WallopPlatform;
}(Wallop));
var WallopSlider = /** @class */ (function (_super) {
    __extends(WallopSlider, _super);
    function WallopSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.watchDirections = [Direction.Left, Direction.Right];
        return _this;
    }
    Object.defineProperty(WallopSlider, "clockwiseRotationSprite", {
        get: function () { return Wallop; },
        enumerable: false,
        configurable: true
    });
    return WallopSlider;
}(Wallop));
var WallopPlatformSlider = /** @class */ (function (_super) {
    __extends(WallopPlatformSlider, _super);
    function WallopPlatformSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.watchDirections = [Direction.Left, Direction.Right];
        return _this;
    }
    Object.defineProperty(WallopPlatformSlider, "clockwiseRotationSprite", {
        get: function () { return WallopPlatform; },
        enumerable: false,
        configurable: true
    });
    return WallopPlatformSlider;
}(WallopPlatform));
var BigWallop = /** @class */ (function (_super) {
    __extends(BigWallop, _super);
    function BigWallop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 36;
        _this.height = 36;
        _this.frameRow = 0;
        _this.maxSpeed = 2.0;
        _this.accel = 0.025;
        _this.peripheryLookDistance = 60;
        _this.peripheryActiveDistance = 36;
        _this.watchDirections = [Direction.Down];
        _this.collideSound = "bigcrash";
        return _this;
    }
    Object.defineProperty(BigWallop, "clockwiseRotationSprite", {
        get: function () { return BigWallopSlider; },
        enumerable: false,
        configurable: true
    });
    BigWallop.prototype.OnSlam = function (dir) {
        if (this.IsOnScreen()) {
            camera.shakeTimerX = 50 * Math.abs(dir.x);
            camera.shakeTimerY = 50 * Math.abs(dir.y);
        }
    };
    BigWallop.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.moveDirection) {
            col = 2;
        }
        else if (this.canSeePlayer) {
            col = 1;
        }
        var ret = [];
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
    };
    return BigWallop;
}(Wallop));
var BigWallopSlider = /** @class */ (function (_super) {
    __extends(BigWallopSlider, _super);
    function BigWallopSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.watchDirections = [Direction.Left, Direction.Right];
        return _this;
    }
    Object.defineProperty(BigWallopSlider, "clockwiseRotationSprite", {
        get: function () { return BigWallop; },
        enumerable: false,
        configurable: true
    });
    return BigWallopSlider;
}(BigWallop));
var BigWallopPlatform = /** @class */ (function (_super) {
    __extends(BigWallopPlatform, _super);
    function BigWallopPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.watchDirections = [Direction.Down];
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.canSpinBounceOn = false;
        _this.frameRow = 1;
        _this.isSolidBox = true;
        return _this;
    }
    Object.defineProperty(BigWallopPlatform, "clockwiseRotationSprite", {
        get: function () { return BigWallopPlatformSlider; },
        enumerable: false,
        configurable: true
    });
    return BigWallopPlatform;
}(BigWallop));
var BigWallopPlatformSlider = /** @class */ (function (_super) {
    __extends(BigWallopPlatformSlider, _super);
    function BigWallopPlatformSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.watchDirections = [Direction.Left, Direction.Right];
        return _this;
    }
    Object.defineProperty(BigWallopPlatformSlider, "clockwiseRotationSprite", {
        get: function () { return BigWallopPlatform; },
        enumerable: false,
        configurable: true
    });
    return BigWallopPlatformSlider;
}(BigWallopPlatform));
var Wallopeño = /** @class */ (function (_super) {
    __extends(Wallopeño, _super);
    function Wallopeño() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 6;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.canSpinBounceOn = true;
        _this.state = 1;
        _this.target = null;
        _this.dRotation = 0;
        _this._rotation = 0;
        _this.walkCycleTimer = 0;
        _this.walkWindUpTimer = 0;
        _this.stareTimer = 0;
        _this.maxStareTimer = 50;
        _this.resetTimer = 0;
        _this.isSpinning = false;
        return _this;
    }
    Object.defineProperty(Wallopeño.prototype, "safeRotation", {
        get: function () {
            return Math.round((this._rotation % 6) + 6) % 6;
        },
        enumerable: false,
        configurable: true
    });
    Wallopeño.prototype.Update = function () {
        var _this = this;
        if (!this.WaitForOnScreen())
            return;
        if (this.state != 3)
            this.ApplyGravity();
        this.ApplyInertia();
        if (this.state == 1) {
            // idle walk
            this.dRotation -= 0.01 * this.direction;
            if (this.dRotation > 0.5)
                this.dRotation = 0.5;
            if (this.dRotation < -0.5)
                this.dRotation = -0.5;
            this._rotation += this.dRotation;
            var theta = this.safeRotation / 6 * (Math.PI);
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
            var p = this.layer.sprites.find(function (a) { return a instanceof Player &&
                ((_this.direction == -1 && a.xMid < _this.xMid && a.xMid > _this.xMid - 50) ||
                    (_this.direction == 1 && a.xMid > _this.xMid && a.xMid < _this.xMid + 50)) &&
                _this.yMid > a.yMid && _this.yMid < a.yMid + 80; });
            if (p && this.isOnGround) {
                this.target = p;
                this.state = 2;
                this.stareTimer = 0;
                this._rotation = 0;
                audioHandler.PlaySound("throw", true);
            }
        }
        else if (this.state == 2) {
            // stare at player, wiggle?
            this.dx = 0;
            if (this.isOnGround) {
                this.stareTimer++;
            }
            else {
                this.state = 4;
            }
            this._rotation += this.direction * 0.25;
            if (this.target && this.target.xMid < this.xMid) {
                this.direction = -1;
            }
            else {
                this.direction = 1;
            }
            if (this.stareTimer >= this.maxStareTimer) {
                this.state = 3;
                this.stareTimer = 0;
                //launch
                if (this.target) {
                    var angle = Math.atan2(this.target.yMid - this.yMid, this.target.xMid - this.xMid);
                    var power = 2.0;
                    this.dx = power * Math.cos(angle);
                    this.dy = power * Math.sin(angle);
                    audioHandler.PlaySound("bwump", true);
                }
            }
        }
        else if (this.state == 3) {
            // launching at player
            this._rotation += -this.direction * 0.5;
            if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0 || this.touchedCeilings.length > 0 || this.isOnGround) {
                this.state = 4;
                this.dx = 0;
            }
        }
        else if (this.state == 4) {
            // falling 
            this._rotation += -this.direction * 0.2;
            if (this.isOnGround) {
                this._rotation = 0;
                this.state = 5;
                this.resetTimer = 0;
            }
        }
        else if (this.state == 5) {
            this.resetTimer++;
            if (this.resetTimer >= 30) {
                this.state = 1;
            }
        }
    };
    Wallopeño.prototype.GetFrameData = function (frameNum) {
        var frame = this.safeRotation;
        var yOffset = 6;
        if (this.isSpinning) {
            if (frame == 2 || frame == 3 || frame == 4)
                yOffset = 7;
        }
        return {
            imageTile: tiles["wallop"][frame][this.direction == 1 ? 0 : 1],
            xFlip: false,
            yFlip: false,
            xOffset: 3 + Math.sin(this.stareTimer / 2) / 2,
            yOffset: yOffset + Math.sin(this.stareTimer / this.maxStareTimer * (Math.PI)) * 5
        };
    };
    return Wallopeño;
}(Enemy));
