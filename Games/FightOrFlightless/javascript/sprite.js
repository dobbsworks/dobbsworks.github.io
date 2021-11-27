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
    blocksNav = false;
    age = 0;


    Update() { }

    Draw() {
        let xOffset = canvas.width / 2;
        let yOffset = canvas.height / 2;
        if (this.z) yOffset -= this.z;
        if (isEditMode) xOffset += 160;
        ctx.translate(xOffset, yOffset);
        if (this.OnBeforeDraw) this.OnBeforeDraw();
        if (this.z) this.DrawShadow(this.x, this.y + this.z, 6 - this.z / 20);

        if (this.isWading) {
            let rippleIndex = (this.age % 60 < 30) ? 9 : 10;
            DrawTile(this.tileset, rippleIndex, this.x, this.y, 2, false);
            DrawTile(this.tileset, this.tile, this.x, this.y, 2, true);

        } else {
            DrawTile(this.tileset, this.tile, this.x, this.y, 2, false);
        }
        if (this.OnAfterDraw) this.OnAfterDraw();
        ctx.translate(-xOffset, -yOffset);
    }

    DrawShadow(x, y, r) {
        if (r < 0) return;
        ctx.fillStyle = "#0004";
        ctx.beginPath();
        ctx.ellipse(x, y, r, r / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

}