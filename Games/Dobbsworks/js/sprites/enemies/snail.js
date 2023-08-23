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
var Snail = /** @class */ (function (_super) {
    __extends(Snail, _super);
    function Snail() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        return _this;
    }
    Snail.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.GroundPatrol(0.2, true);
        this.ApplyGravity();
        this.ApplyInertia();
    };
    Snail.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Snail.prototype.OnBounce = function () {
        var shell = this.ReplaceWithSpriteType(SnailShell);
        shell.dx = 0;
        shell.dy = 0;
    };
    Snail.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["snail"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    };
    return Snail;
}(Enemy));
var RubySnail = /** @class */ (function (_super) {
    __extends(RubySnail, _super);
    function RubySnail() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canBeBouncedOn = false;
        return _this;
    }
    RubySnail.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.isOnGround) {
            for (var _i = 0, _a = this.standingOn; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.layer.AttemptToCoatTile(tile.tileX, tile.tileY, TileType.FireTopDecay1);
            }
        }
        this.ReactToWater();
        if (this.isInWater) {
            this.ReplaceWithSpriteType(Snail);
            this.isInWater = false;
        }
    };
    RubySnail.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 5) % 4;
        return {
            imageTile: tiles["rubySnail"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        };
    };
    return RubySnail;
}(Snail));
