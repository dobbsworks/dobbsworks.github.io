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
var RedBalloon = /** @class */ (function (_super) {
    __extends(RedBalloon, _super);
    function RedBalloon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 8;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = true;
        _this.isInitialized = false;
        _this.connectedSprite = null;
        _this.connectionDistance = 0;
        _this.wireColor = "#AAA";
        _this.wireDrawBottomSpace = 12;
        _this.horizontalDirection = -1;
        _this.frameRow = 0;
        _this.canHangFrom = true;
        _this.popTimer = 0;
        _this.floatTimer = 0;
        return _this;
    }
    RedBalloon.prototype.Update = function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        if (this.popTimer > 0) {
            this.popTimer++;
            if (this.popTimer > 20)
                this.isActive = false;
        }
        this.Movement();
        this.horizontalDirection = this.dx <= 0 ? -1 : 1;
        this.MoveByVelocity();
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
    RedBalloon.prototype.Movement = function () {
        if (this.WaitForOnScreen()) {
            this.floatTimer++;
            this.dx = -0.25;
            this.dy = Math.cos(this.floatTimer / 30) / 5;
            this.ReactToVerticalWind();
        }
    };
    RedBalloon.prototype.OnBounce = function () {
        this.connectedSprite = null;
        this.popTimer = 1;
        this.canBeBouncedOn = false;
        audioHandler.PlaySound("pop", true);
    };
    RedBalloon.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.popTimer > 0) {
            col = Math.floor(this.popTimer / 3);
            if (col > 6)
                col = 6;
        }
        return {
            imageTile: tiles["balloon"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return RedBalloon;
}(Motor));
var BlueBalloon = /** @class */ (function (_super) {
    __extends(BlueBalloon, _super);
    function BlueBalloon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 1;
        _this.direction = Direction.Left;
        return _this;
    }
    BlueBalloon.prototype.Movement = function () {
        if (this.WaitForOnScreen()) {
            this.floatTimer++;
            this.dx = 0;
            this.horizontalDirection = -1;
            this.dy = Math.cos(this.floatTimer / 100) / 4;
        }
    };
    return BlueBalloon;
}(RedBalloon));
var YellowBalloon = /** @class */ (function (_super) {
    __extends(YellowBalloon, _super);
    function YellowBalloon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 2;
        return _this;
    }
    YellowBalloon.prototype.Movement = function () {
        if (this.WaitForOnScreen()) {
            this.floatTimer++;
            this.dy = Math.cos(this.floatTimer / 30) / 5;
            this.horizontalDirection = -1;
            this.dx = -Math.cos(this.floatTimer / 100) / 4;
        }
    };
    return YellowBalloon;
}(RedBalloon));
var GreenBalloon = /** @class */ (function (_super) {
    __extends(GreenBalloon, _super);
    function GreenBalloon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 3;
        return _this;
    }
    GreenBalloon.prototype.Movement = function () {
    };
    return GreenBalloon;
}(RedBalloon));
