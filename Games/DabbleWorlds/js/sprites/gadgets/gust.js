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
var Gust = /** @class */ (function (_super) {
    __extends(Gust, _super);
    function Gust() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        return _this;
    }
    Gust.prototype.Update = function () {
        // this.ApplyGravity();
        // this.ApplyInertia();
        // this.ReactToPlatformsAndSolids();
        // this.MoveByVelocity();
    };
    Gust.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["gust"][frameNum % 12][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Gust;
}(Sprite));
