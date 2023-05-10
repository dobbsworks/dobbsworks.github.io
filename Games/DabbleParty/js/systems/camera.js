"use strict";
var Camera = /** @class */ (function () {
    function Camera(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.minX = 0;
        this.minY = 0;
        this.scale = 1;
        this.targetScale = 1;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }
    Camera.prototype.Update = function () {
        this.prevX = this.x;
        this.prevY = this.y;
        if (this.targetScale < 1)
            this.targetScale = 1;
        if (this.targetScale > 8)
            this.targetScale = 8;
        if (this.scale != this.targetScale) {
            if (Math.abs(this.scale - this.targetScale) < 0.03)
                this.scale = this.targetScale;
            else
                this.scale += (this.targetScale - this.scale) * 0.01;
        }
        this.x = this.targetX;
        this.y = this.targetY;
    };
    Camera.prototype.SnapCamera = function () {
        this.x = this.targetX;
        this.y = this.targetY;
    };
    // public GetLeftCameraEdge(): number {
    //     return this.targetX - this.canvas.width / 2 / this.scale;
    // }
    // public GetRightCameraEdge(): number {
    //     return this.targetX + this.canvas.width / 2 / this.scale;
    // }
    // public GetTopCameraEdge(): number {
    //     return this.targetY - this.canvas.height / 2 / this.scale;
    // }
    // public GetBottomCameraEdge(): number {
    //     return this.targetY + this.canvas.height / 2 / this.scale;
    // }
    Camera.prototype.Clear = function () {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    };
    return Camera;
}());
