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
        let yOffset = 0;
        if (this.z) yOffset = -this.z;
        if (isEditMode) xOffset += 160;
        if(this.z) this.DrawShadow(xOffset + this.x, canvas.height / 2 + this.y, 6 - this.z / 20);

        if (this.isWading) {
            let rippleIndex = (this.age % 60 < 30) ? 9 : 10;
            DrawTile(this.tileset, rippleIndex,
                xOffset + this.x,
                canvas.height / 2 + this.y + yOffset,
                2, false);
            DrawTile(this.tileset, this.tile,
                xOffset + this.x,
                canvas.height / 2 + this.y + yOffset,
                2, true);

        } else {
            DrawTile(this.tileset, this.tile,
                xOffset + this.x,
                canvas.height / 2 + this.y + yOffset,
                2, false);
        }
    }

    DrawShadow(x, y, r) {
        if (r < 0) return;
        ctx.fillStyle = "#0004";
        ctx.beginPath();
        ctx.ellipse(x, y, r, r/2, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

}