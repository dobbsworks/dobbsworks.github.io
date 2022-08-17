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
var DeadEnemy = /** @class */ (function (_super) {
    __extends(DeadEnemy, _super);
    function DeadEnemy(sourceSprite) {
        var _this = _super.call(this, sourceSprite.x, sourceSprite.y, sourceSprite.layer, []) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.frameData = null;
        _this.width = sourceSprite.width;
        _this.height = sourceSprite.height;
        _this.frameData = sourceSprite.GetFrameData(0);
        _this.frameData.yFlip = true;
        _this.dx = Math.cos(sourceSprite.age + sourceSprite.layer.sprites.indexOf(sourceSprite)) / 2;
        _this.dy = -1 - Math.cos(sourceSprite.age + sourceSprite.layer.sprites.indexOf(sourceSprite)) / 5;
        return _this;
    }
    DeadEnemy.prototype.Update = function () {
        this.ApplyGravity();
        this.MoveByVelocity();
        if (this.y > 9999)
            this.isActive = false;
    };
    DeadEnemy.prototype.GetFrameData = function (frameNum) {
        return this.frameData || {
            imageTile: tiles["snail"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return DeadEnemy;
}(Sprite));
