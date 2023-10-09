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
var MinigameSlots = /** @class */ (function (_super) {
    __extends(MinigameSlots, _super);
    function MinigameSlots() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Hot Slots";
        _this.instructions = [
            "Test your luck! Get three of a kind to earn points.",
            "Some of the images are more common than others."
        ];
        _this.backdropTile = tiles["bgSlots"][0][0];
        _this.thumbnail = tiles["thumbnails"][2][2];
        _this.controls = [
            new InstructionControl(Control.Button, "Stop reel"),
        ];
        _this.songId = "menuJazz";
        _this.reelSprites = [];
        _this.reelAnimation = [[], [], []];
        _this.currentStopIndex = 0;
        _this.reelValues = [
            [1, 3, 2, 1, 3, 2, 1, 3, 2, 1],
            [1, 3, 2, 1, 3, 2, 1, 3, 2, 1],
            [1, 1, 2, 2, 3, 1, 1, 0, 1, 1]
        ];
        _this.scoreTimer = 0;
        return _this;
    }
    MinigameSlots.prototype.Initialize = function () {
        var _a;
        this.overlay = new SimpleSprite(0, 0, tiles["slotsOverlay"][0][0]);
        this.reelSprites = [
            new SimpleSprite(-161, 0, tiles["slotWheels"][0][0]),
            new SimpleSprite(0, 0, tiles["slotWheels"][1][0]),
            new SimpleSprite(164, 0, tiles["slotWheels"][2][0]),
        ];
        this.reelSprites[0].dy = 4;
        this.reelSprites[1].dy = 8;
        this.reelSprites[2].dy = 16;
        (_a = this.sprites).push.apply(_a, __spreadArrays(this.reelSprites, [this.overlay]));
    };
    MinigameSlots.prototype.StopReel = function (index) {
        var passByBuffer = 10;
        var currentY = this.reelSprites[index].y;
        var targetY = Math.ceil((currentY - passByBuffer - 64) / 128) * 128 + 64;
        // bake in the animation to slow to a stop
        // y = ax**2 + bx + c
        // y'= 2ax + b
        // at x (time) 0, we know velocity, so we have b
        // at time 0 we know position, so we have c
        // solve for a
        var targetFrameCount = 15 - index * 5;
        var b = this.reelSprites[index].dy;
        var c = currentY;
        var a = (targetY - b * targetFrameCount - c) / (Math.pow(targetFrameCount, 2));
        this.reelAnimation[index] = [];
        for (var i = 0; i <= targetFrameCount; i++) {
            this.reelAnimation[index].push(a * Math.pow(i, 2) + b * i + c);
        }
        this.reelSprites[index].dy = 0;
    };
    MinigameSlots.prototype.ProcessSlots = function () {
        var _this = this;
        var reelValues = this.reelSprites.map(function (a, i) {
            var index = (5 - Math.floor((a.y + 64) / 128));
            var reelValue = _this.reelValues[i][index];
            return reelValue;
        });
        var score = 0;
        if (reelValues.every(function (a) { return a == 1; })) {
            score = 2;
            this.sprites.push(new ScoreSprite(0, 0, 1));
        }
        if (reelValues.every(function (a) { return a == 2; })) {
            score = 5;
            this.sprites.push(new ScoreSprite(0, 0, 3));
        }
        if (reelValues.every(function (a) { return a == 3; })) {
            score = 15;
            this.sprites.push(new ScoreSprite(0, 0, 5));
        }
        if (score > 0) {
            this.score += score;
            audioHandler.PlaySound("dobbloon", false);
        }
    };
    MinigameSlots.prototype.Update = function () {
        var _this = this;
        if (this.timer > 0 && !this.isEnded && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            if (this.currentStopIndex < 3) {
                this.StopReel(this.currentStopIndex);
                this.currentStopIndex++;
                audioHandler.PlaySound("confirm", false);
            }
        }
        this.reelSprites.forEach(function (a, i) {
            if (_this.reelAnimation[i].length > 0) {
                var newY = _this.reelAnimation[i].splice(0, 1)[0];
                a.y = newY;
            }
            a.y += a.dy;
            if (a.y > 580)
                a.y -= 1280 - 128;
        });
        if (this.scoreTimer == 0 && this.currentStopIndex == 3 && this.reelAnimation.every(function (a) { return a.length == 0; }) && this.reelSprites.every(function (a) { return a.dy == 0; })) {
            this.ProcessSlots();
            this.scoreTimer++;
        }
        if (this.scoreTimer >= 1) {
            this.scoreTimer++;
            if (this.scoreTimer == 30)
                this.reelSprites[0].dy = 4;
            if (this.scoreTimer == 40)
                this.reelSprites[1].dy = 8;
            if (this.scoreTimer == 50)
                this.reelSprites[2].dy = 16;
            if (this.scoreTimer == 70) {
                this.currentStopIndex = 0;
                this.scoreTimer = 0;
            }
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameSlots.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    return MinigameSlots;
}(MinigameBase));
