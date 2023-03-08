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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BigYufo = /** @class */ (function (_super) {
    __extends(BigYufo, _super);
    function BigYufo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 36;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.killedByProjectiles = false;
        _this.zIndex = 1;
        _this.tractorTiles = 8;
        return _this;
    }
    BigYufo.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.SkyPatrol(0.5);
        this.dy *= 0.94;
        this.ReactToVerticalWind();
    };
    BigYufo.prototype.IsSpriteInTractorBeam = function (sprite) {
        return sprite.x < this.xRight &&
            sprite.xRight > this.x &&
            sprite.y < this.yBottom + (12 * this.tractorTiles)
            && sprite.yBottom > this.yBottom;
    };
    BigYufo.prototype.GetFrameData = function (frameNum) {
        var gusts = [0, 1, 2, 3, 4, 5, 6, 7].map(function (a) { return ({
            imageTile: tiles["tractorBeam"][a == 7 ? 1 : 0][Math.floor((frameNum / 2 + a) % 12)],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: -a * 12 - 6
        }); });
        return __spreadArrays(gusts, [{
                imageTile: tiles["bigUfo"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 0
            }]);
    };
    return BigYufo;
}(Enemy));
