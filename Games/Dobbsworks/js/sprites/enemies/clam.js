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
var Clammy = /** @class */ (function (_super) {
    __extends(Clammy, _super);
    function Clammy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 16;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.damagesPlayer = false;
        _this.stateTimer = 0;
        _this.state = "idle";
        _this.timerMap = [
            { state: "shaking", frames: 20, next: "closing" },
            { state: "closing", frames: 6, next: "closed" },
            { state: "closed", frames: 50, next: "opening" },
            { state: "opening", frames: 20, next: "idle" },
        ];
        return _this;
    }
    Clammy.prototype.Update = function () {
        var _this = this;
        if (!this.WaitForOnScreen())
            return;
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        var playerStandingOn = player && player.parentSprite == this;
        this.damagesPlayer = this.state == "closed";
        this.isPlatform = this.state != "closed";
        if (playerStandingOn && !this.isPlatform)
            player.parentSprite = null;
        if (this.state == "idle") {
            if (this.isInWater || playerStandingOn) {
                this.state = "shaking";
                this.stateTimer = 0;
            }
        }
        else {
            var stateMachine = this.timerMap.find(function (a) { return a.state == _this.state; });
            if (stateMachine) {
                this.stateTimer += this.isInWater ? 0.3 : 1;
                if (this.stateTimer >= stateMachine.frames) {
                    this.state = stateMachine.next;
                    this.stateTimer = 0;
                }
            }
        }
    };
    Clammy.prototype.GetFrameData = function (frameNum) {
        var _this = this;
        var _a, _b;
        var col = 0;
        if (this.state == "closing") {
            var totalFrames = ((_a = this.timerMap.find(function (a) { return a.state == _this.state; })) === null || _a === void 0 ? void 0 : _a.frames) || 1;
            var frameInSequence = Math.floor(this.stateTimer / totalFrames * 3);
            col = [0, 1, 2, 3][frameInSequence];
        }
        if (this.state == "closed")
            col = 3;
        if (this.state == "opening") {
            var totalFrames = ((_b = this.timerMap.find(function (a) { return a.state == _this.state; })) === null || _b === void 0 ? void 0 : _b.frames) || 1;
            var frameInSequence = Math.floor(this.stateTimer / totalFrames * 3);
            col = [2, 1, 0, 0][frameInSequence];
        }
        var xOffset = this.state == "shaking" ? Math.sin(this.age) : 0;
        return {
            imageTile: tiles["clam"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: xOffset,
            yOffset: 10
        };
    };
    return Clammy;
}(Enemy));
