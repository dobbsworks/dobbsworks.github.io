class Propeller extends Hazard {
    public height = 56;
    public width = 10;
    public respectsSolidTiles = false;
    anchor = null;

    private speed = -1;
    private frame = 0;

    Update(): void {
        super.Update();
        let isPowered = this.GetIsPowered();
        if (this.speed == -1) {
            this.speed = isPowered ? 100 : 0;
        }
        if (isPowered) {
            this.speed += 1;
        } else {
            this.speed -= 1;
        }
        if (this.speed > 100) this.speed = 100;
        if (this.speed < 0) this.speed = 0;

        this.frame += this.speed / 100;
    }

    IsHazardActive(): boolean {
        return this.speed > 0;
    }

    GetIsPowered(): boolean { 
        let tile1 = this.layer.map?.wireLayer.GetTileByPixel(this.x - 2, this.yMid);
        let tile2 = this.layer.map?.wireLayer.GetTileByPixel(this.xRight + 2, this.yMid);
        return tile1?.isPowered() || tile2?.isPowered() || false;
    }
    

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(this.frame) % 4;
        return {
            imageTile: tiles["propeller"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    }
}