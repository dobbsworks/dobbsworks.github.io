class Sprite {
    constructor(x, y, tileset) {
        this.x = x;
        this.y = y;
        this.tileset = tileset;
    }

    tile = 0;
    isActive = true;
    drawOrder = 0;
    blocksBuild = false;
    age = 0;

    Update() { }

    Draw() {
        let xOffset = canvas.width / 2;
        if (isEditMode) xOffset += 160;
        DrawTile(this.tileset, this.tile, 
            xOffset + this.x, 
            canvas.height / 2 + this.y, 
            2);
    }

}