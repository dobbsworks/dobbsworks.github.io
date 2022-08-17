class Umbrella extends Sprite {

    public height: number = 12;
    public width: number = 6;
    respectsSolidTiles = true;
    canBeHeld = true;
    slowFall = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][2][1],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    }
}