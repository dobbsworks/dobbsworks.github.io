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
var AFish = /** @class */ (function (_super) {
    __extends(AFish, _super);
    function AFish() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.lastX = 0;
        return _this;
    }
    AFish.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        var wasInWater = this.isInWater;
        this.ReactToWater();
        if (wasInWater && !this.isInWater) {
            this.x = this.lastX;
            this.direction *= -1;
            this.ReactToWater();
        }
        this.lastX = this.x;
        if (this.isInWater) {
            this.ApplyInertia();
            if (Math.abs(this.dy) > 0.035)
                this.dy *= 0.9;
            if (this.direction == 1 && this.isTouchingRightWall) {
                this.direction = -1;
            }
            if (this.direction == -1 && this.isTouchingLeftWall) {
                this.direction = 1;
            }
            var targetDx = this.direction * 0.3;
            if (this.direction == 1 && this.dx < 0)
                this.dx = 0;
            if (this.direction == -1 && this.dx > 0)
                this.dx = 0;
            if (this.dx != targetDx) {
                this.dx += (targetDx - this.dx) * 0.1;
            }
            this.dy += Math.cos(this.age / 30) / 1000;
            this.ReactToVerticalWind();
        }
        else {
            this.ApplyGravity();
            this.ReplaceWithSpriteType(FloppingFish);
        }
        this.canBeBouncedOn = (player && !player.isInWater);
    };
    AFish.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    AFish.prototype.OnBounce = function () {
        this.ReplaceWithSprite(new DeadEnemy(this));
        this.OnDead();
    };
    AFish.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    };
    return AFish;
}(Enemy));
var FloppingFish = /** @class */ (function (_super) {
    __extends(FloppingFish, _super);
    function FloppingFish() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 12;
        _this.respectsSolidTiles = true;
        _this.direction = 1;
        return _this;
    }
    FloppingFish.prototype.Update = function () {
        this.ApplyGravity();
        this.ReactToPlatformsAndSolids();
        this.ReactToWater();
        this.ApplyInertia();
        this.MoveByVelocity();
        if (this.isInWater) {
            this.ReplaceWithSpriteType(AFish);
        }
        if (this.standingOn.length) {
            this.dy = -1;
            this.direction *= -1;
            this.dx = this.direction * 0.5;
        }
        if (player && this.IsGoingToOverlapSprite(player)) {
            var dead = this.ReplaceWithSprite(new DeadEnemy(this));
            dead.dy = -1;
            dead.dx = 0.5;
            this.OnDead();
        }
    };
    FloppingFish.prototype.GetFrameData = function (frameNum) {
        var col = 2;
        var yFlip = Math.floor(frameNum / 10) % 2 == 0;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: false,
            yFlip: yFlip,
            xOffset: 2,
            yOffset: 6
        };
    };
    return FloppingFish;
}(Sprite));
// 1.11.2;12;0;1;3;0;0|#002c24,#124a1c,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0;#1358eccc;#5f23b8cc;#cf2f17ff|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AAsABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAA/AA/AA/AA/AA/AA/AA/AA5|AA/AAAABCAAIABCAAIABCAAIABCAAsABCAAIABCAAIABCAAIABCAA/AA/AA/AA/AA/AA/AA/AA/AAT|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AAAEAI;ABA3AI;CwALAF;A6AEAH;A6AEAG;A6AEAF
var Grouper = /** @class */ (function (_super) {
    __extends(Grouper, _super);
    function Grouper() {
        // creates school of fish when scrolled on screen
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 18;
        _this.respectsSolidTiles = true;
        _this.canMotorHold = false;
        _this.initialized = false;
        _this.fish = [];
        _this.formation = "fish";
        _this.timer = 0;
        _this.direction = 1;
        _this.canBeBouncedOn = false;
        return _this;
    }
    Grouper.prototype.GetThumbnail = function () {
        return tiles["grouper"][0][0];
    };
    Grouper.prototype.GetFishCoordinates = function () {
        var ret = [];
        if (this.formation == "fish") {
            var fishPositionArray = [
                [2, 4, 6, 9.5],
                [1, 3, 5, 7, 9],
                [0, 2, 4, 6, 8],
                [1, 3, 5, 7, 9],
                [2, 4, 6, 9.5],
            ];
            var fishIndex = 0;
            for (var row = 0; row < fishPositionArray.length; row++) {
                for (var col = 0; col < fishPositionArray[row].length; col++) {
                    var targetX = fishPositionArray[row][col] * 10 + 48;
                    var targetY = (row - 2) * 10;
                    ret.push({ xPixel: targetX, yPixel: targetY });
                    fishIndex++;
                }
            }
        }
        else if (this.formation == "eat" || this.formation == "spin") {
            var theta = -(Math.PI * 2) / 360 * 120;
            var radius = 48;
            for (var fishIndex = 0; fishIndex < this.fish.length; fishIndex++) {
                var theta2 = theta;
                if (this.formation == "spin") {
                    theta2 += this.timer / 100 * 2;
                    var radiusRatio = (240 - this.timer) / 120;
                    radiusRatio = Math.min(1, Math.max(0.1, radiusRatio));
                    radius = 48 * radiusRatio;
                }
                var x = Math.cos(theta2) * radius;
                var y = Math.sin(theta2) * radius;
                ret.push({ xPixel: x, yPixel: y });
                theta += (Math.PI * 2) / 360 * 12;
            }
        }
        return ret;
    };
    Grouper.prototype.LockOn = function () {
        if (player) {
            this.direction = player.xMid < this.xMid ? -1 : 1;
        }
    };
    Grouper.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (!this.initialized) {
            this.initialized = true;
            var fishCount = 23;
            for (var i = 0; i < fishCount; i++) {
                var fish = new GrouperFish(this.x, this.y, this.layer, []);
                this.layer.sprites.push(fish);
                this.fish.push(fish);
            }
            this.LockOn();
        }
        if (this.fish.every(function (a) { return !a.isActive; })) {
            this.OnDead();
            this.isActive = false;
        }
        this.timer++;
        if (player && (this.formation == "fish" || this.formation == "eat")) {
            this.x = Utility.Lerp(this.x, player.xMid, 0.05);
            this.y = Utility.Lerp(this.y, player.yMid, 0.05);
        }
        if (this.formation == "fish" && this.timer > 360) {
            this.timer = 0;
            this.formation = "eat";
        }
        else if (this.formation == "eat" && this.timer > 180) {
            this.timer = 0;
            this.formation = "spin";
        }
        else if (this.formation == "spin" && this.timer > 300) {
            this.timer = 0;
            this.formation = "fish";
            this.LockOn();
        }
        var coords = this.GetFishCoordinates();
        var fishIndex = 0;
        for (var _i = 0, _a = this.fish; _i < _a.length; _i++) {
            var fish = _a[_i];
            var coord = coords.pop();
            if (coord) {
                fish.targetX = (coord.xPixel * this.direction * -1) + this.x + Math.sin(this.age / 30 + fishIndex) * 2;
                fish.targetY = coord.yPixel + this.y + Math.cos(this.age / 30 - fishIndex) * 1;
            }
            fishIndex++;
        }
    };
    Grouper.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["grouper"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 6,
                yOffset: 2
            };
        }
        else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 6,
                yOffset: 2
            };
        }
    };
    return Grouper;
}(Sprite));
var GrouperFish = /** @class */ (function (_super) {
    __extends(GrouperFish, _super);
    function GrouperFish() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 18;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.targetX = 0;
        _this.targetY = 0;
        return _this;
    }
    GrouperFish.prototype.Update = function () {
        this.ReactToWater();
        if (player)
            this.direction = (player.xMid < this.xMid) ? -1 : 1;
        if (this.isInWater) {
            this.ApplyInertia();
            this.ReactToVerticalWind();
            var theta = Math.atan2(this.targetY - this.yMid, this.targetX - this.xMid);
            var targetSpeed = 2.0;
            var accel = 0.035;
            this.AccelerateHorizontally(accel, targetSpeed * Math.cos(theta));
            this.AccelerateVertically(accel, targetSpeed * Math.sin(theta));
            this.dx *= 0.97;
            this.dy *= 0.97;
        }
        else {
            this.ApplyGravity();
            if (this.isOnGround) {
                this.ReplaceWithSprite(new DeadEnemy(this));
            }
        }
    };
    GrouperFish.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    GrouperFish.prototype.OnBounce = function () {
        this.ReplaceWithSprite(new DeadEnemy(this));
        this.OnDead();
    };
    GrouperFish.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["grouper"][0][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 6,
            yOffset: 2
        };
    };
    return GrouperFish;
}(Enemy));
