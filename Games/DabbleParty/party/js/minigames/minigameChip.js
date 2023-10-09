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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var MinigameChip = /** @class */ (function (_super) {
    __extends(MinigameChip, _super);
    function MinigameChip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Legally Distinct Chip Game";
        _this.instructions = [
            "Drop your chip and cross your fingers!",
            "You can't drop a chip until the previous",
            "one is done dropping."
        ];
        _this.backdropTile = tiles["bgGQ"][0][0];
        _this.thumbnail = tiles["thumbnails"][0][0];
        _this.controls = [
            new InstructionControl(Control.Button, "Drop chip")
        ];
        _this.songId = "carnival";
        _this.pins = [];
        _this.cards = [];
        _this.chipStartingY = -240;
        return _this;
    }
    MinigameChip.prototype.Initialize = function () {
        var _a;
        this.chip = new SimpleSprite(0, this.chipStartingY, tiles["chips"][0][0]);
        var row = 0;
        for (var y = 150; y > -180; y -= 52) {
            row++;
            for (var x = -240; x <= 300; x += 60) {
                if (row % 2) {
                    var pin = new SimpleSprite(x - 30, y, tiles["chips"][1][0]);
                    this.pins.push(pin);
                }
                else {
                    var pin = new SimpleSprite(x - 60, y, tiles["chips"][1][0]);
                    this.pins.push(pin);
                    if (x == 300) {
                        var pin2 = new SimpleSprite(x, y, tiles["chips"][1][0]);
                        this.pins.push(pin2);
                    }
                }
            }
        }
        this.cards.push(new SimpleSprite(0, 210, tiles["chips"][0][1]));
        for (var i = 1; i <= 4; i++) {
            this.cards.push(new SimpleSprite(60 * i, 210, tiles["chips"][i][1]));
            this.cards.push(new SimpleSprite(-60 * i, 210, tiles["chips"][i][1]));
        }
        (_a = this.sprites).push.apply(_a, __spreadArrays(this.cards, [this.chip], this.pins));
    };
    MinigameChip.prototype.Update = function () {
        var _this = this;
        if (this.chip.y == this.chipStartingY) {
            this.chip.x += 7;
            if (this.chip.x > 300)
                this.chip.x -= 600;
        }
        if (!this.isEnded && this.timer >= 0) {
            if (this.chip.y == this.chipStartingY) {
                if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                    this.chip.y += 1;
                    this.chip.dy = 0;
                    this.chip.dx = 0.1;
                    audioHandler.PlaySound("pomp", false);
                }
            }
            else {
                this.chip.rotation += 0.03;
                this.chip.dy += 0.2;
                this.chip.y += this.chip.dy;
                this.chip.x += this.chip.dx;
                var pinRadius_1 = 2; // 4
                var chipRadius_1 = 22; // 24
                var collidePin = this.pins.find(function (pin) { return Math.sqrt(Math.pow((pin.x - _this.chip.x), 2) + Math.pow((pin.y - _this.chip.y), 2)) < pinRadius_1 + chipRadius_1; });
                if (collidePin) {
                    audioHandler.PlaySound("pop", false);
                    // mirror velocity across tangent vector, then reverse
                    var theta = Math.atan2(this.chip.y - collidePin.y, this.chip.x - collidePin.x);
                    var oldVelocityAngle = Math.atan2(this.chip.dy, this.chip.dx);
                    var newVelocityAngle = oldVelocityAngle + (theta - oldVelocityAngle) * 2 + Math.PI;
                    var velocityMagnitude = Math.sqrt(Math.pow(this.chip.dy, 2) + Math.pow(this.chip.dx, 2));
                    // don't let ball be overinflated, dampen velocity
                    velocityMagnitude = velocityMagnitude * 0.5 + 0.8;
                    this.chip.dy = velocityMagnitude * Math.sin(newVelocityAngle);
                    this.chip.dx = velocityMagnitude * Math.cos(newVelocityAngle);
                    this.chip.y += this.chip.dy;
                    this.chip.x += this.chip.dx;
                }
            }
            if (this.chip.y > 180 && this.chip.y < 200) {
                var col = Math.floor((Math.abs(this.chip.x) + 30) / 60);
                var pointArray = [1000, 1, 100, 50, 10];
                var earnedPoints = pointArray[col] || 0;
                this.score += earnedPoints;
                audioHandler.PlaySound("dobbloon", false);
                this.ResetChip();
            }
            if (this.IsChipOffScreen()) {
                this.ResetChip();
            }
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameChip.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    MinigameChip.prototype.ResetChip = function () {
        this.chip.y = this.chipStartingY;
        this.chip.x = -300;
    };
    MinigameChip.prototype.IsChipOffScreen = function () {
        var isChipOob = this.chip.y > 400 || this.chip.x > 600 || this.chip.x < -600;
        return isChipOob && !this.isEnded && this.timer >= 0;
    };
    return MinigameChip;
}(MinigameBase));
