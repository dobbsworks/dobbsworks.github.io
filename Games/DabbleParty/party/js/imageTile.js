"use strict";
var ImageTile = /** @class */ (function () {
    function ImageTile(src, xSrc, ySrc, width, height) {
        this.src = src;
        this.xSrc = xSrc;
        this.ySrc = ySrc;
        this.width = width;
        this.height = height;
        // Image tile represents a rectangular slice of a larger image file
        this.yOffset = 0;
        this.xOffset = 0;
    }
    ImageTile.prototype.Draw = function (ctx, destX, destY, zoom, xFlip, yFlip, scale) {
        if (xFlip === void 0) { xFlip = false; }
        if (yFlip === void 0) { yFlip = false; }
        if (scale === void 0) { scale = 1; }
        destY += this.yOffset;
        destX += this.xOffset;
        if (xFlip || yFlip)
            ctx.scale(xFlip ? -1 : 1, yFlip ? -1 : 1);
        // shaving off fractional pixels to hopefully reduce drawing from neighboring tiles
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2, xFlip ? -destX - this.width * zoom : destX, yFlip ? -destY - this.width * zoom : destY, this.width * zoom * scale, this.height * zoom * scale);
        if (xFlip || yFlip)
            ctx.scale(xFlip ? -1 : 1, yFlip ? -1 : 1);
    };
    ImageTile.prototype.DrawToScreen = function (ctx, canvasX, canvasY, scale) {
        if (scale === void 0) { scale = 4; }
        canvasY += this.yOffset;
        canvasX += this.xOffset;
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2, canvasX, canvasY, this.width * scale, this.height * scale);
    };
    return ImageTile;
}());
