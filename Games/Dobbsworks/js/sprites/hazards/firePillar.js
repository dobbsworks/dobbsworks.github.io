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
var FirePillar = /** @class */ (function (_super) {
    __extends(FirePillar, _super);
    function FirePillar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 24;
        _this.width = 16;
        _this.respectsSolidTiles = false;
        _this.warningTime = 45;
        _this.anchor = null;
        return _this;
    }
    FirePillar.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.age > this.warningTime + 60)
            this.isActive = false;
    };
    FirePillar.prototype.IsHazardActive = function () {
        return this.age > this.warningTime;
    };
    FirePillar.prototype.DoesPlayerOverlap = function (player) {
        // special override for infinite height hitbox
        var myX = this.x;
        var spriteX = player.x;
        var isXOverlap = myX < spriteX + player.width && myX + this.width > spriteX;
        return isXOverlap;
    };
    FirePillar.prototype.GetFrameData = function (frameNum) {
        if (this.age < this.warningTime) {
            if (this.age % 6 >= 3)
                return [];
        }
        var frame = Math.floor(frameNum / 6) % 4;
        var yOffset = (frameNum * 1) % 24;
        var mirror = Math.floor(frameNum / 3) % 2 == 0;
        var topOfScreen = camera.y - camera.canvas.height / 2 / camera.scale;
        var bottomOfScreen = camera.y + camera.canvas.height / 2 / camera.scale;
        var targetY = topOfScreen - topOfScreen % 24;
        var ret = [];
        while (targetY < bottomOfScreen + 24) {
            ret.push({
                imageTile: tiles["flamepillar"][0][frame],
                xFlip: mirror,
                yFlip: false,
                xOffset: 8,
                yOffset: -(targetY - this.y) + yOffset
            });
            targetY += 24;
        }
        return ret;
    };
    return FirePillar;
}(Hazard));
