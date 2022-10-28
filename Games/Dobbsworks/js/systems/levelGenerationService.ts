

class LevelBlock {
    constructor(
        public exportString: string,
        public difficulty: number,
        public width: number,
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
    test(): void {
        for (let i = 0; i < 12; i++) {
            currentMap.mainLayer.SetTile(0, i, TileType.DirtTile)
        }
    }

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
        let y = 0;
        for (let block of levelBlocks) {
            block.PlaceInMap(currentMap, x, y);
            x += block.width;
            y -= block.endHeight - block.startHeight;
        }
    }


    LoadTestLevel() {
        LevelMap.BlankOutMap();
        editorHandler.sprites = [];
        let blocks = [LevelGenerator.BasicStartBlock];
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * LevelGenerator.LevelBlocks.length);
            blocks.push(LevelGenerator.LevelBlocks[index]);
        }
        blocks.push(LevelGenerator.BasicEndBlock);
        this.StitchBlocks(blocks);
        this.FillInSolidsBelowFloor(currentMap);
        this.ApplyCaveRoof(currentMap);
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
            caveHeightMap.push(highestBlockY >= 12 ? caveHeightMap[caveHeightMap.length-1] : highestBlockY - 5);
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
        new LevelBlock(`AA/AA3|AA/AA3|AAIABAAAKABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAHABAAABABAAAKABAAAKABAAAKABAAAB|AA/AA3|AA/AA3|AEAFAF;AzADAC;AzAEAC;AzAFAC`, 0, 10, 3, 3),
        new LevelBlock(`AA/AA3|AA/AA3|AAIABAAAKABAAAKABAAALABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAC|AA/AA3|AA/AA3|AHAFAJ`, 1, 10, 3, 4),
        new LevelBlock(`AA/AA3|AA/AA3|AAIABAAAKABAAAiABAAAKABAAAKABAAAiABAAAB|AA/AA3|AA/AA3|AEAGAI`, 2, 10, 3, 3),
    ];

    static BasicStartBlock = new LevelBlock(`AA7|AA7|AAIABAAAKABAAAKABAAAKABAAAKABAAAB|AA7|AA7|AAACAI`, 0, 5, 3, 3);
    static BasicEndBlock = new LevelBlock(`AA7|AA7|AAIABAAAKABAAAKABAAAKABAAAKABAAAB|AA7|AA7|ABACAF`, 0, 5, 3, 3);




    // TODO
    // (optional) post-layout pass to apply special solids
    //      cave roof, non-functional gaps in solids
    // post-layout pass to apply palettes
    // post-layout pass to apply decoration

    // exportFirstScreen(): string {
    //     let ret = "";
    //     for (let x = 0; x < 20; x++) {
    //         for (let y = 0; y < 12; y++) {
    //             let main = currentMap.mainLayer.GetTileByIndex(x, y);
    //             let semisolid = currentMap.semisolidLayer.GetTileByIndex(x, y);
    //             if (main.tileType.solidity == Solidity.Block) 
    //         }
    //         ret += "/";
    //     }
    //     return ret;
    // }
}


