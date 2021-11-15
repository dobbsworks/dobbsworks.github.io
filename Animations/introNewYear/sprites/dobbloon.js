class Dobbloon extends Sprite {
    constructor(x, y) {
        super(images.dobbloon, x, y);
        this.initialY = y;
    }

    scale = 0.5;
    Update(frameNum) {
        this.tile = Math.floor(frameNum / musicBeat*2) % 6;
        this.x -= 4;
        if (this.x < -1000) this.isActive = false;
    }
}
