"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
    return LevelGenerator;
}());
var LevelBlock = /** @class */ (function () {
    /* each block consists of :
        + structural layout
            + Solid/semisolid/water placement
            + special gadgets
            + categorical enemy placements ("need a ground obstacle: piggle/pogo/wooly/crab/shrubbert/prickle")
            + specific enemy placements ("specifically need a snail here")
        + list of carryable items provided by the section
        + carryable item needed by the section
        + rough difficulty measure
        + starting height
        + ending height
    */
    function LevelBlock(exportString, difficulty, width, startHeight, endHeight) {
        this.exportString = exportString;
        this.difficulty = difficulty;
        this.width = width;
        this.startHeight = startHeight;
        this.endHeight = endHeight;
    }
    return LevelBlock;
}());
new LevelBlock("AAqABBAAJABBAAJABBAAJABBAAy|AA/AA/AAD|AAIABCAAIABCAAIABCAAFABAAABABCAAFABAAABABCAAFABAAABABCAAFABAAABABCAAIABCAAIABCAAIABCAAIABC|AA/AA/AAD|AA/AA/AAD|AEAFAF;AzADAD;AzAEAC;AzAFAC;AzAGAD", 0, 11, 3, 3);
new LevelBlock("AA/AA3|AA/AA3|AAIABCAAIABCAAIABCAAJABBAAJABBAAJABBAAJABBAAJABBAAHABDAAHABD|AA/AA3|AA/AA3|AHAEAJ", 1, 10, 3, 4);
