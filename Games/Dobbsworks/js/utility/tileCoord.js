"use strict";
function AreCoordsEqual(coord1, coord2) {
    return coord1.tileX == coord2.tileX && coord1.tileY == coord2.tileY;
}
function AddCoords(coord1, coord2) {
    return { tileX: coord1.tileX + coord2.tileX, tileY: coord1.tileY + coord2.tileY };
}
