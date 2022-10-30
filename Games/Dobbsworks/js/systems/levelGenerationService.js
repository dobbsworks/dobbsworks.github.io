"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var LevelBlock = /** @class */ (function () {
    function LevelBlock(exportString, difficulty, width, heightRequired, startHeight, endHeight) {
        this.exportString = exportString;
        this.difficulty = difficulty;
        this.width = width;
        this.heightRequired = heightRequired;
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
        var y = -2;
        for (var _i = 0, levelBlocks_1 = levelBlocks; _i < levelBlocks_1.length; _i++) {
            var block = levelBlocks_1[_i];
            block.PlaceInMap(currentMap, x, y + block.startHeight - 1);
            x += block.width;
            y -= block.endHeight - block.startHeight;
        }
    };
    // TODO - in addition to storing start/end height of player, need to include bounding box (how many tiles up/down this block can be shifted)
    // currently getting too high and wrapping around
    LevelGenerator.prototype.LoadTestLevel = function () {
        var blocks = [LevelGenerator.BasicStartBlock];
        var currentY = 3;
        for (var i = 0; i < 8; i++) {
            var availableBlocks = LevelGenerator.LevelBlocks.filter(function (a) {
                if (a == blocks[blocks.length - 1])
                    return false;
                var potentialTopY = currentY - a.startHeight + a.heightRequired;
                if (potentialTopY > 12)
                    return false;
                if (currentY < a.startHeight)
                    return false;
                if (currentY < a.endHeight)
                    return false;
                return true;
            });
            if (availableBlocks.length == 0) {
                throw "NO BLOCKS AVAILABLE, current height " + currentY;
            }
            var index = Math.floor(Math.random() * availableBlocks.length);
            var nextBlock = availableBlocks[index];
            blocks.push(nextBlock);
            currentY -= (nextBlock.startHeight - nextBlock.endHeight);
        }
        blocks.push(LevelGenerator.BasicEndBlock);
        var mapWidth = blocks.map(function (a) { return a.width; }).reduce(Utility.Sum);
        LevelMap.BlankOutMap();
        LevelMap.ClearAllTiles(mapWidth, 12);
        editorHandler.sprites = [];
        this.StitchBlocks(blocks);
        this.FillInSolidsBelowFloor(currentMap);
        //this.ApplyCaveRoof(currentMap);
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
        // todo, pass in blocks so we can respect minimum heights of each
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
        new LevelBlock("AA/AA3|AA/AA3|AAKABAAAKABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAKABAAAKABAAAKABA|AA/AA3|AA/AA3|AEAFAH;AzADAE;AzAEAE;AzAFAE", 0, 10, 8, 1, 1),
        new LevelBlock("AA/AA3|AA/AA3|AAJABAAAKABAAAKABAAALABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAB|AA/AA3|AA/AA3|AHAFAK", 1, 10, 5, 2, 3),
        new LevelBlock("AA/AA3|AA/AA3|AAKABAAAKABAAAiABAAAKABAAAKABAAAiABA|AA/AA3|AA/AA3|AEAGAK", 2, 10, 4, 1, 1),
        new LevelBlock("AA/AA/AAb|AA/AA/AAb|AAJABAAAKABAAAKABAAA/AA2ABAAAA|AA/AA/AAb|AA/AA/AAb|AdAGAL", 2, 13, 5, 2, 2),
        new LevelBlock("AA/AAf|AA/AAf|AAIABAAAKABAAAKABAAALAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJABAAAA|AA/AAf|AA/AAf|", 2, 8, 7, 3, 2),
        new LevelBlock("AA/AAH|AA/AAH|AAKABAAAKABAAAKABAAAHABAAAKABAAAKABAAAC|AA/AAH|AA/AAH|BQAFAH", 2, 6, 6, 1, 4),
        new LevelBlock("AA/AAf|AA/AAf|AAIABAAAKABAAAKABAAALABAAALABAAAKABAAAKABAAAKABA|AA/AAf|AA/AAf|", 0, 6, 4, 3, 1),
        new LevelBlock("AA/AAf|AA/AAf|AAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAGABAAAF|AASABAAAKABAAAYABAAAGABAAAKABAAAR|AA/AAf|AJAGAI", 2, 8, 9, 1, 7),
        new LevelBlock('AA/AADABBAAJABCAAA|AA/AAT|AAEABAAAPABAAAKABAAAKABAAAKABAAAAABHAABABAAAAABHAACABA|AAQABAAAKABAAAMABAAAKABAAAb|AA/AAT|AEAFAJ', 1, 7, 12, 7, 1),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAFABAAAKABAAAPABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAFABAAAKABAAAE|AAgABAAAqABAAAKABAAA/AAN|AA/AA/AAn|AzAEAH;AzAFAH;AzAIAH;AzAJAH;AzAJAI;AzAIAI;AzAFAI;AzAEAI;AKALAK', 2, 14, 10, 6, 6),
        new LevelBlock('AA/AAf|AA/AAf|AAIABAAAMABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAB|AA/AAf|AA/AAf|BRAGAK', 1, 8, 4, 3, 3),
        new LevelBlock('AA/AAf|AA/AAf|AAKABAAAHABAAABAFAAAHABAAAiABAAALABAAAKABAAAB|AA/AAf|AA/AAf|', 1, 8, 6, 1, 3),
        new LevelBlock('AA7|AA7|AAKABAAAJABAAAJABAAAJABAAAJABAAAD|AA7|AA7|BOAEAG', 1, 5, 6, 1, 5),
        new LevelBlock('AA/AA3|AA/AA3|AAGABAAAKABAAALABAAAKABAAALABAAAKABAAALABAAAKABAAALABAAAKABA|AAeABAAAXABAAAXABAAAXABAAAM|AA/AA3|BTAJAJ', 2, 10, 7, 5, 1),
        new LevelBlock('AA7|AA7|AAKABAAADAEGABAAAKABAAAPABAAAG|AADABAAAKABAAAKABAAAKABAAAS|AA7|AmADAH', 2, 5, 9, 1, 8),
        new LevelBlock('AA/AAf|AA/AAf|AAKABAAAHABAAAKABAAAKABAAAJAFAABAAANABAAAKABAAAKABA|AA/AAf|AA/AAf|', 1, 8, 7, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAA/AASABAAAKABA|AA/AA3|AA/AA3|AzADAI;AzAGAI;AzAEAH;AzAFAH', 2, 10, 5, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAJABAAAKABAAALAFAAAKAFAAAKAFAAAKAFAAAKAFAAAKAFAAAKAFAAAJABAAAA|AA/AA3|AA/AA3|AFAHAJ', 2, 10, 6, 2, 2),
        new LevelBlock('AA/AAH|AA/AAH|AAKABAAAKABAAAIABAAAKABAAAIABAAAKABAAAD|AA/AAH|AA/AAH|', 0, 6, 6, 1, 5),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAKABAAAKABAAAKABAAAJABAAAKABAAAKABAAAJABAAAKABAAAKABAAAJABAAAKABAAAKABAAAC|AA/AA/AAP|AA/AA/AAP|A4ALAH', 2, 12, 5, 1, 4),
    ];
    LevelGenerator.BasicStartBlock = new LevelBlock("AA7|AA7|AAKABAAAKABAAAKABAAAKABAAAKABA|AA7|AA7|AAACAI", 0, 5, 5, 1, 1);
    LevelGenerator.BasicEndBlock = new LevelBlock("AA7|AA7|AAKABAAAKABAAAKABAAAKABAAAKABA|AA7|AA7|ABACAH", 0, 5, 6, 1, 1);
    return LevelGenerator;
}());
