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
var MinigameJustPlunkIt = /** @class */ (function (_super) {
    __extends(MinigameJustPlunkIt, _super);
    function MinigameJustPlunkIt() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Just Plunk It";
        _this.instructions = [
            "Fiddle with the dial and slider to get the highest number.",
            "There are six 10-second rounds. The timer in the top-left",
            "shows how much time you have before the next round."
        ];
        _this.backdropTile = tiles["bgPlunk"][0][0];
        _this.thumbnail = tiles["thumbnails"][1][1];
        _this.controls = [
            new InstructionControl(Control.Horizontal, "Polarize flange dampener"),
            new InstructionControl(Control.Vertical, "Stabilize degausser"),
        ];
        _this.songId = "meditate";
        _this.digits = [];
        _this.targetRotation = 0;
        _this.targetSlide = 0;
        return _this;
    }
    MinigameJustPlunkIt.prototype.Initialize = function () {
        var _a;
        this.dial = new SimpleSprite(-242, 94, tiles["plunkControls"][0][0]);
        this.slider = new SimpleSprite(350 / 2, 57, tiles["plunkControls"][1][0]);
        this.meter = new SimpleSprite(-292, -163, tiles["plunkControls"][2][0]);
        for (var i = 0; i < 4; i++) {
            var digit = new SimpleSprite(80 * i + 20, -150, tiles["plunkDisplay"][0][0]).Scale(3);
            this.digits.push(digit);
        }
        (_a = this.sprites).push.apply(_a, __spreadArrays([this.dial, this.slider, this.meter], this.digits));
    };
    MinigameJustPlunkIt.prototype.RandomizeTarget = function () {
        this.targetRotation = Random.GetRand() * Math.PI * 2;
        this.targetSlide = Random.GetRandInt(0, 350 / 5) * 5;
    };
    MinigameJustPlunkIt.prototype.GetCurrentPlunkValue = function () {
        var theta1 = this.dial.rotation;
        var theta2 = this.targetRotation;
        var PHI = Math.PI * 2;
        var rotationDistance = (((theta1 - theta2) % PHI) + PHI) % PHI;
        if (rotationDistance > Math.PI)
            rotationDistance = PHI - rotationDistance;
        var slideDistance = Math.abs(this.targetSlide - this.slider.x);
        var ret = 9999 - (rotationDistance * 1000 + slideDistance * 10);
        return Math.min(9999, Math.max(0, ret));
    };
    MinigameJustPlunkIt.prototype.Update = function () {
        var sliderSpeed = 5;
        var rotationSpeed = 0.05;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.slider.x > 0) {
            this.slider.x -= sliderSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.slider.x < 350) {
            this.slider.x += sliderSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.dial.rotation += rotationSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.dial.rotation -= rotationSpeed;
        }
        this.meter.rotation = (this.timer % (60 * 10)) / 600 * Math.PI * 2;
        var plunkCurrent = 2147 + Math.floor(Math.random() * 5000);
        if (!this.isEnded && this.timer >= 0) {
            plunkCurrent = this.GetCurrentPlunkValue();
            if ((this.timer % (60 * 10)) == 0) {
                //score current 
                if (this.timer > 1) {
                    this.score += Math.floor(plunkCurrent / 10) + 1;
                    audioHandler.PlaySound("confirm", false);
                }
                this.RandomizeTarget();
            }
        }
        else {
        }
        for (var i = 0; i < this.digits.length; i++) {
            var digitSprite = this.digits[i];
            var digitValue = Math.floor((plunkCurrent / Math.pow(10, this.digits.length - i - 1)) % 10);
            digitSprite.imageTile = tiles["plunkDisplay"][digitValue][0];
        }
        var isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    return MinigameJustPlunkIt;
}(MinigameBase));
