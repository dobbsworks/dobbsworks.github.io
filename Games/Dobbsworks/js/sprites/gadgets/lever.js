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
var Lever = /** @class */ (function (_super) {
    __extends(Lever, _super);
    function Lever() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.isPowerSource = true;
        _this.isOn = false;
        return _this;
    }
    Lever.prototype.Update = function () {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, true)) {
            // action button pressed
            var players = this.layer.sprites.filter(function (a) { return a instanceof Player; });
            for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                var player_1 = players_1[_i];
                var distance = Math.abs(this.xMid - player_1.xMid) + Math.abs(this.yMid - player_1.yMid);
                if (distance < 9) {
                    this.isOn = !this.isOn;
                    audioHandler.PlaySound("erase", true);
                }
            }
        }
    };
    Lever.prototype.GetPowerPoints = function () {
        if (this.isOn) {
            return [
                { xPixel: this.xMid, yPixel: this.yBottom + 1 }
            ];
        }
        else
            return [];
    };
    Lever.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["misc"][this.isOn ? 1 : 0][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Lever;
}(Sprite));
