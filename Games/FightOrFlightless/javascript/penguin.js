class Penguin extends Sprite {

    constructor(initialTileX, initialTileY) {
        super(
            initialTileX * cellWidth, 
            initialTileY * cellHeight, 
            images.art);
        this.tile = 3;
        this.hp = 5;
    }

    Update() {
        //eventually: find nearest starting point
        let speed = 0.5;
        if (this.x > 0) {
            this.x -= speed;
        }
        if (this.x < 0) {
            this.x += speed;
        }
        if (this.y > 0) {
            this.y -= speed;
        }
        if (this.y < 0) {
            this.y += speed;
        }

        if (this.hp <= 0) {
            this.isActive = false;
        }
    }

}