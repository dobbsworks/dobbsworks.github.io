class StaticImage extends Sprite {
    constructor(image, scale, x, y) {
        super(image, x, y);
        this.scale = scale;
        this.name = Object.keys(images).find(a => images[a] === image)
        if (holiday == "flipped") {
            this.rotation = Math.PI;
        }
    }
    animated = true;
    animationOffset = 0;
    animationSpeed = 1;

    Update(frameNum) {
        if (this.animated)
            this.tile = Math.floor(this.animationSpeed * (frameNum + this.animationOffset) / musicBeat * 2) % this.tileset.count;
    }
}


class Lizard extends StaticImage {
    constructor(scale, x, y, rotation, speed) {
        super(images.lizard, scale, x, y);
        this.rotation = rotation;
        this.speed = speed;
    }

    speed = 1;

    Update(frameNum) {
        super.Update(frameNum);
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * Math.sin(this.rotation);
    }
}