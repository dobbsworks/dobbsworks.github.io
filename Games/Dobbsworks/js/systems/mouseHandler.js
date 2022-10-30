"use strict";
var MouseHandler = /** @class */ (function () {
    function MouseHandler(canvas) {
        this.canvas = canvas;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseScroll = 0;
        this.isMouseOver = false;
        this.isMouseDown = false;
        this.isMouseChanged = false;
        this.hasUserInteracted = false;
        this.InitMouseHandlers();
    }
    MouseHandler.prototype.InitMouseHandlers = function () {
        this.canvas.addEventListener("mousedown", this.OnMouseDown, false);
        this.canvas.addEventListener("mouseup", this.OnMouseUp, false);
        this.canvas.addEventListener("mousemove", this.OnMouseMove, false);
        this.canvas.addEventListener("mouseout", this.OnMouseOut, false);
        this.canvas.addEventListener("touchstart", this.OnTouchStart, false);
        this.canvas.addEventListener("touchend", this.OnTouchEnd, false);
        this.canvas.addEventListener("touchmove", this.OnTouchMove, false);
        this.canvas.addEventListener("wheel", this.OnMouseScroll, false);
    };
    MouseHandler.prototype.GetGameMouseTile = function (layer, camera) {
        var gamePixel = this.GetGameMousePixel(camera);
        var tileX = Math.floor(gamePixel.xPixel / layer.tileWidth);
        var tileY = Math.floor(gamePixel.yPixel / layer.tileHeight);
        return { tileX: tileX, tileY: tileY };
    };
    MouseHandler.prototype.GetGameMousePixel = function (camera) {
        var pixel = this.GetCanvasMousePixel();
        return { xPixel: camera.x - (this.canvas.width / 2) / camera.scale + (pixel.xPixel / camera.scale),
            yPixel: camera.y - (this.canvas.height / 2) / camera.scale + (pixel.yPixel / camera.scale) };
    };
    MouseHandler.prototype.GetCanvasMousePixel = function () {
        if (document.fullscreenElement) {
            var boundingRect = this.canvas.getBoundingClientRect();
            var targetWidthToHeightRatio = this.canvas.width / this.canvas.height;
            var currentWidthToHeightRatio = boundingRect.width / boundingRect.height;
            if (targetWidthToHeightRatio <= currentWidthToHeightRatio) {
                // screen is too wide, dead zone at left and right
                var scaleUpRatio = boundingRect.height / this.canvas.height;
                var currentCanvasWidth = scaleUpRatio * this.canvas.width;
                var deadZoneWidth = (boundingRect.width - currentCanvasWidth) / 2;
                return { xPixel: (this.mouseX - deadZoneWidth) / scaleUpRatio, yPixel: this.mouseY / scaleUpRatio };
            }
            else {
                // screen is too tall, dead zone at top and bottom
                var scaleUpRatio = boundingRect.width / this.canvas.width;
                var currentCanvasHeight = scaleUpRatio * this.canvas.height;
                var deadZoneHeight = (boundingRect.height - currentCanvasHeight) / 2;
                return { xPixel: this.mouseX / scaleUpRatio, yPixel: (this.mouseY - deadZoneHeight) / scaleUpRatio };
            }
        }
        return { xPixel: this.mouseX, yPixel: this.mouseY };
    };
    MouseHandler.prototype.UpdateMouseChanged = function () {
        this.isMouseChanged = false;
        this.mouseScroll = 0;
    };
    MouseHandler.prototype.isMouseClicked = function () {
        return this.isMouseChanged && this.isMouseDown;
    };
    MouseHandler.prototype.OnMouseDown = function (e) {
        mouseHandler.isMouseOver = true;
        mouseHandler.hasUserInteracted = true;
        if (e.button === 0) {
            mouseHandler.isMouseDown = true;
            mouseHandler.isMouseChanged = true;
        }
    };
    MouseHandler.prototype.OnMouseUp = function (e) {
        mouseHandler.isMouseOver = true;
        if (e.button === 0) {
            mouseHandler.isMouseDown = false;
            mouseHandler.isMouseChanged = true;
        }
    };
    MouseHandler.prototype.OnMouseMove = function (e) {
        mouseHandler.mouseX = e.offsetX;
        mouseHandler.mouseY = e.offsetY;
        if (document.body.style.cursor == "none") {
            document.body.style.cursor = "unset";
        }
    };
    MouseHandler.prototype.OnMouseOut = function (e) {
        mouseHandler.isMouseOver = false;
        mouseHandler.OnMouseMove(e);
        // mouseHandler.isMouseChanged = mouseHandler.isMouseDown;
        // mouseHandler.isMouseDown = false;
    };
    MouseHandler.prototype.OnMouseScroll = function (e) {
        mouseHandler.isMouseOver = true;
        if (e.deltaY > 0)
            mouseHandler.mouseScroll = 1;
        if (e.deltaY < 0)
            mouseHandler.mouseScroll = -1;
        e.preventDefault();
    };
    MouseHandler.prototype.OnTouchStart = function (e) {
        mouseHandler.mouseX = e.touches[0].pageX;
        mouseHandler.mouseY = e.touches[0].pageY;
        mouseHandler.isMouseOver = true;
        mouseHandler.hasUserInteracted = true;
        mouseHandler.isMouseDown = true;
        mouseHandler.isMouseChanged = true;
        e.preventDefault();
    };
    MouseHandler.prototype.OnTouchEnd = function (e) {
        mouseHandler.isMouseDown = false;
        mouseHandler.isMouseChanged = true;
    };
    MouseHandler.prototype.OnTouchMove = function (e) {
        mouseHandler.mouseX = e.touches[0].pageX;
        mouseHandler.mouseY = e.touches[0].pageY;
        e.preventDefault();
    };
    return MouseHandler;
}());
