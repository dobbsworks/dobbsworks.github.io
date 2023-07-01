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
