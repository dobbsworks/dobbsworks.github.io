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
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.respectsSolidTiles = true;
        _this.canBeHeld = true;
        _this.frameRow = 0;
        _this.floatsInWater = false;
        _this.hurtsEnemies = false;
        _this.isIgnited = false;
        _this.fuseLeft = 238;
        return _this;
    }
    Bomb.prototype.OnStandInFire = function () {
        this.isIgnited = true;
    };
    Bomb.prototype.OnThrow = function (thrower, direction) {
        this.isIgnited = true;
        _super.prototype.OnThrow.call(this, thrower, direction);
    };
    Bomb.prototype.OnUpThrow = function (thrower, direction) {
        _super.prototype.OnUpThrow.call(this, thrower, direction);
    };
    Bomb.prototype.OnDownThrow = function (thrower, direction) {
        _super.prototype.OnDownThrow.call(this, thrower, direction);
    };
    Bomb.prototype.OnPickup = function () {
        this.isIgnited = true;
        return this;
    };
    Bomb.prototype.ResetFuse = function () {
        this.fuseLeft = 238;
    };
    Bomb.prototype.Update = function () {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.ReactToVerticalWind();
        this.MoveByVelocity();
        if (this.isIgnited) {
            this.fuseLeft--;
            if (this.fuseLeft <= 0) {
                this.Explode();
            }
        }
        if (this.isInWater || this.isInWaterfall) {
            this.ResetFuse();
            this.isIgnited = false;
        }
        if (this.IsInLava()) {
            this.Explode();
        }
    };
    Bomb.prototype.OnExitPipe = function (exitDirection) {
        this.ResetFuse();
    };
    Bomb.prototype.Explode = function () {
        var _a;
        this.isActive = false;
        // create explosions
        audioHandler.PlaySound("erase", false);
        var speed = 1;
        for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 4) {
            var poof = new ExplosionPoof(this.x - 1, this.y - 1, this.layer, []);
            this.layer.sprites.push(poof);
            poof.dx = speed * Math.cos(theta);
            poof.dy = speed * Math.sin(theta);
            poof.x += poof.dx * 4;
            poof.y += poof.dy * 4;
        }
        // destory blocks
        var bombXMid = Math.floor(this.xMid / 12) * 12 + 6;
        var bombYMid = Math.floor(this.yMid / 12) * 12 + 6;
        for (var x = bombXMid - 24; x <= bombXMid + 24; x += 12) {
            for (var y = bombYMid - 24; y <= bombYMid + 24; y += 12) {
                var tileXMid = Math.floor(x / 12) * 12 + 6;
                var tileYMid = Math.floor(y / 12) * 12 + 6;
                var distance = Math.sqrt(Math.pow((tileXMid - bombXMid), 2) + Math.pow((tileYMid - bombYMid), 2));
                if (distance > 28)
                    continue;
                var tile = this.layer.GetTileByPixel(x, y);
                var wireTile = tile.GetWireNeighbor();
                if (wireTile && wireTile.tileType == TileType.Cracks) {
                    (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.SetTile(tile.tileX, tile.tileY, TileType.Air);
                    this.layer.ExplodeTile(tile);
                }
            }
        }
    };
    Bomb.prototype.GetFrameData = function (frameNum) {
        var col = 0;
        if (this.isIgnited) {
            if (this.fuseLeft > 42 + 80)
                col = (this.fuseLeft - (42 + 80)) % 48 <= 20 ? 1 : 2;
            else if (this.fuseLeft > 42)
                col = (this.fuseLeft - (42)) % 32 <= 16 ? 2 : 1;
            else
                col = 3;
        }
        return {
            imageTile: tiles["bomb"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    };
    return Bomb;
}(Sprite));
var SafetyBomb = /** @class */ (function (_super) {
    __extends(SafetyBomb, _super);
    function SafetyBomb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 3;
        return _this;
    }
    SafetyBomb.prototype.OnPickup = function () {
        // do NOT ignite
        return this;
    };
    return SafetyBomb;
}(Bomb));
var ExplosionPoof = /** @class */ (function (_super) {
    __extends(ExplosionPoof, _super);
    function ExplosionPoof() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        _this.hurtsEnemies = true;
        return _this;
    }
    ExplosionPoof.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.MoveByVelocity();
        var velocityDampen = 0.96;
        this.dx *= velocityDampen;
        this.dy *= velocityDampen;
        if (this.age > 25)
            this.isActive = false;
    };
    ExplosionPoof.prototype.GetFrameData = function (frameNum) {
        var col = [0, 1, 1, 2, 2, 2, 3, 3, -1, 3, -1, 3, -1][Math.floor(this.age / 2)];
        if (col == -1) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["bomb"][col][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    ExplosionPoof.prototype.IsHazardActive = function () {
        return true;
    };
    return ExplosionPoof;
}(Hazard));
var BlockShard = /** @class */ (function (_super) {
    __extends(BlockShard, _super);
    function BlockShard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 6;
        _this.width = 6;
        _this.respectsSolidTiles = false;
        _this.tilePortionX = 0;
        _this.tilePortionY = 0;
        return _this;
    }
    BlockShard.prototype.Update = function () {
        this.dx *= 0.99;
        this.ApplyGravity();
        this.MoveByVelocity();
        if (!this.IsOnScreen())
            this.isActive = false;
    };
    BlockShard.prototype.GetFrameData = function (frameNum) {
        throw new Error("Method not implemented.");
    };
    BlockShard.prototype.Draw = function (camera, frameNum) {
        if (frameNum % 2 == 0)
            return;
        var imageTile = this.sourceTileType.imageTile;
        camera.ctx.drawImage(imageTile.src, imageTile.xSrc + 0.1 + this.tilePortionX * 6, imageTile.ySrc + 0.1 + this.tilePortionY * 6, imageTile.width / 2 - 0.2, imageTile.height / 2 - 0.2, (this.x - camera.x - 0) * camera.scale + camera.canvas.width / 2, (this.y - camera.y - 0) * camera.scale + camera.canvas.height / 2, imageTile.width * camera.scale / 2, imageTile.height * camera.scale / 2);
    };
    return BlockShard;
}(Sprite));
