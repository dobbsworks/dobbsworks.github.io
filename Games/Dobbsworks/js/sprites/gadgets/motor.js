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
        _this.wireColor = "#222";
        _this.wireDrawBottomSpace = 11;
        _this.connectionDirectionY = 1;
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
        var possibleConnectionSprites = this.connectionDirectionY == 1 ?
            this.layer.sprites.filter(function (a) { return a.x < _this.xRight && a.xRight > _this.x && a.y >= _this.yBottom && a.canMotorHold; }) :
            this.layer.sprites.filter(function (a) { return a.x < _this.xRight && a.xRight > _this.x && a.yBottom <= _this.y && a.canMotorHold; });
        if (possibleConnectionSprites.length == 0) {
            return;
        }
        if (this.connectionDirectionY == 1)
            possibleConnectionSprites.sort(function (a, b) { return a.y - b.y; });
        if (this.connectionDirectionY == -1)
            possibleConnectionSprites.sort(function (a, b) { return -a.y + b.y; });
        this.connectedSprite = possibleConnectionSprites[0];
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
        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            var playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            }
            else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        }
    };
    Motor.prototype.UpdateConnectedSprite = function (sprite) {
        if (!sprite)
            return;
        if (!sprite.updatedThisFrame) {
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
            sprite.updatedThisFrame = true;
        }
    };
    Motor.prototype.HandlePlayerGrab = function (sprite) {
        var players = this.layer.sprites.filter(function (a) { return a instanceof Player; });
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player_1 = players_1[_i];
            if (player_1.heldItem == sprite && player_1.heldItem.canBeHeld) {
                return true;
            }
        }
        return false;
    };
    Motor.prototype.MoveConnectedSprite = function (sprite) {
        if (sprite instanceof Enemy) {
            sprite.direction = this.horizontalDirection;
        }
        sprite.x = this.xMid - sprite.width / 2;
        sprite.y = this.y + this.connectionDistance;
        sprite.dx = this.dx;
        sprite.dy = this.dy;
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
    Motor.prototype.OnBeforeDraw = function (camera) {
        if (this.connectionDistance == 0 || this.connectedSprite == null)
            return;
        var x = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        var yGameStart = (this.connectionDirectionY == 1) ? (this.y + this.wireDrawBottomSpace) : this.y + 2;
        var y = (yGameStart - camera.y) * camera.scale + camera.canvas.height / 2;
        var yGameEnd = (this.connectionDirectionY == 1) ? this.connectedSprite.y : this.connectedSprite.yBottom;
        var drawHeight = (yGameEnd - yGameStart) * camera.scale;
        camera.ctx.fillStyle = this.wireColor;
        camera.ctx.fillRect(x - 0.5 * camera.scale, y, 1 * camera.scale, drawHeight);
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
var UpwardMotor = /** @class */ (function (_super) {
    __extends(UpwardMotor, _super);
    function UpwardMotor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.motorSpeed = 0.5;
        _this.frameX = 0;
        _this.frameY = 4;
        _this.connectionDirectionY = -1;
        return _this;
    }
    return UpwardMotor;
}(Motor));
var FerrisMotorRight = /** @class */ (function (_super) {
    __extends(FerrisMotorRight, _super);
    function FerrisMotorRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.connectedSprites = [];
        _this.angle = 0;
        _this.direction = 1;
        return _this;
    }
    FerrisMotorRight.prototype.Initialize = function () {
        var _this = this;
        _super.prototype.Initialize.call(this);
        if (this.connectedSprite) {
            if (!(this.connectedSprite instanceof Checkpoint)) {
                this.connectionDistance = this.connectedSprite.yMid - this.yMid;
                this.connectedSprites.push(this.connectedSprite);
                var spriteFromEditor = editorHandler.sprites.find(function (a) { return a.spriteInstance == _this.connectedSprite; });
                if (spriteFromEditor) {
                    for (var i = 1; i < 4; i++) {
                        var spriteType = this.connectedSprite.constructor;
                        var instance = new spriteType(spriteFromEditor.tileCoord.tileX * this.layer.tileWidth, spriteFromEditor.tileCoord.tileY * this.layer.tileHeight, currentMap.mainLayer, spriteFromEditor.editorProps);
                        this.connectedSprites.push(instance);
                        this.layer.sprites.push(instance);
                    }
                }
            }
            this.spinSpeed = 0.02 / this.connectionDistance * 24 * this.direction;
        }
    };
    FerrisMotorRight.prototype.Update = function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        this.angle += this.spinSpeed;
        for (var _i = 0, _a = this.connectedSprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            if (!sprite)
                continue;
            this.UpdateConnectedSprite(sprite);
            this.MoveConnectedSprite(sprite);
            var spriteIndex = this.connectedSprites.indexOf(sprite);
            var playerGrabbed = this.HandlePlayerGrab(sprite);
            if (playerGrabbed) {
                this.connectedSprites[spriteIndex] = null;
            }
            else {
                this.MoveConnectedSpriteToAngle(sprite, this.angle + (Math.PI / 2 * spriteIndex));
            }
        }
    };
    FerrisMotorRight.prototype.MoveConnectedSpriteToAngle = function (sprite, angle) {
        var x = Math.cos(angle) * this.connectionDistance;
        var y = Math.sin(angle) * this.connectionDistance;
        var speed = this.connectionDistance * this.spinSpeed;
        var dx = Math.cos(angle + Math.PI / 2) * speed;
        var dy = Math.sin(angle + Math.PI / 2) * speed;
        if (sprite instanceof Enemy) {
            sprite.direction = dx > 0 ? 1 : -1;
        }
        sprite.x = this.xMid - sprite.width / 2 + x;
        sprite.y = this.yMid - sprite.height / 2 + y;
        sprite.dx = this.dx + dx;
        sprite.dy = this.dy + dy;
    };
    FerrisMotorRight.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["motorTrack"][2][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    FerrisMotorRight.prototype.OnBeforeDraw = function (camera) {
        if (this.connectionDistance == 0 || this.connectedSprites.length == 0)
            return;
        camera.ctx.fillStyle = "#724200";
        for (var i = 0; i < 4; i++) {
            var angle = this.angle + i * Math.PI / 2;
            //let sprite = this.connectedSprites[i];
            for (var r = 6; r < this.connectionDistance; r += 6) {
                var gameX = r * Math.cos(angle) + this.xMid - 1;
                var gameY = r * Math.sin(angle) + this.yMid - 1;
                var destX = (gameX - camera.x) * camera.scale + camera.canvas.width / 2;
                var destY = (gameY - camera.y) * camera.scale + camera.canvas.height / 2;
                camera.ctx.fillRect(destX, destY, 2 * camera.scale, 2 * camera.scale);
            }
        }
    };
    return FerrisMotorRight;
}(Motor));
var FerrisMotorLeft = /** @class */ (function (_super) {
    __extends(FerrisMotorLeft, _super);
    function FerrisMotorLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = -1;
        return _this;
    }
    return FerrisMotorLeft;
}(FerrisMotorRight));
var FastFerrisMotorLeft = /** @class */ (function (_super) {
    __extends(FastFerrisMotorLeft, _super);
    function FastFerrisMotorLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = -2;
        return _this;
    }
    return FastFerrisMotorLeft;
}(FerrisMotorRight));
var FastFerrisMotorRight = /** @class */ (function (_super) {
    __extends(FastFerrisMotorRight, _super);
    function FastFerrisMotorRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = 2;
        return _this;
    }
    return FastFerrisMotorRight;
}(FerrisMotorRight));
