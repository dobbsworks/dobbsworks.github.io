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
var SnouterBullet = /** @class */ (function (_super) {
    __extends(SnouterBullet, _super);
    function SnouterBullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.bumpsEnemies = false;
        _this.frameCols = [0, 1, 2, 3];
        _this.frameRow = 1;
        return _this;
    }
    SnouterBullet.prototype.Update = function () {
        this.ApplyInertia();
        this.ReactToWater();
        if (this.isTouchingLeftWall || this.isTouchingRightWall) {
            this.Crumble();
        }
    };
    SnouterBullet.prototype.OnBounce = function () {
        this.Crumble();
    };
    SnouterBullet.prototype.Crumble = function () {
        this.isActive = false;
        var crumble = new PrickleEggCrumble(this.x, this.y, this.layer, []);
        crumble.dy = this.dy;
        this.layer.sprites.push(crumble);
    };
    SnouterBullet.prototype.GetFrameData = function (frameNum) {
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
    return SnouterBullet;
}(Enemy));
var PricklySnouterBullet = /** @class */ (function (_super) {
    __extends(PricklySnouterBullet, _super);
    function PricklySnouterBullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameCols = [0, 1, 2, 3, 2, 1];
        _this.frameRow = 0;
        _this.canBeBouncedOn = false;
        _this.canSpinBounceOn = true;
        return _this;
    }
    return PricklySnouterBullet;
}(SnouterBullet));
