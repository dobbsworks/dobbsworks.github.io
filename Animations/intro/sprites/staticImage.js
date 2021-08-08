class StaticImage extends Sprite {
    constructor(image, scale, x, y) {
        super(image, x, y);
        this.scale = scale;
    }

    Update(frameNum) {
        this.tile = Math.floor(frameNum / musicBeat*2) % this.tileset.count;
    }
}
