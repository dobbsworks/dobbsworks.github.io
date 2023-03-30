class CeilingButton extends Sprite {

    public height: number = 4;
    public width: number = 8;
    respectsSolidTiles = true;
    isPowerSource = true;
    isPlatform = true;
    isSolidBox = true;
    public anchor: Direction = Direction.Up;

    onTimer = 0;

    public static get clockwiseRotationSprite(): (SpriteType | null) { return RightSideButton; }
    Update(): void { 
        let spritesAtBottom = this.layer.sprites.filter(a => {
            return (a.y == this.yBottom && a.x < this.xRight && a.xRight > this.x);
        })
        if (spritesAtBottom.length > 0) {
            if (this.onTimer != 30) audioHandler.PlaySound("erase", true);
            this.onTimer = 30;
        } else {
            if (this.onTimer > 0) this.onTimer--;
        }
    }
    
    GetPowerPoints(): Pixel[] { 
        if (this.onTimer > 0) {
            return [
                {xPixel: this.xMid, yPixel: this.y - 1}
            ]; 
        } else return []; 
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][this.onTimer > 0 ? 4 : 3][1],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}