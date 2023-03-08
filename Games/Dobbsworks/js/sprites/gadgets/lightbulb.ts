class Lightbulb extends Sprite {

    public height: number = 12;
    public width: number = 8;
    respectsSolidTiles = true;
    canBeHeld = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        if (this.GetIsPowered() && this.age % 90 == 0) {
            let shimmerRipple = new ShimmerRipple(this.xMid, this.yMid, this.layer, []);
            shimmerRipple.maxRadiusPixels = 160;
            this.layer.sprites.push(shimmerRipple);
        }
    }
    
    GetIsPowered(): boolean { 
        let tile = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yBottom + 1);
        return tile?.isPowered() || false;
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][this.GetIsPowered() ? 1 : 0][2],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}