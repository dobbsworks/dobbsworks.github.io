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
var RedCannon = /** @class */ (function (_super) {
    __extends(RedCannon, _super);
    function RedCannon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.holdingPlayer = false;
        _this.shootTimer = 0;
        _this.rotationCounter = 0;
        _this.power = 4;
        _this.frameRow = 0;
        _this.zIndex = 2;
        _this.bigTimer = 0;
        return _this;
    }
    RedCannon.prototype.Update = function () {
        this.rotationCounter++;
        if (this.bigTimer > 0)
            this.bigTimer--;
        var player = this.layer.sprites.find(function (a) { return a instanceof Player; });
        if (!player)
            return;
        if (this.shootTimer > 0)
            this.shootTimer--;
        if (!this.holdingPlayer) {
            if (this.IsGoingToOverlapSprite(player) && this.shootTimer <= 0) {
                this.holdingPlayer = true;
                this.bigTimer = 10;
                audioHandler.PlaySound("bwump", true);
            }
        }
        if (this.holdingPlayer) {
            player.x = this.xMid - player.width / 2;
            player.y = this.yMid - player.height / 2;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.holdingPlayer = false;
                this.shootTimer = 30;
                this.bigTimer = 5;
                // 8 frames per 22.5-degree tile
                // all 8 frames of [2], 4 frames each from [1] and [3] will point to [2]
                var theta = -Math.PI / 2 + 2 * Math.PI * Math.floor((this.rotationCounter + 4) / 16) / 8;
                player.dx = this.power * Math.cos(theta);
                player.dy = this.power * Math.sin(theta);
                player.neutralTimer = 20;
                player.forcedJumpTimer = 20;
                player.jumpTimer = -1;
                audioHandler.PlaySound("pomp", true);
            }
        }
    };
    RedCannon.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.rotationCounter / 8) % 16;
        return {
            imageTile: tiles["cannon"][col][(this.bigTimer > 0 ? 1 : 0) + this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    };
    return RedCannon;
}(Sprite));
var BlueCannon = /** @class */ (function (_super) {
    __extends(BlueCannon, _super);
    function BlueCannon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.power = 3;
        _this.frameRow = 2;
        return _this;
    }
    return BlueCannon;
}(RedCannon));
