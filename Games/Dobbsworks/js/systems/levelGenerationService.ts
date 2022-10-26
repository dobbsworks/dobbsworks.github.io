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


    // TODO
    // export map (use dirt/grass/dirtback/spike as placeholders)
    // extend import code to be able to place end-to-end
    // place sprites
    // (optional) post-layout pass to apply special solids
    // cave roof, non-functional gaps in solids
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



class LevelBlock {
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
    constructor(
        public exportString: string,
        public difficulty: number,
        public width: number,
        public startHeight: number,
        public endHeight: number,
    ) { }
}


new LevelBlock(`AAqABBAAJABBAAJABBAAJABBAAy|AA/AA/AAD|AAIABCAAIABCAAIABCAAFABAAABABCAAFABAAABABCAAFABAAABABCAAFABAAABABCAAIABCAAIABCAAIABCAAIABC|AA/AA/AAD|AA/AA/AAD|AEAFAF;AzADAD;AzAEAC;AzAFAC;AzAGAD`, 0, 11, 3, 3)
new LevelBlock(`AA/AA3|AA/AA3|AAIABCAAIABCAAIABCAAJABBAAJABBAAJABBAAJABBAAJABBAAHABDAAHABD|AA/AA3|AA/AA3|AHAEAJ`, 1, 10, 3, 4)
