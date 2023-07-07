"use strict";
var ImageTile = /** @class */ (function () {
    function ImageTile(src, xSrc, ySrc, width, height, tileMap) {
        this.src = src;
        this.xSrc = xSrc;
        this.ySrc = ySrc;
        this.width = width;
        this.height = height;
        this.tileMap = tileMap;
        // Image tile represents a rectangular slice of a larger image file
        this.yOffset = 0;
        this.xOffset = 0;
    }
    ImageTile.prototype.Draw = function (camera, gameX, gameY, xScale, yScale, xFlip, yFlip, rotation) {
        var ctx = camera.ctx;
        // destY += this.yOffset;
        // destX += this.xOffset;
        // first move the center of the canvas to the center of the object to be drawn
        // next, scale and rotate
        ctx.translate(camera.canvas.width / 2 - (-gameX + camera.x) * camera.scale, camera.canvas.height / 2 - (-gameY + camera.y) * camera.scale);
        ctx.rotate(rotation);
        ctx.scale(xScale * camera.scale * (xFlip ? -1 : 1), yScale * camera.scale * (yFlip ? -1 : 1));
        // finally, draw and restore
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    ImageTile.prototype.DrawToScreen = function (ctx, canvasX, canvasY, scale) {
        if (scale === void 0) { scale = 4; }
        canvasY += this.yOffset;
        canvasX += this.xOffset;
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2, canvasX, canvasY, this.width * scale, this.height * scale);
    };
    return ImageTile;
}());
