class NavMesh {

    constructor(blockedCells) {
        //let t0 = performance.now();
        this.mesh = this.GenerateMesh(blockedCells || []);
        // let t1 = performance.now();
        // console.log(((t1 - t0)/1000).toFixed(3))
    }


    GenerateMesh(blockedCells) {
        let mesh = this.GenerateBlankMesh();
        this.DetermineAvailableTiles(mesh, blockedCells);
        this.CalculateDistanceForTiles(mesh);
        this.CalculateRoutes(mesh);
        return mesh;
    }


    GenerateBlankMesh() {
        let numWaterTilesToMesh = 5;
        let absoluteMaxX = (cellColCount - 1) / 2 + numWaterTilesToMesh;
        let absoluteMaxY = (cellRowCount - 1) / 2 + numWaterTilesToMesh;

        let ret = [];
        for (let x = -absoluteMaxX; x <= absoluteMaxX; x++) {
            for (let y = -absoluteMaxY; y <= absoluteMaxY; y++) {
                let tile = {tileX: x, tileY: y, distance: null, routes: []};
                ret.push(tile);
            }
        }
        return ret;
    }

    DetermineAvailableTiles(tiles, blockedCells) {
        let walls = sprites.filter(a => a instanceof SnowWall);
        for (let wall of walls) {
            let tile = tiles.find(a => a.tileX === wall.tileX && a.tileY === wall.tileY);
            if (tile) {
                tile.distance = -1;
                tile.trueDistance = 9999;
            } else {
                console.error(`No tile found at (${wall.tileX},${wall.tileY})`);
            }
        }
        for (let blockedCell of blockedCells) {
            let tile = tiles.find(a => a.tileX === blockedCell.tileX && a.tileY === blockedCell.tileY);
            if (tile) {
                tile.distance = -1;
                tile.trueDistance = 9999;
            } else {
                console.error(`No tile found at (${wall.tileX},${wall.tileY})`);
            }
        }
    }

    CalculateDistanceForTiles(tiles) {
        let base = sprites.find(a => a instanceof SouthPole);
        if (!base) {
            console.error("No base found for pathing.");
            return;
        }

        let baseTile = tiles.find(a => a.tileX === base.tileX && a.tileY === base.tileY);
        if (!baseTile) {
            console.error("No base tile found for pathing.");
            return;
        }

        baseTile.distance = 0;
        baseTile.trueDistance = 0;

        let toProcess = this.FindNeighborTiles(tiles, baseTile).filter(a => a.distance !== -1);
        while (toProcess.length > 0) {
            let tile = toProcess.shift();
            let neighbors = this.FindNeighborTiles(tiles, tile).filter(a => a.distance !== null && a.distance > -1);
            let minNeighborDist = Math.min(...neighbors.map(a => a.distance));
            tile.distance = minNeighborDist + 1;
            let minNeighborTrueDist = Math.min(...neighbors.map(a => a.trueDistance));
            let closestNeighbors = neighbors.filter(a => a.trueDistance <= minNeighborTrueDist + 0.1);
            let closestNeighbor = closestNeighbors[0];
            tile.trueDistance = closestNeighbor.trueDistance + Math.sqrt((closestNeighbor.tileX - tile.tileX)**2 + (closestNeighbor.tileY - tile.tileY)**2);
            let unprocessedNeighbors = this.FindNeighborTiles(tiles, tile).filter(a => a.distance === null && toProcess.indexOf(a) === -1);
            toProcess.push(...unprocessedNeighbors);
        }
    }

    CalculateRoutes(mesh) {
        for (let tile of mesh) {
            let neighbors = this.FindNeighborTiles(mesh, tile);
            let validNeighbors = neighbors.filter(a => a.distance === tile.distance - 1 && a.distance >= 0);
            let lowestDist = Math.min(...validNeighbors.map(a => a.trueDistance));
            tile.routes = validNeighbors.filter(a => a.trueDistance <= lowestDist + 0.1).map(a => ({
                x: a.tileX - tile.tileX,
                y: a.tileY - tile.tileY
            }));
        }

        let minX = Math.min(...mesh.map(a => a.tileX));
        let maxX = Math.max(...mesh.map(a => a.tileX));
        for (let tile of mesh.filter(a => a.tileX === minX || a.tileX === maxX)) {
            tile.critical = true;
            tile.processed = false;
        }
        while (mesh.filter(a => a.critical && !a.processed).length > 0) {
            let toProcess = mesh.filter(a => a.critical && !a.processed);
            for (let tile of toProcess) {
                for (let route of tile.routes) {
                    let nextTile = mesh.find(a => a.tileX === tile.tileX + route.x && a.tileY === tile.tileY + route.y);
                    nextTile.critical = true;
                    nextTile.processed = false;
                }
                tile.processed = true;
            }
        }
    }


    FindNeighborTiles(mesh, targetTile) {
        return mesh.filter(a => Math.abs(a.tileX - targetTile.tileX) <= 1 && Math.abs(a.tileY - targetTile.tileY) <= 1 && a !== targetTile);
        //return mesh.filter(a => Math.abs(a.tileX - targetTile.tileX) + Math.abs(a.tileY - targetTile.tileY) === 1);
    }


    //TODO: zoo problem

}