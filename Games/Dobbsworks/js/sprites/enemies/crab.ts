class DrSnips extends Enemy {

    public height: number = 7;
    public width: number = 13;
    respectsSolidTiles = true;
    canBeBouncedOn = false;

    clawsUp: boolean = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        let speed = this.isInWater ? 0.4 : 0.25;
        this.GroundPatrol(speed, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        this.clawsUp = Math.floor(this.age / 120) % 2 == 0;
        this.canBeBouncedOn = !this.clawsUp;
    }

    OnBounce(): void {
        if (!this.clawsUp) {
            this.isActive = false;
            let deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1];
        let frame = frames[Math.floor(frameNum / 5) % frames.length];
        let row = this.clawsUp ? 0 : 1;
        return {
            imageTile: tiles["crab"][frame][row],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 5
        };
    }
}