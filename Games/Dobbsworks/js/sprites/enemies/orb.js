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
var Orbbit = /** @class */ (function (_super) {
    __extends(Orbbit, _super);
    function Orbbit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = true;
        _this.canSpinBounceOn = true;
        _this.bumpsEnemies = false;
        _this.frameCol = 0;
        _this.connectedSprite = null;
        _this.connectionDistance = 0;
        _this.theta = -Math.PI / 2;
        return _this;
    }
    Orbbit.prototype.Update = function () {
        var _this = this;
        if (!this.connectedSprite) {
            // search for sprite below
            var possibleConnectionSprites = this.layer.sprites.filter(function (a) { return a.x < _this.xRight && a.xRight > _this.x && a.yMid >= _this.yBottom && !(a instanceof Player || a instanceof DeadEnemy); });
            if (possibleConnectionSprites.length) {
                possibleConnectionSprites.sort(function (a, b) { return a.y - b.y; });
                var targetSprite = possibleConnectionSprites[0];
                // check for cyclical reference
                var iter = targetSprite;
                var circularRefFound = false;
                while (iter instanceof Orbbit) {
                    if (!iter.connectedSprite)
                        break;
                    iter = iter.connectedSprite;
                    if (iter == this) {
                        circularRefFound = true;
                        break;
                    }
                }
                if (!circularRefFound) {
                    this.connectedSprite = targetSprite;
                    this.connectionDistance = Math.sqrt(Math.pow((this.connectedSprite.yMid - this.yMid), 2) + Math.pow((this.connectedSprite.xMid - this.xMid), 2));
                    this.theta = Math.atan2(this.connectedSprite.yMid - this.yMid, this.connectedSprite.xMid - this.xMid);
                }
            }
        }
        else if (this.connectedSprite) {
            this.stackedOn = null;
            // theta change is based on orbit radius
            var deltaTheta = 1 / this.connectionDistance;
            this.theta += deltaTheta;
            var targetX = this.connectedSprite.xMid + this.connectionDistance * -Math.cos(this.theta);
            var targetY = (this.connectedSprite.yMid + this.connectionDistance * -Math.sin(this.theta));
            this.dx = targetX - this.xMid;
            this.dy = targetY - this.yMid;
            if (!this.connectedSprite.isActive)
                this.connectedSprite = null;
        }
        if (!this.connectedSprite) {
            this.dx = 0;
            this.dy = 0;
        }
    };
    Orbbit.prototype.OnBounce = function () {
        this.isActive = false;
        var deadSprite = new DeadEnemy(this);
        this.layer.sprites.push(deadSprite);
        this.OnDead();
    };
    Orbbit.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Orbbit.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["orb"][this.frameCol][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return Orbbit;
}(Enemy));
var Keplurk = /** @class */ (function (_super) {
    __extends(Keplurk, _super);
    function Keplurk() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canBeBouncedOn = false;
        _this.frameCol = 1;
        return _this;
    }
    Keplurk.prototype.OnSpinBounce = function () { };
    return Keplurk;
}(Orbbit));
