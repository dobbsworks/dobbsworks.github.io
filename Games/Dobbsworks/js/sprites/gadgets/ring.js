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
var Ring = /** @class */ (function (_super) {
    __extends(Ring, _super);
    function Ring() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.rowNum = 0;
        _this.canHangFrom = true;
        _this.isMovedByWind = false;
        return _this;
    }
    Ring.prototype.Update = function () {
        var parentMotor = this.GetParentMotor();
        if (!parentMotor) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
        this.MoveByVelocity();
    };
    Ring.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3];
        var frameIndex = Math.floor(frameNum / 10) % frames.length;
        var frame = frames[frameIndex];
        return {
            imageTile: tiles["ring"][frame][this.rowNum],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return Ring;
}(Sprite));
var PullSwitch = /** @class */ (function (_super) {
    __extends(PullSwitch, _super);
    function PullSwitch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 7;
        _this.rowNum = 1;
        _this.isOn = false;
        _this.anchor = Direction.Up;
        _this.isPowerSource = true;
        return _this;
    }
    PullSwitch.prototype.Update = function () {
        var parentMotor = this.GetParentMotor();
        if (!parentMotor) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
        this.MoveByVelocity();
        this.isOn = (player && player.heldItem == this);
    };
    PullSwitch.prototype.GetPowerPoints = function () {
        if (this.isOn) {
            return [
                { xPixel: this.xMid, yPixel: this.y - 1 }
            ];
        }
        else
            return [];
    };
    return PullSwitch;
}(Ring));
var SpringRing = /** @class */ (function (_super) {
    __extends(SpringRing, _super);
    function SpringRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.isMovedByWind = false;
        _this.handle = null;
        return _this;
    }
    SpringRing.prototype.GetThumbnail = function () {
        return tiles["ring"][0][2];
    };
    SpringRing.prototype.Update = function () {
        if (this.handle == null) {
            var handle = new SpringRingHandle(this.x, this.y, this.layer, []);
            this.handle = handle;
            handle.chainAnchor = this;
            this.layer.sprites.push(handle);
        }
        var parentMotor = this.GetParentMotor();
        if (!parentMotor) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
    };
    SpringRing.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["ring"][0][2],
                xFlip: false,
                yFlip: false,
                xOffset: 1,
                yOffset: 1
            };
        }
        return {
            imageTile: tiles["ring"][1][2],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return SpringRing;
}(Sprite));
var SpringRingHandle = /** @class */ (function (_super) {
    __extends(SpringRingHandle, _super);
    function SpringRingHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.rowNum = 0;
        _this.canHangFrom = true;
        _this.isMovedByWind = false;
        _this.maxHoldDistance = 5;
        _this.chainAnchor = null;
        _this.isHeld = false;
        _this.incomingPlayerDx = 0;
        return _this;
    }
    SpringRingHandle.prototype.OnPickup = function () {
        this.incomingPlayerDx = 0;
        if (player)
            this.incomingPlayerDx = player.dx / 2;
        return this;
    };
    SpringRingHandle.prototype.Update = function () {
        if (this.chainAnchor == null || !this.chainAnchor.isActive) {
            this.isActive = false;
            return;
        }
        var wasHeld = this.isHeld;
        this.isHeld = player && player.heldItem == this;
        if (!wasHeld && this.isHeld) {
            this.dy = 1.5;
            this.dx = (this.incomingPlayerDx);
        }
        this.dy -= (this.y - (this.chainAnchor.y + 12)) / 80;
        this.dx -= (this.x - this.chainAnchor.x) / 200;
        if (this.isHeld) {
            var maxSpeed = 0.5;
            var accel = 0.02;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.dx > -maxSpeed)
                this.dx -= accel;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.dx < maxSpeed)
                this.dx += accel;
        }
        if (!this.isHeld) {
            this.dx *= 0.98;
            this.dy *= 0.98;
        }
        this.MoveByVelocity();
    };
    SpringRingHandle.prototype.GetFrameData = function (frameNum) {
        var chainCount = 3;
        var ret = [];
        if (this.chainAnchor) {
            for (var i = 1; i < chainCount; i++) {
                var ratio = i / chainCount;
                ret.push({
                    imageTile: tiles["ring"][1][2],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 1 - (this.chainAnchor.x - this.x) * ratio,
                    yOffset: 1 - (this.chainAnchor.y - this.y) * ratio,
                });
            }
        }
        ret.push({
            imageTile: tiles["ring"][0][2],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        });
        return ret;
    };
    return SpringRingHandle;
}(Sprite));
