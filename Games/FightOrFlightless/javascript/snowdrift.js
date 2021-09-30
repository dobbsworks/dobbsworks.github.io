class SnowDrift extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth, 
            tileY * cellHeight, 
            images.art);
        this.tile = 1;
        this.tileX = tileX;
        this.tileY = tileY;
    }
}