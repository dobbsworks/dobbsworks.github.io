class Fan extends Sprite {

    public height: number = 5;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = true;
    isPlatform = true;
    isSolidBox = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        let affectedSprites = this.layer.sprites.filter(a => a.xMid > this.x && a.xMid < this.xRight && a.yBottom <= this.y && a.yBottom > this.y - 60);
        affectedSprites.forEach(a => a.gustUpTimer = 3);
    }

    GetIsPowered(): boolean {
        let tile = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yBottom + 1);
        return tile?.isPowered() || false;
    }

    GetFrameData(frameNum: number): FrameData[] {
        let gusts = [0,1,2,3,4].map(a => ({
            imageTile: tiles["gust"][Math.floor(frameNum % 12)][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: a * 12 + 12
        }));
        return [...gusts, {
            imageTile: tiles["misc"][0][3],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 7
        }];
    }
}