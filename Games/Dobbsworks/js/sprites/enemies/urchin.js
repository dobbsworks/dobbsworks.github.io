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
var Lurchin = /** @class */ (function (_super) {
    __extends(Lurchin, _super);
    function Lurchin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 7;
        _this.width = 13;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.clawsUp = true;
        return _this;
    }
    Lurchin.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        var speed = this.isInWater ? 0.4 : 0.25;
        this.Patrol(speed, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.clawsUp = Math.floor(this.age / 120) % 2 == 0;
        this.canBeBouncedOn = !this.clawsUp;
    };
    Lurchin.prototype.OnBounce = function () {
        if (!this.clawsUp) {
            this.isActive = false;
            var deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
        }
    };
    Lurchin.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1];
        var frame = frames[Math.floor(frameNum / 5) % frames.length];
        var row = this.clawsUp ? 0 : 1;
        return {
            imageTile: tiles["crab"][frame][row],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 5
        };
    };
    return Lurchin;
}(Enemy));
