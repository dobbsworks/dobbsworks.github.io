class LeftSideButton extends Sprite {

    public height: number = 8;
    public width: number = 4;
    respectsSolidTiles = true;
    isPowerSource = true;
    isPlatform = true;
    isSolidBox = true;
    public anchor: Direction = Direction.Left;

    onTimer = 0;

    Update(): void { 
        let spritesAtRight = this.layer.sprites.filter(a => {
            return (a.x == this.xRight && a.y < this.yBottom && a.yBottom > this.y);
        })
        if (spritesAtRight.length > 0) {
            this.onTimer = 30;
        } else {
            if (this.onTimer > 0) this.onTimer--;
        }
    }
    
    GetPowerPoints(): Pixel[] {
        if (this.onTimer > 0) {
            return [
                {xPixel: this.x - 1, yPixel: this.yMid}
            ]; 
        } else return []; 
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 4 : 3][3],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    }
}