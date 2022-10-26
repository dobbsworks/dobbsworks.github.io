"use strict";
var CircuitHandler = /** @class */ (function () {
    function CircuitHandler() {
    }
    CircuitHandler.UpdateCircuits = function (layer, sprites) {
        var allTiles = layer.wireFlatMap;
        var poweredSprites = sprites.filter(function (a) { return a.isPowerSource; });
        // remove power from all sprite-powered tiles
        allTiles.forEach(function (a) { return a.isSpritePowered = false; });
        // add power to all tiles containing battery/etc
        poweredSprites.forEach(function (s) {
            var powerPoints = s.GetPowerPoints();
            for (var _i = 0, powerPoints_1 = powerPoints; _i < powerPoints_1.length; _i++) {
                var pixel = powerPoints_1[_i];
                var tile = layer.GetTileByPixel(pixel.xPixel, pixel.yPixel);
                tile.isSpritePowered = true;
            }
        });
        var newPowerValuesMap = [];
        var _loop_1 = function (tile) {
            var powerableNeighborFilter = function (neighbor) {
                var t = neighbor.tile;
                if (t.tileType == TileType.CircuitCrossOff || t.tileType == TileType.CircuitCrossOn) {
                    return powerableNeighborFilter({ dir: neighbor.dir, tile: neighbor.tile.Neighbor(neighbor.dir) });
                }
                // if neighbor wire has one exit direction, only look at it from that direction
                if (t.tileType.powerOutputDirection && t.tileType.powerOutputDirection !== neighbor.dir.Opposite()) {
                    return null;
                }
                if (tile.tileType.powerOutputDirection == neighbor.dir)
                    return null;
                if (tile.tileType.powerInputDirection && neighbor.dir !== tile.tileType.powerInputDirection) {
                    return null;
                }
                if (t.tileType.isPowerSource)
                    return t;
                if (t.tileType.canBePowered)
                    return t;
                return null;
            };
            var neighborsToCheckForPower = tile.Neighbors().map(powerableNeighborFilter).filter(function (a) { return a != null; });
            if (tile.isSpritePowered) {
                newPowerValuesMap.push({ t: tile, p: 0 });
            }
            else if (neighborsToCheckForPower) {
                var myNewPowerValue = tile.tileType.calcPowerFromNeighbors(neighborsToCheckForPower);
                newPowerValuesMap.push({ t: tile, p: myNewPowerValue });
            }
        };
        for (var _i = 0, _a = allTiles.filter(function (a) { return a.tileType.canBePowered; }); _i < _a.length; _i++) {
            var tile = _a[_i];
            _loop_1(tile);
        }
        for (var _b = 0, newPowerValuesMap_1 = newPowerValuesMap; _b < newPowerValuesMap_1.length; _b++) {
            var newPowerValue = newPowerValuesMap_1[_b];
            if (newPowerValue.p < 0 || (newPowerValue.p > 20)) {
                newPowerValue.t.PowerDown();
            }
            else {
                newPowerValue.t.PowerUp();
                newPowerValue.t.powerValue = newPowerValue.p;
            }
        }
    };
    CircuitHandler.NormalPowerCalc = function (neighbors) {
        if (neighbors.some(function (a) { return a.tileType.isPowerSource; }))
            return 1;
        var neighborPowerVals = neighbors.filter(function (a) { return a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay; }).map(function (a) { return a.powerValue; });
        var myNewPowerValue = Math.min.apply(Math, neighborPowerVals) + 1;
        return myNewPowerValue;
    };
    CircuitHandler.CrossPowerCalc = function (neighbors) {
        if (neighbors.some(function (a) { return a.tileType.isPowerSource; }))
            return 1;
        var neighborPowerVals = neighbors.filter(function (a) { return a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay; }).map(function (a) { return a.powerValue; });
        var myNewPowerValue = Math.min.apply(Math, neighborPowerVals) + 1;
        return myNewPowerValue;
    };
    CircuitHandler.InverterPowerCalc = function (neighbors) {
        if (neighbors.some(function (a) { return a.tileType.isPowerSource; }))
            return -1;
        var neighborPowerVals = neighbors.filter(function (a) { return a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay; }).map(function (a) { return a.powerValue; });
        if (neighborPowerVals.some(function (a) { return a > 0; }))
            return -1;
        return 1;
    };
    CircuitHandler.DiodePowerCalc = function (neighbors) {
        if (neighbors.some(function (a) { return a.tileType.isPowerSource; }))
            return 1;
        var neighborPowerVals = neighbors.filter(function (a) { return a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay; }).map(function (a) { return a.powerValue; });
        if (neighborPowerVals.some(function (a) { return a > 0; }))
            return 1;
        return -1;
    };
    CircuitHandler.AndGatePowerCalc = function (neighbors) {
        if (neighbors.every(function (a) { return a.tileType.isPowerSource; }))
            return 1;
        var neighborPowerVals = neighbors.filter(function (a) { return !a.tileType.isPowerSource; }).map(function (a) { return a.powerValue; });
        if (neighborPowerVals.some(function (a) { return a === -1; }))
            return -1;
        var myNewPowerValue = Math.min.apply(Math, neighborPowerVals) + 1;
        return myNewPowerValue;
    };
    return CircuitHandler;
}());
