interface TileCoordinate {
    tileX: number,
    tileY: number
}

function AreCoordsEqual(coord1: TileCoordinate, coord2: TileCoordinate): boolean {
    return coord1.tileX == coord2.tileX && coord1.tileY == coord2.tileY;
}

function AddCoords(coord1: TileCoordinate, coord2: TileCoordinate): TileCoordinate {
    return {tileX: coord1.tileX + coord2.tileX, tileY: coord1.tileY + coord2.tileY}
}