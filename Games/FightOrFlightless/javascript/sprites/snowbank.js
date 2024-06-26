class SnowBank extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth, 
            tileY * cellHeight, 
            images.art);
        this.tile = 1;
        this.tileX = tileX;
        this.tileY = tileY;
    }
    
    drawOrder = 10;
    blocksBuild = true;
    money = 500;

    Update() {
        if (this.money <= 0) this.tile = 11;
    }
}