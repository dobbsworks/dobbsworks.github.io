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
var PipeContent = /** @class */ (function (_super) {
    __extends(PipeContent, _super);
    function PipeContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.isMovedByWind = false;
        _this.containedSprite = null;
        _this.spriteFrames = [];
        _this.storedAge = 0;
        return _this;
    }
    PipeContent.prototype.SetContainedSprite = function (sprite) {
        var _a;
        sprite.OnEnterPipe();
        if (this.IsOnScreen()) {
            audioHandler.PlaySound("pipe-in", false);
        }
        var motor = this.layer.sprites.find(function (a) { return a instanceof Motor && a.connectedSprite == sprite; });
        if (motor) {
            motor.connectedSprite = null;
        }
        this.containedSprite = sprite;
        var frames = sprite.GetFrameData(0);
        if ("xFlip" in frames)
            this.spriteFrames.push(frames);
        else
            (_a = this.spriteFrames).push.apply(_a, frames);
        for (var _i = 0, _b = this.spriteFrames; _i < _b.length; _i++) {
            var frame = _b[_i];
            frame.imageTile = new ImageTile(frame.imageTile.src, frame.imageTile.xSrc, frame.imageTile.ySrc, frame.imageTile.width > 10 ? 10 : frame.imageTile.width, frame.imageTile.height > 10 ? 10 : frame.imageTile.height);
            frame.xOffset = -1;
            frame.yOffset = -1;
            if (frame.imageTile.width < 10)
                frame.xOffset -= (10 - frame.imageTile.width) / 2;
            if (frame.imageTile.height < 10)
                frame.yOffset -= (10 - frame.imageTile.height) / 2;
        }
        this.dx = 0;
        this.dy = 0;
        this.age = 0;
        if (player == sprite) {
            camera.target = this;
        }
    };
    PipeContent.prototype.Update = function () {
        var _this = this;
        var _a;
        this.dx = this.direction.x;
        this.dy = this.direction.y;
        if (this.age % 12 == 0) {
            var oldDirection = this.direction;
            var track_1 = (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByPixel(this.xMid, this.yMid);
            if (track_1 && track_1.tileType.isTrackPipe) {
                // if land on pipe tile, pop out sprite, set direction/velocity based on pipe outlet direction
                this.isActive = false;
                if (this.containedSprite) {
                    this.layer.sprites.push(this.containedSprite);
                    this.containedSprite.x = this.xMid - this.containedSprite.width / 2;
                    this.containedSprite.y = this.yMid - this.containedSprite.height / 2;
                    this.containedSprite.isActive = true;
                    this.containedSprite.trackPipeExit = track_1;
                    if (camera.target == this) {
                        player = this.containedSprite;
                        camera.target = player;
                        player.Jump();
                        player.age = this.age + this.storedAge;
                    }
                    // eject from exit
                    if (track_1.tileType.trackDirections[0].y == 0) {
                        // horizontal dir
                        this.containedSprite.dx = -track_1.tileType.trackDirections[0].x;
                        this.containedSprite.dy = -1.5;
                    }
                    else {
                        this.containedSprite.dx = 0;
                        this.containedSprite.dy = -1.7 * track_1.tileType.trackDirections[0].y;
                    }
                    this.containedSprite.OnExitPipe(track_1.tileType.trackDirections[0].Opposite());
                    if (this.IsOnScreen()) {
                        audioHandler.PlaySound("pipe-out", false);
                    }
                }
            }
            else if (track_1 && track_1.tileType.trackDirections.length > 0) {
                // check possible directions
                if (track_1.tileType.trackDirections.length == 1) {
                    this.direction = track_1.tileType.trackDirections[0];
                }
                else if (track_1.tileType.trackDirections.length == 2) {
                    this.direction = track_1.tileType.trackDirections.filter(function (a) { return a != _this.direction.Opposite(); })[0];
                }
                else if (track_1.tileType.trackDirections.length == 4) {
                    // prioritize same as current, override with player input
                    // find directions that have a connecting track
                    var validDirections = track_1.tileType.trackDirections.filter(function (a) { return track_1 && track_1.Neighbor(a).tileType.trackDirections.indexOf(a.Opposite()) > -1; });
                    // unless backwards is the only option, no going backwards
                    if (validDirections.length > 1) {
                        validDirections = validDirections.filter(function (a) { return a != _this.direction.Opposite(); });
                    }
                    if (validDirections.length == 1) {
                        this.direction = validDirections[0];
                    }
                    else {
                        var canControlDirection = this.containedSprite instanceof Player;
                        if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && validDirections.indexOf(Direction.Left) > -1) {
                            this.direction = Direction.Left;
                        }
                        else if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && validDirections.indexOf(Direction.Right) > -1) {
                            this.direction = Direction.Right;
                        }
                        else if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && validDirections.indexOf(Direction.Up) > -1) {
                            this.direction = Direction.Up;
                        }
                        else if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Down, false) && validDirections.indexOf(Direction.Down) > -1) {
                            this.direction = Direction.Down;
                        }
                        else {
                            // making no choice! Can we keep going straight?
                            if (validDirections.indexOf(this.direction) == -1) {
                                // nope! Can we hang a left?
                                if (validDirections.indexOf(this.direction.CounterClockwise()) > -1) {
                                    this.direction = this.direction.CounterClockwise();
                                }
                                else {
                                    this.direction = validDirections[0];
                                }
                            }
                        }
                    }
                }
                else {
                    this.direction = this.direction.Opposite();
                }
                // confirm chosen direction is valid, else go back
                if (track_1.Neighbor(this.direction).tileType.trackDirections.indexOf(this.direction.Opposite()) == -1) {
                    this.direction = oldDirection.Opposite();
                }
            }
        }
        this.MoveByVelocity();
    };
    PipeContent.prototype.GetFrameData = function (frameNum) {
        var ret = [{
                imageTile: tiles["motorTrack"][7][4],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }];
        if (this.spriteFrames) {
            ret.push.apply(ret, this.spriteFrames);
        }
        return ret;
    };
    return PipeContent;
}(Sprite));
