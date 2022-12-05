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
var Winch = /** @class */ (function (_super) {
    __extends(Winch, _super);
    function Winch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.isInitialized = false;
        _this.connectedSprite = null;
        _this.connectionDistance = 0;
        _this.wireColor = "#482413";
        _this.wireDrawBottomSpace = 6;
        _this.horizontalDirection = -1;
        _this.isPlatform = true;
        _this.minConnectionDistance = 8;
        _this.maxConnectionDistance = 0;
        _this.winchSpeed = 0.2;
        _this.isWinding = false;
        _this.windsDown = false;
        return _this;
    }
    Winch.prototype.Update = function () {
        this.dx *= 0.9;
        this.dy *= 0.9;
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
            this.maxConnectionDistance = this.connectionDistance;
        }
        if (Utility.Xor(this.GetIsPowered(), this.windsDown)) {
            this.connectionDistance -= this.winchSpeed;
            this.isWinding = true;
        }
        else {
            this.connectionDistance += this.winchSpeed;
            this.isWinding = true;
        }
        if (this.connectionDistance > this.maxConnectionDistance) {
            this.connectionDistance = this.maxConnectionDistance;
            this.isWinding = false;
        }
        if (this.connectionDistance < this.minConnectionDistance) {
            this.connectionDistance = this.minConnectionDistance;
            this.isWinding = false;
        }
        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            var playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            }
            else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        }
    };
    Winch.prototype.GetIsPowered = function () {
        var _a;
        if (this.connectedSprite && this.connectedSprite instanceof PullSwitch && this.connectedSprite.isOn)
            return true;
        var tile = (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByPixel(this.xMid, this.yMid);
        return (tile === null || tile === void 0 ? void 0 : tile.isPowered()) || false;
    };
    Winch.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 10) % 2;
        if (!this.isWinding)
            col = 0;
        if (this.GetIsPowered())
            col += 2;
        return {
            imageTile: tiles["motorTrack"][col][5],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    };
    return Winch;
}(Motor));
var ReverseWinch = /** @class */ (function (_super) {
    __extends(ReverseWinch, _super);
    function ReverseWinch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.windsDown = true;
        return _this;
    }
    return ReverseWinch;
}(Winch));
