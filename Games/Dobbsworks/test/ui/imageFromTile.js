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
var ImageFromTile = /** @class */ (function (_super) {
    __extends(ImageFromTile, _super);
    function ImageFromTile(x, y, width, height, imageTile) {
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        _this.imageTile = imageTile;
        _this.zoom = 4;
        return _this;
    }
    ImageFromTile.prototype.IsMouseOver = function () {
        return mouseHandler.GetCanvasMousePixel().xPixel >= this.x && mouseHandler.GetCanvasMousePixel().xPixel <= this.x + this.width &&
            mouseHandler.GetCanvasMousePixel().yPixel >= this.y && mouseHandler.GetCanvasMousePixel().yPixel <= this.y + this.height;
    };
    ImageFromTile.prototype.GetMouseOverElement = function () { return null; };
    ImageFromTile.prototype.Update = function () { };
    ImageFromTile.prototype.Draw = function (ctx) {
        var zoom = this.zoom;
        //this.imageTile.Draw(ctx, this.x, this.y, 4, false, false);
        var fullImageWidth = this.imageTile.width * zoom;
        var widthClipScale = Math.min(1, this.width / fullImageWidth);
        var fullImageHeight = this.imageTile.height * zoom;
        var heightClipScale = Math.min(1, this.height / fullImageHeight);
        var drawWidth = Math.min(this.width, fullImageWidth);
        var drawHeight = Math.min(this.height, fullImageHeight);
        var offsetX = (this.width - drawWidth) / 2;
        var offsetY = (this.height - drawHeight) / 2;
        try {
            ctx.drawImage(this.imageTile.src, this.imageTile.xSrc + 0.1, this.imageTile.ySrc + 0.1, (this.imageTile.width - 0.2) * widthClipScale, (this.imageTile.height - 0.2) * heightClipScale, this.x + offsetX, this.y + offsetY, drawWidth, drawHeight);
        }
        catch (e) {
            console.log(this.imageTile.src);
        }
    };
    return ImageFromTile;
}(UIElement));
