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
var BounceMushroom = /** @class */ (function (_super) {
    __extends(BounceMushroom, _super);
    function BounceMushroom(minigame) {
        var _this = _super.call(this, 0, 0) || this;
        _this.minigame = minigame;
        _this.width = 48;
        _this.height = 48;
        _this.targetPositionIndex = 2;
        _this.positions = [-240, -120, 0, 120, 240];
        _this.isLockedIn = true;
        _this.speed = 10;
        _this.bounceTimer = 0;
        return _this;
    }
    BounceMushroom.prototype.Bounce = function () {
        this.bounceTimer = 30;
        audioHandler.PlaySound("boing", true);
    };
    BounceMushroom.prototype.Update = function () {
        if (this.bounceTimer > 0) {
            this.bounceTimer--;
        }
        if (this.isLockedIn) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.targetPositionIndex > 0) {
                this.targetPositionIndex--;
                this.isLockedIn = false;
            }
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.targetPositionIndex < this.positions.length - 1) {
                this.targetPositionIndex++;
                this.isLockedIn = false;
            }
        }
        if (!this.isLockedIn) {
            var targetX = this.positions[this.targetPositionIndex];
            if (Math.abs(this.x - targetX) <= this.speed) {
                // close enough
                this.x = targetX;
                this.isLockedIn = true;
            }
            else {
                if (this.x < targetX)
                    this.x += this.speed;
                else
                    this.x -= this.speed;
            }
        }
    };
    BounceMushroom.prototype.GetFrameData = function (frameNum) {
        var col = 2 - Math.floor(Math.sin(this.bounceTimer) / (31 - this.bounceTimer) * 2);
        return {
            imageTile: tiles["bounceMush"][col][playerIndex],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return BounceMushroom;
}(Sprite));
var BounceEgg = /** @class */ (function (_super) {
    __extends(BounceEgg, _super);
    function BounceEgg(x, y, minigame) {
        var _this = _super.call(this, x, y) || this;
        _this.minigame = minigame;
        _this.width = 48;
        _this.height = 48;
        _this.bounceHeight = 240;
        _this.timer = 0;
        _this.speed = 1;
        return _this;
    }
    BounceEgg.prototype.Update = function () {
        var _this = this;
        this.timer++;
        var bounceHeight = this.timer < 60 ? 240 : this.bounceHeight;
        this.rotation += 0.2;
        if (this.timer > 60)
            this.x += this.speed;
        var xForArc = ((this.timer < 60 ? (this.timer - 60) : this.x) + 360) % 120;
        this.y = (bounceHeight / Math.pow(60, 2)) * Math.pow((xForArc - 60), 2) - bounceHeight - 35;
        var mush = this.minigame.mushroom;
        if (mush.positions.some(function (x) { return Math.abs(_this.x - x) < 1; }) && this.y < 5 && this.timer >= 60) {
            // on a bounce point
            if (mush.isLockedIn && Math.abs(this.x - mush.x) < 1) {
                // bounce!
                mush.Bounce();
            }
            else {
                // splat
                this.isActive = false;
                var brokenEgg = new SimpleSprite(this.x, this.y, tiles["droppingItems"][2][0], function (s) {
                    s.dy += 0.2;
                    s.y += s.dy;
                    if (s.y > 500)
                        s.isActive = false;
                });
                brokenEgg.dy -= 3;
                brokenEgg.y += 45;
                this.minigame.sprites.push(brokenEgg);
                audioHandler.PlaySound("pop", false);
            }
        }
        else if (this.x >= 360) {
            // nest!
            this.isActive = false;
            this.minigame.score++;
            audioHandler.PlaySound("dobbloon", false);
            var scoreUp = new SimpleSprite(this.x, this.y, tiles["droppingItems"][3][0], function (s) {
                s.y -= 2;
                if (s.y < -100) {
                    s.isActive = false;
                    console.log(s.age);
                }
            }).Scale(2);
            this.minigame.sprites.push(scoreUp);
        }
    };
    BounceEgg.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["droppingItems"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return BounceEgg;
}(Sprite));
var MinigameMushroomBounce = /** @class */ (function (_super) {
    __extends(MinigameMushroomBounce, _super);
    function MinigameMushroomBounce() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Fungus Amongus";
        _this.instructions = [
            "Bounce the eggs safely to the nest with the mushroom.",
            "The branch will shake when an egg is about to fall,",
            "so keep your eyes peeled."
        ];
        _this.backdropTile = tiles["forest"][0][0];
        _this.thumbnail = tiles["thumbnails"][0][2];
        _this.controls = [
            new InstructionControl(Control.Horizontal, "Move mushroom")
        ];
        _this.songId = "forest";
        _this.branchWiggleTimer = 0;
        _this.eggList = [
            { t: 1, s: 1 },
            { t: 12, s: 1 },
            { t: 14.75, s: 1 },
            { t: 24.5, s: 0.5 },
            { t: 27, s: 1 },
            { t: 28, s: 1 },
            { t: 39.5, s: 1 },
            { t: 42, s: 1 },
            { t: 44.5, s: 1 },
            { t: 51.5, s: 0.75 },
            { t: 54.75, s: 0.75 },
            { t: 55, s: 0.75 },
            { t: 55.25, s: 0.75 },
            { t: 67.5, s: 2 },
            { t: 73.5, s: 2 },
            { t: 74.9, s: 2 },
            { t: 81, s: 3 },
            { t: 87, s: 2 },
            { t: 87.2, s: 2 },
            { t: 87.4, s: 2 },
            { t: 87.6, s: 2 },
        ];
        return _this;
    }
    MinigameMushroomBounce.prototype.Initialize = function () {
        camera.targetX = 30;
        camera.targetY = -100;
        this.mushroom = new BounceMushroom(this);
        for (var _i = 0, _a = this.mushroom.positions; _i < _a.length; _i++) {
            var pos = _a[_i];
            this.sprites.push(new SimpleSprite(pos, this.mushroom.y, tiles["bounceMush"][2][4]));
        }
        this.sprites.push(this.mushroom);
        this.branch = new SimpleSprite(-300, -200, tiles["branch"][0][0]);
        this.sprites.push(this.branch);
        this.sprites.push(new SimpleSprite(0, 142, tiles["ground"][0][0]).Scale(2));
        this.sprites.push(new SimpleSprite(360, 8, tiles["nest"][0][0]));
    };
    MinigameMushroomBounce.prototype.Update = function () {
        var _this = this;
        if (this.branchWiggleTimer > 0) {
            this.branchWiggleTimer--;
            var wiggle = (Math.sin(this.branchWiggleTimer) / (31 - this.branchWiggleTimer) * 2);
            this.branch.x = -300 + wiggle * 10;
        }
        var isSpawnComing = this.eggList.some(function (a) { return Math.floor(a.t * 60) == _this.timer + 30; });
        if (isSpawnComing)
            this.branchWiggleTimer = 30;
        var spawns = this.eggList.filter(function (a) { return Math.floor(a.t * 60) == _this.timer; });
        for (var _i = 0, spawns_1 = spawns; _i < spawns_1.length; _i++) {
            var spawn = spawns_1[_i];
            var egg = new BounceEgg(-240, -240, this);
            egg.bounceHeight = 240 / spawn.s;
            egg.speed = spawn.s;
            this.sprites.push(egg);
            audioHandler.PlaySound("bwump", false);
        }
        var gameOverTime = (Math.max.apply(Math, this.eggList.map(function (a) { return a.t; })) + 5) * 60;
        if (gameOverTime == this.timer) {
            this.SubmitScore(this.score);
        }
    };
    return MinigameMushroomBounce;
}(MinigameBase));
