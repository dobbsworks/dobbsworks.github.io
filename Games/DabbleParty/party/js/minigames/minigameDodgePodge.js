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
var MinigameDodgePodge = /** @class */ (function (_super) {
    __extends(MinigameDodgePodge, _super);
    function MinigameDodgePodge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Dodge Podge";
        _this.instructions = [
            "Steer your balloon to dodge the cannon blasts!",
            "The occasional coin flying by is worth an extra",
            "point, so go for the gold!"
        ];
        _this.backdropTile = tiles["bgBalloon"][0][0];
        _this.thumbnail = tiles["thumbnails"][2][0];
        _this.controls = [
            new InstructionControl(Control.Move, "Move"),
        ];
        _this.songId = "sky";
        _this.score = 100;
        _this.balloonSpeed = 3;
        _this.cannons = [];
        _this.bulletTimes = [];
        return _this;
    }
    MinigameDodgePodge.prototype.Initialize = function () {
        var _a;
        this.balloon = new SimpleSprite(0, 0, tiles["cannon"][playerIndex][1]);
        this.sprites.push(this.balloon);
        for (var y = -225; y <= 225; y += 90) {
            var cannonLeft = new SimpleSprite(-440, y, tiles["cannon"][0][0]);
            var cannonRight = new SimpleSprite(440, y, tiles["cannon"][0][0]);
            cannonRight.rotation = Math.PI;
            this.cannons.push(cannonLeft, cannonRight);
        }
        (_a = this.sprites).push.apply(_a, this.cannons);
        this.bulletTimes = this.GetBulletTimes();
    };
    MinigameDodgePodge.prototype.GetBulletTimes = function () {
        var ret = [];
        Random.SetSeed(5);
        for (var i = 0; i < 60 * 60; i += 10) {
            var val = Random.GetRand();
            var threshold = Math.max(0.1, i / 6000 * 1.1);
            if (val < threshold) {
                var cannonIndex = Random.GetSeededRandInt(0, this.cannons.length - 1);
                var isCoin = Random.GetRand() < 0.2;
                ret.push({ frame: i, cannonIndex: cannonIndex, isCoin: isCoin });
            }
        }
        return ret;
    };
    MinigameDodgePodge.prototype.Update = function () {
        var _this = this;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.balloon.y -= this.balloonSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.balloon.y += this.balloonSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
            this.balloon.x -= this.balloonSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
            this.balloon.x += this.balloonSpeed;
        }
        if (this.balloon.x < -330)
            this.balloon.x = -330;
        if (this.balloon.x > 330)
            this.balloon.x = 330;
        if (this.balloon.y < -225)
            this.balloon.y = -225;
        if (this.balloon.y > 225)
            this.balloon.y = 225;
        var bulletTime = this.bulletTimes.find(function (a) { return a.frame == _this.timer; });
        if (bulletTime) {
            var cannon = this.cannons[bulletTime.cannonIndex];
            var cannonSide_1 = cannon.x < 0 ? -1 : 1;
            var image = bulletTime.isCoin ? tiles["dobbloon"][0][0] : tiles["cannon"][1][0];
            var bullet = new SimpleSprite(cannon.x + 20 * -cannonSide_1, cannon.y, image, function (spr) {
                var bulletSpeed = 4;
                spr.x += bulletSpeed * -cannonSide_1;
                if (spr.name == "coin") {
                    spr.Animate(0.25);
                }
            });
            bullet.name = bulletTime.isCoin ? "coin" : "bullet";
            if (bulletTime.isCoin)
                bullet.Scale(0.6);
            this.sprites.push(bullet);
            if (bulletTime.isCoin) {
                audioHandler.PlaySound("confirm", false);
            }
            else {
                audioHandler.PlaySound("pomp", false);
            }
        }
        var overlap = this.sprites.find(function (a) { return a != _this.balloon && _this.balloon.DistanceBetweenCenters(a) < 65; });
        if (overlap) {
            if (overlap.name == "coin") {
                this.score++;
                audioHandler.PlaySound("dobbloon", false);
                overlap.isActive = false;
            }
            if (overlap.name == "bullet") {
                this.score--;
                overlap.isActive = false;
                audioHandler.PlaySound("hurt", false);
            }
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameDodgePodge.prototype.GetRemainingTicks = function () {
        return 60 * 64 - this.timer;
    };
    return MinigameDodgePodge;
}(MinigameBase));
