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
var SoccerBall = /** @class */ (function (_super) {
    __extends(SoccerBall, _super);
    function SoccerBall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.canBeHeld = false;
        _this.floatsInWater = true;
        _this.hurtsEnemies = false;
        return _this;
    }
    SoccerBall.prototype.OnStrikeEnemy = function (enemy) {
        this.dy -= 2;
        this.dx *= 0.5;
        audioHandler.PlaySound("soccer", true);
    };
    SoccerBall.prototype.Update = function () {
        var _this = this;
        var overlappingPlayers = this.layer.sprites.filter(function (a) { return a instanceof Player && a.Overlaps(_this); });
        for (var _i = 0, overlappingPlayers_1 = overlappingPlayers; _i < overlappingPlayers_1.length; _i++) {
            var overlappingPlayer = overlappingPlayers_1[_i];
            if (overlappingPlayer.xMid <= this.xMid) {
                // bounce right
                this.dx = 2;
            }
            else {
                // bounce left
                this.dx = -2;
            }
            this.dy = -3;
            audioHandler.PlaySound("soccer", true);
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ApplyAirDrag();
        this.ReactToWater();
        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        }
        else {
            this.rotation -= this.GetTotalDx() / 2;
        }
        var oldDy = this.dy;
        this.ReactToPlatformsAndSolids();
        if (this.isOnGround) {
            if (oldDy > 0.2) {
                audioHandler.PlaySound("soccer", true);
                this.dy = -oldDy + 0.2;
                var slope = this.standingOn.map(function (a) { return a.tileType.solidity; }).find(function (a) { return a instanceof SlopeSolidity && a.verticalSolidDirection == 1; });
                if (slope) {
                    // bouncing on slope
                    var currentSpeed_1 = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
                    var currentDir = Math.atan2(this.dy, this.dx);
                    var oppositeCurrentDir = Math.PI + currentDir;
                    var slopeAngle = Math.atan2(slope.absoluteSlope * slope.horizontalSolidDirection, 1);
                    var slopePerpendicular = slopeAngle - Math.PI / 2;
                    var newAngle = 2 * slopePerpendicular - oppositeCurrentDir;
                    this.dx = currentSpeed_1 * Math.cos(newAngle);
                    this.dy = currentSpeed_1 * Math.sin(newAngle);
                }
            }
        }
        this.ReactToVerticalWind();
        this.MoveByVelocity();
        var currentSpeed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
        this.hurtsEnemies = currentSpeed > 1.6;
    };
    SoccerBall.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["soccerball"]).length;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = 3 - (Math.floor(rot / (Math.PI * 2) * totalFrames) || 0);
        if (frame < 0)
            frame = 0;
        return {
            imageTile: tiles["soccerball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    };
    return SoccerBall;
}(Sprite));
