class Poof extends Sprite {
    public height: number = 16;
    public width: number  = 16;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;

    Update(): void {
        //this.MoveByVelocity();
        if (this.age > 14) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0,1,2,3,4,5,6,7,7,7,7];
        let frameIndex = Math.floor(frameNum / 2) % frames.length;
        let frame = frames[frameIndex];
        return {
            imageTile: tiles["poof"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}

class Pow extends Sprite {
    public height: number = 10;
    public width: number  = 10;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;

    imageName = "pow";

    Update(): void {
        if (this.age > 5) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0,1,2,3,4,5];
        let frameIndex = Math.floor(frameNum) % frames.length;
        let frame = frames[frameIndex];
        return {
            imageTile: tiles[this.imageName][0][frame],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}


class Twinkle extends Pow {
    imageName = "twinkle";
}