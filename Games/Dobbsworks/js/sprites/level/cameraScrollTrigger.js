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
var CameraScrollTrigger = /** @class */ (function (_super) {
    __extends(CameraScrollTrigger, _super);
    function CameraScrollTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        _this.frameRow = 1;
        return _this;
    }
    CameraScrollTrigger.prototype.Update = function () {
    };
    CameraScrollTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][this.frameCol][this.frameRow],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    };
    return CameraScrollTrigger;
}(Sprite));
var CameraScrollUp = /** @class */ (function (_super) {
    __extends(CameraScrollUp, _super);
    function CameraScrollUp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Up;
        _this.frameCol = 0;
        return _this;
    }
    return CameraScrollUp;
}(CameraScrollTrigger));
var CameraScrollDown = /** @class */ (function (_super) {
    __extends(CameraScrollDown, _super);
    function CameraScrollDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Down;
        _this.frameCol = 1;
        return _this;
    }
    return CameraScrollDown;
}(CameraScrollTrigger));
var CameraScrollLeft = /** @class */ (function (_super) {
    __extends(CameraScrollLeft, _super);
    function CameraScrollLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Left;
        _this.frameCol = 2;
        return _this;
    }
    return CameraScrollLeft;
}(CameraScrollTrigger));
var CameraScrollRight = /** @class */ (function (_super) {
    __extends(CameraScrollRight, _super);
    function CameraScrollRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Right;
        _this.frameCol = 3;
        return _this;
    }
    return CameraScrollRight;
}(CameraScrollTrigger));
var CameraScrollReset = /** @class */ (function (_super) {
    __extends(CameraScrollReset, _super);
    function CameraScrollReset() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = null;
        _this.frameCol = 0;
        _this.frameRow = 2;
        return _this;
    }
    return CameraScrollReset;
}(CameraScrollTrigger));
var CameraZoomTrigger = /** @class */ (function (_super) {
    __extends(CameraZoomTrigger, _super);
    function CameraZoomTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        return _this;
    }
    CameraZoomTrigger.prototype.Update = function () {
    };
    CameraZoomTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][this.frameCol][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    };
    return CameraZoomTrigger;
}(Sprite));
var CameraZoomOut = /** @class */ (function (_super) {
    __extends(CameraZoomOut, _super);
    function CameraZoomOut() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = "out";
        _this.frameCol = 2;
        return _this;
    }
    return CameraZoomOut;
}(CameraZoomTrigger));
var CameraZoomIn = /** @class */ (function (_super) {
    __extends(CameraZoomIn, _super);
    function CameraZoomIn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = "in";
        _this.frameCol = 3;
        return _this;
    }
    return CameraZoomIn;
}(CameraZoomTrigger));
