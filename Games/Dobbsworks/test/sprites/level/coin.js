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
var Coin = /** @class */ (function (_super) {
    __extends(Coin, _super);
    function Coin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = false;
        _this.anchor = null;
        _this.imageSource = "coin";
        _this.border = 1;
        _this.sound = "coin";
        _this.isTouched = false;
        _this.touchTimer = 0;
        return _this;
    }
    Coin.prototype.Update = function () {
        if (this.isTouched) {
            this.touchTimer++;
            this.y -= 0.25;
            if (this.touchTimer > 60)
                this.isActive = false;
        }
        else {
            var player_1 = this.layer.sprites.find(function (a) { return a instanceof Player; });
            if (player_1 && player_1.Overlaps(this)) {
                this.isTouched = true;
                audioHandler.PlaySound(this.sound, false);
                if (this instanceof Dobbloon) {
                    this.layer.sprites.push(new Points(this.x, this.y, this.layer, []));
                }
            }
        }
    };
    Coin.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 10) % 6;
        var frameRow = 0;
        if (this.isTouched) {
            frame = Math.floor(frameNum / 3) % 6;
            frameRow = Math.ceil(this.touchTimer / 20);
            if (frameRow > 3)
                frameRow = 3;
        }
        return {
            imageTile: tiles[this.imageSource][frame][frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: this.border,
            yOffset: this.border
        };
    };
    return Coin;
}(Sprite));
var Dobbloon = /** @class */ (function (_super) {
    __extends(Dobbloon, _super);
    function Dobbloon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 14;
        _this.width = 14;
        _this.border = 2;
        _this.imageSource = "dobbloon";
        _this.sound = "dobbloon";
        return _this;
    }
    return Dobbloon;
}(Coin));