class Fan extends Sprite {

    public height: number = 5;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = true;
    isPlatform = true;
    isSolidBox = true;

    //public direction: Direction = Direction.Up;

    private gusts: Gust[] = [];

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        let targetX = this.x;
        for (let i = 0; i < 5; i++) {
            let targetY = this.y - 12 * (i+1);
            if (this.gusts[i]) {
                this.gusts[i].x = targetX;
                this.gusts[i].y = targetY;
            } else {
                let newGust = new Gust(targetX, targetY, this.layer, []);
                (<Gust[]>this.gusts).push(newGust);
                this.layer.sprites.push(newGust);
            }
        }

        let totalGustHeight = this.gusts.length * 12;
        let affectedSprites = this.layer.sprites.filter(a => a.xMid > this.x && a.xMid < this.xRight && a.yBottom <= this.y && a.yBottom > this.y - 60);
        affectedSprites.forEach(a => a.gustUpTimer = 3);
    }

    GetIsPowered(): boolean {
        let tile = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yBottom + 1);
        return tile?.isPowered() || false;
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][0][3],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 7
        };
    }
}