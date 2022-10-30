

class LevelBlock {
    constructor(
        public exportString: string,
        public difficulty: number,
        public width: number,
        public heightRequired: number,
        public startHeight: number,
        public endHeight: number,
    ) { }

    PlaceInMap(map: LevelMap, startX: number, startY: number) {
        let segments = this.exportString.split("|");
        map.GetLayerList().forEach((layer, index) => {
            LevelLayer.ImportIntoLayer(layer, segments[index], index, 12, startX, startY);
        });
        LevelMap.ImportSprites(segments[5], startX, startY);
    }
}

class LevelGenerator {

    ExportCurrent(numColumns: number) {
        let spriteList: string[] = [];
        for (let sprite of editorHandler.sprites.filter(a => !(a.spriteInstance instanceof Player || a.spriteInstance instanceof GoldGear))) {
            let spriteIndex = spriteTypes.indexOf(sprite.spriteType);
            let x = sprite.tileCoord.tileX;
            let y = sprite.tileCoord.tileY;
            let additionalProps = sprite.editorProps || [];

            let spriteStr = [spriteIndex, x, y, ...additionalProps].map(a => Utility.toTwoDigitB64(a));
            spriteList.push(spriteStr.join(''));
        }
        return [
            ...currentMap.GetLayerList().map(a => a.ExportToString(numColumns)),
            spriteList.join(";"),
        ].join("|");
    }


    StitchBlocks(levelBlocks: LevelBlock[]) {
        if (levelBlocks.length == 0) return;
        let x = 0;
        let y = -2;
        for (let block of levelBlocks) {
            block.PlaceInMap(currentMap, x, y + block.startHeight - 1);
            x += block.width;
            y -= block.endHeight - block.startHeight;
        }
    }


    // TODO - in addition to storing start/end height of player, need to include bounding box (how many tiles up/down this block can be shifted)
    // currently getting too high and wrapping around


    LoadTestLevel() {
        let blocks = [LevelGenerator.BasicStartBlock];

        let currentY = 3;
        for (let i = 0; i < 8; i++) {
            let availableBlocks = LevelGenerator.LevelBlocks.filter(a => {
                if (a == blocks[blocks.length - 1]) return false;
                let potentialTopY = currentY - a.startHeight + a.heightRequired;
                if (potentialTopY > 12) return false;
                if (currentY < a.startHeight) return false;
                if (currentY < a.endHeight) return false;
                return true;
            });
            if (availableBlocks.length == 0) {
                throw "NO BLOCKS AVAILABLE, current height " + currentY;
            }
            let index = Math.floor(Math.random() * availableBlocks.length);
            let nextBlock = availableBlocks[index];
            blocks.push(nextBlock);
            currentY -= (nextBlock.startHeight - nextBlock.endHeight);
        }
        blocks.push(LevelGenerator.BasicEndBlock);
        let mapWidth = blocks.map(a => a.width).reduce(Utility.Sum);

        LevelMap.BlankOutMap();
        LevelMap.ClearAllTiles(mapWidth, 12);
        editorHandler.sprites = [];

        this.StitchBlocks(blocks);
        this.FillInSolidsBelowFloor(currentMap);
        //this.ApplyCaveRoof(currentMap);
        this.ApplyGrassyDecor(currentMap);
    }

    FillInSolidsBelowFloor(map: LevelMap): void {
        for (let x = 0; x < map.mainLayer.tiles.length; x++) {

            let lowestBlockY = 11;
            for (let y = 11; y > -1; y--) {
                let tile = map.mainLayer.GetTileByIndex(x, y);
                if (tile.tileType == TileType.Dirt) {
                    lowestBlockY = y;
                    break;
                }
            }

            if (lowestBlockY > -1) {
                for (let y = lowestBlockY + 1; y < 12; y++) {
                    map.mainLayer.SetTile(x, y, TileType.Dirt, true);
                }
            }
        }
    }

