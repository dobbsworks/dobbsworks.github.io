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
var PorcoRosso = /** @class */ (function (_super) {
    __extends(PorcoRosso, _super);
    function PorcoRosso() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 13;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.squishTimer = 0;
        _this.frameRow = 0;
        _this.direction = -1;
        _this.animationSpeed = 0.2;
        _this.bounceSoundId = "oink";
        return _this;
    }
    PorcoRosso.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.squishTimer > 0) {
            this.squishTimer++;
            this.ApplyGravity();
            if (this.standingOn.length > 0 || (this.stackedOn && this.squishTimer > 20)) {
                this.ReplaceWithSpriteType(Piggle);
            }
        }
        else {
            this.PorcoMovement();
            this.ApplyInertia();
            this.dy *= 0.9;
            this.ReactToWater();
        }
        this.ReactToVerticalWind();
    };
    PorcoRosso.prototype.PorcoMovement = function () {
        this.SkyPatrol(0.3);
    };
    PorcoRosso.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    PorcoRosso.prototype.OnBounce = function () {
        this.squishTimer = 1;
        this.dy = 0.5;
    };
    PorcoRosso.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 4) % 2;
        if (this.squishTimer > 0)
            frame += 2;
        return {
            imageTile: tiles["aviator"][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 2
        };
    };
    return PorcoRosso;
}(Enemy));
var PorcoBlu = /** @class */ (function (_super) {
    __extends(PorcoBlu, _super);
    function PorcoBlu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 1;
        return _this;
    }
    PorcoBlu.prototype.PorcoMovement = function () {
        this.SkyPatrol(1);
    };
    return PorcoBlu;
}(PorcoRosso));
var PorcoVerde = /** @class */ (function (_super) {
    __extends(PorcoVerde, _super);
    function PorcoVerde() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 2;
        return _this;
    }
    PorcoVerde.prototype.PorcoMovement = function () {
        this.SkyPatrol(0.3);
    };
    return PorcoVerde;
}(PorcoRosso));
