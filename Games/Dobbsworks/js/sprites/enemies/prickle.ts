class Prickle extends Enemy {

    public height: number = 10;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = false;

    Update(): void {
        if (!this.WaitForOnScreen()) {
            return; 
        } else {
            this.dx = -0.3;
        }
        this.GroundPatrol(0.3, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frames = [0,1];
        let frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }
}