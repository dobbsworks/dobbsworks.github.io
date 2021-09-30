class Sprite {
    constructor(x, y, tileset) {
        this.x = x;
        this.y = y;
        this.tileset = tileset;
    }

    tile = 0;
    isActive = true;

    Update() { }

    Draw() {
        DrawTile(this.tileset, this.tile, 
            canvas.width / 2 + this.x, 
            canvas.height / 2 + this.y, 
            2);
    }

}