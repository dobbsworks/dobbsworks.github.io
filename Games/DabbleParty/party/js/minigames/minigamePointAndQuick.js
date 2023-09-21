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
var MinigamePointAndQuick = /** @class */ (function (_super) {
    __extends(MinigamePointAndQuick, _super);
    function MinigamePointAndQuick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Point, And Quick";
        _this.instructions = [
            "Press the directions indicated by the incoming boxes.",
            "Stacked boxes will require you to complete the whole",
            "stack without any mistakes."
        ];
        _this.backdropTile = tiles["bgParty"][0][playerIndex];
        _this.thumbnail = tiles["thumbnails"][1][2];
        _this.controls = [
            new InstructionControl(Control.Move, "Point"),
        ];
        _this.songId = "cherry";
        _this.boxStacks = [];
        _this.targetIndex = 0;
        _this.wrongTimer = 0;
        _this.scootTimes = [1, 2, 4, 7, 11, 15, 20, 21, 22, 22, 22, 22, 21, 20, 15, 11, 7, 4, 2, 1]; //total 250
        _this.currentScootTimes = [];
        return _this;
    }
    MinigamePointAndQuick.prototype.Initialize = function () {
        var _this = this;
        var conveyor = new SimpleSprite(90, 220, tiles["conveyor"][0][0]);
        this.sprites.push(conveyor);
        this.targeter = new SimpleSprite(-180, 103, tiles["directionBox"][0][5], function (spr) {
            spr.xScale = Math.sin(_this.timer / 20) / 16 + 1.05;
            spr.yScale = Math.sin(_this.timer / 20) / 16 + 1.05;
        });
        this.sprites.push(this.targeter);
        this.CreateBoxStack();
        this.CreateBoxStack();
        this.CreateBoxStack();
        this.CreateBoxStack();
    };
    MinigamePointAndQuick.prototype.CreateBoxStack = function () {
        var _a;
        var _this = this;
        var ret = [];
        var maxSize = 1;
        if (this.score > 4)
            maxSize = 2;
        if (this.score > 15)
            maxSize = 3;
        if (this.score > 30)
            maxSize = 4;
        var minSize = 1;
        if (this.score > 20)
            minSize = 2;
        if (this.score > 50)
            minSize = 3;
        if (this.score > 80)
            minSize = 4;
        var size = Random.GetRandInt(minSize, maxSize);
        var targetX = -180 + this.boxStacks.length * 250;
        var targetY = 103;
        for (var i = 0; i < size; i++) {
            var spr = new SimpleSprite(targetX, targetY, tiles["directionBox"][0][4]);
            spr.name = Random.RandFrom(["up", "down", "left", "right"]);
            ret.push(spr);
            targetY -= 95;
        }
        (_a = this.sprites).push.apply(_a, ret);
        this.boxStacks.push(ret);
        // push targeter to top of sprite order
        this.sprites = __spreadArrays(this.sprites.filter(function (a) { return a != _this.targeter; }), [this.targeter]);
        return ret;
    };
    MinigamePointAndQuick.prototype.ScootBoxes = function () {
        var scoot = this.currentScootTimes.shift() || 1;
        this.boxStacks.forEach(function (a) {
            a.forEach(function (b) {
                b.x -= scoot;
            });
        });
    };
    MinigamePointAndQuick.prototype.Update = function () {
        if (!this.isEnded && this.timer >= 0) {
            if (this.wrongTimer > 0) {
                this.wrongTimer--;
                if (Math.floor(this.wrongTimer / 4) % 2 == 0) {
                    this.targeter.xScale = 0;
                    this.targeter.yScale = 0;
                }
            }
            else {
                var isStackInPlace = this.boxStacks[0] && this.boxStacks[0][0] && this.boxStacks[0][0].x == -180;
                if (isStackInPlace) {
                    if (this.boxStacks.length <= 3) {
                        this.CreateBoxStack();
                    }
                    var stack = this.boxStacks[0];
                    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
                        var spr = stack_1[_i];
                        if (spr.name == "left")
                            spr.imageTile = tiles["directionBox"][0][0];
                        if (spr.name == "right")
                            spr.imageTile = tiles["directionBox"][0][1];
                        if (spr.name == "up")
                            spr.imageTile = tiles["directionBox"][0][2];
                        if (spr.name == "down")
                            spr.imageTile = tiles["directionBox"][0][3];
                    }
                    var pressedKey = "";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true))
                        pressedKey = "left";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true))
                        pressedKey = "right";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true))
                        pressedKey = "up";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true))
                        pressedKey = "down";
                    var expectedKey = this.boxStacks[0][this.targetIndex].name;
                    if (pressedKey != "") {
                        if (pressedKey == expectedKey) {
                            // correct
                            this.targetIndex++;
                            if (this.targetIndex >= this.boxStacks[0].length) {
                                // stack complete
                                audioHandler.PlaySound("coin", false);
                                this.score++;
                                this.targetIndex = 0;
                                var completedStack = this.boxStacks.shift() || [];
                                for (var _a = 0, completedStack_1 = completedStack; _a < completedStack_1.length; _a++) {
                                    var box = completedStack_1[_a];
                                    box.isActive = false;
                                    var boxAnim = new SimpleSprite(box.x, box.y, box.imageTile, function (spr) {
                                        spr.x -= 15;
                                        spr.rotation -= 0.015;
                                        if (spr.x < -800)
                                            spr.isActive = false;
                                    });
                                    this.sprites.push(boxAnim);
                                }
                                this.currentScootTimes = __spreadArrays(this.scootTimes);
                                this.ScootBoxes();
                            }
                        }
                        else {
                            // INCORRECT
                            this.targetIndex = 0;
                            this.wrongTimer = 30;
                            audioHandler.PlaySound("error", false);
                        }
                    }
                }
                else {
                    this.targeter.xScale = 0;
                    this.targeter.yScale = 0;
                    this.ScootBoxes();
                }
            }
            var targetY = 103 - this.targetIndex * 95;
            this.targeter.y += (targetY - this.targeter.y) * 0.2;
        }
        var isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    return MinigamePointAndQuick;
}(MinigameBase));
