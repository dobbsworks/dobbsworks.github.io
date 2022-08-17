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
var Umbrella = /** @class */ (function (_super) {
    __extends(Umbrella, _super);
    function Umbrella() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 6;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.slowFall = true;
        return _this;
    }
    Umbrella.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    Umbrella.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][2][1],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    };
    return Umbrella;
}(Sprite));
