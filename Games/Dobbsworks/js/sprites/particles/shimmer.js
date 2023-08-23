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
var Shimmer = /** @class */ (function (_super) {
    __extends(Shimmer, _super);
    function Shimmer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        _this.imageName = "shimmer";
        return _this;
    }
    Shimmer.prototype.Update = function () {
        if (this.age > 20)
            this.isActive = false;
    };
    Shimmer.prototype.GetFrameData = function (frameNum) {
        var frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0];
        var frameIndex = Math.floor(this.age / 2) % frames.length;
        var frame = frames[frameIndex];
        return {
            imageTile: tiles[this.imageName][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Shimmer;
}(Sprite));
var ShimmerRipple = /** @class */ (function (_super) {
    __extends(ShimmerRipple, _super);
    function ShimmerRipple() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 1;
        _this.width = 1;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        _this.initialized = false;
        _this.maxRadiusPixels = 36;
        _this.currentRevealRadius = 0;
        _this.revealSpeed = 0.8;
        _this.queuedShimmers = [];
        return _this;
    }
    ShimmerRipple.prototype.Initialize = function () {
        // scan for shimmer tiles in a radius, determine time to trigger particles at each location
        var minTileX = Math.floor((this.x - this.maxRadiusPixels) / this.layer.tileWidth);
        var minTileY = Math.floor((this.y - this.maxRadiusPixels) / this.layer.tileHeight);
        var tileRadius = Math.floor(this.maxRadiusPixels / this.layer.tileWidth);
        for (var x = minTileX; x <= minTileX + tileRadius * 2; x++) {
            for (var y = minTileY; y < minTileY + tileRadius * 2; y++) {
                if (!this.layer.tiles[x])
                    continue;
                var potentialShimmerTile = this.layer.tiles[x][y];
                if (!potentialShimmerTile)
                    continue;
                if (!potentialShimmerTile.tileType.shimmers)
                    continue;
                var xDist = (potentialShimmerTile.tileX + 0.5) * this.layer.tileWidth - this.x;
                var yDist = (potentialShimmerTile.tileY + 0.5) * this.layer.tileHeight - this.y;
                var distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
                if (distance <= this.maxRadiusPixels) {
                    this.queuedShimmers.push({ tileX: potentialShimmerTile.tileX, tileY: potentialShimmerTile.tileY, distance: distance });
                }
            }
        }
    };
    ShimmerRipple.prototype.Update = function () {
        var _this = this;
        if (!this.initialized) {
            this.Initialize();
            this.initialized = true;
        }
        this.currentRevealRadius += this.revealSpeed;
        var toReveal = this.queuedShimmers.filter(function (a) { return a.distance <= _this.currentRevealRadius; });
        // remove revealed blocks from list
        this.queuedShimmers = this.queuedShimmers.filter(function (a) { return a.distance > _this.currentRevealRadius; });
        for (var _i = 0, toReveal_1 = toReveal; _i < toReveal_1.length; _i++) {
            var tile = toReveal_1[_i];
            this.layer.sprites.push(new Shimmer(tile.tileX * this.layer.tileWidth, tile.tileY * this.layer.tileHeight, this.layer, []));
        }
        if (this.queuedShimmers.length == 0 && this.currentRevealRadius > this.maxRadiusPixels)
            this.isActive = false;
        if (this.maxRadiusPixels > 50) {
            // jump shimmers don't count, need lightbulb shimmer
            var ghosts = this.layer.sprites.filter(function (a) { return a.isDestroyedByLight; });
            for (var _a = 0, ghosts_1 = ghosts; _a < ghosts_1.length; _a++) {
                var ghost = ghosts_1[_a];
                var distance = Math.sqrt(Math.pow((this.x - ghost.x), 2) + Math.pow((this.y - ghost.y), 2));
                if (Math.abs(distance - this.currentRevealRadius) < 5) {
                    ghost.ReplaceWithSpriteType(Poof);
                }
            }
        }
    };
    ShimmerRipple.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["shimmer"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    ShimmerRipple.prototype.OnAfterDraw = function (camera) {
        var ctx = camera.ctx;
        if (this.currentRevealRadius > 3) {
            var x = (this.x - camera.x) * camera.scale + camera.canvas.width / 2;
            var y = (this.y - camera.y) * camera.scale + camera.canvas.height / 2;
            ctx.strokeStyle = "#FFF3";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, this.currentRevealRadius * camera.scale, -Math.PI / 2, 2 * Math.PI - Math.PI / 2, false);
            ctx.stroke();
        }
    };
    return ShimmerRipple;
}(Sprite));
