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
var Poof = /** @class */ (function (_super) {
    __extends(Poof, _super);
    function Poof() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 16;
        _this.width = 16;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        return _this;
    }
    Poof.prototype.Update = function () {
        this.MoveByVelocity();
        if (this.age > 14)
            this.isActive = false;
    };
    Poof.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 3, 4, 5, 6, 7, 7, 7, 7];
        var frameIndex = Math.floor(frameNum / 2) % frames.length;
        var frame = frames[frameIndex];
        return {
            imageTile: tiles["poof"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Poof;
}(Sprite));
var Pow = /** @class */ (function (_super) {
    __extends(Pow, _super);
    function Pow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        _this.imageName = "pow";
        return _this;
    }
    Pow.prototype.Update = function () {
        if (this.age > 5)
            this.isActive = false;
    };
    Pow.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 3, 4, 5];
        var frameIndex = Math.floor(frameNum) % frames.length;
        var frame = frames[frameIndex];
        return {
            imageTile: tiles[this.imageName][0][frame],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Pow;
}(Sprite));
var Twinkle = /** @class */ (function (_super) {
    __extends(Twinkle, _super);
    function Twinkle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageName = "twinkle";
        return _this;
    }
    return Twinkle;
}(Pow));
