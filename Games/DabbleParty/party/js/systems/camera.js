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
        if (this.targetScale < 0.421875)
            this.targetScale = 0.421875;
        if (this.targetScale > 8)
            this.targetScale = 8;
        if (this.scale != this.targetScale) {
            //this.scale = this.targetScale;
            // this.x = this.targetX;
            // this.y = this.targetY;
            if (Math.abs(this.scale - this.targetScale) < 0.001)
                this.scale = this.targetScale;
            else
                this.scale += (this.targetScale - this.scale) * 0.1;
        }
        if (this.x != this.targetX) {
            if (Math.abs(this.x - this.targetX) < 0.001)
                this.x = this.targetX;
            else
                this.x += (this.targetX - this.x) * 0.1;
        }
        if (this.y != this.targetY) {
            if (Math.abs(this.y - this.targetY) < 0.001)
                this.y = this.targetY;
            else
                this.y += (this.targetY - this.y) * 0.1;
        }
    };
    Camera.prototype.SnapCamera = function () {
        this.x = this.targetX;
        this.y = this.targetY;
    };
    Camera.prototype.GameCoordToCanvas = function (gameX, gameY) {
        var x = camera.canvas.width / 2 - (-gameX + camera.x) * camera.scale;
        var y = camera.canvas.height / 2 - (-gameY + camera.y) * camera.scale;
        return { canvasX: x, canvasY: y };
    };
    Camera.prototype.GetLeftCameraEdge = function () {
        return this.targetX - this.canvas.width / 2 / this.scale;
    };
    Camera.prototype.SetLeftCameraEdge = function (value) {
        this.targetX = value + this.canvas.width / 2 / this.scale;
    };
    Camera.prototype.GetRightCameraEdge = function () {
        return this.targetX + this.canvas.width / 2 / this.scale;
    };
    Camera.prototype.SetRightCameraEdge = function (value) {
        this.targetX = value - this.canvas.width / 2 / this.scale;
    };
    Camera.prototype.GetTopCameraEdge = function () {
        return this.targetY - this.canvas.height / 2 / this.scale;
    };
    Camera.prototype.SetTopCameraEdge = function (value) {
        this.targetY = value + this.canvas.height / 2 / this.scale;
    };
    Camera.prototype.GetBottomCameraEdge = function () {
        return this.targetY + this.canvas.height / 2 / this.scale;
    };
    Camera.prototype.SetBottomCameraEdge = function (value) {
        this.targetY = value - this.canvas.height / 2 / this.scale;
    };
    Camera.prototype.Clear = function () {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    };
    return Camera;
}());
