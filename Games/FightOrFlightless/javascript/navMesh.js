class NavMesh {

    constructor() {
        //let t0 = performance.now();
        this.mesh = this.GenerateMesh();
        // let t1 = performance.now();
        // console.log(((t1 - t0)/1000).toFixed(3))
    }


    GenerateMesh() {
        let mesh = this.GenerateBlankMesh();
        this.DetermineAvailableTiles(mesh);
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

    DetermineAvailableTiles(tiles) {
        let walls = sprites.filter(a => a instanceof SnowWall);
        for (let wall of walls) {
            let tile = tiles.find(a => a.tileX === wall.tileX && a.tileY === wall.tileY);
            if (tile) {
                tile.distance = -1;
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

        let isDone = false;
        let searchDistance = 0;
        while(!isDone) {
            let tilesToSearchFrom = tiles.filter(a => a.distance === searchDistance); 
            for (let tileToSearchFrom of tilesToSearchFrom) {
                let neighbors = this.FindNeighborTiles(tiles, tileToSearchFrom);
                let validNeighbors = neighbors.filter(a => a.distance === null);
                for (let neighbor of validNeighbors) {
                    neighbor.distance = searchDistance + 1;
                    tileToSearchFrom.routes.push({x: 0, y: 0})
                }
            }
            if (tilesToSearchFrom.length === 0) isDone = true;
            searchDistance++;
        }
    }

    CalculateRoutes(mesh) {
        for (let tile of mesh) {
            let neighbors = this.FindNeighborTiles(mesh, tile);
            let validNeighbors = neighbors.filter(a => a.distance === tile.distance - 1);
            tile.routes = validNeighbors.map(a => ({
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
        //return mesh.filter(a => Math.abs(a.tileX - targetTile.tileX) <= 1 && Math.abs(a.tileY - targetTile.tileY) <= 1);
        return mesh.filter(a => Math.abs(a.tileX - targetTile.tileX) + Math.abs(a.tileY - targetTile.tileY) === 1);
    }


    //TODO: zoo problem

}