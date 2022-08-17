class TestBox extends Sprite {

    public height: number = 12;
    public width: number = 12;
    isSolidBox = true;
    respectsSolidTiles = false;
    canBeHeld = true;
    floatsInWater = true;


    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["terrain"][4][2],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}