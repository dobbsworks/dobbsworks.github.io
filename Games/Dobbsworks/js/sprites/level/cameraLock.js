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
var CameraLockHorizontal = /** @class */ (function (_super) {
    __extends(CameraLockHorizontal, _super);
    function CameraLockHorizontal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        return _this;
    }
    CameraLockHorizontal.prototype.Update = function () {
    };
    CameraLockHorizontal.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][0][0],
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
    return CameraLockHorizontal;
}(Sprite));
var CameraLockVertical = /** @class */ (function (_super) {
    __extends(CameraLockVertical, _super);
    function CameraLockVertical() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        return _this;
    }
    CameraLockVertical.prototype.Update = function () {
    };
    CameraLockVertical.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][1][0],
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
    return CameraLockVertical;
}(Sprite));
