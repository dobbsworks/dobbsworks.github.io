class RightSideButton extends Sprite {

    public height: number = 8;
    public width: number = 4;
    respectsSolidTiles = true;
    isPowerSource = true;
    isPlatform = true;
    isSolidBox = true;
    public anchor: Direction = Direction.Right;

    onTimer = 0;

    Update(): void { 
        let spritesAtLeft = this.layer.sprites.filter(a => {
            return (a.xRight == this.x && a.y < this.yBottom && a.yBottom > this.y);
        })
        if (spritesAtLeft.length > 0) {
            this.onTimer = 30;
        } else {
            if (this.onTimer > 0) this.onTimer--;
        }
    }
    
    GetPowerPoints(): Pixel[] { 
        if (this.onTimer > 0) {
            return [
                {xPixel: this.xRight + 1, yPixel: this.yMid}
            ]; 
        } else return [];
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 2 : 1][3],
            xFlip: false,
            yFlip: false,
            xOffset: 8,
            yOffset: 2
        };
    }
}