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
var RollingSnailShell = /** @class */ (function (_super) {
    __extends(RollingSnailShell, _super);
    function RollingSnailShell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeBouncedOn = true;
        _this.direction = 1;
        _this.wallBounceTimer = 0;
        _this.floatsInWater = true;
        _this.hurtsEnemies = true;
        return _this;
    }
    RollingSnailShell.prototype.Update = function () {
        this.ApplyGravity();
        if (this.isTouchingLeftWall) {
            this.direction = 1;
            this.ledgeGrabDistance = 1;
            this.wallBounceTimer = 0;
        }
        else if (this.isTouchingRightWall) {
            this.direction = -1;
            this.ledgeGrabDistance = 1;
            this.wallBounceTimer = 0;
        }
        this.wallBounceTimer++;
        if (this.wallBounceTimer > 3) {
            this.ledgeGrabDistance = 3;
        }
        var baseSpeed = 1.2; //should be equal to player run speed
        if (this.age < 12) {
            this.dx = this.direction * 1.5 * baseSpeed;
        }
        else if (this.age < 22) {
            this.dx = this.direction * 1.3 * baseSpeed;
        }
        else if (this.age < 30) {
            this.dx = this.direction * 1.15 * baseSpeed;
        }
        else {
            this.dx = this.direction * baseSpeed;
        }
        this.ApplyInertia();
        this.ReactToWater();
        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        }
        else {
            this.rotation -= this.GetTotalDx() / 2;
        }
    };
    RollingSnailShell.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    RollingSnailShell.prototype.OnBounce = function () {
        var shell = this.ReplaceWithSpriteType(SnailShell);
        shell.dx = 0;
        shell.dy = 0;
    };
    RollingSnailShell.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["snail"]).length - 2;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = 9 - Math.floor(rot / (Math.PI * 2) * totalFrames) || 1;
        if (frame < 0)
            frame = 0;
        var row = this.framesSinceThrown < 25 ? 1 : 0;
        return {
            imageTile: tiles["snail"][frame][row],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return RollingSnailShell;
}(Enemy));
