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
var DragonSwoop = /** @class */ (function (_super) {
    __extends(DragonSwoop, _super);
    function DragonSwoop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 102;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.anchor = Direction.Down;
        _this.initialized = false;
        _this.pauseTimer = 60;
        _this.playedAudio = false;
        return _this;
    }
    DragonSwoop.prototype.Update = function () {
        if (!this.playedAudio) {
            this.playedAudio = true;
            audioHandler.PlaySound("alert", false);
        }
        if (this.pauseTimer > 0) {
            this.pauseTimer--;
            return;
        }
        if (!this.initialized) {
            this.initialized = true;
            if (player) {
                this.direction = (player.xMid < this.xMid ? -1 : 1);
                this.dx = 3 * this.direction;
            }
        }
        this.AccelerateHorizontally(0.01, 3 * this.direction);
        this.ApplyInertia();
        this.ReactToVerticalWind();
    };
    DragonSwoop.prototype.GetFrameData = function (frameNum) {
        var leftScreenEdge = camera.x - camera.canvas.width / 2 / camera.scale;
        var rightScreenEdge = camera.x + camera.canvas.width / 2 / camera.scale;
        if (frameNum % 4 < 2) {
            if (this.xRight < leftScreenEdge && this.dx >= 0) {
                return {
                    imageTile: tiles["dragonwarning"][0][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: -(leftScreenEdge - this.x),
                    yOffset: 0
                };
            }
            if (this.x > rightScreenEdge && this.dx <= 0) {
                return {
                    imageTile: tiles["dragonwarning"][0][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: -(rightScreenEdge - 24 - this.x),
                    yOffset: 0
                };
            }
        }
        return {
            imageTile: tiles["flying"][0][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: this.direction == 1 ? 8 : 8,
            yOffset: 7
        };
    };
    return DragonSwoop;
}(Enemy));
var CrashingDragon = /** @class */ (function (_super) {
    __extends(CrashingDragon, _super);
    function CrashingDragon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 102;
        _this.respectsSolidTiles = false;
        _this.canBeHeld = false;
        _this.floatsInWater = false;
        _this.isPlatform = true;
        _this.zIndex = 2;
        _this.direction = 1;
        return _this;
    }
    CrashingDragon.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.AccelerateHorizontally(0.04, this.direction * 1.5);
        if (player && player.parentSprite == this) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                this.AccelerateVertically(0.02, -1.5);
            }
            else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                this.AccelerateVertically(0.02, 1.5);
            }
            else {
                this.dy *= 0.95;
            }
        }
        else {
            this.dy *= 0.95;
        }
        this.ReactToWater();
        this.MoveByVelocity();
        if (this.age % 10 == 0) {
            var fireX = this.x + Math.random() * this.width - 3;
            var fireY = this.y + Math.random() * this.height - 3;
            var fire = new SingleFireBreath(fireX, fireY, this.layer, []);
            fire.hurtsPlayer = false;
            this.layer.sprites.push(fire);
        }
        // to do - when collide with wall...?
    };
    CrashingDragon.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["flying"][0][1],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: this.direction == 1 ? 8 : 8,
            yOffset: 7
        };
    };
    return CrashingDragon;
}(Sprite));
