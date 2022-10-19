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
var SpriteKiller = /** @class */ (function (_super) {
    __extends(SpriteKiller, _super);
    function SpriteKiller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        return _this;
    }
    SpriteKiller.prototype.Update = function () {
        var _this = this;
        var overlappers = this.layer.sprites.filter(function (a) { return !(a instanceof Player) &&
            !(a instanceof DeadPlayer) &&
            !(a instanceof Poof) &&
            a.Overlaps(_this); });
        for (var _i = 0, overlappers_1 = overlappers; _i < overlappers_1.length; _i++) {
            var overlapper = overlappers_1[_i];
            overlapper.ReplaceWithSpriteType(Poof);
        }
        if (overlappers.length > 0) {
            audioHandler.PlaySound("erase", true);
        }
    };
    SpriteKiller.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][3][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return SpriteKiller;
}(Sprite));
