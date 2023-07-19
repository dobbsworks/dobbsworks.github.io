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
        this.name = "";
        this.age = 0;
        this.xScale = 1;
        this.yScale = 1;
        this.scrollSpeed = 1;
    }
    Sprite.prototype.Draw = function (camera) {
        var fd = this.GetFrameData(0);
        if ('xFlip' in fd)
            fd.imageTile.Draw(camera, this.x + fd.xOffset, this.y + fd.yOffset, this.xScale, this.yScale, fd.xFlip, fd.yFlip, this.rotation, this.scrollSpeed);
        else {
            for (var _i = 0, fd_1 = fd; _i < fd_1.length; _i++) {
                var f = fd_1[_i];
                f.imageTile.Draw(camera, this.x + f.xOffset, this.y + f.yOffset, this.xScale, this.yScale, f.xFlip, f.yFlip, this.rotation, this.scrollSpeed);
            }
        }
    };
    Sprite.prototype.Scale = function (ratio) {
        this.width *= ratio;
        this.height *= ratio;
        this.xScale *= ratio;
        this.yScale *= ratio;
        return this;
    };
    Sprite.prototype.SetScrollSpeed = function (value) {
        this.scrollSpeed = value;
        return this;
    };
    Sprite.prototype.Overlaps = function (sprite) {
        if (!this.isActive)
            return false;
        if (!sprite.isActive)
            return false;
        return this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y;
    };
    Sprite.prototype.DistanceBetweenCenters = function (sprite) {
        return Math.sqrt(Math.pow((this.x - sprite.x), 2) + Math.pow((this.y - sprite.y), 2));
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
    SimpleSprite.prototype.Animate = function (animationSpeed) {
        if (currentMinigame && this.imageTile) {
            var totalFrames = this.imageTile.tileMap.rows * this.imageTile.tileMap.cols;
            var frameIndex = Math.floor(animationSpeed * currentMinigame.timer) % totalFrames;
            var col = frameIndex % this.imageTile.tileMap.cols;
            var row = Math.floor(frameIndex / this.imageTile.tileMap.cols);
            this.imageTile = this.imageTile.tileMap[col][row];
        }
    };
    return SimpleSprite;
}(Sprite));
var ScoreSprite = /** @class */ (function (_super) {
    __extends(ScoreSprite, _super);
    function ScoreSprite(x, y, index) {
        if (index === void 0) { index = 0; }
        var _this = _super.call(this, x, y) || this;
        _this.index = index;
        _this.width = 0;
        _this.height = 0;
        return _this;
    }
    ScoreSprite.prototype.Update = function () {
        this.y -= 2;
        if (this.age >= 33)
            this.isActive = false;
    };
    ScoreSprite.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["texts"][0][this.index],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ScoreSprite;
}(Sprite));
