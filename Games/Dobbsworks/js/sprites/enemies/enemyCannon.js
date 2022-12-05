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
var Blaster = /** @class */ (function (_super) {
    __extends(Blaster, _super);
    function Blaster() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 6;
        _this.respectsSolidTiles = false;
        _this.damagesPlayer = false;
        _this.anchor = null;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.killedByProjectiles = false;
        _this.timer = 0;
        _this.stateNum = 0;
        return _this;
    }
    // 0 for right, 1 for upright pre fire, 2 for upright post fire
    Blaster.prototype.Update = function () {
        this.timer++;
        if (this.timer > 40) {
            this.timer = 0;
            this.stateNum++;
            if (this.stateNum > 11)
                this.stateNum = 0;
            if (this.stateNum % 3 == 2)
                this.Fire();
        }
    };
    Blaster.prototype.Fire = function () {
        var poof = new Poof(this.xMid, this.yMid, this.layer, []);
        poof.x -= poof.width / 2;
        poof.y -= poof.height / 2;
        this.layer.sprites.push(poof);
        if (this.stateNum == 2 || this.stateNum == 5)
            poof.dy = -1;
        if (this.stateNum == 8 || this.stateNum == 11)
            poof.dy = 1;
        if (this.stateNum == 2 || this.stateNum == 11)
            poof.dx = 1;
        if (this.stateNum == 5 || this.stateNum == 8)
            poof.dx = -1;
        poof.x += poof.dx * 6;
        poof.y += poof.dy * 6;
        var bullet = new BlasterBullet(this.xMid, this.yMid, this.layer, []);
        bullet.x = poof.xMid - bullet.width / 2;
        bullet.y = poof.yMid - bullet.height / 2;
        bullet.dx = poof.dx;
        bullet.dy = poof.dy;
        this.layer.sprites.push(bullet);
    };
    Blaster.prototype.GetFrameData = function (frameNum) {
        var col = 1;
        var horizFlip = false;
        var vertFlip = false;
        if (this.stateNum % 6 == 0)
            col = 0;
        if (this.stateNum % 6 == 3)
            col = 2;
        if (this.stateNum == 4 || this.stateNum == 5)
            horizFlip = true;
        if (this.stateNum == 6)
            horizFlip = true;
        if (this.stateNum == 7 || this.stateNum == 8) {
            horizFlip = true;
            vertFlip = true;
        }
        if (this.stateNum == 9)
            vertFlip = true;
        if (this.stateNum == 10 || this.stateNum == 11)
            vertFlip = true;
        return {
            imageTile: tiles["enemyCannon"][col][0],
            xFlip: horizFlip,
            yFlip: vertFlip,
            xOffset: 3,
            yOffset: 3
        };
    };
    return Blaster;
}(Enemy));
var BlasterBullet = /** @class */ (function (_super) {
    __extends(BlasterBullet, _super);
    function BlasterBullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 4;
        _this.width = 4;
        _this.respectsSolidTiles = true;
        _this.killedByProjectiles = false;
        return _this;
    }
    BlasterBullet.prototype.Update = function () {
        if (this.isTouchingLeftWall || this.isTouchingRightWall || this.isOnCeiling || this.standingOn.length) {
            this.ReplaceWithSpriteType(Poof);
        }
    };
    BlasterBullet.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["enemyCannon"][col][1],
            xFlip: false,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        };
    };
    return BlasterBullet;
}(Enemy));
