class Coin extends Sprite {
    public height: number = 8;
    public width: number = 8;
    public respectsSolidTiles: boolean = false;
    
    isExemptFromSilhoutte = true;
    anchor = null;
    imageSource = "coin";
    border = 1;
    sound = "coin";
    isTouched = false;
    touchTimer = 0;
    
    Update(): void {
        if (this.isTouched) {
            this.touchTimer++;
            this.y -= 0.25;
            if (this.touchTimer > 60) this.isActive = false;
        } else {
            let player = this.layer.sprites.find(a => a instanceof Player);
            if (player && player.Overlaps(this)) {
                this.isTouched = true;
                audioHandler.PlaySound(this.sound, false);
                if (this instanceof Dobbloon) {
                    this.layer.sprites.push(new Points(this.xMid - 15/2, this.y, this.layer, []))
                }
            }
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 10) % 6;
        let frameRow = 0;
        if (this.isTouched) {
            frame = Math.floor(frameNum / 3) % 6;
            frameRow = Math.ceil(this.touchTimer / 20);
            if (frameRow > 3) frameRow = 3;
        }
        return {
            imageTile: tiles[this.imageSource][frame][frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: this.border,
            yOffset: this.border
        };
    }

}

class Dobbloon extends Coin {
    public height: number = 14;
    public width: number = 14;
    border = 2;
    imageSource = "dobbloon";
    sound = "dobbloon";
}