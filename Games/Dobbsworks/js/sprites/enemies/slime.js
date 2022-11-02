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
var LittleJelly = /** @class */ (function (_super) {
    __extends(LittleJelly, _super);
    function LittleJelly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 13;
        _this.respectsSolidTiles = true;
        _this.squishTimer = 0;
        _this.jumpPrepTimer = 0;
        _this.canBeBouncedOn = true;
        _this.frameCounter = 0;
        _this.animateTimer = 0;
        _this.wasOnGround = false;
        return _this;
    }
    LittleJelly.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.isInDeathAnimation) {
            if (this.squishTimer == 2)
                audioHandler.PlaySound("stuck-jump", true);
            this.squishTimer++;
            this.ApplyGravity();
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        }
        else {
            if (this.isOnGround) {
                if (!this.wasOnGround) {
                    // just landed
                    audioHandler.PlaySound("stuck-jump", true);
                    this.CreateSlimeGround();
                    this.animateTimer = 1;
                }
                this.jumpPrepTimer++;
                this.dx *= 0.5;
                if (this.jumpPrepTimer > 20) {
                    this.jumpPrepTimer = 0;
                    this.dy = -2.5;
                    //this.animateTimer = 1;
                }
                this.wasOnGround = true;
                if (player) {
                    if (player.xMid < this.xMid)
                        this.direction = -1;
                    if (player.xMid > this.xMid)
                        this.direction = 1;
                }
            }
            else {
                this.SkyPatrol(0.35);
                this.wasOnGround = false;
            }
            this.ApplyGravity();
            this.ReactToWater();
        }
        if (this.animateTimer > 0) {
            this.animateTimer++;
            this.frameCounter += 0.4;
            if (this.animateTimer > 20) {
                this.animateTimer = 0;
                this.frameCounter = 0;
            }
        }
    };
    LittleJelly.prototype.CreateSlimeGround = function () {
        var _this = this;
        var xs = [this.xMid, this.xMid - 6, this.xMid + 6].map(function (a) { return Math.floor(a / _this.layer.tileWidth); }).filter(Utility.OnlyUnique);
        var y = Math.floor((this.yBottom + 1) / this.layer.tileHeight);
        xs.forEach(function (x) { return _this.AttemptToSlime(x, y); });
    };
    LittleJelly.prototype.AttemptToSlime = function (xIndex, yIndex) {
        var _a;
        var tile = this.layer.GetTileByIndex(xIndex, yIndex);
        var semisolid = tile.GetSemisolidNeighbor();
        // TODO
        // when it's possible to wash off slime we'll need to store the previous semisolid
        if (tile.tileType == TileType.Air) {
            if (semisolid && semisolid.tileType.solidity == Solidity.Top) {
                if (!semisolid.tileType.isExemptFromSlime) {
                    semisolid.layer.SetTile(xIndex, yIndex, TileType.Slime);
                }
            }
        }
        else {
            if (tile.tileType.solidity == Solidity.Block && !tile.tileType.isExemptFromSlime) {
                (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.semisolidLayer.SetTile(xIndex, yIndex, TileType.Slime);
            }
        }
    };
    LittleJelly.prototype.OnBounce = function () {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
    };
    LittleJelly.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1, 2, 3, 4, 3, 2, 1];
        var frame = frames[Math.floor(this.frameCounter) % frames.length];
        if (this.isInDeathAnimation) {
            frame = Math.floor(this.squishTimer / 5) + 5;
            if (frame > 9)
                frame = 9;
        }
        return {
            imageTile: tiles["slime"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    };
    return LittleJelly;
}(Enemy));
