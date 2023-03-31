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
var Spurpider = /** @class */ (function (_super) {
    __extends(Spurpider, _super);
    function Spurpider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 8;
        _this.width = 8;
        _this.respectsSolidTiles = true;
        _this.canBeBouncedOn = true;
        _this.frameRow = 0;
        _this.maxSquishTimer = 30;
        _this.state = "rest";
        _this.targetY = -9999;
        _this.pauseTimer = 0;
        _this.riseTimer = 0;
        _this.riseDys = [-1, -1.5, -1, -1, -0.5, -0.5, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0, -0.5];
        _this.squishTimer = 0;
        return _this;
    }
    Spurpider.prototype.Update = function () {
        var _this = this;
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > this.maxSquishTimer) {
                this.isActive = false;
            }
        }
        else {
            if (this.state == "rest") {
                this.targetY = this.y;
                var isPlayerNearAndBelow = this.layer.sprites.some(function (p) { return p instanceof Player && Math.abs(_this.x - p.x) < 20 && p.y > _this.y - 3 && p.y < _this.y + 150; });
                if (isPlayerNearAndBelow) {
                    this.state = "drop";
                    this.dy += 0.05;
                }
            }
            if (this.state == "drop" && this.dy == 0)
                this.state = "pause";
            if (this.state == "drop") {
                this.dy += 0.05;
                if (this.dy > 1.5)
                    this.dy = 1.5;
            }
            if (this.state == "pause") {
                this.pauseTimer++;
                if (this.pauseTimer > 30) {
                    this.state = "rise";
                    this.pauseTimer = 0;
                }
            }
            if (this.state == "rise") {
                this.riseTimer = (this.riseTimer + 1) % this.riseDys.length;
                this.dy = this.riseDys[Math.floor(this.riseTimer / 2)] / 1;
                if (this.y < this.targetY) {
                    this.state = "rest";
                    this.y = this.targetY;
                    this.dy = 0;
                }
            }
            this.ReactToWater();
            this.ReactToVerticalWind();
        }
    };
    Spurpider.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Spurpider.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.OnDead();
    };
    Spurpider.prototype.GetFrameData = function (frameNum) {
        var frameCol = 0;
        if (!this.isInDeathAnimation) {
            if (this.dy > 0)
                frameCol = 1;
            if (this.dy < 0)
                frameCol = 2;
            if (this.state == "rest")
                frameCol = 3;
        }
        else {
            frameCol = 4;
        }
        return {
            imageTile: tiles["spider"][frameCol][this.frameRow],
            xFlip: Math.floor((frameNum % 20) / 10) == 0,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    };
    return Spurpider;
}(Enemy));
var ClimbingSpurpider = /** @class */ (function (_super) {
    __extends(ClimbingSpurpider, _super);
    function ClimbingSpurpider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.respectsSolidTiles = false;
        _this.isInitialized = false;
        _this.webTopY = 0;
        _this.webBottomY = 0;
        _this.verticalDirection = 1;
        _this.anchorX = 0;
        _this.frameRow = 1;
        _this.anchor = null;
        return _this;
    }
    ClimbingSpurpider.prototype.Initialize = function () {
        var _this = this;
        if (!this.isInitialized) {
            var motor = this.layer.sprites.find(function (a) { return a instanceof Motor && a.connectedSprite == _this; });
            if (motor)
                return;
            this.isInitialized = true;
            this.anchorX = this.x;
            this.webTopY = this.y;
            this.webBottomY = this.yBottom;
            var startTile = this.layer.GetTileByPixel(this.xMid, this.yMid);
            for (var y = startTile.tileY; y >= 0; y--) {
                this.webTopY = (y + 1) * 12;
                var tile = this.layer.GetTileByIndex(startTile.tileX, y);
                if (tile.tileType.solidity == Solidity.Block)
                    break;
                if (tile.tileType.solidity == Solidity.SolidForNonplayer)
                    break;
                if (tile.tileType.solidity == Solidity.Bottom)
                    break;
                if (tile.tileType.solidity instanceof SlopeSolidity) {
                    if (tile.tileType.solidity.verticalSolidDirection == 1)
                        break;
                    var ratio = tile.tileType.solidity.slopeFunc(0.5);
                    this.webTopY = y * 12 + 12 * ratio;
                    break;
                }
                this.webTopY = y * 12;
            }
            for (var y = startTile.tileY; y < currentMap.mapHeight; y++) {
                this.webBottomY = y * 12;
                var tile = this.layer.GetTileByIndex(startTile.tileX, y);
                if (tile.tileType.solidity == Solidity.Block)
                    break;
                if (tile.tileType.solidity == Solidity.SolidForNonplayer)
                    break;
                if (tile.tileType.solidity == Solidity.Top)
                    break;
                if (tile.tileType.solidity instanceof SlopeSolidity) {
                    if (tile.tileType.solidity.verticalSolidDirection == -1)
                        break;
                    var ratio = tile.tileType.solidity.slopeFunc(0.5);
                    this.webBottomY = y * 12 + 12 * ratio;
                    break;
                }
                this.webBottomY = (y + 1) * 12;
            }
        }
    };
    ClimbingSpurpider.prototype.Update = function () {
        if (this.stackedOn)
            return;
        this.Initialize();
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            this.dy = 0;
            this.dx = 0;
            if (this.squishTimer > this.maxSquishTimer) {
                this.isActive = false;
            }
        }
        else {
            var speed = 0.3;
            var accel = 0.05;
            var targetDy = speed * this.verticalDirection;
            this.AccelerateVertically(accel, targetDy);
            if (this.y > this.webBottomY - this.height) {
                this.verticalDirection = -1;
                if (this.dy > 0)
                    this.dy = 0;
            }
            if (this.y < this.webTopY) {
                this.verticalDirection = 1;
                if (this.dy < 0)
                    this.dy = 0;
            }
            var targetDx = (this.anchorX - this.x) / 10;
            this.AccelerateHorizontally(Math.abs(targetDx), targetDx);
            this.dx *= 0.98;
        }
    };
    ClimbingSpurpider.prototype.OnBeforeDraw = function (camera) {
        if (!this.isInitialized)
            return;
        camera.ctx.fillStyle = "#FFF";
        var destX = (this.anchorX + this.width / 2 - camera.x) * camera.scale + camera.canvas.width / 2;
        var destXSpider = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        var destY1 = (this.webTopY - camera.y) * camera.scale + camera.canvas.height / 2;
        var destY2 = (this.webBottomY - camera.y) * camera.scale + camera.canvas.height / 2;
        var destYSpider = (this.yMid - camera.y) * camera.scale + camera.canvas.height / 2;
        camera.ctx.lineWidth = camera.scale / 2;
        camera.ctx.strokeStyle = "#FFF";
        camera.ctx.beginPath();
        camera.ctx.moveTo(destX, destY1);
        camera.ctx.lineTo(destXSpider, destYSpider);
        camera.ctx.lineTo(destX, destY2);
        camera.ctx.stroke();
    };
    return ClimbingSpurpider;
}(Spurpider));
