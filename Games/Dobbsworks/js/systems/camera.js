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
        this.isAutoscrollingHorizontally = false;
        this.isAutoscrollingVertically = false;
        this.autoscrollX = 0;
        this.autoscrollY = 0;
        this.autoscrollTriggers = [];
        this.cameraZoomTriggers = [];
        this.leftLockTimer = 0;
        this.rightLockTimer = 0;
        this.upLockTimer = 0;
        this.downLockTimer = 0;
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
            if (onScreenScrollTriggers.some(function (a) { return a instanceof CameraScrollLeft || a instanceof CameraScrollRight; }))
                this.isAutoscrollingHorizontally = true;
            if (onScreenScrollTriggers.some(function (a) { return a instanceof CameraScrollUp || a instanceof CameraScrollDown; }))
                this.isAutoscrollingVertically = true;
            var _loop_1 = function (trigger) {
                if (trigger.direction) {
                    this_1.autoscrollX += trigger.direction.x * .25;
                    this_1.autoscrollY += trigger.direction.y * .25;
                    // remove from list of available triggers
                    this_1.autoscrollTriggers = this_1.autoscrollTriggers.filter(function (a) { return a != trigger; });
                }
                else {
                    this_1.Reset();
                }
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
        if (this.isAutoscrollingHorizontally) {
            this.targetX += this.autoscrollX;
        }
        else {
            if (this.target) {
                this.targetX = this.target.xMid;
            }
        }
        if (this.isAutoscrollingVertically) {
            this.targetY += this.autoscrollY;
        }
        else {
            if (this.target) {
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
            this.AdjustCameraTargetForMapBounds();
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
    Camera.prototype.AdjustCameraTargetForMapBounds = function () {
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
        // Handle horizontal screen locks
        var horizontalLocks = currentMap.cameraLocksHorizontal;
        var hittingLeftLock = false;
        var hittingRightLock = false;
        for (var _i = 0, horizontalLocks_1 = horizontalLocks; _i < horizontalLocks_1.length; _i++) {
            var lock = horizontalLocks_1[_i];
            if (this.targetX > lock.xMid && this.GetLeftCameraEdge() < lock.x) {
                this.targetX = lock.x + this.canvas.width / 2 / this.scale;
                hittingLeftLock = true;
            }
            else {
            }
            if (this.targetX < lock.xMid && this.GetRightCameraEdge() > lock.xRight) {
                this.targetX = lock.xRight - this.canvas.width / 2 / this.scale;
                hittingRightLock = true;
            }
        }
        if (hittingLeftLock) {
            this.leftLockTimer++;
        }
        else {
            this.leftLockTimer = 0;
        }
        if (hittingRightLock) {
            this.rightLockTimer++;
        }
        else {
            this.rightLockTimer = 0;
        }
        // Handle vertical screen locks
        var verticalLocks = currentMap.cameraLocksVertical;
        var hittingUpLock = false;
        var hittingDownLock = false;
        for (var _a = 0, verticalLocks_1 = verticalLocks; _a < verticalLocks_1.length; _a++) {
            var lock = verticalLocks_1[_a];
            if (this.targetY + 7 > lock.yMid && this.GetTopCameraEdge() < lock.y) {
                this.targetY = lock.y + this.canvas.height / 2 / this.scale;
                hittingUpLock = true;
            }
            else {
            }
            if (this.targetY + 7 < lock.yMid && this.GetBottomCameraEdge() > lock.yBottom) {
                this.targetY = lock.yBottom - this.canvas.height / 2 / this.scale;
                hittingDownLock = true;
            }
        }
        if (hittingUpLock) {
            this.upLockTimer++;
        }
        else {
            this.upLockTimer = 0;
        }
        if (hittingDownLock) {
            this.downLockTimer++;
        }
        else {
            this.downLockTimer = 0;
        }
        this.minX = this.canvas.width / 2 / this.scale;
        this.minY = this.canvas.height / 2 / this.scale;
        if (this.targetX < this.minX)
            this.targetX = this.minX;
        if (this.targetY < this.minY)
            this.targetY = this.minY;
    };
    Camera.prototype.Reset = function () {
        this.autoscrollX = 0;
        this.autoscrollY = 0;
        this.isAutoscrollingHorizontally = false;
        this.isAutoscrollingVertically = false;
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
