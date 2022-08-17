class CircuitHandler {

    public static UpdateCircuits(layer: LevelLayer, sprites: Sprite[]): void {
        let allTiles = layer.tiles.flatMap(a => a);
        let poweredSprites = sprites.filter(a => a.isPowerSource);

        // remove power from all sprite-powered tiles
        allTiles.forEach(a => a.isSpritePowered = false);

        // add power to all tiles containing battery/etc
        poweredSprites.forEach(s => {
            let powerPoints = s.GetPowerPoints();
            for (let pixel of powerPoints) {
                let tile = layer.GetTileByPixel(pixel.xPixel, pixel.yPixel);
                tile.isSpritePowered = true;
            }
        });

        let newPowerValuesMap: { t: LevelTile, p: number }[] = [];

        for (let tile of allTiles.filter(a => a.tileType.canBePowered)) {

            let powerableNeighborFilter = (neighbor: { dir: Direction, tile: LevelTile }): (LevelTile | null) => {
                let t = neighbor.tile;
                if (t.tileType == TileType.CircuitCrossOff || t.tileType == TileType.CircuitCrossOn) {
                    return powerableNeighborFilter({dir: neighbor.dir, tile: neighbor.tile.Neighbor(neighbor.dir)})
                }
                // if neighbor wire has one exit direction, only look at it from that direction
                if (t.tileType.powerOutputDirection && t.tileType.powerOutputDirection !== neighbor.dir.Opposite()) {
                    return null;
                }
                if (tile.tileType.powerOutputDirection == neighbor.dir) return null;
                if (tile.tileType.powerInputDirection && neighbor.dir !== tile.tileType.powerInputDirection) {
                    return null;
                }
                if (t.tileType.isPowerSource) return t;
                if (t.tileType.canBePowered) return t;
                return null;
            }

            let neighborsToCheckForPower = <LevelTile[]>tile.Neighbors().map(powerableNeighborFilter).filter(a => a != null);

            if (tile.isSpritePowered) {
                newPowerValuesMap.push({ t: tile, p: 0 });
            } else if (neighborsToCheckForPower) {
                let myNewPowerValue = tile.tileType.calcPowerFromNeighbors(neighborsToCheckForPower);
                newPowerValuesMap.push({ t: tile, p: myNewPowerValue });
            }

        }

        for (let newPowerValue of newPowerValuesMap) {
            if (newPowerValue.p < 0 || (newPowerValue.p > 20)) {
                newPowerValue.t.PowerDown()
            } else {
                newPowerValue.t.PowerUp();
                newPowerValue.t.powerValue = newPowerValue.p;
            }
        }
    }

    public static NormalPowerCalc(neighbors: LevelTile[]): number {
        if (neighbors.some(a => a.tileType.isPowerSource)) return 1;
        let neighborPowerVals = neighbors.filter(a => a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay).map(a => a.powerValue);
        let myNewPowerValue = Math.min(...neighborPowerVals) + 1;
        return myNewPowerValue;
    }

    public static CrossPowerCalc(neighbors: LevelTile[]): number {
        if (neighbors.some(a => a.tileType.isPowerSource)) return 1;
        let neighborPowerVals = neighbors.filter(a => a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay).map(a => a.powerValue);
        let myNewPowerValue = Math.min(...neighborPowerVals) + 1;
        return myNewPowerValue;
    }

    public static InverterPowerCalc(neighbors: LevelTile[]): number {
        if (neighbors.some(a => a.tileType.isPowerSource)) return -1;
        let neighborPowerVals = neighbors.filter(a => a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay).map(a => a.powerValue);
        if (neighborPowerVals.some(a => a > 0)) return -1;
        return 1;
    }

    public static DiodePowerCalc(neighbors: LevelTile[]): number {
        if (neighbors.some(a => a.tileType.isPowerSource)) return 1;
        let neighborPowerVals = neighbors.filter(a => a.powerValue > -1 && a.powerDelay > a.tileType.requiredPowerDelay).map(a => a.powerValue);
        if (neighborPowerVals.some(a => a > 0)) return 1;
        return -1;
    }

    public static AndGatePowerCalc(neighbors: LevelTile[]): number {
        if (neighbors.every(a => a.tileType.isPowerSource)) return 1;
        let neighborPowerVals = neighbors.filter(a => !a.tileType.isPowerSource).map(a => a.powerValue);
        if (neighborPowerVals.some(a => a === -1)) return -1;
        let myNewPowerValue = Math.min(...neighborPowerVals) + 1;
        return myNewPowerValue;
    }
}