"use strict";
var Camera = /** @class */ (function () {
    function Camera(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 9999;
        this.maxX = 0;
        this.maxY = 0;
        this.minX = 0;
        this.minY = 0;
        this.scale = 4;
        this.target = null;
        this.targetScale = 4;
        this.defaultScale = 4;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }
    Camera.prototype.Update = function () {
        if (this.target) {
            this.x = this.target.xMid;
            this.y = this.target.yBottom - 12;
        }
        if (this.targetScale < 1)
            this.targetScale = 1;
        if (this.targetScale > 8)
            this.targetScale = 8;
        if (this.scale != this.targetScale) {
            if (Math.abs(this.scale - this.targetScale) < 0.03)
                this.scale = this.targetScale;
            else {
                if (editorHandler.isInEditMode) {
                    this.scale += (this.targetScale - this.scale) * 0.05;
                }
                else {
                    this.scale += (this.targetScale - this.scale) * 0.01;
                }
            }
        }
        if (currentMap) {
            var minScaleForY = camera.canvas.height / currentMap.mainLayer.GetMaxY();
            var minScaleForX = camera.canvas.width / currentMap.mainLayer.GetMaxX();
            var minScale = Math.max(minScaleForX, minScaleForY);
            if (this.targetScale < minScale)
                this.targetScale = minScale;
            if (this.scale < minScale)
                this.scale = minScale;
            this.maxX = currentMap.mainLayer.GetMaxX() - this.canvas.width / 2 / this.scale;
            this.maxY = currentMap.mainLayer.GetMaxY() - this.canvas.height / 2 / this.scale;
            if (this.x > this.maxX)
                this.x = this.maxX;
            if (this.y > this.maxY)
                this.y = this.maxY;
            this.minX = this.canvas.width / 2 / this.scale;
            this.minY = this.canvas.height / 2 / this.scale;
            if (this.x < this.minX)
                this.x = this.minX;
            if (this.y < this.minY)
                this.y = this.minY;
        }
    };
    Camera.prototype.Clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return Camera;
}());
