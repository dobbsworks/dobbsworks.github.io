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
var MinigameLift = /** @class */ (function (_super) {
    __extends(MinigameLift, _super);
    function MinigameLift() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Like You Don't Even Want A Lift";
        _this.instructions = [
            "This busted elevator's buttons change depending on what",
            "floor it's on. Some buttons will go up, some will go down.",
            "Try to remember the right button for each floor!"
        ];
        _this.backdropTile = tiles["bgElevator"][0][0];
        _this.thumbnail = tiles["thumbnails"][2][1];
        _this.controls = [
            new InstructionControl(Control.Move, "Select button"),
            new InstructionControl(Control.Button, "Press button"),
        ];
        _this.songId = "slime";
        _this.digits = [];
        _this.buttons = [];
        _this.targetDisplayFloor = 1;
        _this.currentDisplayFloor = 1;
        _this.accelTimer = 0;
        _this.elevatorDirection = 0;
        _this.selectedIndex = -1;
        _this.floors = [];
        return _this;
    }
    MinigameLift.prototype.Initialize = function () {
        var _a;
        this.backdropBuildings = new SimpleSprite(266, 50, tiles["skyscrapers"][0][0]);
        this.skyscraper = new SimpleSprite(242, -160, tiles["bigSkyscraper"][0][0]);
        this.digits = [
            new SimpleSprite(-315, -198, tiles["elevatorDisplay"][12][0]),
            new SimpleSprite(-255, -198, tiles["elevatorDisplay"][0][0]),
            new SimpleSprite(-195, -198, tiles["elevatorDisplay"][1][0]),
        ];
        (_a = this.sprites).push.apply(_a, __spreadArrays([this.backdropBuildings, this.skyscraper], this.digits));
        for (var i = 0; i < 100; i++) {
            // create a floor
            var floor = this.GetButtonEffectsForFloorIndex(i);
            this.floors.push(floor);
        }
        this.ResetButtons();
    };
    MinigameLift.prototype.GetButtonEffectsForFloorIndex = function (floorIndex) {
        var buttonCount = 5 + Math.floor(floorIndex / 2);
        var maxUp = 2;
        var maxDown = Math.min(floorIndex, 3);
        var pool = [1];
        for (var a = 1; a <= maxUp; a++)
            pool.push(a);
        for (var a = 1; a <= maxDown; a++)
            pool.push(-a);
        if (pool.length > buttonCount)
            console.error("Button pool should always be smaller than number needed");
        var poolIter = __spreadArrays(pool);
        var ret = [];
        while (ret.length < buttonCount) {
            if (poolIter.length == 0)
                poolIter = __spreadArrays(pool);
            var index = Random.GetSeededRandInt(0, poolIter.length - 1);
            var removed = poolIter.splice(index, 1)[0];
            ret.push(removed);
        }
        return ret;
    };
    MinigameLift.prototype.ResetButtons = function () {
        var _a;
        this.buttons.forEach(function (a) { return a.isActive = false; });
        this.buttons = [];
        var buttonEffects = this.floors[this.currentDisplayFloor - 1];
        var buttonCount = buttonEffects.length;
        var buttonsPerRow = 5;
        for (var i = 0; i < buttonCount; i++) {
            var row = Math.floor(i / buttonsPerRow);
            var col = i % buttonsPerRow;
            var button = new SimpleSprite(col * 70 + -390, row * 70 + -70, tiles["elevatorButton"][0][0]);
            button.name = i.toString();
            this.buttons.push(button);
        }
        (_a = this.sprites).push.apply(_a, this.buttons);
    };
    MinigameLift.prototype.UpdateSelectedButton = function () {
        if (this.selectedIndex == -1) {
            this.selectedIndex = 0;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            if (this.selectedIndex >= 5)
                this.selectedIndex -= 5;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) {
            if (this.selectedIndex % 5 != 0)
                this.selectedIndex -= 1;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) {
            if (this.selectedIndex % 5 != 4)
                this.selectedIndex += 1;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            if (this.selectedIndex <= this.buttons.length - 1 - 5)
                this.selectedIndex += 5;
        }
        if (this.selectedIndex > this.buttons.length)
            this.selectedIndex = this.buttons.length - 1;
        if (this.selectedIndex < 0)
            this.selectedIndex = 0;
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].imageTile = tiles["elevatorButton"][0][0];
            if (i == this.selectedIndex)
                this.buttons[i].imageTile = tiles["elevatorButton"][1][0];
        }
    };
    MinigameLift.prototype.UpdateFloorDisplay = function () {
        if (this.elevatorDirection == 0) {
            this.digits[0].imageTile = tiles["elevatorDisplay"][12][0];
        }
        else if (this.elevatorDirection > 0) {
            this.digits[0].imageTile = tiles["elevatorDisplay"][10][0];
        }
        else if (this.elevatorDirection < 0) {
            this.digits[0].imageTile = tiles["elevatorDisplay"][11][0];
        }
        var displayNumber = this.elevatorDirection > 0 ?
            Math.floor(this.currentDisplayFloor) :
            Math.ceil(this.currentDisplayFloor);
        var firstDigit = Math.floor(displayNumber / 10);
        var secondDigit = displayNumber % 10;
        this.digits[1].imageTile = tiles["elevatorDisplay"][firstDigit][0];
        this.digits[2].imageTile = tiles["elevatorDisplay"][secondDigit][0];
    };
    MinigameLift.prototype.Update = function () {
        if (Math.abs(this.currentDisplayFloor - this.targetDisplayFloor) < 0.5) {
            this.accelTimer--;
            if (this.accelTimer < 30)
                this.accelTimer = 30;
            if (Math.abs(this.currentDisplayFloor - this.targetDisplayFloor) < 0.05) {
                //arrived at floor
                this.currentDisplayFloor = this.targetDisplayFloor;
                this.accelTimer = 0;
                if (this.elevatorDirection != 0) {
                    this.elevatorDirection = 0;
                    this.ResetButtons();
                }
            }
            else {
                this.elevatorDirection = this.currentDisplayFloor > this.targetDisplayFloor ? -1 : 1;
                this.currentDisplayFloor += this.elevatorDirection * this.accelTimer / 60 * 0.01;
            }
        }
        else {
            this.accelTimer += 1;
            if (this.accelTimer > 60)
                this.accelTimer = 60;
            this.elevatorDirection = this.currentDisplayFloor > this.targetDisplayFloor ? -1 : 1;
            this.currentDisplayFloor += this.elevatorDirection * this.accelTimer / 60 * 0.01;
        }
        this.UpdateFloorDisplay();
        if (this.elevatorDirection == 0 && this.timer >= 0) {
            this.UpdateSelectedButton();
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && !this.isEnded) {
                this.buttons[this.selectedIndex].imageTile = tiles["elevatorButton"][2][0];
                var effect = this.floors[this.currentDisplayFloor - 1][this.selectedIndex];
                this.targetDisplayFloor += effect;
                this.score += effect;
                if (effect > 0)
                    audioHandler.PlaySound("dobbloon", false);
                if (effect < 0)
                    audioHandler.PlaySound("error", false);
            }
        }
        this.backdropBuildings.y = (this.currentDisplayFloor - 1) * 20 + 50;
        this.skyscraper.y = (this.currentDisplayFloor - 1) * 40 - 160;
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameLift.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    return MinigameLift;
}(MinigameBase));
