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
var FirePillarTrigger = /** @class */ (function (_super) {
    __extends(FirePillarTrigger, _super);
    function FirePillarTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 24;
        _this.width = 24;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        return _this;
    }
    FirePillarTrigger.prototype.GetThumbnail = function () {
        return tiles["flametrigger"][0][0];
    };
    FirePillarTrigger.prototype.Update = function () {
        if (this.IsOnScreen()) {
            // how far is this, top to bottom?
            var bottomOfScreen = camera.y + camera.canvas.height / 2 / camera.scale;
            var topOfScreen = camera.y - camera.canvas.height / 2 / camera.scale;
            var leftOfScreen = camera.x + camera.canvas.width / 2 / camera.scale;
            var rightOfScreen = camera.x - camera.canvas.width / 2 / camera.scale;
            var vertMargin = (this.y - bottomOfScreen) + (topOfScreen - this.yBottom);
            var horizontalMargin = (this.x - leftOfScreen) + (rightOfScreen - this.xRight);
            var vertRatio = (this.y - bottomOfScreen) / vertMargin; // [0.0, 1.0] = [top, bottom]
            var horizRatio = 1 - (this.x - leftOfScreen) / horizontalMargin; // [0.0, 1.0] = [left, right]
            if (Math.abs(vertRatio - horizRatio) < 0.1) {
                // LAUNCH
                var newSprite = this.ReplaceWithSpriteType(FirePillar);
            }
        }
    };
    FirePillarTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["flametrigger"][0][0],
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
    return FirePillarTrigger;
}(Sprite));
