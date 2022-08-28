"use strict";
var Camera = /** @class */ (function () {
    function Camera(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 9999;
        this.targetX = 0;
        this.targetY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.minX = 0;
        this.minY = 0;
        this.scale = 4;
        this.target = null;
        this.targetScale = 4;
        this.defaultScale = 4;
        this.transitionTimer = 0;
        this.isAutoscrolling = false;
        this.autoscrollX = 0;
        this.autoscrollY = 0;
        this.autoscrollTriggers = [];
        this.cameraZoomTriggers = [];
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }
    Camera.prototype.Update = function () {
        var _this = this;
        if (this.transitionTimer > 0) {
            var xChange = (this.targetX - this.x) / this.transitionTimer;
            var yChange = (this.targetY - this.y) / this.transitionTimer;
            this.x += xChange;
            this.y += yChange;
            this.transitionTimer--;
            return;
        }
        var onScreenScrollTriggers = this.autoscrollTriggers.filter(function (a) {
            return a.x >= _this.GetLeftCameraEdge() &&
                a.xRight <= _this.GetRightCameraEdge() &&
                a.y >= _this.GetTopCameraEdge() &&
                a.yBottom <= _this.GetBottomCameraEdge();
        });
        if (onScreenScrollTriggers.length) {
            this.isAutoscrolling = true;
            var _loop_1 = function (trigger) {
                this_1.autoscrollX += trigger.direction.x * .25;
                this_1.autoscrollY += trigger.direction.y * .25;
                // remove from list of available triggers
                this_1.autoscrollTriggers = this_1.autoscrollTriggers.filter(function (a) { return a != trigger; });
            };
            var this_1 = this;
            for (var _i = 0, onScreenScrollTriggers_1 = onScreenScrollTriggers; _i < onScreenScrollTriggers_1.length; _i++) {
                var trigger = onScreenScrollTriggers_1[_i];
                _loop_1(trigger);
            }
        }
        var onScreenZoomTriggers = this.cameraZoomTriggers.filter(function (a) {
            return a.x >= _this.GetLeftCameraEdge() &&
                a.xRight <= _this.GetRightCameraEdge() &&
                a.y >= _this.GetTopCameraEdge() &&
                a.yBottom <= _this.GetBottomCameraEdge();
        });
        if (onScreenZoomTriggers.length) {
            var _loop_2 = function (trigger) {
                if (trigger.direction == "in") {
                    this_2.targetScale *= 1.1892;
                }
                else {
                    this_2.targetScale /= 1.1892;
                }
                if (this_2.targetScale > this_2.defaultScale * 2)
                    this_2.targetScale = this_2.defaultScale * 2;
                if (this_2.targetScale < this_2.defaultScale / 4)
                    this_2.targetScale = this_2.defaultScale / 4;
                // remove from list of available triggers
                this_2.cameraZoomTriggers = this_2.cameraZoomTriggers.filter(function (a) { return a != trigger; });
            };
            var this_2 = this;
            for (var _a = 0, onScreenZoomTriggers_1 = onScreenZoomTriggers; _a < onScreenZoomTriggers_1.length; _a++) {
                var trigger = onScreenZoomTriggers_1[_a];
                _loop_2(trigger);
            }
        }
        if (this.isAutoscrolling) {
            this.targetX += this.autoscrollX;
            this.targetY += this.autoscrollY;
        }
        else {
            if (this.target) {
                this.targetX = this.target.xMid;
                this.targetY = this.target.yBottom - 12;
            }
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
            if (this.targetX > this.maxX)
                this.targetX = this.maxX;
            if (this.targetY > this.maxY)
                this.targetY = this.maxY;
            var horizontalLocks = currentMap.cameraLocksHorizontal;
            for (var _b = 0, horizontalLocks_1 = horizontalLocks; _b < horizontalLocks_1.length; _b++) {
                var lock = horizontalLocks_1[_b];
                if (this.targetX > lock.xMid && this.GetLeftCameraEdge() < lock.x) {
                    this.targetX = lock.x + this.canvas.width / 2 / this.scale;
                }
                if (this.targetX < lock.xMid && this.GetRightCameraEdge() > lock.xRight) {
                    this.targetX = lock.xRight - this.canvas.width / 2 / this.scale;
                }
            }
            this.minX = this.canvas.width / 2 / this.scale;
            this.minY = this.canvas.height / 2 / this.scale;
            if (this.targetX < this.minX)
                this.targetX = this.minX;
            if (this.targetY < this.minY)
                this.targetY = this.minY;
            var xDelta = Math.abs(this.x - this.targetX);
            var yDelta = Math.abs(this.y - this.targetY);
            var isCameraFar = xDelta > this.canvas.width / 2 / this.scale || yDelta > this.canvas.height / 2 / this.scale;
            if (isCameraFar && !currentMap.doorTransition && !editorHandler.isInEditMode) {
                this.transitionTimer = 90;
            }
            else {
                this.x = this.targetX;
                this.y = this.targetY;
            }
        }
    };
    Camera.prototype.Reset = function () {
        this.autoscrollX = 0;
        this.autoscrollY = 0;
        this.isAutoscrolling = false;
        this.targetScale = this.defaultScale;
        if (currentMap) {
            this.autoscrollTriggers = currentMap.mainLayer.sprites.filter(function (a) { return a instanceof CameraScrollTrigger; });
            this.cameraZoomTriggers = currentMap.mainLayer.sprites.filter(function (a) { return a instanceof CameraZoomTrigger; });
        }
    };
    Camera.prototype.SnapCamera = function () {
        this.x = this.targetX;
        this.y = this.targetY;
    };
    Camera.prototype.GetLeftCameraEdge = function () {
        return this.targetX - this.canvas.width / 2 / this.scale;
    };
    Camera.prototype.GetRightCameraEdge = function () {
        return this.targetX + this.canvas.width / 2 / this.scale;
    };
    Camera.prototype.GetTopCameraEdge = function () {
        return this.targetY - this.canvas.height / 2 / this.scale;
    };
    Camera.prototype.GetBottomCameraEdge = function () {
        return this.targetY + this.canvas.height / 2 / this.scale;
    };
    Camera.prototype.Clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return Camera;
}());
