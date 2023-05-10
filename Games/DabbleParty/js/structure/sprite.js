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
var Sprite = /** @class */ (function () {
    function Sprite(x, y) {
        this.x = x;
        this.y = y;
        this.collides = false;
        this.isActive = true;
        this.rotation = 0;
        this.dx = 0;
        this.dy = 0;
        this.xScale = 1;
        this.yScale = 1;
    }
    Sprite.prototype.Draw = function (camera) {
        var fd = this.GetFrameData(0);
        if (fd)
            fd.imageTile.Draw(camera, this.x, this.y, this.xScale, this.yScale, fd.xFlip, fd.yFlip, this.rotation);
    };
    Sprite.prototype.Scale = function (ratio) {
        this.width *= ratio;
        this.height *= ratio;
        this.xScale *= ratio;
        this.yScale *= ratio;
        return this;
    };
    return Sprite;
}());
var SimpleSprite = /** @class */ (function (_super) {
    __extends(SimpleSprite, _super);
    function SimpleSprite(x, y, imageTile, logic) {
        if (logic === void 0) { logic = function () { }; }
        var _this = _super.call(this, x, y) || this;
        _this.imageTile = imageTile;
        _this.logic = logic;
        _this.width = imageTile.width;
        _this.height = imageTile.height;
        return _this;
    }
    SimpleSprite.prototype.Update = function () {
        this.logic(this);
    };
    SimpleSprite.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: this.imageTile,
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return SimpleSprite;
}(Sprite));
