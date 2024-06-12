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
var JumboJelly = /** @class */ (function (_super) {
    __extends(JumboJelly, _super);
    function JumboJelly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 60;
        _this.width = 72;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.damagesPlayer = false;
        return _this;
    }
    JumboJelly.prototype.Update = function () {
        _super.prototype.Update.call(this);
    };
    JumboJelly.prototype.OnBounce = function () { };
    JumboJelly.prototype.OnGroundLanding = function () {
        audioHandler.PlaySound("stuck-jump", true);
        //this.CreateSlimeGround(this.landingCoating);
    };
    JumboJelly.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 5) % 5;
        return {
            imageTile: tiles["bigSlime"][0][frame],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    };
    JumboJelly.prototype.OnAfterAllSpritesDraw = function (camera, frameNum) {
        var frame = Math.floor(frameNum / 5) % 5;
        var fd = {
            imageTile: tiles["bigSlime"][1][frame],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
        this.layer.DrawFrame(fd, camera.scale, this);
    };
    return JumboJelly;
}(LittleJelly));
