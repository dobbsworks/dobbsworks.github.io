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
        _this.canBeBouncedOn = false;
        _this.canSpinBounceOn = true;
        _this.horizontalLookDirection = -1;
        _this.verticalLookDirection = -1;
        _this.canSeePlayer = false;
        _this.moveDir = 0;
        return _this;
    }
    Wallop.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        var players = currentMap.mainLayer.sprites.filter(function (a) { return a instanceof Player; });
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player_1 = players_1[_i];
            var verticalDistance = this.yMid - player_1.yMid;
            var horizontalDistance = this.xMid - player_1.xMid;
            this.verticalLookDirection = verticalDistance > 0 ? -1 : 1;
            this.horizontalLookDirection = horizontalDistance > 0 ? -1 : 1;
            this.canSeePlayer = Math.abs(horizontalDistance) < 48 && verticalDistance < 0 && verticalDistance > -120;
            if (this.canSeePlayer && Math.abs(horizontalDistance) < 15) {
                this.moveDir = 1;
            }
        }
        if (this.isOnGround)
            this.moveDir = 0;
        if (this.moveDir == 1)
            this.dy += 0.3;
        if (this.dy > 3)
            this.dy = 3;
    };
    Wallop.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.canSeePlayer) {
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == 1)
                col = 5;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == 1)
                col = 4;
            if (this.horizontalLookDirection == 1 && this.verticalLookDirection == -1)
                col = 3;
            if (this.horizontalLookDirection == -1 && this.verticalLookDirection == -1)
                col = 2;
        }
        if (this.moveDir != 0)
            col = 1;
        return {
            imageTile: tiles["wallop"][col][2],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Wallop;
}(Enemy));
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
            }
        }
        else if (this.state == 2) {
            // stare at player, wiggle?
            if (this.isOnGround)
                this.stareTimer++;
            this.dx = 0;
            if (this.target && this.target.xMid < this.xMid) {
                this.direction = -1;
            }
            else {
                this.direction = 1;
            }
            if (this.stareTimer >= 120) {
                this.state = 3;
                this.stareTimer = 0;
                //launch
                if (this.target) {
                    var angle = Math.atan2(this.target.yMid - this.yMid, this.target.xMid - this.xMid);
                    var power = 2.5;
                    this.dx = power * Math.cos(angle);
                    this.dy = power * Math.sin(angle);
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
            yOffset: yOffset
        };
    };
    return Wallopeño;
}(Enemy));
