class Pig extends Sprite {
    constructor(x, y) {
        super(images.pig, x, y);
    }

    scale = 4;
    Update(frameNum) {
        let frames = [0,1,2,1,0,3,4,4,3];
        this.tile = frames[Math.floor(frameNum / 5) % frames.length];
        this.x -= 1;
    }

}
