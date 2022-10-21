class Points extends Sprite {
    public height: number = 9;
    public width: number = 15;
    public respectsSolidTiles: boolean = false;

    isExemptFromSilhoutte = true;
    public column = 0;

    Update(): void {
        if (this.age > 80) this.isActive = false;
        if (this.age < 25) this.y -= 0.5;
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frameRow = Math.floor(this.age / 8);
        if (frameRow > 9) frameRow = 9;
        return {
            imageTile: tiles["points"][this.column][frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

}