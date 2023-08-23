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
var Skitter = /** @class */ (function (_super) {
    __extends(Skitter, _super);
    function Skitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.unhideTimer = 0;
        _this.isHiding = false;
        _this.isClimbing = false;
        return _this;
    }
    Skitter.prototype.Update = function () {
        var _this = this;
        if (!this.WaitForOnScreen())
            return;
        var players = this.layer.sprites.filter(function (a) { return a instanceof Player; });
        players.sort(function (a, b) { return Math.abs(a.xMid - _this.xMid) + Math.abs(a.yMid - _this.yMid) - Math.abs(b.xMid - _this.xMid) - Math.abs(b.yMid - _this.yMid); });
        if (players.length > 0) {
            var p = players[0];
            var isPlayerFacing = (p.direction == 1 && p.xRight <= this.x) || (p.direction == -1 && p.x >= this.xRight);
            if (isPlayerFacing) {
                this.unhideTimer = 0;
            }
            else {
                this.unhideTimer++;
            }
            this.isHiding = this.unhideTimer < 20;
            if (!this.isHiding) {
                this.direction = (p.xMid < this.xMid ? -1 : 1);
                this.AccelerateHorizontally(0.3, 0.5 * this.direction);
                if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0) {
                    this.dy += -0.1;
                    if (this.dy < -0.5)
                        this.dy = -0.5;
                    this.isClimbing = true;
                }
                else {
                    this.isClimbing = false;
                }
            }
        }
        if (!this.isClimbing) {
            this.ApplyGravity();
        }
        if (this.isClimbing && this.isHiding) {
            this.dy *= 0.9;
        }
        this.ApplyInertia();
        this.ReactToWater();
    };
    Skitter.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 20) % 2;
        if (this.isHiding)
            col = 2;
        var xOffset = 2;
        var yOffset = 4;
        if (this.isClimbing) {
            col += 3;
            xOffset = this.direction == 1 ? 4 : 0;
            yOffset = 2;
        }
        return {
            imageTile: tiles["skitter"][col][0],
            xFlip: this.direction == -1,
            yFlip: false,
            xOffset: xOffset,
            yOffset: yOffset
        };
    };
    return Skitter;
}(Enemy));
