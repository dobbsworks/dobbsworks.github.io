class Ring extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = false;

    canHangFrom = true;


    Update(): void {
        //this.ApplyGravity();
        this.ApplyInertia();
        //this.ReactToWater();
        //this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frames = [0,0,1,1,1,2,2,2,2,1,1,1,0,0,3,3,3,4,4,4,4,3,3,3];
        let frameIndex = Math.floor(frameNum / 10) % frames.length;
        let frame = frames[frameIndex]
        return {
            imageTile: tiles["ring"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}