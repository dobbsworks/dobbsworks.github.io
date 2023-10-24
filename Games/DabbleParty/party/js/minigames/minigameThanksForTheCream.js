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
var MinigameThanksForTheCream = /** @class */ (function (_super) {
    __extends(MinigameThanksForTheCream, _super);
    function MinigameThanksForTheCream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Thanks For The Cream";
        _this.instructions = [
            "Quintuple scoop, please! Move your cone to catch",
            "the falling scoops of ice cream. You'll earn more",
            "points for well-centered stacks."
        ];
        _this.backdropTile = tiles["bgBeach"][0][0];
        _this.thumbnail = tiles["thumbnails"][1][3];
        _this.controls = [
            new InstructionControl(Control.Horizontal, "Move cone"),
        ];
        _this.songId = "desert";
        _this.coneScoops = [];
        _this.range = 100;
        return _this;
    }
    MinigameThanksForTheCream.prototype.Initialize = function () {
        this.cone = new SimpleSprite(0, 200, tiles["iceCream"][4][0]);
        this.sprites.push(this.cone);
    };
    // image size 150px tiles
    MinigameThanksForTheCream.prototype.LaunchScoops = function () {
        var _this = this;
        var targetX = 0;
        for (var i = 0; i < 5; i++) {
            var leftEdge = Math.max(targetX - this.range, -350);
            var rightEdge = Math.min(targetX + this.range, 350);
            targetX = Random.GetSeededRandInt(leftEdge, rightEdge);
            var y = 300 + i * 100;
            var scoop = new SimpleSprite(targetX, y, tiles["iceCream"][playerIndex][0], function (spr) {
                spr.y -= 5;
                var targetY = -300 - (+(spr.name) * 225);
                if (spr.y < targetY) {
                    _this.CreateBigScoop(spr.x);
                    spr.isActive = false;
                }
            }).Scale(0.25);
            scoop.name = i.toString();
            this.sprites.unshift(scoop);
            audioHandler.PlaySound("jump", false);
        }
        this.range += 25;
        if (this.range > 200)
            this.range = 200;
    };
    MinigameThanksForTheCream.prototype.CreateBigScoop = function (x) {
        var _this = this;
        var scoop = new SimpleSprite(x, -300, tiles["iceCream"][playerIndex][0], function (spr) {
            spr.y += 5;
            if (spr.name == "big") {
                var targetY = _this.cone.y - 85 - (_this.coneScoops.length) * 75;
                var targetX = _this.cone.x;
                if (_this.coneScoops.length > 0)
                    targetX = _this.coneScoops[_this.coneScoops.length - 1].x;
                var xDistance = Math.abs(targetX - spr.x);
                if (spr.y == targetY && xDistance < 50) {
                    _this.coneScoops.push(spr);
                }
            }
            if (spr.y > 300)
                spr.isActive = false;
        });
        scoop.name = "big";
        this.sprites.push(scoop);
    };
    MinigameThanksForTheCream.prototype.Update = function () {
        var move = 0;
        var moveSpeed = 5;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.cone.x > -350) {
            move -= moveSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.cone.x < 350) {
            move += moveSpeed;
        }
        this.cone.x += move;
        if (!this.isEnded && this.timer >= 0) {
            var cycle = this.timer % (60 * 8);
            if (cycle == 0) {
                this.LaunchScoops();
            }
            if (cycle > 60 * 8 - 50 && cycle < 60 * 8 - 25) {
                this.cone.y += 20;
            }
            if (cycle == 60 * 8 - 25) {
                // score it!
                for (var i = 0; i < this.coneScoops.length; i++) {
                    var x = i == 0 ? this.cone.x : this.coneScoops[i - 1].x;
                    var xDelta = Math.abs(this.coneScoops[i].x - x);
                    // 3 points for very close, 2 for ok, 1 for at least it's attached
                    if (xDelta < 10)
                        this.score++;
                    if (xDelta < 25)
                        this.score++;
                    if (xDelta < 50)
                        this.score++;
                }
                audioHandler.PlaySound("dobbloon", false);
                this.coneScoops.forEach(function (a) { return a.isActive = false; });
                this.coneScoops = [];
                this.sprites.filter(function (a) { return a.name == "big"; }).forEach(function (a) { return a.name = "dead"; });
            }
            if (cycle > 60 * 8 - 25) {
                this.cone.y -= 20;
            }
        }
        for (var i = 0; i < this.coneScoops.length; i++) {
            var scoop = this.coneScoops[i];
            scoop.x += move;
            scoop.y = this.cone.y - 85 - i * 75;
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameThanksForTheCream.prototype.GetRemainingTicks = function () {
        return (60 * 64 - 1) - this.timer;
    };
    return MinigameThanksForTheCream;
}(MinigameBase));
