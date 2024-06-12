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
var Wooly = /** @class */ (function (_super) {
    __extends(Wooly, _super);
    function Wooly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 0;
        _this.imageSource = "sheep";
        _this.turnAtLedges = false;
        _this.bounceSoundId = "baa-dead";
        return _this;
    }
    return Wooly;
}(Piggle));
var BoolyState;
(function (BoolyState) {
    BoolyState[BoolyState["Patrol"] = 0] = "Patrol";
    BoolyState[BoolyState["WindUp"] = 1] = "WindUp";
    BoolyState[BoolyState["Charging"] = 2] = "Charging";
})(BoolyState || (BoolyState = {}));
var WoolyBooly = /** @class */ (function (_super) {
    __extends(WoolyBooly, _super);
    function WoolyBooly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageSource = "sheep";
        _this.frameRow = 1;
        _this.state = BoolyState.Patrol;
        _this.windupTimer = 0;
        _this.bounceSoundId = "baa-dead";
        return _this;
    }
    // enemies
    // canBeHelds
    // hearts
    // special : pop balloons
    WoolyBooly.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (this.state == BoolyState.Patrol) {
                this.GroundPatrol(0.3, this.turnAtLedges);
                if (this.IsPlayerInLineOfSight()) {
                    this.state = BoolyState.WindUp;
                    audioHandler.PlaySound("baa", false);
                    this.windupTimer = 0;
                    this.dx = 0;
                    this.direction = (player.xMid < this.xMid ? -1 : 1);
                }
            }
            else if (this.state == BoolyState.WindUp) {
                this.windupTimer++;
                if (this.windupTimer > 60) {
                    this.state = BoolyState.Charging;
                }
            }
            else if (this.state == BoolyState.Charging) {
                this.AccelerateHorizontally(0.25, this.direction);
                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.Recoil(this.direction);
                }
                else if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.Recoil(this.direction);
                }
                else {
                    var sprites = this.GetPotentialBounceSprites();
                    var xLeft = this.direction == -1 ? this.x - 3 : this.xRight;
                    var xRight = this.direction == -1 ? this.x : this.xRight + 3;
                    sprites.sort(function (a, b) { return b.y - a.y; });
                    for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
                        var sprite = sprites_1[_i];
                        if (sprite.x < xRight && sprite.xRight > xLeft &&
                            sprite.y < this.yBottom && sprite.yBottom > this.y) {
                            this.LaunchSprite(sprite, this.direction);
                            this.Recoil(this.direction);
                            if (sprite == player) {
                                player.throwTimer = 0;
                                player.heldItem = null;
                            }
                            break;
                        }
                    }
                }
            }
            this.ApplyGravity();
            this.ReactToWater();
        }
    };
    WoolyBooly.prototype.GetPotentialBounceSprites = function () {
        return this.layer.sprites.filter(function (a) { return (a instanceof Enemy || a instanceof Player ||
            a.canBeHeld || a instanceof ExtraHitHeart || a instanceof RedBalloon) && !(a instanceof Sparky); });
    };
    WoolyBooly.prototype.Recoil = function (direction) {
        this.dx = -0.8 * direction;
        this.dy = -0.7;
        this.state = BoolyState.Patrol;
        audioHandler.PlaySound("crash", false);
    };
    return WoolyBooly;
}(Hoggle));
