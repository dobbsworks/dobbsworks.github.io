class Biggle extends Enemy {

    public height: number = 22;
    public width: number = 24;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    squishTimer = 0;

    animationSpeed = 0.2;
    frameRow = 0;
    turnAtLedges = true;
    bounceSoundId: string = "oink";

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.GroundPatrol(0.3, this.turnAtLedges);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }

    OnBounce(): void {
        this.isActive = false;
        [1, -1].forEach(dir => {
            let pig = new Piggle(this.xMid + dir * 6 - 5.5, this.yMid, this.layer, []);
            this.layer.sprites.push(pig);
            pig.dx = dir * 2;
            pig.dy = -1;
            pig.direction = dir == -1 ? -1 : 1;
        });
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1, 2, 1, 0, 3, 4, 4, 3];
        let frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        //if (this.isInDeathAnimation) frame = 5;
        return {
            imageTile: tiles["bigpig"][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 4,
            yOffset: 6
        };
    }
}