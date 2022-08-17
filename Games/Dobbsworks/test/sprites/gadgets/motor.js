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
var Motor = /** @class */ (function (_super) {
    __extends(Motor, _super);
    function Motor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.isInitialized = false;
        _this.connectedSprite = null;
        _this.connectionDistance = 0;
        _this.isOnTrack = false;
        _this.motorSpeed = 0.5;
        _this.motorSpeedRatio = 1; // for connected sprite to slow down motor in some situations
        _this.trackTile = null;
        _this.horizontalDirection = 1;
        _this.verticalDirection = -1;
        _this.frame = 0;
        _this.frameX = 0;
        _this.frameY = 0;
        return _this;
    }
    Motor.prototype.Initialize = function () {
        var _this = this;
        var currentTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor();
        if (currentTile === null || currentTile === void 0 ? void 0 : currentTile.tileType.isTrack)
            this.isOnTrack = true;
        // find closest non-player sprite below motor
        var spritesBelow = this.layer.sprites.filter(function (a) { return a.x < _this.xRight && a.xRight > _this.x && a.y > _this.yBottom && a.canMotorHold; });
        if (spritesBelow.length == 0) {
            return;
        }
        spritesBelow.sort(function (a, b) { return a.y - b.y; });
        this.connectedSprite = spritesBelow[0];
        this.connectionDistance = this.connectedSprite.y - this.y;
    };
    Motor.prototype.GetTileRatio = function (num) {
        return (num % 12) / 12;
    };
    Motor.prototype.Update = function () {
        var _a, _b;
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        var oldTrack = this.trackTile;
        this.trackTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor() || null;
        if (this.isOnTrack && ((_a = this.trackTile) === null || _a === void 0 ? void 0 : _a.tileType.isTrack)) {
            if ((oldTrack === null || oldTrack === void 0 ? void 0 : oldTrack.tileType) != this.trackTile.tileType && oldTrack != null) {
                if (oldTrack.tileType == TileType.TrackVertical || oldTrack.tileType == TileType.TrackTopCap || oldTrack.tileType == TileType.TrackBottomCap) {
                    if (this.trackTile.tileType.trackCurveHorizontalDirection != 0) {
                        this.horizontalDirection = this.trackTile.tileType.trackCurveHorizontalDirection || 1;
                        this.verticalDirection = this.trackTile.tileType.trackCurveVerticalDirection == 1 ? -1 : 1;
                    }
                }
                if (oldTrack.tileType == TileType.TrackHorizontal || oldTrack.tileType == TileType.TrackLeftCap || oldTrack.tileType == TileType.TrackRightCap) {
                    if (this.trackTile.tileType.trackCurveHorizontalDirection != 0) {
                        this.verticalDirection = this.trackTile.tileType.trackCurveVerticalDirection || 1;
                        this.horizontalDirection = this.trackTile.tileType.trackCurveHorizontalDirection == 1 ? -1 : 1;
                    }
                }
                if (this.trackTile.tileType == TileType.TrackVertical || this.trackTile.tileType == TileType.TrackTopCap || this.trackTile.tileType == TileType.TrackBottomCap) {
                    this.verticalDirection = oldTrack.tileType.trackCurveVerticalDirection || this.verticalDirection;
                }
                if (this.trackTile.tileType == TileType.TrackHorizontal || this.trackTile.tileType == TileType.TrackLeftCap || this.trackTile.tileType == TileType.TrackRightCap) {
                    this.horizontalDirection = oldTrack.tileType.trackCurveHorizontalDirection || this.horizontalDirection;
                }
            }
            if (this.trackTile.tileType == TileType.TrackLeftCap && this.GetTileRatio(this.xMid) <= 0.5) {
                this.horizontalDirection = 1;
            }
            if (this.trackTile.tileType == TileType.TrackRightCap && this.GetTileRatio(this.xMid) >= 0.5) {
                this.horizontalDirection = -1;
            }
            if (this.trackTile.tileType == TileType.TrackBottomCap && this.GetTileRatio(this.yMid) >= 0.5) {
                this.verticalDirection = -1;
            }
            if (this.trackTile.tileType == TileType.TrackTopCap && this.GetTileRatio(this.yMid) <= 0.5) {
                this.verticalDirection = 1;
            }
            var targetSpeed = this.trackTile.tileType.trackDirectionEquation(this.GetTileRatio(this.xMid), this.GetTileRatio(this.yMid));
            var speedRatio = 1;
            if (this.trackTile.tileType.isTrackCap) {
                var distanceFromCenter = Math.abs(this.GetTileRatio(this.xMid) - 0.5) + Math.abs(this.GetTileRatio(this.yMid) - 0.5);
                distanceFromCenter = Math.max(0, Math.min(0.5, distanceFromCenter)) * 2; // distance is [0, 1]
                var distanceToCircleMap = Math.sqrt(-(Math.pow((distanceFromCenter - 1), 2)) + 1.1);
                speedRatio = distanceToCircleMap;
            }
            speedRatio *= this.motorSpeed * this.motorSpeedRatio;
            var horizDir = this.horizontalDirection * (speedRatio >= 0 ? 1 : -1);
            var vertDir = this.verticalDirection * (speedRatio >= 0 ? 1 : -1);
            this.frame += speedRatio;
            var targetPoint = this.trackTile.tileType.trackEquation(this.GetTileRatio(this.xMid) + this.GetTileRatio(Math.abs(targetSpeed.dx * speedRatio) * horizDir), this.GetTileRatio(this.yMid) + this.GetTileRatio(Math.abs(targetSpeed.dy * speedRatio) * vertDir));
            this.dx = (this.xMid - this.xMid % 12) + targetPoint.x * 12 - this.xMid;
            this.dy = (this.yMid - this.yMid % 12) + targetPoint.y * 12 - this.yMid;
            this.MoveByVelocity();
        }
        else {
            this.isOnTrack = false;
            this.ApplyGravity();
            var oldX = this.x;
            var oldY = this.y;
            this.MoveByVelocity();
            if ((_b = this.trackTile) === null || _b === void 0 ? void 0 : _b.tileType.isTrack) {
                var previousTile = this.layer.GetTileByPixel(oldX + this.width / 2, oldY + this.height / 2).GetWireNeighbor();
                if (this.trackTile == previousTile) {
                    // check if we "crossed" the track
                    var crossedTrack = this.trackTile.tileType.trackCrossedEquation(this.GetTileRatio(oldX), this.GetTileRatio(oldY), this.GetTileRatio(this.x), this.GetTileRatio(this.y));
                    if (crossedTrack)
                        this.isOnTrack = true;
                }
            }
        }
        if (!this.trackTile)
            this.isOnTrack = false;
        this.MoveConnectedSprite();
    };
    Motor.prototype.MoveConnectedSprite = function () {
        if (!this.connectedSprite)
            return;
        if (!this.connectedSprite.updatedThisFrame) {
            this.connectedSprite.Update();
            this.connectedSprite.updatedThisFrame = true;
        }
        var player = this.layer.sprites.find(function (a) { return a instanceof Player; });
        if (player) {
            if (player.heldItem == this.connectedSprite && player.heldItem.canBeHeld) {
                this.connectedSprite = null;
                return;
            }
        }
        if (this.connectedSprite instanceof Enemy) {
            this.connectedSprite.direction = this.horizontalDirection;
        }
        this.connectedSprite.x = this.xMid - this.connectedSprite.width / 2;
        this.connectedSprite.y = this.y + this.connectionDistance;
        this.connectedSprite.dx = this.dx;
        this.connectedSprite.dy = this.dy;
    };
    Motor.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(Math.abs(this.frame) / 4) % 2;
        return {
            imageTile: tiles["motorTrack"][col + this.frameX][this.frameY],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    Motor.prototype.OnAfterDraw = function (camera) {
        if (this.connectionDistance == 0)
            return;
        var x = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        var y = (this.yBottom - camera.y) * camera.scale + camera.canvas.height / 2;
        camera.ctx.fillStyle = "#222";
        camera.ctx.fillRect(x - 0.5 * camera.scale, y - 1 * camera.scale, 1 * camera.scale, (this.connectionDistance - 11) * camera.scale);
    };
    return Motor;
}(Sprite));
var SlowMotor = /** @class */ (function (_super) {
    __extends(SlowMotor, _super);
    function SlowMotor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.motorSpeed = 0.25;
        _this.frameX = 0;
        _this.frameY = 3;
        return _this;
    }
    return SlowMotor;
}(Motor));
var FastMotor = /** @class */ (function (_super) {
    __extends(FastMotor, _super);
    function FastMotor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.motorSpeed = 1;
        _this.frameX = 2;
        _this.frameY = 3;
        return _this;
    }
    return FastMotor;
}(Motor));
