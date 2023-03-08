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
var ReviveWings = /** @class */ (function (_super) {
    __extends(ReviveWings, _super);
    function ReviveWings() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        return _this;
    }
    ReviveWings.prototype.Update = function () {
    };
    ReviveWings.prototype.GetFrameData = function (frameNum) {
        var isPlayerDead = this.layer.sprites.some(function (a) { return a instanceof DeadPlayer && a.canRespawn; });
        if (isPlayerDead || editorHandler.isInEditMode) {
            var col = [0, 1, 2, 3, 2, 1][Math.floor(frameNum / 8) % 6];
            return {
                imageTile: tiles["angelWings"][col][0],
                xFlip: false,
                yFlip: false,
                xOffset: 3,
                yOffset: 4 + Math.sin(frameNum / 40)
            };
        }
        else {
            return {
                imageTile: tiles["angelWings"][4][0],
                xFlip: false,
                yFlip: false,
                xOffset: 3,
                yOffset: 4
            };
        }
    };
    return ReviveWings;
}(Sprite));
