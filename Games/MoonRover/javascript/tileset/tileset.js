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

    //TODO recolor
}

var tileset = {};
function InitializeTilesets() {
    tileset.enemy = new Tileset("enemy-parts-01");
    tileset.enemy.CreateTile(11,3,6,2); // Exhaust
    tileset.enemy.CreateTile(0,0,8,16); // Left plate
    tileset.enemy.CreateTile(10,11,5,5); // Wheel
    tileset.enemy.CreateTile(19,4,6,12); // Right plate
    tileset.enemy.CreateTile(28,3,13,13); // Core
    tileset.enemy.CreateTile(43,1,4,4); // Eye

    let core = new TileNode(tileset.enemy.tiles[4]);
    core.xAnchorOffset = 6;
    core.yAnchorOffset = 5;
    core.offsetX = TileNode.GetWave(1, 1, -1);
    let leftPlate = core.AddChild(new TileNode(tileset.enemy.tiles[1]), -2, -2, 50);
    let eye = leftPlate.AddChild(new TileNode(tileset.enemy.tiles[5]), 0, 0, 99);
    eye.offsetY = TileNode.GetWave(-1, 2, 0);
    leftPlate.offsetY = TileNode.GetWave(1, 2, 0);
    core.AddChild(new TileNode(tileset.enemy.tiles[2]), 0, 10);
    core.AddChild(new TileNode(tileset.enemy.tiles[2]), 8, 10);
    let exhaust = core.AddChild(new TileNode(tileset.enemy.tiles[0]), 10, 9);
    exhaust.offsetY = TileNode.GetWave(2, 1, 0);
    let rightPlate = core.AddChild(new TileNode(tileset.enemy.tiles[3]), 8, 0, 50);
    rightPlate.offsetY = TileNode.GetWave(1, 1, 0);

    let orangeBotImage = core.Print(24,24,16);
    tileset.orangeBot = new Tileset(orangeBotImage);
    tileset.orangeBot.SliceIntoTiles(16);
}