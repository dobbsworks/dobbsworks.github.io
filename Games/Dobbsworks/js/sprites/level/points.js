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
var Points = /** @class */ (function (_super) {
    __extends(Points, _super);
    function Points() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 15;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        _this.column = 0;
        return _this;
    }
    Points.prototype.Update = function () {
        if (this.age > 80)
            this.isActive = false;
        if (this.age < 25)
            this.y -= 0.5;
    };
    Points.prototype.GetFrameData = function (frameNum) {
        var frameRow = Math.floor(this.age / 8);
        if (frameRow > 9)
            frameRow = 9;
        return {
            imageTile: tiles["points"][this.column][frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Points;
}(Sprite));
