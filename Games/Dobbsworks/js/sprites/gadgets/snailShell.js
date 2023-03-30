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
var SnailShell = /** @class */ (function (_super) {
    __extends(SnailShell, _super);
    function SnailShell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = true;
        _this.canMotorHold = false;
        return _this;
    }
    SnailShell.prototype.Update = function () {
        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        }
        else {
            this.rotation -= this.GetTotalDx() / 2;
        }
        if (this.age > 10) {
            var players = (this.layer.sprites.filter(function (a) { return a instanceof Player; }));
            for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                var player_1 = players_1[_i];
                if (player_1 && player_1.heldItem != this && player_1.Overlaps(this)) {
                    var oldDy = this.dy;
                    var newShell = this.OnThrow(player_1, player_1.x < this.x ? 1 : -1);
                    newShell.dy = oldDy;
                }
            }
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    SnailShell.prototype.OnDownThrow = function (thrower, direction) {
        _super.prototype.OnDownThrow.call(this, thrower, direction);
        this.age = 0;
    };
    SnailShell.prototype.OnUpThrow = function (thrower, direction) {
        _super.prototype.OnUpThrow.call(this, thrower, direction);
        this.age = 0;
    };
    SnailShell.prototype.OnThrow = function (thrower, direction) {
        this.isActive = false;
        var shell = this.ReplaceWithSpriteType(RollingSnailShell);
        shell.age = 0;
        shell.framesSinceThrown = 0;
        shell.direction = direction;
        if (!(thrower instanceof Player))
            shell.framesSinceThrown = 100;
        return shell;
    };
    SnailShell.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["snail"]).length - 2;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = 9 - Math.floor(rot / (Math.PI * 2) * totalFrames) || 1;
        if (frame < 0)
            frame = 0;
        return {
            imageTile: tiles["snail"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return SnailShell;
}(Sprite));
