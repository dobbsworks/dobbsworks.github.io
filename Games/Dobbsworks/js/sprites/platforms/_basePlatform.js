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
var BasePlatform = /** @class */ (function (_super) {
    __extends(BasePlatform, _super);
    function BasePlatform(x, y, layer, editorProps) {
        var _this = _super.call(this, x, y, layer, editorProps) || this;
        _this.sourceImage = "platform";
        _this.height = 2;
        _this.isPlatform = true;
        _this.respectsSolidTiles = false;
        _this.xRenderOffset = 0;
        _this.yRenderOffset = 0;
        _this.anchor = Direction.Up;
        var numTiles = editorProps[0] || 3;
        _this.width = numTiles * layer.tileWidth;
        return _this;
    }
    BasePlatform.prototype.IsPlayerStandingOn = function () {
        var _this = this;
        return this.layer.sprites.some(function (a) { return a instanceof Player && a.parentSprite == _this && a.standingOn.length == 0; });
    };
    BasePlatform.prototype.GetFullRiders = function () {
        var _this = this;
        return this.layer.sprites.filter(function (a) { return a.parentSprite == _this && a.standingOn.length == 0; });
    };
    BasePlatform.prototype.GetFullRiderCount = function () {
        return this.GetFullRiders().length;
    };
    BasePlatform.prototype.GetOneFootRiderCount = function () {
        var _this = this;
        return this.layer.sprites.filter(function (a) { return a.parentSprite == _this && (a.standingOn.length > 0 || (a instanceof Player && a.isClimbing)); }).length;
    };
    BasePlatform.prototype.GetFrameData = function (frameNum) {
        if (this.width <= 12) {
            return [{
                    imageTile: tiles[this.sourceImage][0][this.tilesetRow],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 0 + this.xRenderOffset,
                    yOffset: 0 + this.yRenderOffset
                }];
        }
        var frames = [{
                imageTile: tiles[this.sourceImage][1][this.tilesetRow],
                xFlip: false,
                yFlip: false,
                xOffset: 0 + this.xRenderOffset,
                yOffset: 0 + this.yRenderOffset
            }, {
                imageTile: tiles[this.sourceImage][3][this.tilesetRow],
                xFlip: false,
                yFlip: false,
                xOffset: -(this.width - 12) + this.xRenderOffset,
                yOffset: 0 + this.yRenderOffset
            }];
        for (var x = 12; x < this.width - 12; x += 12) {
            frames.push({
                imageTile: tiles[this.sourceImage][2][this.tilesetRow],
                xFlip: false,
                yFlip: false,
                xOffset: -x + this.xRenderOffset,
                yOffset: 0 + this.yRenderOffset
            });
        }
        return frames;
    };
    return BasePlatform;
}(Sprite));
