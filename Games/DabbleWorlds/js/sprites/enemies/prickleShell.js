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
var PrickleShell = /** @class */ (function (_super) {
    __extends(PrickleShell, _super);
    function PrickleShell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.jumpTimer = 0;
        _this.frameCols = [0, 1, 2, 3, 2, 1];
        _this.frameRow = 0;
        return _this;
    }
    PrickleShell.prototype.Update = function () {
        if (this.isOnGround) {
            this.dy = -1;
            this.jumpTimer = 0;
        }
        if (this.isOnCeiling) {
            this.jumpTimer = 9999;
        }
        this.jumpTimer++;
        if (this.jumpTimer > 20) {
            this.ApplyGravity();
        }
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        this.EnemyUpdate();
    };
    PrickleShell.prototype.GetFrameData = function (frameNum) {
        var frames = this.frameCols;
        var frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle-egg"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return PrickleShell;
}(Enemy));
var PrickleEgg = /** @class */ (function (_super) {
    __extends(PrickleEgg, _super);
    function PrickleEgg() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canBeBouncedOn = true;
        _this.frameCols = [0, 1, 2, 3];
        _this.frameRow = 0;
        return _this;
    }
    return PrickleEgg;
}(PrickleShell));
