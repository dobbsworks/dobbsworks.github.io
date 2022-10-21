class Poof extends Sprite {
    public height: number = 16;
    public width: number  = 16;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;

    Update(): void {
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