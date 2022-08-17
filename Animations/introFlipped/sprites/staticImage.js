class StaticImage extends Sprite {
    constructor(image, scale, x, y) {
        super(image, x, y);
        this.scale = scale;
        this.name = Object.keys(images).find(a => images[a] === image);
        this.rotation = Math.PI;
    }
    animated = true;
    animationOffset = 0;
    animationSpeed = 1;

    Update(frameNum) {
        if (this.animated)
            this.tile = Math.floor(this.animationSpeed * (frameNum + this.animationOffset) / musicBeat * 2) % this.tileset.count;
    }
}
