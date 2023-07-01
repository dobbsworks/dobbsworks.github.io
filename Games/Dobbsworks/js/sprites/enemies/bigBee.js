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
var Bigby = /** @class */ (function (_super) {
    __extends(Bigby, _super);
    function Bigby() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 17;
        _this.width = 22;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.anchor = null;
        _this.bounceTimer = 0;
        _this.connectedSprite = null;
        _this.connectionDistance = 0;
        _this.isInitialized = false;
        return _this;
    }
    Bigby.prototype.Initialize = function () {
        this.GrabItem();
    };
    Bigby.prototype.Update = function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        if (!this.WaitForOnScreen())
            return;
        this.SkyPatrol(0.3);
        this.ApplyInertia();
        this.dy *= 0.9;
        this.ReactToWater();
        this.ReactToVerticalWind();
        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            var playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            }
            else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        }
        else {
            this.GrabItem();
        }
        if (this.bounceTimer > 0) {
            this.bounceTimer++;
            if (this.bounceTimer > 30)
                this.bounceTimer = 0;
        }
    };
    Bigby.prototype.GrabItem = function () {
        var possibleConnectionSprite = this.GetPotentialMotorCargo(1, 5);
        if (possibleConnectionSprite && possibleConnectionSprite.yBottom <= this.yBottom + 12) {
            var targetAlreadyOnMotor = possibleConnectionSprite.GetParentMotor();
            var isHeld = this.layer.sprites.some(function (a) { return a instanceof Player && a.heldItem == a; });
            var isMotor = possibleConnectionSprite instanceof Motor;
            if (!targetAlreadyOnMotor && !isHeld && !isMotor) {
                this.connectedSprite = possibleConnectionSprite;
                this.connectionDistance = this.height + 2;
            }
        }
    };
    Bigby.prototype.HandlePlayerGrab = function (sprite) {
        var players = this.layer.sprites.filter(function (a) { return a instanceof Player; });
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player_1 = players_1[_i];
            if (player_1.heldItem == sprite && player_1.heldItem.canBeHeld) {
                return true;
            }
        }
        return false;
    };
    Bigby.prototype.MoveConnectedSprite = function (sprite) {
        if (sprite instanceof Enemy) {
            sprite.direction = this.dx > 0 ? 1 : -1;
        }
        sprite.x = this.xMid - sprite.width / 2;
        sprite.y = this.y + this.connectionDistance;
        sprite.dx = this.dx;
        sprite.dy = this.dy;
    };
    Bigby.prototype.UpdateConnectedSprite = function (sprite) {
        if (!sprite)
            return;
        if (!sprite.updatedThisFrame) {
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
            sprite.updatedThisFrame = true;
        }
    };
    Bigby.prototype.OnBounce = function () {
        this.bounceTimer = 1;
    };
    Bigby.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Bigby.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(frameNum / 5) % 2;
        var row = 0;
        if (this.bounceTimer > 0) {
            var a = Math.cos(this.bounceTimer * 0.3);
            row = 2;
            if (a > 0.4)
                row = 1;
            if (a < -0.4)
                row = 3;
        }
        return {
            imageTile: tiles["bigby"][col][row],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        };
    };
    Bigby.prototype.OnBeforeDraw = function (camera) {
        if (this.connectionDistance == 0 || this.connectedSprite == null)
            return;
        var x = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        var yGameStart = (this.y + 15);
        var y = (yGameStart - camera.y) * camera.scale + camera.canvas.height / 2;
        var yGameEnd = this.connectedSprite.y;
        var drawHeight = (yGameEnd - yGameStart) * camera.scale;
        camera.ctx.fillStyle = "black";
        camera.ctx.fillRect(x - 0.5 * camera.scale, y, 1 * camera.scale, drawHeight);
    };
    return Bigby;
}(Enemy));
