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
var BouncePlatform = /** @class */ (function (_super) {
    __extends(BouncePlatform, _super);
    function BouncePlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilesetRow = 9;
        _this.originalY = -9999;
        _this.canMotorHold = false;
        return _this;
    }
    BouncePlatform.prototype.Update = function () {
        var _this = this;
        if (this.originalY == -9999)
            this.originalY = this.y;
        var isCompressing = this.IsPlayerStandingOn();
        var yDelta = this.y - this.originalY;
        if (isCompressing && yDelta < 4) {
            this.dy = 0.5;
        }
        if (yDelta >= 4 && this.dy >= 0) {
            this.dy = 0;
        }
        if (!isCompressing) {
            this.dy = -1;
        }
        this.MoveByVelocity();
        if (yDelta >= 4 && isCompressing) {
            this.y = this.originalY + 4;
            var player_1 = this.layer.sprites.find(function (a) { return a instanceof Player && a.parentSprite == _this && a.standingOn.length == 0; });
            if (player_1) {
                player_1.dyFromPlatform = -3;
            }
        }
        if (yDelta <= 0 && !isCompressing) {
            this.y = this.originalY;
            this.dy = 0;
        }
    };
    return BouncePlatform;
}(BasePlatform));
