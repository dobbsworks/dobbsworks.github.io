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
var Dice = /** @class */ (function (_super) {
    __extends(Dice, _super);
    function Dice() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        //rolls = true;
        _this.canBeHeld = true;
        _this.displayedValue = 1; // [1,6]
        _this.spin = 0; // [0,5]
        _this.spinSpeed = 0;
        return _this;
    }
    Object.defineProperty(Dice.prototype, "value", {
        get: function () {
            if (this.spinSpeed)
                return 0;
            return this.displayedValue;
        },
        enumerable: false,
        configurable: true
    });
    Dice.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (this.spinSpeed) {
            this.spin += this.spinSpeed;
            if (this.spin >= 6) {
                this.spin %= 6;
                this.displayedValue += 1;
                if (this.displayedValue >= 7)
                    this.displayedValue -= 6;
            }
            if (this.isOnGround) {
                this.spinSpeed -= 0.1;
                if (this.spinSpeed <= 0) {
                    this.spinSpeed = 0;
                    if (Math.floor(this.spin)) {
                        this.spinSpeed = 0.1;
                    }
                }
            }
        }
        else {
            this.canBeHeld = true;
        }
    };
    Dice.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["dice"][Math.floor(this.spin)][this.displayedValue - 1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    Dice.prototype.OnThrow = function (thrower, direction) {
        this.spinSpeed = 1;
        this.displayedValue = 1 + this.age % 6;
        this.spin = Math.floor(this.age / 7) % 6;
        this.canBeHeld = false;
        _super.prototype.OnThrow.call(this, thrower, direction);
    };
    return Dice;
}(Sprite));
