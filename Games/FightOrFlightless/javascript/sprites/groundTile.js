class GroundTile extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth,
            tileY * cellHeight,
            images.art);
        this.tile = 0;
        this.tileX = tileX;
        this.tileY = tileY;
    }
    drawOrder = 0;

    Update() {
    }
}