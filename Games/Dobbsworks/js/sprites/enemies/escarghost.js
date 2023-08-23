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
var Escarghost = /** @class */ (function (_super) {
    __extends(Escarghost, _super);
    function Escarghost() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.isDestroyedByLight = true;
        _this.killedByProjectiles = false;
        _this.patrolTimer = 0;
        return _this;
    }
    Escarghost.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Escarghost.prototype.OnBounce = function () {
        var shell = this.ReplaceWithSpriteType(SnailShell);
        shell.dx = 0;
        shell.dy = 0;
    };
    Escarghost.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.ApplyInertia();
        this.ReactToWater();
        this.AccelerateHorizontally(0.01, 0.2 * this.direction);
        this.ReactToVerticalWind();
        this.AccelerateVertically(0.01, Math.sin(this.age / 40) / 20);
        this.patrolTimer++;
        if (this.patrolTimer > 300) {
            this.patrolTimer = 0;
            this.direction *= -1;
        }
        var backdropTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetBackdropNeighbor();
        var isOnBackdrop = ((backdropTile === null || backdropTile === void 0 ? void 0 : backdropTile.tileType) != TileType.Air);
        this.canBeBouncedOn = !isOnBackdrop;
        this.killedByProjectiles = !isOnBackdrop;
    };
    Escarghost.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["escarghost"][col][this.canBeBouncedOn ? 1 : 0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    };
    return Escarghost;
}(Enemy));
