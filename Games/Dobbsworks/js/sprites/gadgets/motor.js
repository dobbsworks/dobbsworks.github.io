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
        _this.frame = 0;
        _this.frameX = 0;
        _this.frameY = 0;
        _this.direction = Direction.Right;
        return _this;
    }
    Motor.prototype.OnEnterPipe = function () {
        this.connectedSprite = null;
    };
    Motor.prototype.Initialize = function () {
        var _this = this;
        var currentTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor();
        if (currentTile === null || currentTile === void 0 ? void 0 : currentTile.tileType.trackDirections.length)
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
        var targetAlreadyOnMotor = this.layer.sprites.some(function (a) { return a instanceof Motor && a.connectedSprite == possibleConnectionSprites[0]; });
        if (!targetAlreadyOnMotor) {
            this.connectedSprite = possibleConnectionSprites[0];
            this.connectionDistance = this.connectedSprite.y - this.y;
        }
        else {
            // Below comment block can duplicate already held sprites (useful for ferris motor setups)
            var targetSprite = possibleConnectionSprites[0];
            var spriteType = targetSprite.constructor;
            this.connectedSprite = new spriteType(targetSprite.x, targetSprite.y, targetSprite.layer, []);
            this.layer.sprites.push(this.connectedSprite);
            this.connectionDistance = this.connectedSprite.y - this.y;
        }
    };
    Motor.prototype.GetTileRatio = function (num) {
        return (num % 12) / 12;
    };
    Motor.prototype.Update = function () {
        var _this = this;
        var _a, _b;
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        var parentMotor = this.layer.sprites.find(function (a) { return a instanceof Motor && a.connectedSprite == _this; });
        if (!parentMotor) {
            this.trackTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor() || null;
            if (this.isOnTrack && ((_a = this.trackTile) === null || _a === void 0 ? void 0 : _a.tileType.trackDirections.length)) {
                var trackDirections = this.trackTile.tileType.trackDirections;
                var tileXMid = this.trackTile.tileX * 12 + 6;
                var tileYMid = this.trackTile.tileY * 12 + 6;
                var speedRatio = 1;
                if (this.trackTile.tileType.trackDirections.length == 1) {
                    var distanceFromCenter = Math.abs(this.GetTileRatio(this.xMid) - 0.5) + Math.abs(this.GetTileRatio(this.yMid) - 0.5);
                    distanceFromCenter = Math.max(0, Math.min(0.5, distanceFromCenter)) * 2; // distance is [0, 1]
                    var distanceToCircleMap = Math.sqrt(-(Math.pow((distanceFromCenter - 1), 2)) + 1.1);
                    speedRatio = distanceToCircleMap;
                }
                speedRatio *= this.motorSpeed * this.motorSpeedRatio;
                this.frame += speedRatio;
                if (trackDirections.length == 1) {
                    // TRACK CAP
                    // +-----------+
                    // |           |
                    // |           |
                    // |     o     |
                    // |     |     |
                    // |     |     |
                    // +-----------+
                    // safety to keep direction lined up
                    if (this.direction != trackDirections[0] && this.direction != trackDirections[0].Opposite()) {
                        this.direction = trackDirections[0];
                    }
                    if (this.direction == trackDirections[0].Opposite()) {
                        if (this.direction == Direction.Up && this.yMid % 12 < 6) {
                            this.direction = Direction.Down;
                            this.y -= this.yMid % 12 - 6;
                        }
                        if (this.direction == Direction.Down && this.yMid % 12 > 6) {
                            this.direction = Direction.Up;
                            this.y -= this.yMid % 12 - 6;
                        }
                        if (this.direction == Direction.Left && this.xMid % 12 < 6) {
                            this.direction = Direction.Right;
                            this.x -= this.xMid % 12 - 6;
                        }
                        if (this.direction == Direction.Right && this.xMid % 12 > 6) {
                            this.direction = Direction.Left;
                            this.x -= this.xMid % 12 - 6;
                        }
                    }
                    this.dx = speedRatio * this.direction.x;
                    this.dy = speedRatio * this.direction.y;
                    if (this.direction.x == 0)
                        this.x -= this.x % 12;
                    if (this.direction.y == 0)
                        this.y -= this.y % 12;
                }
                else if (trackDirections.length == 4) {
                    // TRACK BRIDGE
                    // +-----------+
                    // |     |     |
                    // |     |     |
                    // |-----+-----|
                    // |     |     |
                    // |     |     |
                    // +-----------+
                    this.dx = speedRatio * this.direction.x;
                    this.dy = speedRatio * this.direction.y;
                    if (this.direction.x == 0)
                        this.x = this.trackTile.tileX * 12;
                    if (this.direction.y == 0)
                        this.y = this.trackTile.tileY * 12;
                }
                else if (trackDirections[0] == trackDirections[1].Opposite()) {
                    // safety to keep direction lined up
                    if (this.direction != trackDirections[0] && this.direction != trackDirections[0].Opposite()) {
                        this.direction = trackDirections[0];
                    }
                    this.dx = speedRatio * this.direction.x;
                    this.dy = speedRatio * this.direction.y;
                    if (this.direction.x == 0)
                        this.x = this.trackTile.tileX * 12;
                    if (this.direction.y == 0)
                        this.y = this.trackTile.tileY * 12;
                }
                else {
                    // CURVED TRACK
                    // +-----------+
                    // |           |
                    // |           |
                    // |==._       |
                    // |    \      |
                    // |     |     |
                    // +-----------+
                    var dirX = trackDirections[0].y == 0 ? trackDirections[0] : trackDirections[1];
                    var dirY = trackDirections[0].x == 0 ? trackDirections[0] : trackDirections[1];
                    var arcCenterX = tileXMid + 6 * dirX.x;
                    var arcCenterY = tileYMid + 6 * dirY.y;
                    // arcCenter is lower-left corner in above diagram
                    var theta_1 = Math.atan2(this.yMid - arcCenterY, this.xMid - arcCenterX);
                    // theta 0 == direct right
                    //      -0.7 == up-right
                    //      3.14 == left
                    //      0.7 == down-right
                    var targetSpin = 0; // 1 for clockwise, -1 for counterclockwise
                    if (this.direction == dirX || this.direction == dirY.Opposite()) {
                        // heading out to side or in from top/bottom
                        targetSpin = (dirX.x == dirY.y ? 1 : -1);
                    }
                    else {
                        // heading out to top/bottom or in from side
                        targetSpin = (dirX.x == dirY.y ? -1 : 1);
                    }
                    var targetTheta_1 = theta_1 + speedRatio / 6 * targetSpin;
                    var targetX = arcCenterX + Math.cos(targetTheta_1) * 6;
                    var targetY = arcCenterY + Math.sin(targetTheta_1) * 6;
                    this.dx = targetX - this.xMid;
                    this.dy = targetY - this.yMid;
                    var fortyfives = [Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4];
                    if (fortyfives.some(function (a) { return Utility.IsBetween(a, theta_1, targetTheta_1); })) {
                        // crossed a 45 degree split
                        if (this.direction == dirX.Opposite())
                            this.direction = dirY;
                        else
                            this.direction = dirX;
                    }
                }
                /*
                // Weird test case
                1.7.0;12;0;0;3|#0acf2f,#ed697a,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABBACAAAIABCAAIACAABBAAIABAACAABAAAIABCAAIABCAAIABBACAAAIACAABBAAHAGAABCAAIABCAAIABCAAGABBACAABBAAGABEAAGABDACAAAGABEAAGABBACAABBAAGABEAAHABDAAHACAABAACAABAAAHABD|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABAAAKABAAAKABAAAC|AAnAkAAAKAkAAAAAtDAAFAkAAAAAtDAAFAkAAAAAtDAAFAkAAAAAtBAAAAtAAAFAkAAAAAtAAqDAAEAkAAAAAqAAtCAAFAkBAtDAAFAkBAtDAAFAqAAkAAAJAqAAsAAAJAqAAkAAAJAqAAkAAAUAlHAAY|ABCGAF;A6AYAC;AEAPAG;AEAgAI;AzAiAG;AzAjAF;AzAkAG;AEAxAE;AbA8AGAD;A0A9AC;AlA2AJ;AlA/AH;A5BIAE;AEBLAG;AEBOAI;A4BcAJ;AzBZAG;AzBYAG;AzBXAG;AEBiAG;AEBiAF;AdBoAIAD;AdBtAI;AEB0AG;AFCAAH;AAAEAI;AvAMAF
                1.7.0;12;0;0;3|#641db4,#df422f,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABBACAAAIABCAAIACAABBAAIABAACAABAAAIABCAAIABCAAIABBACAAAIACAABBAAHAGAABCAAIABCAAIABCAAGABBACAABBAAGABEAAGABDACAAAGABEAAGABBACAABBAAGABEAAHABDAAHACAABAACAABAAAHABD|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABAAAKABAAAKABAAAC|AA+AmAApAAmAApAAAHAkAAnAAoAAkAAAHAkAAAAAmAAoAAAHAnAApAAnAApAAAIAnAAlAAoAAA/AA8|ABCGAF;A6AYAC;AEAPAG;AEAgAI;AzAiAG;AzAjAF;AzAkAG;AEAxAE;AbA8AGAD;A0A9AC;AlA2AJ;AlA/AH;A5BIAE;AEBLAG;AEBOAI;A4BcAJ;AzBZAG;AzBYAG;AzBXAG;AEBiAG;AEBiAF;AdBoAIAD;AdBtAI;AEB0AG;AFCAAH;AAAEAI;AvAGAG
                1.7.0;12;0;0;3|#93ddf6,#7b81bf,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABBACAAAIABCAAIACAABBAAIABAACAABAAAIABCAAIABCAAIABBACAAAIACAABBAAHAGAABCAAIABCAAIABCAAGABBACAABBAAGABEAAGABDACAAAGABEAAGABBACAABBAAGABEAAHABDAAHACAABAACAABAAAHABD|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABAAAKABAAAKABAAAC|AAWADAAAOADGAAEADAAmAApAAACADAAAEADAAAAAoAAAJAnAApAAAJAnAAoAAA/AA/AAV|ABCGAF;A6AYAC;AEAPAG;AEAgAI;AzAiAG;AzAjAF;AzAkAG;AEAxAE;AbA8AGAD;A0A9AC;AlA2AJ;AlA/AH;A5BIAE;AEBLAG;AEBOAI;A4BcAJ;AzBZAG;AzBYAG;AzBXAG;AEBiAG;AEBiAF;AdBoAIAD;AdBtAI;AEB0AG;AFCAAH;AAAFAI;AfAEAI;AvAHAF
                */
                this.MoveByVelocity();
            }
            else {
                this.isOnTrack = false;
                this.ApplyGravity();
                var oldX = this.x;
                var oldY = this.y;
                this.MoveByVelocity();
                if ((_b = this.trackTile) === null || _b === void 0 ? void 0 : _b.tileType.trackDirections.length) {
                    var previousTile = this.layer.GetTileByPixel(oldX + this.width / 2, oldY + this.height / 2).GetWireNeighbor();
                    if (this.trackTile == previousTile) {
                        // check if we "crossed" the track
                        var motorMidpoint = { x: this.xMid, y: this.yMid };
                        var tileXMid = this.trackTile.tileX * 12 + 6;
                        var tileYMid = this.trackTile.tileY * 12 + 6;
                        var trackDirections = this.trackTile.tileType.trackDirections;
                        if (trackDirections.length == 1) {
                            // TRACK CAP
                            // +-----------+
                            // |           |
                            // |           |
                            // |     o     |
                            // |     |     |
                            // |     |     |
                            // +-----------+
                            var dir = trackDirections[0];
                            var crosses = Utility.DoLinesIntersect(motorMidpoint, { x: oldX + 6, y: oldY + 6 }, { x: tileXMid, y: tileYMid }, { x: tileXMid + 6 * dir.x, y: tileYMid + 6 * dir.y });
                            if (crosses) {
                                this.isOnTrack = true;
                                if (dir.y == 0) {
                                    this.y = this.trackTile.tileY * 12;
                                }
                                if (dir.x == 0) {
                                    this.x = this.trackTile.tileX * 12;
                                }
                                if (dir.x == 0) {
                                    this.direction = this.dy < 0 ? Direction.Up : Direction.Down;
                                }
                                else {
                                    this.direction = this.dx < 0 ? Direction.Left : Direction.Right;
                                }
                            }
                        }
                        else if (trackDirections.length == 4) {
                            // TRACK BRIDGE
                            // +-----------+
                            // |     |     |
                            // |     |     |
                            // |-----+-----|
                            // |     |     |
                            // |     |     |
                            // +-----------+
                            var crossesHorizontal = Utility.DoLinesIntersect(motorMidpoint, { x: oldX + 6, y: oldY + 6 }, { x: tileXMid - 6, y: tileYMid }, { x: tileXMid + 6, y: tileYMid });
                            if (crossesHorizontal) {
                                this.isOnTrack = true;
                                this.y = this.trackTile.tileY * 12;
                                this.direction = this.dx < 0 ? Direction.Left : Direction.Right;
                            }
                            else {
                                var crossesVertical = Utility.DoLinesIntersect(motorMidpoint, { x: oldX + 6, y: oldY + 6 }, { x: tileXMid, y: tileYMid - 6 }, { x: tileXMid, y: tileYMid + 6 });
                                if (crossesVertical) {
                                    this.isOnTrack = true;
                                    this.x = this.trackTile.tileX * 12;
                                    this.direction = this.dy < 0 ? Direction.Up : Direction.Down;
                                }
                            }
                        }
                        else if (trackDirections.length == 2) {
                            if (trackDirections[0] == trackDirections[1].Opposite()) {
                                // STRAIGHT TRACK
                                if (trackDirections[0].x == 0) {
                                    // VERTICAL
                                    // +-----------+
                                    // |     |     |
                                    // |     |     |
                                    // |     |     |
                                    // |     |     |
                                    // |     |     |
                                    // +-----------+
                                    var crosses = (oldX <= tileXMid && this.xMid >= tileXMid) || (oldX >= tileXMid && this.xMid <= tileXMid);
                                    if (crosses) {
                                        this.isOnTrack = true;
                                        this.x = this.trackTile.tileX * 12;
                                        this.direction = this.dy < 0 ? Direction.Up : Direction.Down;
                                    }
                                }
                                else {
                                    // HORIZONTAL
                                    // +-----------+
                                    // |           |
                                    // |           |
                                    // |===========|
                                    // |           |
                                    // |           |
                                    // +-----------+
                                    var crosses = (oldY <= tileYMid && this.yMid >= tileYMid) || (oldY >= tileYMid && this.yMid <= tileYMid);
                                    if (crosses) {
                                        this.isOnTrack = true;
                                        this.y = this.trackTile.tileY * 12;
                                        this.direction = this.dx < 0 ? Direction.Left : Direction.Right;
                                    }
                                }
                            }
                            else {
                                // CURVED TRACK
                                // +-----------+
                                // |           |
                                // |           |
                                // |==._       |
                                // |    \      |
                                // |     |     |
                                // +-----------+
                                var dir1 = trackDirections[0], dir2 = trackDirections[1];
                                var arcCenterX = tileXMid + 6 * (dir1.x + dir2.x);
                                var arcCenterY = tileYMid + 6 * (dir1.y + dir2.y);
                                // arcCenter is lower-left corner in above diagram
                                var oldDist = Math.sqrt(Math.pow((oldX - arcCenterX), 2) + Math.pow((oldY - arcCenterY), 2));
                                var newDist = Math.sqrt(Math.pow((this.x - arcCenterX), 2) + Math.pow((this.y - arcCenterY), 2));
                                var crosses = (oldDist <= 6 && newDist >= 6) || (oldDist >= 6 && newDist <= 6);
                                if (crosses) {
                                    this.isOnTrack = true;
                                    var theta = Math.atan2(this.y - arcCenterY, this.x - arcCenterX);
                                    this.x = Math.cos(theta) * 6 + arcCenterX;
                                    this.y = Math.sin(theta) * 6 + arcCenterY;
                                    if (dir1 == Direction.Down || dir2 == Direction.Down) {
                                        this.direction = Direction.Down;
                                    }
                                    else if (dir1 == Direction.Left || dir2 == Direction.Left) {
                                        this.direction = Direction.Left;
                                    }
                                    else {
                                        this.direction = Direction.Right;
                                    }
                                }
                            }
                        }
                        else {
                            // WHAT
                            console.error("Invalid track directions");
                        }
                    }
                }
            }
            if (!this.trackTile)
                this.isOnTrack = false;
        }
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
            if (this.direction.x == 1 || this.direction.x == -1)
                sprite.direction = this.direction.x;
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
        _this.rotationDirection = 1;
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
                        this.MoveConnectedSprite(instance);
                    }
                }
            }
            this.spinSpeed = 0.02 / this.connectionDistance * 24 * this.rotationDirection;
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
        _this.rotationDirection = -1;
        return _this;
    }
    return FerrisMotorLeft;
}(FerrisMotorRight));
var FastFerrisMotorLeft = /** @class */ (function (_super) {
    __extends(FastFerrisMotorLeft, _super);
    function FastFerrisMotorLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotationDirection = -2;
        return _this;
    }
    return FastFerrisMotorLeft;
}(FerrisMotorRight));
var FastFerrisMotorRight = /** @class */ (function (_super) {
    __extends(FastFerrisMotorRight, _super);
    function FastFerrisMotorRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotationDirection = 2;
        return _this;
    }
    return FastFerrisMotorRight;
}(FerrisMotorRight));
