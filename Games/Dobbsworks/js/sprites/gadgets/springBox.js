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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var SpringBox = /** @class */ (function (_super) {
    __extends(SpringBox, _super);
    function SpringBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        _this.springTimers = [0, 0, 0, 0];
        return _this;
    }
    //                      right, down, left, up
    SpringBox.prototype.Update = function () {
        var _this = this;
        this.ApplyInertia();
        this.MoveByVelocity();
        for (var i = 0; i < this.springTimers.length; i++) {
            if (this.springTimers[i] > -1)
                this.springTimers[i]--;
        }
        var bounceSpeed = 2;
        var timerResetValue = 30;
        var overlappingSprites = this.layer.sprites.filter(function (a) { return a.Overlaps(_this); });
        for (var _i = 0, overlappingSprites_1 = overlappingSprites; _i < overlappingSprites_1.length; _i++) {
            var sprite = overlappingSprites_1[_i];
            var deltaY = sprite.yMid - this.yMid;
            var deltaX = sprite.xMid - this.xMid;
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // vertical bounce
                if (deltaY > 0) {
                    // bounce down
                    sprite.dy = bounceSpeed;
                    this.springTimers[1] = timerResetValue;
                }
                else {
                    // bounce up
                    sprite.dy = -bounceSpeed * 1.6;
                    this.springTimers[3] = timerResetValue;
                }
            }
            else {
                // horizontal bounce
                sprite.dy -= 0.3;
                if (sprite instanceof Enemy) {
                    sprite.direction = sprite.direction == -1 ? 1 : -1;
                }
                if (deltaX > 0) {
                    // bounce right
                    this.springTimers[0] = timerResetValue;
                    this.LaunchSprite(sprite, 1);
                }
                else {
                    // bounce left
                    this.springTimers[2] = timerResetValue;
                    this.LaunchSprite(sprite, -1);
                }
            }
            audioHandler.PlaySound("boing", true);
        }
    };
    SpringBox.prototype.GetFrameData = function (frameNum) {
        var _this = this;
        if (frameNum == 0) {
            return [{
                    imageTile: tiles["springbox"][0][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 0,
                    yOffset: 0
                }];
        }
        var sides = [0, 1, 2, 3].map(function (a) {
            var timer = _this.springTimers[a];
            var offset = [1, 2, 3, 4, 5, 6, 6, 5, 4, 4, 5, 6, 6, 5, 4,
                4, 5, 5, 4, 3, 3, 4, 4, 3, 2, 2, 3, 3, 2, 1][timer] || 0;
            return {
                imageTile: tiles["springbox"][a][1],
                xFlip: false,
                yFlip: false,
                xOffset: (a == 0 || a == 2) ? (a == 0 ? -offset : offset) : 0,
                yOffset: !(a == 0 || a == 2) ? (a == 1 ? -offset : offset) : 0
            };
        });
        return __spreadArrays(sides, [{
                imageTile: tiles["springbox"][1][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }]);
    };
    return SpringBox;
}(Sprite));
