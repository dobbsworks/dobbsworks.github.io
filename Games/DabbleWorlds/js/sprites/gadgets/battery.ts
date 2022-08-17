class Battery extends Sprite {

    public height: number = 12;
    public width: number = 6;
    respectsSolidTiles = true;
    rolls = false;
    canBeHeld = true;
    isPowerSource = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetPowerPoints(): Pixel[] { 
        return [
            {xPixel: this.xMid, yPixel: this.y - 1},
            {xPixel: this.xMid, yPixel: this.yBottom + 1}
        ]; 
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    }
}