    ApplyCaveRoof(map: LevelMap): void {
        // todo, pass in blocks so we can respect minimum heights of each
        let caveHeightMap: number[] = [];
        for (let x = 0; x < map.mainLayer.tiles.length; x++) {

            let highestBlockY = 12;
            for (let y = 0; y < 12; y++) {
                let tile = map.mainLayer.GetTileByIndex(x, y);
                if (tile.tileType == TileType.Dirt) {
                    highestBlockY = y;
                    break;
                }
            }
            caveHeightMap.push(highestBlockY >= 12 ? caveHeightMap[caveHeightMap.length - 1] : highestBlockY - 5);
        }

        let newCaveHeightMap = [];
        for (let i = 0; i < caveHeightMap.length; i++) {
            newCaveHeightMap.push(Math.floor(
                [-1, 0, 1].map(a => caveHeightMap[i + a] ?? caveHeightMap[i]).reduce(Utility.Sum) / 3
                - Math.random() + Math.sin(i / 3)
            ));
        }

        for (let x = 0; x < map.mainLayer.tiles.length; x++) {
            for (let y = 0; y < newCaveHeightMap[x]; y++) {
                map.mainLayer.SetTile(x, y, TileType.Dirt);
            }
        }
    }

    ApplyGrassyDecor(map: LevelMap): void {
        for (let x = 0; x < map.mainLayer.tiles.length; x++) {
            for (let y = 0; y < 12; y++) {
                let tile = map.mainLayer.GetTileByIndex(x, y);

                let tileAbove = map.mainLayer.GetTileByIndex(x, y - 1);

                if (tile.tileType == TileType.Dirt && tileAbove.tileType == TileType.Air) {
                    map.semisolidLayer.SetTile(x, y, TileType.GrassyTop);
                    if (Math.random() < 0.05 && y > 0) {
                        map.mainLayer.SetTile(x, y - 1, TileType.Flower);
                    }
                }

                if (tile.tileType == TileType.Dirt && Math.random() < 0.18) {
                    map.mainLayer.SetTile(x, y, TileType.DirtTile);
                }

                let semisolid = tile.GetSemisolidNeighbor();
                if (semisolid?.tileType == TileType.GrassyTop) {
                    for (let y2 = y; y2 < 12; y2++) {
                        map.backdropLayer.SetTile(x, y2, TileType.DirtBack);
                    }
                }
            }
        }
    }

    static LevelBlocks: LevelBlock[] = [
        new LevelBlock(`AA/AA3|AA/AA3|AAKABAAAKABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAKABAAAKABAAAKABA|AA/AA3|AA/AA3|AEAFAH;AzADAE;AzAEAE;AzAFAE`, 0, 10, 8, 1, 1),
        new LevelBlock(`AA/AA3|AA/AA3|AAJABAAAKABAAAKABAAALABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAB|AA/AA3|AA/AA3|AHAFAK`, 1, 10, 5, 2, 3),
        new LevelBlock(`AA/AA3|AA/AA3|AAKABAAAKABAAAiABAAAKABAAAKABAAAiABA|AA/AA3|AA/AA3|AEAGAK`, 2, 10, 4, 1, 1),
        new LevelBlock(`AA/AA/AAb|AA/AA/AAb|AAJABAAAKABAAAKABAAA/AA2ABAAAA|AA/AA/AAb|AA/AA/AAb|AdAGAL`, 2, 13, 5, 2, 2),
        new LevelBlock(`AA/AAf|AA/AAf|AAIABAAAKABAAAKABAAALAFAABAAAJAFAABAAAJAFAABAAAJAFAABAAAJABAAAA|AA/AAf|AA/AAf|`, 2, 8, 7, 3, 2),
        new LevelBlock(`AA/AAH|AA/AAH|AAKABAAAKABAAAKABAAAHABAAAKABAAAKABAAAC|AA/AAH|AA/AAH|BQAFAH`, 2, 6, 6, 1, 4),
        new LevelBlock(`AA/AAf|AA/AAf|AAIABAAAKABAAAKABAAALABAAALABAAAKABAAAKABAAAKABA|AA/AAf|AA/AAf|`, 0, 6, 4, 3, 1),
        new LevelBlock(`AA/AAf|AA/AAf|AAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAGABAAAF|AASABAAAKABAAAYABAAAGABAAAKABAAAR|AA/AAf|AJAGAI`, 2, 8, 9, 1, 7),
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

    static BasicStartBlock = new LevelBlock(`AA7|AA7|AAKABAAAKABAAAKABAAAKABAAAKABA|AA7|AA7|AAACAI`, 0, 5, 5, 1, 1);
    static BasicEndBlock = new LevelBlock(`AA7|AA7|AAKABAAAKABAAAKABAAAKABAAAKABA|AA7|AA7|ABACAH`, 0, 5, 6, 1, 1);
}


