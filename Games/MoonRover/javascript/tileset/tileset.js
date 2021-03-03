class Tileset {

    constructor(image) {
        if (typeof image === "string") this.image = document.getElementById(image);
        else this.image = image;
    }

    tiles = [];

    CreateTile(x,y,w,h) {
        let tile = new Tile(this.image, x, y, w, h);
        this.tiles.push(tile);
    }

    SliceIntoTiles(tileCount) {
        let tileWidth = this.image.width / tileCount;
        let tileHeight = this.image.height;
        for (let i=0; i<tileCount; i++) {
            let x = i * tileWidth;
            this.CreateTile(x, 0, tileWidth, tileHeight);
        }
    }
}

var tileset = {};
function InitializeTilesets() {
    let imageIds = ["player", "orangebot","tealbot","yellowbot","limebot","cyanbot","bluebot","purplecore","bluecore","limecore","orangecore","redcore","magentacore", "star", "coin"];

    for (let imageId of imageIds) {
        let image = document.getElementById(imageId);
        tileset[imageId] = new Tileset(image);
        tileset[imageId].SliceIntoTiles(image.width / image.height);
    }
}
