class SnowWall extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth,
            tileY * cellHeight,
            images.art);
        this.tile = 8;
        this.tileX = tileX;
        this.tileY = tileY;
    }


    Update() {
    }
}