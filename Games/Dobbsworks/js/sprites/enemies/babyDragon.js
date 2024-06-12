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
var Bernie = /** @class */ (function (_super) {
    __extends(Bernie, _super);
    function Bernie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 11;
        _this.width = 24;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.canSpinBounceOn = true;
        _this.isInitialized = false;
        _this.flameTimer = 0;
        _this.isPatrolling = true;
        return _this;
    }
    Bernie.prototype.Update = function () {
        if (!this.WaitForOnScreen()) {
            return;
        }
        if (this.isPatrolling) {
            this.GroundPatrol(0.3, true);
            if (this.IsPlayerInLineOfSight()) {
                this.isPatrolling = false;
                this.dx = 0;
                this.flameTimer = -30;
            }
        }
        else {
            this.flameTimer++;
            if (this.flameTimer > 0) {
                var fire = new SingleFireBreath((this.direction == -1 ? this.x - 2 : this.xRight + 2) - 3, this.y + 1, this.layer, []);
                fire.dx = 1.6 * this.direction;
                fire.dy = Random.random() / 2 - 0.25;
                this.layer.sprites.push(fire);
            }
            if (this.flameTimer > 30) {
                if (this.IsPlayerInLineOfSight()) {
                    this.flameTimer = -45;
                }
                else {
                    this.isPatrolling = true;
                }
            }
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    };
    Bernie.prototype.GetFrameData = function (frameNum) {
        var frameRow = Math.floor(frameNum / 10) % 3;
        if (!this.isPatrolling)
            frameRow = 3;
        return {
            imageTile: tiles["babyDragon"][0][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    };
    return Bernie;
}(Enemy));
