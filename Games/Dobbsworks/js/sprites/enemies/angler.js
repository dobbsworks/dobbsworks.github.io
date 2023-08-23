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
var Angler = /** @class */ (function (_super) {
    __extends(Angler, _super);
    function Angler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = true;
        _this.disguise = null;
        _this.revealTimer = 0;
        return _this;
    }
    Angler.prototype.OnMapLoad = function () {
        var _this = this;
        // check for disguise
        var sprite = this.layer.sprites.find(function (a) { return a.x < _this.xMid && a.xRight > _this.xMid && a.y < _this.yBottom + 6 && a.yBottom > _this.yBottom + 6; });
        if (sprite) {
            sprite.isActive = false;
            var fd = sprite.GetFrameData(0);
            if ('xFlip' in fd) {
                this.disguise = fd;
            }
            else {
                this.disguise = fd[0];
            }
            if (this.disguise.imageTile == tiles["empty"][0][0]) {
                this.disguise = null;
                sprite.isActive = true;
            }
        }
    };
    Angler.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.isInWater = this.IsInWater();
        var p = this.layer.sprites.find(function (a) { return a instanceof Player; });
        if (p) {
            if (this.disguise) {
                this.damagesPlayer = false;
                if (this.revealTimer == 0) {
                    var playerDistance = Math.sqrt(Math.pow((this.xMid - p.xMid), 2) + Math.pow((this.yMid - p.yMid), 2));
                    if (playerDistance < 18) {
                        this.revealTimer = 1;
                        audioHandler.PlaySound("reveal", true);
                    }
                }
                else {
                    this.revealTimer++;
                    if (this.revealTimer >= 120) {
                        this.damagesPlayer = true;
                        this.disguise = null;
                    }
                }
            }
            else {
                var targetX = p.xMid;
                var targetY = this.isInWater ? p.yMid : this.yMid;
                var theta = Math.atan2(targetY - this.yMid, targetX - this.xMid);
                var targetSpeed = 1.0;
                var accel = 0.010;
                this.AccelerateHorizontally(accel, targetSpeed * Math.cos(theta));
                this.AccelerateVertically(accel, targetSpeed * Math.sin(theta));
                this.direction = p.xMid < this.xMid ? -1 : 1;
            }
        }
        if (!this.isInWater) {
            if (!this.isInWater && this.dy < 0)
                this.dy = 0;
            this.ApplyGravity();
            this.ApplyInertia();
        }
    };
    Angler.prototype.GetFrameData = function (frameNum) {
        var frames = [1, 2, 3, 2, 1, 0];
        var frame = frames[Math.floor(frameNum / 5) % frames.length];
        var ret = [{
                imageTile: tiles["angler"][frame][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: 4,
                yOffset: 4
            }];
        if (this.disguise) {
            if (Math.floor(this.revealTimer / 5) % 2 == 0) {
                ret = [this.disguise];
            }
        }
        if (editorHandler.isInEditMode) {
            ret.push({
                imageTile: tiles["itemWrapper"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 1.5,
                yOffset: -9
            });
        }
        return ret;
    };
    return Angler;
}(Enemy));
