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
var Spurpider = /** @class */ (function (_super) {
    __extends(Spurpider, _super);
    function Spurpider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.state = "rest";
        _this.targetY = -9999;
        _this.pauseTimer = 0;
        _this.riseTimer = 0;
        _this.riseDys = [-1, -1.5, -1, -1, -0.5, -0.5, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0, -0.5];
        _this.squishTimer = 0;
        return _this;
    }
    Spurpider.prototype.Update = function () {
        var _this = this;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (this.state == "rest") {
                this.targetY = this.y;
                var isPlayerNearAndBelow = this.layer.sprites.some(function (p) { return p instanceof Player && Math.abs(_this.x - p.x) < 20 && p.y > _this.y - 3 && p.y < _this.y + 150; });
                if (isPlayerNearAndBelow) {
                    this.state = "drop";
                    this.dy += 0.05;
                }
            }
            if (this.state == "drop" && this.dy == 0)
                this.state = "pause";
            if (this.state == "drop") {
                this.dy += 0.05;
                if (this.dy > 1.5)
                    this.dy = 1.5;
            }
            if (this.state == "pause") {
                this.pauseTimer++;
                if (this.pauseTimer > 30) {
                    this.state = "rise";
                    this.pauseTimer = 0;
                }
            }
            if (this.state == "rise") {
                this.riseTimer = (this.riseTimer + 1) % this.riseDys.length;
                this.dy = this.riseDys[Math.floor(this.riseTimer / 2)] / 1;
                if (this.y < this.targetY) {
                    this.state = "rest";
                    this.y = this.targetY;
                    this.dy = 0;
                }
            }
            this.ReactToWater();
        }
    };
    Spurpider.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
    };
    Spurpider.prototype.GetFrameData = function (frameNum) {
        var frameCol = 0;
        if (!this.isInDeathAnimation) {
            if (this.dy > 0)
                frameCol = 1;
            if (this.dy < 0)
                frameCol = 2;
            if (this.state == "rest")
                frameCol = 3;
        }
        return {
            imageTile: tiles["spider"][frameCol][this.isInDeathAnimation ? 1 : 0],
            xFlip: Math.floor((frameNum % 20) / 10) == 0,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    };
    return Spurpider;
}(Enemy));
