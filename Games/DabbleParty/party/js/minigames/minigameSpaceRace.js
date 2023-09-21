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
var MinigameSpaceRace = /** @class */ (function (_super) {
    __extends(MinigameSpaceRace, _super);
    function MinigameSpaceRace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Space Race";
        _this.instructions = [
            "Pilot your ship as far as you can through the vast",
            "reaches of space. Travel through rings to speed up,",
            "and avoid the ship-slowing meteors."
        ];
        _this.backdropTile = tiles["space"][0][0];
        _this.thumbnail = tiles["thumbnails"][0][3];
        _this.controls = [
            new InstructionControl(Control.Vertical, "Move"),
        ];
        _this.songId = "computer";
        _this.bgScale = 6;
        _this.movingItems = [];
        _this.rocketSpeed = 4;
        _this.totalDistance = 0;
        return _this;
    }
    MinigameSpaceRace.prototype.Initialize = function () {
        var _a;
        this.bg1 = new SimpleSprite(-450 * this.bgScale, 400, tiles["space"][0][0]).Scale(this.bgScale);
        this.bg2 = new SimpleSprite(442 * this.bgScale, 400, tiles["space"][0][0]).Scale(this.bgScale);
        this.sprites.push(this.bg2, this.bg1);
        this.rocket = new SimpleSprite(-350, 0, tiles["rocket"][0][playerIndex]).Scale(0.2);
        this.sprites.push(this.rocket);
        this.movingItems = this.GetThings();
        (_a = this.sprites).push.apply(_a, this.movingItems);
    };
    MinigameSpaceRace.prototype.GetThings = function () {
        var ret = [];
        Random.SetSeed(2);
        for (var i = 0; i < 2000; i++) {
            var val = Random.GetRand();
            if (val < 0.1) {
                var x = i * 100 + 300;
                var y = Random.GetRandInt(-180, 180);
                if (val < 0.03) {
                    var spr = new SimpleSprite(x, y, tiles["spaceThings"][0][0], function (spr) { });
                    spr.name = "rings";
                    ret.push(spr);
                }
                else {
                    var spr = new SimpleSprite(x, y, tiles["spaceThings"][1][0], function (spr) {
                        spr.rotation += 0.01;
                    });
                    spr.name = "rock";
                    ret.push(spr);
                }
            }
        }
        ret.forEach(function (a) { return a.Scale(0.25); });
        return ret;
    };
    MinigameSpaceRace.prototype.Update = function () {
        var _this = this;
        this.bg1.x -= this.rocketSpeed * 0.5;
        this.bg2.x -= this.rocketSpeed * 0.5;
        if (this.bg2.x < -60) {
            this.bg1.x += 892 * this.bgScale;
            this.bg2.x += 892 * this.bgScale;
        }
        var rocketVerticalSpeed = 4;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.rocket.y -= rocketVerticalSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.rocket.y += rocketVerticalSpeed;
        }
        if (this.rocket.y > 180)
            this.rocket.y = 180;
        if (this.rocket.y < -180)
            this.rocket.y = -180;
        this.bg1.y = 200 - (this.rocket.y) / 4;
        this.bg2.y = this.bg1.y;
        var overlap = this.movingItems.find(function (a) { return a.Overlaps(_this.rocket); });
        if (overlap) {
            if (overlap.name == "rings") {
                this.rocketSpeed += 5;
                audioHandler.PlaySound("dobbloon", false);
            }
            if (overlap.name == "rock") {
                this.rocketSpeed *= 0.5;
                audioHandler.PlaySound("crash", false);
            }
            overlap.isActive = false;
        }
        this.rocketSpeed += 0.005;
        var maxRocketSpeed = 100;
        if (this.rocketSpeed > maxRocketSpeed)
            this.rocketSpeed = maxRocketSpeed;
        var minRocketSpeed = 4;
        if (this.rocketSpeed < minRocketSpeed)
            this.rocketSpeed = minRocketSpeed;
        this.totalDistance += this.rocketSpeed;
        this.movingItems.forEach(function (a) {
            a.x -= _this.rocketSpeed;
        });
        var isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.movingItems.forEach(function (a) { return a.isActive = false; });
            this.SubmitScore(Math.floor(this.totalDistance));
        }
    };
    return MinigameSpaceRace;
}(MinigameBase));
