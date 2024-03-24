"use strict";
// KNOWN ISSUES
// final block can generate too high, need to have something bring it down lower
// mushroom drop too hard!
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
var LevelPaletteRule = /** @class */ (function () {
    function LevelPaletteRule(doesRuleApply, frequency, // [0,1] chance of applying rule
    newTileType, targetLayer) {
        this.doesRuleApply = doesRuleApply;
        this.frequency = frequency;
        this.newTileType = newTileType;
        this.targetLayer = targetLayer;
    }
    LevelPaletteRule.IsNBelowFloor = function (n) {
        return function (map, tileX, tileY) {
            var toBeReplaced = map.mainLayer.GetTileByIndex(tileX, tileY);
            var tile = map.mainLayer.GetTileByIndex(tileX, tileY - n);
            var tileAbove = map.mainLayer.GetTileByIndex(tileX, tileY - 1 - n);
            return (tile.tileY > 0 && tile.tileType.solidity == Solidity.Block && tileAbove.tileType == TileType.Air && toBeReplaced.tileType == TileType.Dirt);
        };
    };
    LevelPaletteRule.IsNAboveCeiling = function (n) {
        return function (map, tileX, tileY) {
            var toBeReplaced = map.mainLayer.GetTileByIndex(tileX, tileY);
            var tile = map.mainLayer.GetTileByIndex(tileX, tileY + n);
            var tileBelow = map.mainLayer.GetTileByIndex(tileX, tileY + 1 + n);
            return (tile.tileY < 11 && tile.tileType.solidity == Solidity.Block && tileBelow.tileType == TileType.Air && toBeReplaced.tileType == TileType.Dirt);
        };
    };
    LevelPaletteRule.IsFloor = LevelPaletteRule.IsNBelowFloor(0);
    LevelPaletteRule.IsCeiling = LevelPaletteRule.IsNAboveCeiling(0);
    LevelPaletteRule.IsOfType = function (tileType) {
        return function (map, tileX, tileY) {
            return tileType == map.mainLayer.GetTileByIndex(tileX, tileY).tileType ||
                tileType == map.semisolidLayer.GetTileByIndex(tileX, tileY).tileType;
        };
    };
    LevelPaletteRule.IsPillarOfType = function (tileType) {
        return function (map, tileX, tileY) {
            var leftNeighbor = map.mainLayer.GetTileByIndex(tileX - 1, tileY).tileType;
            var rightNeighbor = map.mainLayer.GetTileByIndex(tileX + 1, tileY).tileType;
            return leftNeighbor == TileType.Air && rightNeighbor == TileType.Air &&
                tileType == map.mainLayer.GetTileByIndex(tileX, tileY).tileType ||
                tileType == map.semisolidLayer.GetTileByIndex(tileX, tileY).tileType;
        };
    };
    LevelPaletteRule.IsBelowType = function (tileType) {
        return function (map, tileX, tileY) {
            for (var y = tileY; y >= 0; y--)
                if (tileType == map.mainLayer.GetTileByIndex(tileX, y).tileType ||
                    tileType == map.semisolidLayer.GetTileByIndex(tileX, y).tileType)
                    return true;
            return false;
        };
    };
    LevelPaletteRule.IsImmediatelyRightOf = function (tileType) {
        return function (map, tileX, tileY) {
            return tileType == map.mainLayer.GetTileByIndex(tileX - 1, tileY).tileType ||
                tileType == map.semisolidLayer.GetTileByIndex(tileX - 1, tileY).tileType ||
                tileType == map.backdropLayer.GetTileByIndex(tileX - 1, tileY).tileType;
        };
    };
    return LevelPaletteRule;
}());
var LevelGeneratorDifficulty = /** @class */ (function () {
    function LevelGeneratorDifficulty(difficultyName, difficultyNumber, initialMinDifficultyLevel, initialMaxDifficultyLevel) {
        this.difficultyName = difficultyName;
        this.difficultyNumber = difficultyNumber;
        this.initialMinDifficultyLevel = initialMinDifficultyLevel;
        this.initialMaxDifficultyLevel = initialMaxDifficultyLevel;
    }
    LevelGeneratorDifficulty.Easy = new LevelGeneratorDifficulty("Easy", 1, 0, 2);
    LevelGeneratorDifficulty.Normal = new LevelGeneratorDifficulty("Normal", 2, 1, 3);
    LevelGeneratorDifficulty.Hard = new LevelGeneratorDifficulty("Hard", 3, 3, 5);
    LevelGeneratorDifficulty.Kaizo = new LevelGeneratorDifficulty("Kaizo", 4, 4, 6);
    LevelGeneratorDifficulty.List = [
        LevelGeneratorDifficulty.Easy,
        LevelGeneratorDifficulty.Normal,
        LevelGeneratorDifficulty.Hard,
        LevelGeneratorDifficulty.Kaizo,
    ];
    return LevelGeneratorDifficulty;
}());
var LevelGenerator = /** @class */ (function () {
    function LevelGenerator(difficulty) {
        this.difficulty = difficulty;
        this.levelLength = 12;
        this.doubleOrNothingMultiplier = 1;
        this.levelsCleared = 0;
        this.bankedClearTime = 0;
        this.earnedPoints = 0;
        this.currentMinDifficulty = difficulty.initialMinDifficultyLevel + 0.25;
        this.currentMaxDifficulty = difficulty.initialMaxDifficultyLevel;
    }
    LevelGenerator.Restart = function () {
        if (levelGenerator) {
            levelGenerator.LogRun();
        }
        levelGenerator = new LevelGenerator((levelGenerator === null || levelGenerator === void 0 ? void 0 : levelGenerator.difficulty) || LevelGeneratorDifficulty.Easy);
        levelGenerator.LoadTestLevel();
        MenuHandler.GoBack();
        MenuHandler.SubMenu(BlankMenu);
        editorHandler.SwitchToPlayMode();
    };
    LevelGenerator.prototype.LogRun = function () {
        DataService.LogMarathonRun(this.difficulty.difficultyNumber, this.levelsCleared, this.bankedClearTime, this.earnedPoints);
    };
    LevelGenerator.prototype.OnLevelWin = function () {
        this.levelsCleared++;
        if (player) {
            this.bankedClearTime += player.age;
        }
        this.earnedPoints += Math.floor(1 * this.difficulty.difficultyNumber * this.doubleOrNothingMultiplier);
    };
    LevelGenerator.prototype.ActivateDoubleOrNothing = function () {
        this.doubleOrNothingMultiplier = 2;
        this.earnedPoints = 0;
    };
    LevelGenerator.prototype.NextLevel = function () {
        this.IncrementDifficulty();
        this.LoadTestLevel();
        editorHandler.SwitchToPlayMode();
    };
    LevelGenerator.prototype.OnLose = function () {
        //levelGenerator = null;
        MenuHandler.GoBack();
        if ((levelGenerator === null || levelGenerator === void 0 ? void 0 : levelGenerator.doubleOrNothingMultiplier) == 1) {
            // died before 3 clears
            levelGenerator.earnedPoints = 0;
            audioHandler.SetBackgroundMusic("carnival");
        }
        else {
            audioHandler.SetBackgroundMusic("levelEnd");
        }
        var menu = MenuHandler.SubMenu(MarathonDeathMenu);
    };
    LevelGenerator.prototype.IncrementDifficulty = function () {
        this.currentMaxDifficulty += 0.75;
        this.currentMinDifficulty += 0.25;
        if (this.currentMinDifficulty >= 6)
            this.currentMinDifficulty = 6;
        this.levelLength += 1;
        if (this.levelLength > 50)
            this.levelLength = 50;
    };
    LevelGenerator.prototype.ExportCurrent = function (numColumns) {
        var spriteList = [];
        for (var _i = 0, _a = editorHandler.sprites.filter(function (a) { return !(a.spriteInstance instanceof Player || a.spriteInstance instanceof GoldGear); }); _i < _a.length; _i++) {
            var sprite = _a[_i];
            var spriteIndex = spriteTypes.indexOf(sprite.spriteType);
            var x = sprite.tileCoord.tileX;
            var y = sprite.tileCoord.tileY;
            var additionalProps = sprite.editorProps || [];
            var spriteStr = __spreadArrays([spriteIndex, x, y], additionalProps).map(function (a) { return Utility.toTwoDigitB64(+a); });
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
    LevelGenerator.prototype.LoadTestLevel = function () {
        var _this = this;
        var blocks = [LevelGenerator.BasicStartBlock];
        var currentY = 3;
        for (var i = 0; i < this.levelLength; i++) {
            var availableBlocks = LevelGenerator.LevelBlocks.filter(function (a) {
                if (a.difficulty < _this.currentMinDifficulty || a.difficulty > _this.currentMaxDifficulty)
                    return false;
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
            var nextBlock = Utility.RandFrom(availableBlocks);
            blocks.push(nextBlock);
            //console.log("Adding " + LevelGenerator.LevelBlocks.indexOf(nextBlock), nextBlock)
            currentY -= (nextBlock.startHeight - nextBlock.endHeight);
        }
        blocks.push(LevelGenerator.BasicEndBlock);
        var mapWidth = blocks.map(function (a) { return a.width; }).reduce(Utility.Sum);
        LevelMap.BlankOutMap();
        LevelMap.ClearAllTiles(mapWidth, 12);
        editorHandler.sprites = [];
        this.StitchBlocks(blocks);
        this.FillInSolidsBelowFloor(currentMap);
        this.FillInSolidsAboveCeiling(currentMap);
        var palettes = [this.ApplyGrassyDecor, this.ApplyLeafyDecor, this.ApplyCaveDecor, this.ApplyPalaceDecor];
        var palette = Utility.RandFrom(palettes);
        palette.bind(this, currentMap, blocks)();
        this.ChooseRandomMusic();
    };
    LevelGenerator.prototype.ChooseRandomMusic = function () {
        var songName = Utility.RandFrom(audioHandler.levelSongList.filter(function (a) { return a != "silence"; }));
        audioHandler.SetBackgroundMusic(songName);
        currentMap.songId = audioHandler.levelSongList.indexOf(songName);
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
    LevelGenerator.prototype.FillInSolidsAboveCeiling = function (map) {
        for (var x = 0; x < map.mainLayer.tiles.length; x++) {
            var ceilingBlock = map.mainLayer.tiles[x].find(function (a) { return a.tileType == TileType.RedBlock; });
            if (ceilingBlock) {
                for (var y = 0; y <= ceilingBlock.tileY; y++) {
                    map.mainLayer.SetTile(x, y, TileType.Dirt, true);
                }
            }
        }
    };
    LevelGenerator.prototype.ApplyCaveRoof = function (map, blocks) {
        var blockHeightMap = [];
        var currentY = 3;
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            currentY += block.heightRequired - block.startHeight;
            for (var i = 0; i < block.width; i++) {
                blockHeightMap.push(currentY);
            }
            currentY -= (block.heightRequired - block.endHeight);
        }
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
            var height = highestBlockY >= 12 ? caveHeightMap[caveHeightMap.length - 1] : highestBlockY - 5;
            var blockHeight = 12 - blockHeightMap[x];
            caveHeightMap.push(Math.min(height, blockHeight));
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
    LevelGenerator.prototype.ApplyPaletteRules = function (map, rules) {
        var _loop_2 = function (rule) {
            var _loop_3 = function (x) {
                var actions = [];
                var _loop_4 = function (y) {
                    if (rule.doesRuleApply(map, x, y)) {
                        if (rule.frequency >= 1 || Math.random() <= rule.frequency) {
                            var targetLayer = rule.targetLayer;
                            var layer_1 = map.GetLayerList()[targetLayer !== null && targetLayer !== void 0 ? targetLayer : rule.newTileType.targetLayer];
                            if (layer_1.layerType == TargetLayer.wire) {
                                var wireType = map.wireLayer.GetTileByIndex(x, y).tileType;
                                // NEVER overwrite wire layer if already something there
                                if (wireType != TileType.Air)
                                    return "continue";
                            }
                            actions.push(function () { layer_1.SetTile(x, y, rule.newTileType); });
                        }
                    }
                };
                for (var y = 0; y < 12; y++) {
                    _loop_4(y);
                }
                actions.forEach(function (a) { return a(); });
            };
            for (var x = 0; x < map.mainLayer.tiles.length; x++) {
                _loop_3(x);
            }
        };
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            _loop_2(rule);
        }
    };
    LevelGenerator.prototype.ApplyGrassyDecor = function (map, blocks) {
        var rules = [
            new LevelPaletteRule(LevelPaletteRule.IsFloor, 1, TileType.GrassyTop, null),
            new LevelPaletteRule(LevelPaletteRule.IsNBelowFloor(-1), 0.05, TileType.Flower, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 0.18, TileType.DirtTile, null),
            new LevelPaletteRule(LevelPaletteRule.IsBelowType(TileType.GrassyTop), 1, TileType.DirtBack, null),
        ];
        this.ApplyPaletteRules(map, rules);
        var bgs = [
            '#00dddd,#eeeeff,0.00,1.00,0.40;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0',
            '#bf00ff,#eeeeff,0.00,1.00,0.40;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#000000,0,0,0.1,0,1,0;AC,#021602,0,0,0.2,0,1,0;AD,#054505,0,0,0.3,0,1,0',
            '#00007f,#eeeeff,0.00,1.00,0.40;AL,#5eeded,0,0,0.05,0,0,0;AB,#000000,0,0,0.1,0,1,0;AC,#021602,0,0,0.2,0,1,0;AD,#044504,0,0,0.3,0,1,0',
            '#00007f,#eeeeff,0.00,1.00,0.40;AL,#5eeded,0,0,0.05,0,0,0;AI,#1818e5,0,0,0.1,0,1,0;AC,#021417,0,0,0.2,0,1,0;AD,#044434,0,0,0.3,0,1,0',
            '#7f006a,#ffd865,0.00,1.00,0.40;AL,#5eeded,0,0,0.05,0,0,0;AI,#1818e5,0,0,0.1,0,1,0;AC,#021417,0,0,0.2,0,1,0;AD,#044434,0,0,0.3,0,1,0',
            '#ffe14c,#eeeeff,0.00,1.00,0.40;AB,#5959a5,0,0,0.05,1,1,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0',
        ];
        map.LoadBackgroundsFromImportString(Utility.RandFrom(bgs));
    };
    LevelGenerator.prototype.ApplyLeafyDecor = function (map, blocks) {
        this.ApplyCaveRoof(currentMap, blocks);
        var rules = [
            new LevelPaletteRule(LevelPaletteRule.IsPillarOfType(TileType.Dirt), 1, TileType.Tree, null),
            new LevelPaletteRule(LevelPaletteRule.IsFloor, 1, TileType.GrassyTop, null),
            new LevelPaletteRule(LevelPaletteRule.IsFloor, 1, TileType.Leaves, null),
            new LevelPaletteRule(LevelPaletteRule.IsNBelowFloor(1), 0.5, TileType.Leaves, null),
            new LevelPaletteRule(LevelPaletteRule.IsNBelowFloor(2), 0.2, TileType.Leaves, null),
            new LevelPaletteRule(LevelPaletteRule.IsCeiling, 1, TileType.Leaves, null),
            new LevelPaletteRule(LevelPaletteRule.IsNAboveCeiling(1), 0.5, TileType.Leaves, null),
            new LevelPaletteRule(LevelPaletteRule.IsNAboveCeiling(2), 0.2, TileType.Leaves, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 0.18, TileType.DirtTile, null),
        ];
        this.ApplyPaletteRules(map, rules);
        this.ApplyPaletteRules(map, [
            new LevelPaletteRule(LevelPaletteRule.IsBelowType(TileType.GrassyTop), 1, TileType.DirtBack, null),
        ]);
        // this.ApplyPaletteRules(map, [
        //     new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.GrassyTop), 1, TileType.Air, TargetLayer.semisolid),
        // ]);
        var bgs = [
            '#007f99,#000019,0.00,1.00,0.25;AH,#442c07,0,0,0.05,4,1,0;AG,#442c07,0,0,0.1,0,1,0;AG,#442c07,0,0,0.2,-2,0,0;AD,#29a010,0,0,0.3,1,0,0',
            '#007f99,#000019,0.00,1.00,0.50;AH,#442c07,0,0,0.05,4,1,0;AG,#442c07,0,0,0.1,0,1,0;AL,#8cf294,0,0.25,0.2,3,1,0;AD,#228b0d,0,0,0.3,1,0,0',
            '#998c00,#000019,0.00,1.00,0.50;AH,#442c07,0,0,0.05,4,1,0;AG,#442c07,0,0,0.1,0,1,0;AL,#8cf294,0,0.25,0.2,3,1,0;AD,#808b0d,0,0,0.3,1,0,0',
            '#19ff9f,#bfffb2,0.00,1.00,0.30;AH,#442c07,0,0,0.05,4,1,0;AG,#442c07,0,0,0.1,0,1,0;AL,#8cf294,0,0.25,0.2,3,1,0;AD,#8b6b0d,0,0,0.3,1,0,0',
            '#ff1965,#bfffb2,0.50,1.00,0.35;AH,#2e0744,0,0,0.05,4,1,0;AG,#44073e,0,0,0.1,0,1,0;AL,#f28cd8,0,0.25,0.2,3,1,0;AD,#8b0d42,0,0,0.3,1,0,0',
        ];
        map.LoadBackgroundsFromImportString(Utility.RandFrom(bgs));
    };
    LevelGenerator.prototype.ApplyCaveDecor = function (map, blocks) {
        this.ApplyCaveRoof(currentMap, blocks);
        var rules = [
            new LevelPaletteRule(LevelPaletteRule.IsFloor, 1, TileType.CaveTop, null),
            new LevelPaletteRule(LevelPaletteRule.IsNBelowFloor(-1), 0.05, TileType.DecorCave, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 0.02, TileType.CaveBlock, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 0.04, TileType.CaveBrick, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 1, TileType.CaveGround, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Ladder), 1, TileType.CaveLadder, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.SpikeBlock), 1, TileType.CaveSpikes, null),
            new LevelPaletteRule(LevelPaletteRule.IsBelowType(TileType.CaveTop), 1, TileType.CaveBack, null),
        ];
        this.ApplyPaletteRules(map, rules);
        var bgs = [
            '#00264c,#242474,0.00,1.00,0.55;AT,#001119,0,0,0.05,8,1,0;AT,#001419,0,0,0.1,-4,0,0;AT,#002c32,0,0,0.2,-2,1,0;AT,#0a2528,0,0,0.3,0,0,0',
            '#4b004b,#522474,0.00,1.00,0.55;AT,#001119,0,0,0.05,8,1,0;AT,#001419,0,0,0.1,-4,0,0;AT,#002c32,0,0,0.2,-2,1,0;AT,#0a2528,0,0,0.3,0,0,0',
            '#06004b,#742424,0.00,1.00,0.80;AT,#001119,0,0,0.05,3,1,0;AT,#001419,0,0,0.1,1,1,0;AL,#ed5eed,0,-0.25,0.2,-2,1,0;AL,#ea476f,0,-0.5,0.3,1,0,0',
            '#06004b,#247460,0.00,1.00,0.80;AZ,#d82626,0,0,0.1,-3,0,0;AI,#1818e5,-7.25,0,0.2,-3,1,0;AY,#595959,0,-0.25,0.2,-9,0,0;AL,#ffffff,0,-0.5,0.3,2,0,0'
        ];
        map.LoadBackgroundsFromImportString(Utility.RandFrom(bgs));
    };
    LevelGenerator.prototype.ApplyPalaceDecor = function (map, blocks) {
        if (Math.random() > 0.5)
            this.ApplyCaveRoof(currentMap, blocks);
        var rules = [
            new LevelPaletteRule(LevelPaletteRule.IsFloor, 1, TileType.PinkTop, null),
            new LevelPaletteRule(LevelPaletteRule.IsNBelowFloor(-1), 0.05, TileType.DecorCave, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 0.05, TileType.DecorWhite, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 0.02, TileType.WhiteBlock, null),
            new LevelPaletteRule(LevelPaletteRule.IsPillarOfType(TileType.Dirt), 1, TileType.WhiteBrick, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Dirt), 1, TileType.WhiteGround, null),
            new LevelPaletteRule(LevelPaletteRule.IsOfType(TileType.Ladder), 1, TileType.WhiteLadder, null),
            new LevelPaletteRule(LevelPaletteRule.IsBelowType(TileType.PinkTop), 1, TileType.WhiteBack, null),
        ];
        this.ApplyPaletteRules(map, rules);
        var bgs = [
            '#d818ff,#eeeeff,0.00,0.70,0.50;AJ,#5eeded,-0.25,0,0.5,-1,1,0;AY,#b2b2b2,0,0,0.6,-1,1,0;AJ,#5eeded,-0.75,0,0.6,-3,1,0;AJ,#5eeded,-1,0,0.8,-5,1,0',
            '#000000,#5f00e5,0.00,0.70,0.15;AJ,#000000,-0.25,0,0.5,-2,0,0;AY,#000000,0,0,0.6,0,1,0;AY,#000000,0,0,0.5,-2,1,0;AJ,#000000,-1,0,0.7,-3,1,0',
            '#5118ff,#d47fff,0.00,0.70,0.60;AJ,#5eeded,-0.25,0,0.5,-1,1,0;AY,#b2b2b2,0,0,0.6,-1,1,0;AJ,#5eeded,-0.75,0,0.6,-3,1,0;AJ,#5eeded,-1,0,0.8,-5,1,0',
            '#00157f,#ffaa7f,0.00,0.70,0.10;AJ,#e56e18,-0.25,0,0.05,-3,1,0;AY,#000000,0,0,0.1,-4,1,0;AJ,#ff5100,-0.75,0,0.2,-5,1,0;AJ,#ff0000,-1,0,0.3,-8,1,0',
            '#00157f,#ffaa7f,0.00,0.70,0.15;AE,#074507,-0.25,0,0.05,-3,1,0;AN,#726c77,0,0,0.1,2,1,0;AF,#7f7f7f,0,0,0.2,1,1,0;Ab,#2f382d,0,0,0.3,-4,0,0',
        ];
        map.LoadBackgroundsFromImportString(Utility.RandFrom(bgs));
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
        new LevelBlock('AA/AADABBAAJABCAAA|AA/AAT|AAEABAAAPABAAAKABAAAKABAAAKABAAAHADAAABABAAAHADAAACABA|AAQABAAAKABAAAMABAAAKABAAAb|AA/AAT|AEAFAJ', 1, 7, 12, 7, 1),
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
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAKABAAA/AAAAFAABAAANABAAAKABAAAGADAAACABAAAHADAAABABAAAHADAAABABAAAB|AA/AA/AAP|AA/AA/AAP|AdACAJAD;AdABAG', 3, 12, 9, 1, 3),
        new LevelBlock('AA/AAf|AA/AAf|AAGADAAACABAAAGADAAACABAAAKABAAAKABAAAKABAAAKABAAADABAAAKABAAAG|AAcABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAa|AA/AAf|AEAEAH;AEAEAE', 2, 8, 10, 1, 8),
        new LevelBlock('AA/AAT|AA/AAT|AAEABAAAQABAAAKABAAAKABAAAKABAAAKABAAAGADAAACABA|AA/AAT|AA/AAT|AmAEAH;BAAEAG', 1, 7, 8, 7, 1),
        new LevelBlock('AA/AAf|AA/AAf|AAFABAAAzABAAAFADAAADABAAAGADAAACABAAAFADAAADABA|AA/AAf|AA/AAf|AqACAH', 2, 8, 8, 6, 1),
        new LevelBlock('AA/AAH|AA/AAH|AAFAFAABAAAuADAAFAAAJADAAFAAABABA|AA/AAH|AA/AAH|ALADAL', 5, 6, 9, 6, 1),
        new LevelBlock('AA/AAT|AA/AAT|AAFADAAAIADAAAKADAAAJAFAAADACAAAFAFAAADACAAAFADAAADABAAAGADAAACABAAAC|AA/AAT|AA/AAT|AcADALAC;AEAAAL;BWAAAG', 5, 7, 9, 1, 4),
        new LevelBlock('AA/AA/AA/AAj|AA/AA/AA/AAj|AAzADAAALADAAAKADAAAKADAAACAFAABAAAFADAAAKADAAAJADAAAlAFAABAAAqADAAALADAAAF|AA/AA/AA/AAj|AA/AA/AA/AAj|BNAQAI;AMAFAL;AMAJAL;BWAFAF;BWAJAF;AdAPAL;AdABALAC', 6, 19, 8, 1, 1),
        new LevelBlock('AA/AAr|AA/AAr|AAGADAAA5DWAABAAAn|AADAVDAA6AWCAAl|AA/AAr|ALACAL;ALAHAL', 6, 9, 9, 1, 1),
        new LevelBlock('AA/AA/AAD|AA/AA/AAD|AADADAAAKADAAFAAAJADAAAKADAAAKADAAAKADAAABDWAABAAAGADAAAKADAAAKADAAAOADAAAKADAAABABA|AAnAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAe|AA/AA/AAD|ALABAI;ALADAI;AqAGAI;AHAGAH;AdAGAL', 6, 11, 8, 4, 1),
        new LevelBlock('AA7|AA7|AATAFAABAAAMABAAAHAFAAABABAAAHADAAABABA|AA7|AA7|AaABAG', 5, 5, 7, 6, 1),
        new LevelBlock('AA/AA/AAD|AA/AA/AAD|AA/AAAADAAFAAACAFAABAAA4AFAABAAAA|AA/AA/AAD|AA/AA/AAD|AaABAG;AdAHAKAC', 5, 11, 7, 6, 2),
        new LevelBlock('AA/AAT|AA/AAT|AA1ADAAAKADAAAKADAC9E|AA/AAT|AA0ADBAAJADAAFAAAJADG|ALABAK;ALAEAL;ALAEAK;AjAEAH', 6, 7, 7, 2, 1),
        new LevelBlock('AA/AAH|AA/AAH|AAKABAAAKABAAAJABAAAKABAAAKABAAAKABAAAA|AA/AAH|AA/AAH|BQAFAH;BQAFAJ;BQAFAI', 2, 6, 5, 1, 3),
        new LevelBlock('AA/AA3|AA/AA3|AAGABAAAKABAAAMABAAAKABAAAMABAAAKABAAAKABAAAKABAAAKABAAAJABAAAA|AA/AA3|AA/AA3|AEAIAK', 1, 10, 6, 5, 1),
        new LevelBlock('AA/AAH|AA/AAH|AAGABAAACABAAAoABAAACABAAAGABAAAF|AA/AAH|AAcArAAlEAtAAAj|BKACAI;A1ACAL', 4, 6, 8, 1, 7),
        new LevelBlock('AA/AAf|AA/AAf|AAEABAAAKABAAACABAAAsABAAACABAAAGADAAACABAAAGADAAACABA|AA/AAf|AAoArAAlEAtAAAv|BKADAI;A1ADAL', 4, 8, 8, 7, 1),
        new LevelBlock('AA/AAT|AA/AAT|AAGADAAABABAAAHADAAABABAAAHADAAABABAAAHADAAABABAAAHADAAABABAAAHADAAABABAAAHADAAABABAAAA|AA/AAT|AASArAAlCAtAAASArAAlCAtAAASArAAlCAtAAAL|A2ABAL;A2ADAL;A2AFAL', 3, 7, 5, 2, 2),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAJABAAAKABAAAHADAAABABAAAHADAAABABAAAHADAAABABAAAGADAAACABAAAGADAAACABAAAGADAAACABAAAHADAAABABAAAHADAAABABAAAHADAAABABAAAKABAAAA|AA/AABAIAAAKAIAAAKAIAAA0|AAiAqAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAsAAAL|BKAGAI;A1AGAL', 2, 12, 6, 2, 2),
        new LevelBlock('AA/AA/AAn|AATADAABAAAJADAABAAAJADAABBAAIADAABBAAIADAABBAAIADAABBAAIADAABAAAJADAABBAAIADAABBAAIADAABBAAIADAABAAAZ|AAHABAAALABAAAGADAAADABAAAGADAAADABAAAEADAAAEABAAAKABAAAKABAAAHAFAABAAAMABAAAKABAAAKABAAAHAFAABAAAJABAAAKABAAAC|AA/AA/AAn|AA/AA/AAn|', 4, 14, 7, 4, 4),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAcADAAAwACAC4DAAGACAAAKACAAAJADAAAc|AA/AA/AAP|AA/AA/AAP|AaABAH;AVAHAG;AdAIAL', 6, 12, 7, 5, 1),
        new LevelBlock('AA/AAT|AA/AAT|AA/AANAFAAAAAFAAAAAFAAAA|AA/AAOABAAAD|AA/AAT|A7ACALAD', 4, 7, 8, 1, 6),
        new LevelBlock('AA/AAT|AA/AAT|AAFAFAAAAAFAAAAAFAAA/AACAFAAAAAFAAAAAFAAAA|AAGABAAA/AAGABAAAD|AA/AAT|A7ACALAD', 5, 7, 8, 6, 6),
        new LevelBlock('AA/AAH|AA/AAH|AA/AABAFAABAAAD|AA/AAH|AA/AAH|AuACAE;A/ACAL;AmAEAH', 5, 6, 9, 1, 6),
        new LevelBlock('AA/AAr|AA/AAr|AAWABAAAhAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAIAFAABB|AA/AAr|AA/AAr|AYABAJ;ALABAK', 7, 9, 6, 2, 3),
        new LevelBlock('AA/AAH|AA/AAH|AAWABAAAdAFAABAAAP|AA/AAH|AA/AAH|AYABAJ;ALABAK', 8, 6, 8, 2, 6),
        new LevelBlock('AA/AA/AAb|AA/AA/AAb|AAIABAAA/AA/AAOABAAAB|AA/AA/AAb|AA/AA/AAb|BZAGAI;AbAFAL;AzAEAE;AzAIAE;AzAFAD;AzAHAD', 2, 13, 9, 3, 3),
        new LevelBlock('AA/AA/AAb|AA/AA/AAb|AAIABAAA3ADAAAKADAAAKADAAA9ABAAAB|AA/AA/AAb|AA/AA/AAb|AbAFALAC;BZAGAI', 5, 13, 6, 3, 3),
        new LevelBlock('AA/AA/AA/|AA/AA/AA/|AAKABAAAKABAAAHABAAABABAAAHABAAABABAAA/AADABAAABABAAAHABAAABABAAAKABAAAKABAAAKABAAAKABAAAKABA|AA/AA/AA/|AA/AA/AA/|BAAGAF;A8AGAE;AEAPAK', 3, 16, 8, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAIADAAAAABAAAGADAAAKADAAAKADAAAKADAAAKADAAAKADAAAKADAAAMADAAAMABA|AAWABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAL|AA/AA3|AqAIAL;AHAIAK;AqADAJ;AHADAI', 3, 10, 6, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAHABAAALABAAALABAAALABAAAiABAAAJABAAAJABAAAJABAAAC|AA/AA3|AA/AA3|BQAJAH', 2, 10, 5, 4, 4),
        new LevelBlock('AA7|AA7|AAKABAAAUAFAABAAAXABA|AA7|AA7|', 2, 5, 5, 1, 1),
        new LevelBlock('AA7|AA7|AAFADAAFAAACABAAAFADAAAKADAAAKADAAAKADAAFAAACABA|AA7|AA7|', 3, 5, 6, 1, 1),
        new LevelBlock('AA/AAT|AA/AAT|AAKABAAAJABAAAKABAAAKABAAAKABAAAY|AA/AAT|AA/AAT|AHADAJ', 1, 7, 5, 1, 2),
        new LevelBlock('AA/AAr|AA/AAr|AAGADAAAKADAAEDAAGADAAAKADAAAKADAAEDAAGADAAAKADAAAKADAAEDAAGADAAAD|AA/AAr|AA/AAr|AmAGAK', 3, 9, 5, 2, 2),
        new LevelBlock('AA/AA/AAD|AA/AA/AAD|AAdADAAFAAEDAA/AABADAAFAAEDAAX|AA/AA/AAD|AA/AA/AAD|ALAFAG', 4, 11, 6, 2, 2),
        new LevelBlock('AA7|AA7|AARADAAAKADAAEEAAFADAAAQ|AA7|AA7|', 2, 5, 6, 2, 2),
        new LevelBlock('AA/AAr|AAaADAABAAA/AAO|AAFADAAAKADAAAKACAAAKADAAAKADAAACAFAABAAAFADAAAKADAAAKADAAAKADAAAE|AA/AAr|AAcADBAAJAVAAAKAEAADAAfCAAx|AgACAF;AIACAE;AdABALAC;AdAGALAC', 6, 9, 8, 1, 1),
        new LevelBlock('AA/AAr|AA/AAr|AAiEGAAAIEGAAAAABAAAGEGAAAAABAAAIEGAABAAAIAFAABAAAb|AA/AAr|AA/AAr|BVADAK;BVAEAI', 5, 9, 9, 1, 5),
        new LevelBlock('AA/AAH|AA/AAH|AAGADAAACABAAAGADAAACABAAAGADAAACABAAAGADAAACABAAAGADAAACABAAAGADAAACABA|AA/AAH|AA/AAH|AnAEAK;AnABAK', 3, 6, 5, 1, 1),
        new LevelBlock('AA7|AA7|AAKABAAAIADAAAAABAAAGADAAAAEHAAAAABAAAIADAAAAABAAAKABA|AA7|AA7|AnACAI', 2, 5, 5, 1, 1),
        new LevelBlock('AA/AA/AA/AAv|AA/AA/AA/AAv|AA6DHAAA/AA/AAsADAAADABAAAA|AA/AA/AA/AAv|AA/AA/AA/AAv|BNALAL;BNARAJ;BNAOAK;BKAOAI', 7, 20, 8, 1, 2),
        new LevelBlock('AA/AA/AAb|AA/AA/AAb|AAIABAAALAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAGAFAAABAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAGAFAAAb|AA/AA/AAb|AA/AA/AAb|BNAHAI;A4AHAJ', 6, 13, 7, 3, 3),
        new LevelBlock('AA/AA/AAz|AA/AA/AAz|AA/AAAADAAFAAAJADAAFAAABEIAAAXAFAABAAAJAFAABAAAJAFAABAAAEAFAABAAAhADAAFAAAE|AA/AA/AAz|AA/AA/AAz|BeAGAI;ALANAL;AdACALAC', 7, 15, 9, 1, 1),
        new LevelBlock('AA/AAr|AA/AAr|AAhAfAABAAAJAfAABAAAEADAAFAAAJADAAFAAAKADAAAc|AA/AAr|AA/AAr|AUACAJ;AUADAJ;ALAGAK', 7, 9, 7, 2, 2),
        new LevelBlock('AA/AAT|AA/AAT|AAhAfAABAAAJAfAABAAARAFAABAAAP|AA/AAT|AA/AAT|AUACAJ;AUADAJ', 4, 7, 8, 2, 5),
        new LevelBlock('AA/AA/AA/AAL|AA/AA/AA/AAL|AAVAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAApADAC4EAAv|AA/AA/AA/AAL|AA/AA/AA/AAL|BMACAJ;ALAKAK;ALAOAK', 7, 17, 7, 3, 2),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAKABAAAKABAAAIADAAAAAFAAAKABAAAIADAAAAAFAAAKABAAAKABAAAIADAAAAAFAAAKABAAAIADAAAAAFAAAKABAAAKABA|AA/AA/AAP|AA/AA/AAP|', 4, 12, 3, 1, 1),
        // spin ring
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABA|AAqABAAAKABAAAKABAAAKABAAAn|AA/AA3|BhAEAI;AzAEAE;AzAFAE;AzAEAF;AzAFAF', 0, 10, 8, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAJABAAALABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAGABAAALABAAAC|AA/AA3|AA/AA3|BhAEAI', 1, 10, 7, 2, 4),
        new LevelBlock('AA/AA3|AA/AA3|AAJABAAALABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAGABAAALABAAAC|AAqABAAAKABAAAKABAAAKABAAAKABAAAb|AA/AA3|BhAEAI;AEAFAG', 3, 10, 8, 2, 4),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAA/AAqABA|AA/AA3|AA/AA3|BhAEAJ', 4, 10, 5, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAGADAAACABAAAGADAAACABAAAKABAAAJABAAA3ABAAAD|AA/AAOABAAAKABAAAKABAAAP|AA/AA3|BhAGAL;AHAEAJ', 5, 10, 6, 1, 5),
        new LevelBlock('AA/AA/AA/AAL|AA/AA/AA/AAL|AAKABAAAKABAAA/AA/AAyABA|AA/AA/AA/AAL|AA/AA/AA/AAL|BhAEAK;BhAKAK;AzAGAH;AzAHAG;AzAIAG;AzAJAH;AzAMAH;AzANAG;AzAOAG;AzAPAH', 4, 17, 6, 1, 1),
        new LevelBlock('AA/AAr|AA/AAr|AAFABAAAKABAAA/AAFADAAFAAACAFAABAAAL|AA/AAr|AA/AAr|BhADAL', 6, 9, 7, 6, 1),
        new LevelBlock('AA/AAr|AA/AAr|AA/AAr|AA/AAr|AA2ADEAAv|BhABAL;BhAGAL;A2AEAL', 5, 9, 5, 1, 1),
        new LevelBlock('AA/AAr|AA/AAr|AARADAAAKC6AAAKC6AAAKC6AAdAAAJC6AAAKC6AAAVC4FDEA|AA/AAr|AAdADAAAKADAAAKADBAAJADAAAKADAAAc|AjAEAI;BhABAL;BhAGAL;AVACAF', 7, 10, 7, 1, 1),
        new LevelBlock('AA/AA/AA/|AA/AA/AA/|AAFADAAAYEIAAA/AA/AAMADAC4EAAFADAAADABA|AAGAPEAA/AA/AAz|AA/AA/AA/|BhABAL;BhAGAL;AVACAH;BhALAL', 7, 16, 7, 1, 1),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAKABAAAHADAAA3AFAABAAAjADAAAKADAAAP|AA/AA/AAP|AA/AA/AAP|BiACAL;BiAEAI;BiACAF;BiAIAL', 6, 11, 9, 1, 1),
        // split paths
        new LevelBlock('AA/AA/AA/AA/AA/AAD|AA/AA/AA/AA/AA/AAD|AAJABAAAKABAAAKABAAAKABAAAHABAAABABAAAEADAC4BABAC4BABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAHABAAABABAAAGABAAACABAAAFABAAADABAAAFABAAADAFAABAAAEABAAADAFAABAAAEABAAADABAAAGABAAACABAAAHABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAKABAAAKABAAAA|AAHABAAAKABAAAKABAAA/AA/AA/AA/AADAPBAAAAPBAAZ|AA/AA/AA/AA/AA/AAD|AVABAH;AEATAE;A0AXAJ;AzAXAG', 1, 27, 8, 2, 2),
        new LevelBlock('AA/AA/AA/AA/AA/AAD|AA/AA/AA/AA/AA/AAD|AAKABAAAKABAAAKABAAAKABAAAHABAAABABAAAEADAC4BABAC4BABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAHABAAABABAAAGABAAABABAAAGABAAACABAAAGABAAACABAAAGABAAACABAAAGABAAACABAAAHABAAABABAAAIABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAKABAAAKABA|AAIABAAAKABAAAKABAAA/AA/AA/AA/AADAPBAAAAPBAAY|AA/AA/AA/AA/AA/AAD|AVABAI;AEATAJ;A0AXAH;AzAXAK;BAASAF', 1, 27, 8, 1, 1),
        new LevelBlock('AA/AA/AA/AA/AAH|AA/AA/AA/AA/AAH|AAIABAAAKABAAAKABAAALABAAALABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABA|AA/AANAPBAAAAPBAA/AA/AAuAPBAAAAPBAAA|AA/AA/AA/AA/AAH|A6AUAH;BAAOAI;A8AOAF;A8APAF;A8AQAF;BAAPAI;BAAQAI', 1, 22, 7, 3, 1),
        new LevelBlock('AA/AA/AA/AA/AAH|AA/AA/AA/AA/AAH|AAIABAAAKABAAAKABAAALABAAALABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABAAAEADAAABABAAABABA|AA/AANAPBAAAAPBAA/AA/AAuAPBAAAAPBAAA|AA/AA/AA/AA/AAH|A6AUAK;A8APAF;AFAPAH', 1, 23, 8, 3, 1),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAMABAAAKABAAAKABAAAKABAAAIABAAAKABAAAMABAAAKABA|AA/AA/AAn|AA/AA/AAn|AEAJAK', 1, 14, 4, 1, 1),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAMABAAAKABAAAKABAAAKABAAAIABAAAKABAAAMABAAAKABA|AA/AACABAAAKABAAAKABAAAKABAAAKABAAAKABAAAn|AA/AA/AAn|AEAJAK;AEAHAG', 2, 14, 6, 1, 1),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAKABAAAKABAAAKABAAAKABAAAiABAAAKABAAAKABAAAKABAAAiABAAAKABA|AA3ABAAAKABAAA6ABAAAKABAAAa|AA/AA/AAn|AHAJAK', 2, 14, 4, 1, 1),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAKABAAAJABAAAKABAAAKABAAAKABAAAKABAAAGADAAFAAABABAAAGADAAFAAABABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABA|AA/AA/AAn|AA/AA/AAn|AEAMAJ;AEAMAI', 2, 14, 6, 1, 1),
        new LevelBlock('AA/AA/AAb|AA/AA/AAb|AAKABAAAKABAAAKABAAAKABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAB|AA/AA/AAb|AA/AA/AAb|BQALAI', 1, 13, 5, 1, 3),
        new LevelBlock('AA/AA/AA/AAL|AA/AA/AA/AAL|AAKABAAAKABAAAGABAAACABAAAGABAAACABAAAGABAAACABAAAKABAAAKABAAAKABAAAKABAAAKABAAAJABAAAKABAAAKABAAAKABAAAKABAAAFABAAAKABAAAF|AA/AAbABAAAKABAAA/AAi|AA/AA/AA/AAL|BeADAG;AEANAJ', 1, 17, 8, 1, 7),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAKABAAAKABAAAKABAAAKABAAAKABAAA/AAAABAAAKABAAAF|AA/AA/AAP|AA/AA/AAP|A7AGAK', 1, 12, 8, 1, 7),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAGABAAAKABAAAKABAAA+ABAAAKABAAAKABAAAJABAAAKABAAAKABAAAKABAAAA|AA/AA/AAn|AA/AA/AAn|BQANAJ', 1, 14, 6, 4, 2),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABA|AA/AA3|AA/AA3|BRAJAK;AHAIAK', 3, 10, 4, 1, 1),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAA6ABAAAKABAAAKABAAAKABA|AAeABAAAKABAAAKABAAAKABAAAAABAAAIABAAAAABAAAKABAAAKABAAA9|AA/AA/AAn|AEAIAI', 1, 14, 6, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAGABAAAKABAAAD|AAgABAAAKABAAAKABAAAgABAAAb|AA/AA3|AGAEAI', 1, 10, 6, 1, 5),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAMABAAAKABAAAKABA|AA/AA3|AA/AA3|AzADAG;AzAEAG;AzAFAG;AzAGAG', 0, 10, 6, 1, 1),
        new LevelBlock('AA/AAT|AA/AAT|AAKABAAAKABAAAKABAAAIElBABAAAIABAAAKABAAAKABAAAB|AA/AAT|AA/AAT|', 2, 7, 4, 1, 3),
        new LevelBlock('AA/AA/AAn|AA/AA/AAn|AAKABAAAKABAAAUABAAAhABAAAjABAAAkABAAAKABA|AA/AA/AAn|AA/AA/AAn|', 3, 14, 5, 1, 1),
        new LevelBlock('AA/AAT|AA/AAT|AAKABAAAKABAAAUABAAAhABAAAC|AA/AAT|AA/AAT|', 2, 7, 5, 1, 4),
        new LevelBlock('AA/AA3|AA/AA3|AAHABAAAKABAAAuABAAAlABAAAKABA|AA/AA3|AA/AA3|', 2, 10, 5, 4, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAGADAAACABAAA1AFAABEAAiABAAAKABA|AA/AA3|AA/AA3|BGADAL', 3, 10, 7, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAGADAAACABAAA1AFAABEAAiABAAAKABA|AA/AA3|AA/AA3|BGADAL;BGADAH', 5, 10, 7, 1, 1),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAhAFAABAAArABAAAKABAAAKABAAAC|AA/AA3|AA/AA3|AkADAJ', 2, 10, 5, 1, 4),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AA/AAzAFCABAAAKABAAAEADAABAAFCAAAABA|AA/AA/AAP|AA/AA/AAP|ALAGAJ;AdACALAC', 4, 12, 7, 1, 1),
        new LevelBlock('AA/AA/AA/AAX|AA/AA/AA/AAX|AA1AFAAAKAFAAAKAFAAAXAFAAAKAFAAAKAFAAAXAFAAAKAFAAAKAFAAAXAFAAAN|AA/AA/AA/AAX|AA/AA/AA/AAX|AdACAIAE;AdAGAJAE;AdAKAKAE;AdAOALAE', 4, 18, 6, 4, 1),
        new LevelBlock('AA/AA/AAD|AA/AA/AAD|AA/AAMADAAFAAACAFAABAAAv|AA/AA/AAD|AA/AA/AAD|AdACAL;AdAIAL', 3, 11, 7, 1, 1),
        new LevelBlock('AA/AAr|AA/AAr|AA/AACADAAFAAAm|AA/AAr|AA/AAr|AdACAK;AdAGAK', 4, 9, 5, 2, 2),
        new LevelBlock('AA/AA/AAb|AA/AA/AAb|AA/AAEAFAABAAArADAAFAAAm|AA/AA/AAb|AA/AA/AAb|AdACAL;AdAGAL;AdAKAL', 5, 13, 5, 1, 1),
        new LevelBlock('AA/AA/AAz|AA/AA/AAz|AASAFAABAAAJAFAAAKAFAAAjADAAAKC4AAAKC4AAAKAFAABAAA9|AA/AA/AAz|AA/AA/AAz|AdABAG;AdACALAC;AVACAJ;AdAGAL;AdAHAIAC;AdAMAIAD', 6, 15, 7, 6, 4),
        new LevelBlock('AA/AA/AAD|AA/AA/AAD|AA/AAOAFAABAAAJAFAAAWAFAAAJADAAAE|AA/AA/AAD|AA/AA/AAD|AdACAH;AdAHAL', 8, 12, 7, 5, 1),
        new LevelBlock('AA/AA/AAz|AA/AA/AAz|AA1ADAAFCAAHADAAAKADAAFCAAKC4AAAKC4AAAKC4AAFAABAAA7|AA/AA/AAz|AA/AA/AAz|AtAFAL;AdABAJAC;AVAIAH;AtAIAL;AdALAL;AcAFAIAE', 6, 15, 7, 3, 1),
        new LevelBlock('AA/AA/AA/AAL|AA/AA/AA/AAL|AAEADAAADAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAfAFAABAAAJAFAABAAA/AAJ|AAFAPDAA/AA/AA/AAB|AA/AA/AA/AAL|ALACAJ;AYACAI;AdANAJAD', 7, 17, 7, 3, 3),
        new LevelBlock('AA/AA3|AA/AA3|AAIABAAAkABAAAKABAAAgABAAAKABAAAKABAAAB|AAqABAAAKABAAA/|AA/AA3|', 1, 10, 6, 3, 3),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAIABAAAwABAAAKABAAAsABAAAKABAAAKABAAAB|AA2ABAAAKABAAA/AAL|AA/AA/AAP|', 2, 12, 6, 3, 3),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAAsABAAAKABAAAKABAAAKABAAALABAAAA|AA/AA3|AA/AA3|AEAHAI', 2, 10, 5, 1, 2),
        new LevelBlock('AA/AA3|AA/AA3|AAKABAAAKABAAA/AARABAAAKABAAAA|AA/AA3|AA/AA3|', 5, 10, 6, 1, 2),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAKABAAAKABAAA/AApABAAAKABAAAA|AA/AA/AAP|AA/AA/AAP|BVABAH;AzADAG;AzAFAG;AzAHAG;AzAJAH', 6, 12, 7, 1, 2),
        new LevelBlock('AA/AA/AA/AAv|AA/AA/AA/AAv|AA/AA/AA/AAv|AA/AA/AA/AAv|AA/AA/AA/AAv|BZAIAI;BVAIAL;AdABAK;AdAQAKAC', 6, 20, 8, 2, 2),
        new LevelBlock('AA/AA/AA/AAL|AA/AA/AA/AAL|AA/AANADAAAKADAAAKADAAA/AAk|AA/AA/AA/AAL|AA/AA/AA/AAL|AdAMAK;AdACAKAC;BZAHAI;AuAHAK', 6, 17, 6, 2, 2),
        new LevelBlock('AA/AAT|AA/AAT|AAHABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAC|AA/AAT|AA/AAT|BAADAL;BaADAF;BAADAH;BZADAJ', 5, 7, 7, 4, 4),
        new LevelBlock('AA/AA/AAz|AA/AA/AAz|AAGADAAACABAAAGADAAACABAAAGADAAACABAAAGADAAAKADAAAKADAAAKADAAAKADAAAKADAAAKADAAAKADAAAKADAAAKADAAACABAAAGADAAACABAAAKABA|AASAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAKAYAAAb|AA3AlDAAfAlDAAfAlDAAv|A2AEAJ;A2AHAJ;A2AKAJ', 4, 15, 5, 1, 1),
        new LevelBlock('AA/AA/AA/|AA/AA/AA/|AAIABAAAKABAAAKABAAAKABAAAMABAAAKABAAAKABAAAKABAAAGABAAAKABAAAKABAAAKABAAAMABAAAKABAAAKABAAAKABAAAB|AA/AA/AA/|AA/AA/AA/|BfAJAF', 4, 16, 7, 3, 3),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAJABAAA/AA/AACABAAAA|AA/AA/AAP|AAKAqAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAsA|BVADAJ;A1ADAL', 6, 12, 6, 2, 2),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAJABAAA/AA/AACABAAAA|AA/AA/AAP|AAKAqAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAHAkAAABAkAAAKAsA|A1ADAL;BNADAJ;A2AGAI', 6, 12, 6, 2, 2),
        new LevelBlock('AA/AA/AAP|AA/AA/AAP|AAJABAAA/AA/AACABAAAA|AA/AA/AAP|AAKAqAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAkAAAKAsA|A1ADAL;BJADAJ', 6, 12, 6, 2, 2),
        new LevelBlock('AA/AA/AA/AA/AAH|AA/AA/AA/AA/AAH|AAKABAAAKABAAAKABAAAtAFAABAAA4AFAABAAA6AFAABAAA5ABAAAA|AA/AA/AA/AA/AAH|AA/AA/AA/AA/AAH|BJAGAJ;BJALAI;BJAQAJ', 5, 22, 6, 1, 2),
    ];
    // difficulty scale
    // 0 - walk straight through. maybe an optional enemy for coins
    // 1 - baby jump. 2-tile gap, or a single easy enemy. No run button
    // 5 - HC can't. Bordering on basic kaizo platforming. Land on a spider and then min bounce. One safe side
    LevelGenerator.BasicStartBlock = new LevelBlock("AA7|AA7|AAKABAAAKABAAAKABAAAKABAAAKABA|AA7|AA7|AAACAI", 0, 5, 5, 1, 1);
    LevelGenerator.BasicEndBlock = new LevelBlock("AA7|AA7|AAKABAAAKABAAAKABAAAKABAAAKABA|AA7|AA7|ABACAH", 0, 5, 6, 1, 1);
    return LevelGenerator;
}());
var levelGenerator; // = new LevelGenerator(LevelGeneratorDifficulty.Easy);
