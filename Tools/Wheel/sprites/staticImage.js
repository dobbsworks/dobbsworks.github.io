class StaticImage extends Sprite {
    constructor(image, scale, x, y) {
        super(image, x, y);
        this.scale = scale;
        this.name = Object.keys(images).find(a => images[a] === image)
    }
    baseSpeed = frames * 8;
    animated = true;
    animationOffset = 0;
    animationSpeed = 1;

    Update(frameNum) {
        if (this.animated && this.tileset.count)
            this.tile = Math.floor(this.animationSpeed * (frameNum + this.animationOffset) / this.baseSpeed * 2) % this.tileset.count;
    }
}
