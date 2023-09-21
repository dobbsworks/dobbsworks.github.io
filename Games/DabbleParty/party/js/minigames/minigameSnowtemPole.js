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
var MinigameSnowtemPole = /** @class */ (function (_super) {
    __extends(MinigameSnowtemPole, _super);
    function MinigameSnowtemPole() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Snowtem Pole";
        _this.instructions = [
            "Drop lines of snowballs to try to build the tallest",
            "snowman you can! The snowballs move faster as you go,",
            "but you'll get lots of chances to build snowmen."
        ];
        _this.backdropTile = tiles["bgSnow"][0][0];
        _this.thumbnail = tiles["thumbnails"][3][2];
        _this.controls = [
            new InstructionControl(Control.Button, "Drop snowballs"),
        ];
        _this.songId = "frost";
        _this.snowballCounts = [4, 4, 3, 2, 1, 1];
        _this.snowSpeeds = [5, 10, 9, 8, 7, 6, 5];
        _this.currentSnowlineIndex = 0;
        _this.snowLine = [];
        _this.isSnowLineFalling = false;
        return _this;
    }
    MinigameSnowtemPole.prototype.Initialize = function () {
        for (var i = -2; i <= 2; i++) {
            var snowball = new SimpleSprite(i * 80, 70 * 3 + 30, tiles["snowman"][0][0]).Scale(0.5);
            this.sprites.push(snowball);
        }
        this.CreateSnowline();
    };
    MinigameSnowtemPole.prototype.CreateSnowline = function () {
        var _a;
        var snowLineLength = this.snowballCounts[this.currentSnowlineIndex];
        this.currentSnowlineIndex++;
        if (this.currentSnowlineIndex >= this.snowballCounts.length) {
            this.currentSnowlineIndex = 0;
        }
        this.snowLine = [];
        for (var i = 0; i < snowLineLength; i++) {
            var snowball = new SimpleSprite((i - 6) * 80, -250, tiles["snowman"][this.currentSnowlineIndex == 0 ? 1 : 0][0]).Scale(0.5);
            snowball.name = this.currentSnowlineIndex == 0 ? "head" : "ball";
            this.snowLine.push(snowball);
        }
        (_a = this.sprites).push.apply(_a, this.snowLine);
    };
    MinigameSnowtemPole.prototype.MoveSnowline = function () {
        var _this = this;
        if (this.snowLine.length > 0) {
            this.snowLine.forEach(function (a) { return a.x += 80; });
            if (this.snowLine[0].x > 80 * 6) {
                this.snowLine.forEach(function (a) { return a.x -= 80 * (12 + _this.snowLine.length); });
            }
        }
    };
    MinigameSnowtemPole.prototype.SnowlineDrop = function () {
        var fallingInProgress = false;
        var _loop_1 = function (snowball) {
            if (!snowball.isActive)
                return "continue";
            var snowballsBelow = this_1.sprites.filter(function (a) { return a.x == snowball.x && a != snowball; });
            var ground = Math.min.apply(Math, __spreadArrays(snowballsBelow.map(function (a) { return a.y; }), [600])) + 5 - 70;
            snowball.dy += 0.1;
            snowball.y += snowball.dy;
            if (snowball.y > ground) {
                snowball.y = ground;
                snowball.dy = 0;
            }
            else {
                fallingInProgress = true;
            }
            if (snowball.y > 400)
                snowball.isActive = false;
        };
        var this_1 = this;
        for (var _i = 0, _a = this.snowLine; _i < _a.length; _i++) {
            var snowball = _a[_i];
            _loop_1(snowball);
        }
        return fallingInProgress;
    };
    MinigameSnowtemPole.prototype.ClearSnow = function () {
        var _a;
        var head = this.sprites.find(function (a) { return a.name == "head"; });
        var headX = head ? head.x : -1;
        var toBeCleared = this.sprites.filter(function (a) { return a.name == "head" || a.name == "ball"; });
        var scoreUps = [];
        var anims = [];
        var _loop_2 = function (snowball) {
            snowball.isActive = false;
            // create animated snow to fall
            var anim = new SimpleSprite(snowball.x + 1, snowball.y, tiles["snowman"][snowball == head ? 1 : 0][0], function (s) {
                s.dy += 0.2;
                s.y += s.dy;
                if (s.y > 300)
                    s.isActive = false;
            }).Scale(0.5);
            anims.push(anim);
            if (snowball.x == headX) {
                this_2.score++;
                audioHandler.PlaySound("dobbloon", false);
                var scoreUp = new SimpleSprite(snowball.x + 1, snowball.y, tiles["droppingItems"][3][0], function (s) {
                    s.y -= 2;
                    if (s.y < snowball.y - 100)
                        s.isActive = false;
                }).Scale(2);
                scoreUps.push(scoreUp);
            }
        };
        var this_2 = this;
        for (var _i = 0, toBeCleared_1 = toBeCleared; _i < toBeCleared_1.length; _i++) {
            var snowball = toBeCleared_1[_i];
            _loop_2(snowball);
        }
        (_a = this.sprites).push.apply(_a, __spreadArrays(anims, scoreUps));
    };
    MinigameSnowtemPole.prototype.Update = function () {
        if (!this.isEnded) {
            if (this.isSnowLineFalling) {
                var isStillFalling = this.SnowlineDrop();
                if (!isStillFalling) {
                    if (this.currentSnowlineIndex == 0) {
                        // just placed snowman head
                        this.ClearSnow();
                    }
                    this.CreateSnowline();
                    this.isSnowLineFalling = false;
                }
            }
            else {
                if (this.timer % this.snowSpeeds[this.currentSnowlineIndex] == 0)
                    this.MoveSnowline();
            }
            if (!this.isSnowLineFalling && this.timer >= 0) {
                if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                    this.isSnowLineFalling = true;
                    audioHandler.PlaySound("pomp", false);
                }
            }
        }
        var isGameOver = this.timer == 60 * 64;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    return MinigameSnowtemPole;
}(MinigameBase));
