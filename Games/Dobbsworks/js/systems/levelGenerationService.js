"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var LevelBlock = /** @class */ (function () {
    function LevelBlock(exportString, difficulty, width, startHeight, endHeight) {
        this.exportString = exportString;
        this.difficulty = difficulty;
        this.width = width;
        this.startHeight = startHeight;
        this.endHeight = endHeight;
    }
    LevelBlock.prototype.PlaceInMap = function (map, startX, startY) {
        var segments = this.exportString.split("|");
        map.GetLayerList().forEach(function (layer, index) {
            LevelLayer.ImportIntoLayer(layer, segments[index], index, 12, startX, startY);
        });
        LevelMap.ImportSprites(segments[5], startX, startY);
    };
    return LevelBlock;
}());
var LevelGenerator = /** @class */ (function () {
    function LevelGenerator() {
    }
    LevelGenerator.prototype.test = function () {
        for (var i = 0; i < 12; i++) {
            currentMap.mainLayer.SetTile(0, i, TileType.DirtTile);
        }
    };
    LevelGenerator.prototype.ExportCurrent = function (numColumns) {
        var spriteList = [];
        for (var _i = 0, _a = editorHandler.sprites.filter(function (a) { return !(a.spriteInstance instanceof Player || a.spriteInstance instanceof GoldGear); }); _i < _a.length; _i++) {
            var sprite = _a[_i];
            var spriteIndex = spriteTypes.indexOf(sprite.spriteType);
            var x = sprite.tileCoord.tileX;
            var y = sprite.tileCoord.tileY;
            var additionalProps = sprite.editorProps || [];
            var spriteStr = __spreadArrays([spriteIndex, x, y], additionalProps).map(function (a) { return Utility.toTwoDigitB64(a); });
            spriteList.push(spriteStr.join(''));
        }
        return __spreadArrays(currentMap.GetLayerList().map(function (a) { return a.ExportToString(numColumns); }), [
            spriteList.join(";"),
        ]).join("|");
    };
    LevelGenerator.prototype.StitchBlocks = function (levelBlocks) {
        if (levelBlocks.length == 0)
            return;
        var x = 0;
        var y = 0;
        for (var _i = 0, levelBlocks_1 = levelBlocks; _i < levelBlocks_1.length; _i++) {
            var block = levelBlocks_1[_i];
            block.PlaceInMap(currentMap, x, y);
            x += block.width;
            y -= block.endHeight - block.startHeight;
        }
    };
    LevelGenerator.prototype.LoadTestLevel = function () {
        LevelMap.BlankOutMap();
        editorHandler.sprites = [];
        var blocks = [LevelGenerator.BasicStartBlock];
        for (var i = 0; i < 5; i++) {
            var index = Math.floor(Math.random() * LevelGenerator.LevelBlocks.length);
            blocks.push(LevelGenerator.LevelBlocks[index]);
        }
        blocks.push(LevelGenerator.BasicEndBlock);
        this.StitchBlocks(blocks);
        this.FillInSolidsBelowFloor(currentMap);
        this.ApplyCaveRoof(currentMap);
        this.ApplyGrassyDecor(currentMap);
    };
    LevelGenerator.prototype.FillInSolidsBelowFloor = function (map) {
        for (var x = 0; x < map.mainLayer.tiles.length; x++) {
            var lowestBlockY = 11;
            for (var y = 11; y > -1; y--) {
                var tile = map.mainLayer.GetTileByIndex(x, y);
                if (tile.tileType == TileType.Dirt) {
                    lowestBlockY = y;
                    break;
                }
            }
            if (lowestBlockY > -1) {
                for (var y = lowestBlockY + 1; y < 12; y++) {
                    map.mainLayer.SetTile(x, y, TileType.Dirt, true);
                }
            }
        }
    };
    LevelGenerator.prototype.ApplyCaveRoof = function (map) {
        var caveHeightMap = [];
        for (var x = 0; x < map.mainLayer.tiles.length; x++) {
            var highestBlockY = 12;
            for (var y = 0; y < 12; y++) {
                var tile = map.mainLayer.GetTileByIndex(x, y);
                if (tile.tileType == TileType.Dirt) {
                    highestBlockY = y;
                    break;
                }
            }
            caveHeightMap.push(highestBlockY >= 12 ? caveHeightMap[caveHeightMap.length - 1] : highestBlockY - 5);
        }
        var newCaveHeightMap = [];
        var _loop_1 = function (i) {
            newCaveHeightMap.push(Math.floor([-1, 0, 1].map(function (a) { var _a; return (_a = caveHeightMap[i + a]) !== null && _a !== void 0 ? _a : caveHeightMap[i]; }).reduce(Utility.Sum) / 3
                - Math.random() + Math.sin(i / 3)));
        };
        for (var i = 0; i < caveHeightMap.length; i++) {
            _loop_1(i);
        }
        for (var x = 0; x < map.mainLayer.tiles.length; x++) {
            for (var y = 0; y < newCaveHeightMap[x]; y++) {
                map.mainLayer.SetTile(x, y, TileType.Dirt);
            }
        }
    };
    LevelGenerator.prototype.ApplyGrassyDecor = function (map) {
        for (var x = 0; x < map.mainLayer.tiles.length; x++) {
            for (var y = 0; y < 12; y++) {
                var tile = map.mainLayer.GetTileByIndex(x, y);
                var tileAbove = map.mainLayer.GetTileByIndex(x, y - 1);
                if (tile.tileType == TileType.Dirt && tileAbove.tileType == TileType.Air) {
                    map.semisolidLayer.SetTile(x, y, TileType.GrassyTop);
                    if (Math.random() < 0.05 && y > 0) {
                        map.mainLayer.SetTile(x, y - 1, TileType.Flower);
                    }
                }
                if (tile.tileType == TileType.Dirt && Math.random() < 0.18) {
                    map.mainLayer.SetTile(x, y, TileType.DirtTile);
                }
                var semisolid = tile.GetSemisolidNeighbor();
                if ((semisolid === null || semisolid === void 0 ? void 0 : semisolid.tileType) == TileType.GrassyTop) {
                    for (var y2 = y; y2 < 12; y2++) {
                        map.backdropLayer.SetTile(x, y2, TileType.DirtBack);
                    }
                }
            }
        }
    };
    LevelGenerator.LevelBlocks = [
        new LevelBlock("AA/AA3|AA/AA3|AAIABAAAKABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAKABAAAKABAAAKABAAAB|AA/AA3|AA/AA3|AEAFAF;AzADAC;AzAEAC;AzAFAC", 0, 10, 3, 3),
        new LevelBlock("AA/AA3|AA/AA3|AAIABAAAKABAAAKABAAALABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAC|AA/AA3|AA/AA3|AHAFAJ", 1, 10, 3, 4),
        new LevelBlock("AA/AA3|AA/AA3|AAIABAAAKABAAAiABAAAKABAAAKABAAAiABAAAB|AA/AA3|AA/AA3|AEAGAI", 2, 10, 3, 3),
    ];
    LevelGenerator.BasicStartBlock = new LevelBlock("AA7|AA7|AAIABAAAKABAAAKABAAAKABAAAKABAAAB|AA7|AA7|AAACAI", 0, 5, 3, 3);
    LevelGenerator.BasicEndBlock = new LevelBlock("AA7|AA7|AAIABAAAKABAAAKABAAAKABAAAKABAAAB|AA7|AA7|ABACAF", 0, 5, 3, 3);
    return LevelGenerator;
}());
