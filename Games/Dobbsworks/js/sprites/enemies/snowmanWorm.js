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
var Snoworm = /** @class */ (function (_super) {
    __extends(Snoworm, _super);
    function Snoworm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.bodySegments = [];
        _this.initialized = false;
        _this.oldPositions = [];
        _this.bounceTimer = 0;
        _this.iframes = 0;
        _this.numParts = 5;
        return _this;
    }
    Snoworm.prototype.Initialize = function () {
        if (!this.initialized) {
            this.initialized = true;
            for (var i = 0; i < this.numParts; i++) {
                var body = new SnowmanWormBody(this.x, this.y, this.layer, []);
                body.parent = this;
                body.childNumber = i + 1;
                this.bodySegments.push(body);
            }
            for (var i = this.bodySegments.length - 1; i >= 0; i--) {
                this.layer.sprites.unshift(this.bodySegments[i]);
            }
        }
    };
    Snoworm.prototype.UpdateBodySegments = function () {
        if (this.iframes == 0) {
            this.oldPositions.push({ x: this.x, y: this.y });
            if (this.oldPositions.length > 51)
                this.oldPositions.shift();
        }
        for (var i = 0; i < this.bodySegments.length; i++) {
            var body = this.bodySegments[i];
            var pos = this.oldPositions[i * 10];
            if (!pos)
                pos = this.oldPositions[this.oldPositions.length - 1];
            body.x = pos.x;
            body.y = pos.y;
        }
    };
    Snoworm.prototype.Update = function () {
        this.Initialize();
        if (!this.WaitForOnScreen())
            return;
        this.UpdateBodySegments();
        this.GroundPatrol(0.3, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        if (this.bounceTimer > 0)
            this.bounceTimer++;
        if (this.bounceTimer > 20) {
            this.isActive = false;
        }
        if (this.iframes > 0)
            this.iframes--;
    };
    Snoworm.prototype.OnBounce = function () {
        if (this.iframes > 0)
            return;
        var unbrokenBody = this.bodySegments.filter(function (a) { return a.bounceTimer == 0; });
        var tail = unbrokenBody[0];
        if (tail) {
            tail.bounceTimer++;
            tail.canBeBouncedOn = false;
        }
        else {
            this.bounceTimer++;
            this.canBeBouncedOn = false;
        }
        this.iframes = 10;
    };
    Snoworm.prototype.GetFrameData = function (frameNum) {
        if (this.bounceTimer > 0) {
            var frame = Math.min(3, Math.floor(this.bounceTimer / 5));
            return {
                imageTile: tiles["snowman"][frame][1],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 3 : 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["snowman"][1][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: this.direction == 1 ? 3 : 0,
            yOffset: Math.sin(this.age / 10 + this.iframes / 2) + 1
        };
    };
    return Snoworm;
}(Enemy));
var SnowmanWormBody = /** @class */ (function (_super) {
    __extends(SnowmanWormBody, _super);
    function SnowmanWormBody() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 9;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.bodySegments = [];
        _this.initialized = false;
        _this.bumpsEnemies = false;
        _this.bounceTimer = 0;
        _this.parent = null;
        _this.childNumber = 0;
        return _this;
    }
    SnowmanWormBody.prototype.Update = function () {
        var _a;
        if (!this.WaitForOnScreen())
            return;
        if (this.bounceTimer > 0)
            this.bounceTimer++;
        if (this.bounceTimer > 20) {
            this.isActive = false;
        }
        if (!((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isActive)) {
            var deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
            this.isActive = false;
        }
    };
    SnowmanWormBody.prototype.OnBounce = function () {
        if (this.parent) {
            this.parent.OnBounce();
        }
    };
    SnowmanWormBody.prototype.GetFrameData = function (frameNum) {
        if (this.bounceTimer > 0) {
            var frame = Math.min(3, Math.floor(this.bounceTimer / 5));
            return {
                imageTile: tiles["snowman"][frame][1],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["snowman"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: Math.sin(this.age / 10 + this.childNumber + (this.parent ? this.parent.iframes / 2 : 0)) + 1
        };
    };
    return SnowmanWormBody;
}(Enemy));
var BouncingSnowWorm = /** @class */ (function (_super) {
    __extends(BouncingSnowWorm, _super);
    function BouncingSnowWorm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.leapWaitTimer = 0;
        return _this;
    }
    BouncingSnowWorm.prototype.Update = function () {
        this.Initialize();
        this.UpdateBodySegments();
        if (this.isTouchingLeftWall)
            this.direction = 1;
        if (this.isTouchingRightWall)
            this.direction = -1;
        if (this.isOnGround)
            this.leapWaitTimer++;
        if (this.leapWaitTimer > 60) {
            this.leapWaitTimer = 0;
            this.dy = -1.5;
            this.dx = this.direction * 1;
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        if (this.bounceTimer > 0)
            this.bounceTimer++;
        if (this.bounceTimer > 20) {
            this.isActive = false;
        }
        if (this.iframes > 0)
            this.iframes--;
    };
    return BouncingSnowWorm;
}(Snoworm));
