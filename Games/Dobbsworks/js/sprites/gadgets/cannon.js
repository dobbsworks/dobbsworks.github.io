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
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = false;
        _this.heldPlayer = null;
        _this.shootTimer = 0;
        _this.rotationCounter = 0;
        _this.autoRotates = true;
        _this.power = 4;
        _this.frameRow = 0;
        _this.zIndex = 2;
        _this.bigTimer = 0;
        _this.autoFireFrames = -1;
        _this.autoFireTimer = 0;
        return _this;
    }
    RedCannon.prototype.Update = function () {
        if (this.autoRotates) {
            this.rotationCounter++;
        }
        else {
            if (this.heldPlayer) {
                var isUpPressed = KeyboardHandler.IsKeyPressed(KeyAction.Up, false);
                var isLeftPressed = KeyboardHandler.IsKeyPressed(KeyAction.Left, false);
                var isRightPressed = KeyboardHandler.IsKeyPressed(KeyAction.Right, false);
                var isDownPressed = KeyboardHandler.IsKeyPressed(KeyAction.Down, false);
                if (isUpPressed && !isLeftPressed && !isRightPressed)
                    this.rotationCounter = 0;
                if (isUpPressed && isRightPressed)
                    this.rotationCounter = 16;
                if (isRightPressed && !isUpPressed && !isDownPressed)
                    this.rotationCounter = 32;
                if (isRightPressed && isDownPressed)
                    this.rotationCounter = 48;
                if (isDownPressed && !isLeftPressed && !isRightPressed)
                    this.rotationCounter = 64;
                if (isDownPressed && isLeftPressed)
                    this.rotationCounter = 80;
                if (isLeftPressed && !isUpPressed && !isDownPressed)
                    this.rotationCounter = 96;
                if (isLeftPressed && isUpPressed)
                    this.rotationCounter = 112;
            }
        }
        if (this.bigTimer > 0)
            this.bigTimer--;
        if (this.shootTimer > 0)
            this.shootTimer--;
        if (!this.heldPlayer) {
            var players = this.layer.sprites.filter(function (a) { return a instanceof Player; });
            for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                var player_1 = players_1[_i];
                this.autoFireTimer = 0;
                if (this.IsGoingToOverlapSprite(player_1) && this.shootTimer <= 0 && !player_1.yoyoTarget) {
                    this.heldPlayer = player_1;
                    this.bigTimer = 10;
                    audioHandler.PlaySound("bwump", true);
                }
            }
        }
        if (this.heldPlayer) {
            this.autoFireTimer++;
            this.heldPlayer.x = this.xMid - this.heldPlayer.width / 2;
            this.heldPlayer.y = this.yMid - this.heldPlayer.height / 2;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.CannonBlastPlayer();
            }
            else {
                if (this.autoFireTimer == this.autoFireFrames) {
                    this.CannonBlastPlayer();
                }
            }
            if (!this.IsOnScreen()) {
                this.heldPlayer.OnPlayerDead(false);
            }
        }
    };
    RedCannon.prototype.CannonBlastPlayer = function () {
        this.heldPlayer = null;
        this.shootTimer = 30;
        this.bigTimer = 5;
        // 8 frames per 22.5-degree tile
        // all 8 frames of [2], 4 frames each from [1] and [3] will point to [2]
        var theta = -Math.PI / 2 + 2 * Math.PI * Math.floor((this.rotationCounter + 4) / 16) / 8;
        player.dx = this.power * Math.cos(theta);
        player.dy = this.power * Math.sin(theta);
        player.dxFromPlatform = 0;
        player.dyFromPlatform = 0;
        player.neutralTimer = 20;
        player.forcedJumpTimer = 20;
        player.jumpTimer = -1;
        audioHandler.PlaySound("pomp", true);
    };
    RedCannon.prototype.GetFrameData = function (frameNum) {
        var col = Math.floor(this.rotationCounter / 8) % 16;
        var frames = [{
                imageTile: tiles["cannon"][col][(this.bigTimer > 0 ? 1 : 0) + this.frameRow],
                xFlip: false,
                yFlip: false,
                xOffset: 3,
                yOffset: 3
            }];
        if (this.heldPlayer && this.autoFireFrames > 0) {
            var remaining = Math.floor((this.autoFireFrames - this.autoFireTimer) / 30);
            var newFrame = {
                imageTile: tiles["numbers"][remaining][0],
                xFlip: false,
                yFlip: false,
                xOffset: -2,
                yOffset: -1
            };
            frames.push(newFrame);
        }
        return frames;
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
var PurpleCannon = /** @class */ (function (_super) {
    __extends(PurpleCannon, _super);
    function PurpleCannon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 4;
        _this.autoRotates = false;
        _this.autoFireFrames = 120;
        return _this;
    }
    return PurpleCannon;
}(RedCannon));
