class Ground extends Sprite {
    constructor(x, y) {
        super(images.ground, x, y);
    }

    scale = 10;
    Update(frameNum) {
        this.x -= 4;
        if (this.x < -100) this.x += 40;
    }
}
