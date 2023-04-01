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
var Doopster = /** @class */ (function (_super) {
    __extends(Doopster, _super);
    function Doopster() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = false;
        _this.isSolidBox = true;
        _this.hasRider = false;
        _this.duplicationTimer = 0;
        _this.sourceSprite = null;
        _this.duplicateSprite = null;
        return _this;
    }
    Doopster.prototype.Update = function () {
        var _this = this;
        var riders = this.layer.sprites.filter(function (a) { return a.parentSprite == _this; });
        this.hasRider = riders.length > 0;
        if (!this.sourceSprite || !this.sourceSprite.isActive || !this.duplicateSprite || !this.duplicateSprite.isActive) {
            this.duplicateSprite = null;
            if (riders.length == 1) {
                var toDuplicate = riders[0];
                if (this.sourceSprite == toDuplicate) {
                    this.duplicationTimer++;
                }
                else {
                    this.duplicationTimer = 0;
                    this.sourceSprite = toDuplicate;
                }
                if (this.duplicationTimer >= 60) {
                    this.CreateDuplicate();
                    this.duplicationTimer = 0;
                }
            }
            else {
                this.duplicationTimer = 0;
            }
        }
        this.dx *= 0.9;
        this.dy *= 0.9;
    };
    Doopster.prototype.CreateDuplicate = function () {
        if (this.sourceSprite) {
            var spriteType = this.sourceSprite.constructor;
            this.duplicateSprite = new spriteType(this.xMid - this.sourceSprite.width / 2, this.sourceSprite.y + 12 + this.sourceSprite.height, this.sourceSprite.layer, []);
            this.duplicateSprite.age = this.sourceSprite.age;
            this.duplicateSprite.isDuplicate = true;
            this.layer.sprites.push(this.duplicateSprite);
            this.layer.sprites.push(new Poof(this.duplicateSprite.xMid - 8, this.duplicateSprite.yMid - 8, this.layer, []));
            if (this.IsOnScreen()) {
                audioHandler.PlaySound("bap", true);
                audioHandler.PlaySound("pomp", true);
            }
        }
    };
    Doopster.prototype.GetIsPowered = function () {
        var _a;
        var tile = (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByPixel(this.xMid, this.yMid);
        return (tile === null || tile === void 0 ? void 0 : tile.isPowered()) || false;
    };
    Doopster.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.duplicationTimer > 0) {
            col = Math.floor(this.duplicationTimer / 3) % 5 + 1;
        }
        else if (this.hasRider) {
            col = 6;
        }
        return {
            imageTile: tiles["doopster"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    };
    return Doopster;
}(Sprite));
