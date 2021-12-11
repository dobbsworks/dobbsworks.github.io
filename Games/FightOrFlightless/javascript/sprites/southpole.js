class SouthPole extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth, 
            tileY * cellHeight, 
            images.art);
        this.tile = 5;
        this.tileX = tileX;
        this.tileY = tileY;
    }

    maxHp = 10;
    hp = 10;
    
    drawOrder = 10;
    blocksBuild = true;
}