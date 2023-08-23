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
var AirBubble = /** @class */ (function (_super) {
    __extends(AirBubble, _super);
    function AirBubble() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.popTimer = 0;
        return _this;
    }
    AirBubble.prototype.Update = function () {
        if (this.popTimer == 0 && player) {
            if (player.IsGoingToOverlapSprite(this)) {
                player.currentBreath = player.maxBreath;
                this.popTimer = 1;
                audioHandler.PlaySound("airBubble", false);
            }
        }
        if (this.popTimer > 0)
            this.popTimer++;
        if (this.popTimer > 18)
            this.isActive = false;
        this.y += Math.sin(this.age / 30) / 20;
    };
    AirBubble.prototype.GetFrameData = function (frameNum) {
        var col = 1;
        if (this.popTimer > 6)
            col = 2;
        if (this.popTimer > 12)
            col = 3;
        return {
            imageTile: tiles["fluids"][col][3],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return AirBubble;
}(Sprite));
