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
        _this.canHangFrom = true;
        return _this;
    }
    Ring.prototype.Update = function () {
        //this.ApplyGravity();
        this.ApplyInertia();
        //this.ReactToWater();
        //this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Ring.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3];
        var frameIndex = Math.floor(frameNum / 10) % frames.length;
        var frame = frames[frameIndex];
        return {
            imageTile: tiles["ring"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return Ring;
}(Sprite));
