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
var Saw = /** @class */ (function (_super) {
    __extends(Saw, _super);
    function Saw() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 36;
        _this.width = 36;
        _this.respectsSolidTiles = false;
        _this.anchor = null;
        _this.radius = 18;
        _this.imageSource = "saw";
        return _this;
    }
    Saw.prototype.Update = function () {
        _super.prototype.Update.call(this);
    };
    Saw.prototype.IsHazardActive = function () {
        return true;
    };
    Saw.prototype.DoesPlayerOverlap = function (player) {
        // special override for round hitbox
        var x = player.x;
        if (player.x < this.xMid)
            x = this.xMid;
        if (player.xRight < this.xMid)
            x = player.xRight;
        var y = player.y;
        if (player.y < this.yMid)
            y = this.yMid;
        if (player.yBottom < this.yMid)
            y = player.yBottom;
        var distSquared = Math.pow((x - this.xMid), 2) + Math.pow((y - this.yMid), 2);
        return distSquared < Math.pow(this.radius, 2);
    };
    Saw.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 2.5) % 3;
        return {
            imageTile: tiles[this.imageSource][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    };
    return Saw;
}(Hazard));
var SmallSaw = /** @class */ (function (_super) {
    __extends(SmallSaw, _super);
    function SmallSaw() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 24;
        _this.width = 24;
        _this.radius = 12;
        _this.imageSource = "smallSaw";
        return _this;
    }
    return SmallSaw;
}(Saw));
