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
var FlipPlatform = /** @class */ (function (_super) {
    __extends(FlipPlatform, _super);
    function FlipPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 1;
        _this.sourceImage = "flipPlatform";
        _this.leftCapCol = 0;
        _this.rightCapCol = 0;
        _this.middleCol = 0;
        _this.isInitialized = false;
        _this.motor = null;
        _this.SegmentType = FlipPlatformSection;
        return _this;
    }
    FlipPlatform.prototype.Update = function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            var motor = this.GetParentMotor();
            if (motor instanceof Motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
            if (!motor) {
                this.isActive = false;
                for (var x = this.x; x < this.xRight; x += 12) {
                    var segment = new this.SegmentType(x, this.y, this.layer, []);
                    segment.width = 12;
                    this.layer.sprites.push(segment);
                }
            }
        }
    };
    return FlipPlatform;
}(BasePlatform));
var FlipPlatformSection = /** @class */ (function (_super) {
    __extends(FlipPlatformSection, _super);
    function FlipPlatformSection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.falling = false;
        _this.timer = 0;
        _this.dropTime = 5;
        return _this;
    }
    FlipPlatformSection.prototype.Update = function () {
        var _this = this;
        if (this.IsPlayerStandingOn()) {
            this.falling = true;
        }
        if (this.falling)
            this.timer++;
        else
            this.timer--;
        if (this.timer < 0)
            this.timer = 0;
        if (this.timer > 120)
            this.falling = false;
        this.isPlatform = this.timer < this.dropTime;
        if (!this.isPlatform) {
            var riders = this.layer.sprites.filter(function (a) { return a.parentSprite == _this; });
            riders.forEach(function (a) { return a.parentSprite = null; });
        }
    };
    FlipPlatformSection.prototype.GetFrameData = function (frameNum) {
        var frame = 0;
        if (this.timer > 0) {
            frame = Math.floor(this.timer / 2) % 2;
            if (this.timer >= this.dropTime)
                frame = 2;
            if (this.timer >= this.dropTime + 3)
                frame = Math.floor(this.timer / 10) % 3 + 3;
        }
        return [{
                imageTile: tiles[this.sourceImage][frame][this.tilesetRow],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }];
    };
    return FlipPlatformSection;
}(FlipPlatform));
var SlowFlipPlatform = /** @class */ (function (_super) {
    __extends(SlowFlipPlatform, _super);
    function SlowFlipPlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 0;
        _this.SegmentType = SlowFlipPlatformSection;
        return _this;
    }
    return SlowFlipPlatform;
}(FlipPlatform));
var SlowFlipPlatformSection = /** @class */ (function (_super) {
    __extends(SlowFlipPlatformSection, _super);
    function SlowFlipPlatformSection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dropTime = 12;
        _this.tilesetRow = 0;
        return _this;
    }
    return SlowFlipPlatformSection;
}(FlipPlatformSection));
