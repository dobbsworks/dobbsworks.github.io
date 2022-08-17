class Gust extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    canMotorHold = false;

    Update(): void {
        // this.ApplyGravity();
        // this.ApplyInertia();
        // this.ReactToPlatformsAndSolids();
        // this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["gust"][frameNum % 12][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}