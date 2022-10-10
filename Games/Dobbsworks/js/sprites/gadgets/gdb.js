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
var Gdb = /** @class */ (function (_super) {
    __extends(Gdb, _super);
    function Gdb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        return _this;
    }
    Gdb.prototype.Update = function () {
        this.x -= 0.3;
    };
    Gdb.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 4) % 2;
        return {
            imageTile: tiles["gdbtemp"][0][frame],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Gdb;
}(Sprite));
