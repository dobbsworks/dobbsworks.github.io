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
var MinigameFightOrFlightless = /** @class */ (function (_super) {
    __extends(MinigameFightOrFlightless, _super);
    function MinigameFightOrFlightless() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Fight Or Flightless";
        _this.instructions = [
            "Defend yourself from the endless horde of penguins!",
            "Keep an eye on your snowball meter, it takes some",
            "time to build up more snowballs."
        ];
        _this.backdropTile = tiles["bgGraph"][0][0];
        _this.thumbnail = tiles["thumbnails"][3][0];
        _this.controls = [
            new InstructionControl(Control.Button, "Throw snowball"),
        ];
        _this.songId = "overdue";
        _this.facing = 0;
        _this.charge = 0;
        _this.chargeNeeded = 40;
        _this.maxCharges = 5;
        return _this;
    }
    MinigameFightOrFlightless.prototype.Initialize = function () {
        var _a;
        this.score = 99;
        this.snowman = new SimpleSprite(0, 0, tiles["penguin"][1][0]).Scale(0.5);
        this.sprites.push(this.snowman);
        var penguins = [];
        for (var i = 0; i < 100; i++) {
            var theta = Random.GetRand() * Math.PI * 2;
            var r = i * 50 + 300 + Random.GetRandIntFrom1ToNum(100);
            var penguin = new SimpleSprite(r * Math.cos(theta), r * Math.sin(theta), tiles["penguin"][0][0]).Scale(0.5);
            penguin.name = "penguin";
            var penguinSpeed = 0.4;
            penguin.dx = -Math.cos(theta) * penguinSpeed;
            penguin.dy = -Math.sin(theta) * penguinSpeed;
            penguins.push(penguin);
        }
        (_a = this.sprites).push.apply(_a, penguins);
    };
    MinigameFightOrFlightless.prototype.ThrowSnowball = function () {
        var snowball = new SimpleSprite(0, -1, tiles["penguin"][2][0]).Scale(0.5);
        var speed = 4;
        snowball.dx = speed * Math.cos(this.facing);
        snowball.dy = speed * Math.sin(this.facing);
        snowball.x += snowball.dx * 10;
        snowball.y += snowball.dy * 10;
        snowball.name = "snowball";
        this.sprites.push(snowball);
    };
    MinigameFightOrFlightless.prototype.Update = function () {
        var rotationSpeed = 0.05;
        this.charge += 0.7;
        if (this.charge > this.maxCharges * this.chargeNeeded) {
            this.charge = this.maxCharges * this.chargeNeeded;
        }
        this.facing += rotationSpeed;
        if (!this.isEnded && this.timer >= 0) {
            var speedMultiplier = Math.pow(this.timer / 60, 0.25);
            for (var _i = 0, _a = this.sprites.filter(function (a) { return a.name == "penguin"; }); _i < _a.length; _i++) {
                var penguin = _a[_i];
                penguin.x += penguin.dx * speedMultiplier;
                penguin.y += penguin.dy * speedMultiplier;
                if (Math.pow(penguin.x, 2) + Math.pow(penguin.y, 2) < Math.pow(30, 2)) {
                    penguin.isActive = false;
                    // hit snowman
                    this.score--;
                    audioHandler.PlaySound("hurt", false);
                }
                else {
                    for (var _b = 0, _c = this.sprites.filter(function (a) { return a.name == "snowball"; }); _b < _c.length; _b++) {
                        var snowball = _c[_b];
                        var dist = Math.sqrt(Math.pow((penguin.x - snowball.x), 2) + Math.pow((penguin.y - snowball.y), 2));
                        if (dist < 50) {
                            snowball.isActive = false;
                            penguin.isActive = false;
                            var anim = new SimpleSprite(penguin.x, penguin.y, tiles["penguin"][0][0], function (spr) {
                                spr.x += spr.dx * 15;
                                spr.y += spr.dy * 15;
                                spr.rotation += 0.2;
                            }).Scale(0.5);
                            anim.dx = -penguin.dx;
                            anim.dy = -penguin.dy;
                            this.sprites.push(anim);
                            audioHandler.PlaySound("baa-dead", false);
                        }
                    }
                }
            }
            for (var _d = 0, _e = this.sprites.filter(function (a) { return a.name == "snowball"; }); _d < _e.length; _d++) {
                var snowball = _e[_d];
                snowball.x += snowball.dx;
                snowball.y += snowball.dy;
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && this.charge > this.chargeNeeded) {
                this.charge -= this.chargeNeeded;
                this.ThrowSnowball();
                audioHandler.PlaySound("throw", false);
            }
        }
        var isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
        this.sprites = this.sprites.sort(function (a, b) { return a.y - b.y; });
    };
    MinigameFightOrFlightless.prototype.OnBeforeDrawSprites = function (camera) {
        camera.ctx.save();
        camera.ctx.scale(1, 0.5);
        camera.ctx.strokeStyle = "red";
        camera.ctx.lineWidth = 8;
        camera.ctx.beginPath();
        var x = camera.canvas.width / 2;
        var y = camera.canvas.height;
        var r = 200;
        var r2 = 180;
        camera.ctx.moveTo(x, y);
        camera.ctx.lineTo(x + r * Math.cos(this.facing), y + r * Math.sin(this.facing));
        camera.ctx.lineTo(x + r2 * Math.cos(this.facing + 0.1), y + r2 * Math.sin(this.facing + 0.1));
        camera.ctx.moveTo(x + r * Math.cos(this.facing), y + r * Math.sin(this.facing));
        camera.ctx.lineTo(x + r2 * Math.cos(this.facing - 0.1), y + r2 * Math.sin(this.facing - 0.1));
        camera.ctx.stroke();
        camera.ctx.restore();
    };
    MinigameFightOrFlightless.prototype.OnAfterDraw = function (camera) {
        if (!this.isEnded) {
            camera.ctx.fillStyle = "#0088";
            //camera.ctx.fillRect( 30, 510, 40, -204);
            var y = 508;
            for (var i = 0; i < this.maxCharges; i++) {
                camera.ctx.fillRect(30, y, 40, -39);
                y -= 40;
            }
            camera.ctx.fillStyle = "#FFFB";
            camera.ctx.fillRect(34, 508, 32, -this.charge + 1);
        }
    };
    return MinigameFightOrFlightless;
}(MinigameBase));
