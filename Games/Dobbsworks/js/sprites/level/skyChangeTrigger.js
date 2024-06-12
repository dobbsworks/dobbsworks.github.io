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
var SkyChangeTrigger = /** @class */ (function (_super) {
    __extends(SkyChangeTrigger, _super);
    function SkyChangeTrigger(x, y, layer, editorProps) {
        var _this = _super.call(this, x, y, layer, editorProps) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        _this.skyString = "";
        _this.skyString = editorProps[0];
        return _this;
    }
    SkyChangeTrigger.prototype.GetThumbnail = function () {
        return tiles["editor"][5][9];
    };
    SkyChangeTrigger.prototype.Update = function () {
        if (this.IsOnScreen(0)) {
            if (this.skyString) {
                currentMap.targetSky = currentMap.LoadSkyFromString(this.skyString);
            }
            this.isActive = false;
        }
    };
    SkyChangeTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["editor"][5][9],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    };
    return SkyChangeTrigger;
}(Sprite));
