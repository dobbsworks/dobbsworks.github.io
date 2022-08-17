"use strict";
var LevelTile = /** @class */ (function () {
    function LevelTile(tileX, tileY, tileType, layer) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.tileType = tileType;
        this.layer = layer;
        this.isSpritePowered = false;
        this.powerValue = -1; // -1 no power, 0+ distance from powersource
        this.powerDelay = 0;
        this.isPoweredUp = false;
        this.SetPropertiesByTileType();
    }
    LevelTile.prototype.GetMainNeighbor = function () {
        var _a;
        return (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.mainLayer.GetTileByIndex(this.tileX, this.tileY);
    };
    LevelTile.prototype.GetSemisolidNeighbor = function () {
        var _a;
        return (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.semisolidLayer.GetTileByIndex(this.tileX, this.tileY);
    };
    LevelTile.prototype.GetWireNeighbor = function () {
        var _a;
        return (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer.GetTileByIndex(this.tileX, this.tileY);
    };
    LevelTile.prototype.GetWaterNeighbor = function () {
        var _a;
        return (_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.waterLayer.GetTileByIndex(this.tileX, this.tileY);
    };
    LevelTile.prototype.GetTopPixel = function () {
        return this.tileY * this.layer.tileHeight;
    };
    LevelTile.prototype.SetPropertiesByTileType = function () {
        if (this.tileType == TileType.PowerBlock) {
            this.powerValue = 0;
        }
        if (this.tileType == TileType.CircuitOn || this.tileType == TileType.ConveyorRightOn) {
            this.powerValue = 1;
        }
    };
    LevelTile.prototype.isPowered = function () {
        return this.tileType == TileType.PowerBlock || (this.powerValue >= 0 && this.powerValue < 20);
    };
    LevelTile.prototype.PowerUp = function () {
        var _a, _b;
        if (!this.tileType.canBePowered)
            return;
        if (!this.isPoweredUp)
            this.tileType.onPowered(this);
        this.isPoweredUp = true;
        this.powerDelay++;
        var poweredVersionOfTile = this.tileType.poweredTile;
        if (poweredVersionOfTile) {
            this.layer.SetTile(this.tileX, this.tileY, poweredVersionOfTile);
        }
        if (this.layer === ((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer)) {
            (_b = this.layer.map) === null || _b === void 0 ? void 0 : _b.mainLayer.GetTileByIndex(this.tileX, this.tileY).PowerUp();
        }
    };
    LevelTile.prototype.PowerDown = function () {
        var _a, _b;
        this.powerDelay = 0;
        this.isPoweredUp = false;
        this.tileType.onUnpowered(this);
        var unpoweredVersionOfTile = this.tileType.unpoweredTile;
        if (unpoweredVersionOfTile) {
            this.layer.SetTile(this.tileX, this.tileY, unpoweredVersionOfTile);
        }
        this.powerValue = -1;
        if (this.layer === ((_a = this.layer.map) === null || _a === void 0 ? void 0 : _a.wireLayer)) {
            (_b = this.layer.map) === null || _b === void 0 ? void 0 : _b.mainLayer.GetTileByIndex(this.tileX, this.tileY).PowerDown();
        }
    };
    LevelTile.prototype.Neighbors = function () {
        var _this = this;
        return Direction.All.map(function (d) { return ({ dir: d, tile: _this.layer.GetTileByIndex(_this.tileX + d.x, _this.tileY + d.y) }); });
    };
    LevelTile.prototype.Neighbor = function (dir) {
        return this.layer.GetTileByIndex(this.tileX + dir.x, this.tileY + dir.y);
    };
    return LevelTile;
}());
