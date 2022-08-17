class DoorAnimation extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    public frame: number = 0;
    zIndex = 3;

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["door"][this.frame][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}