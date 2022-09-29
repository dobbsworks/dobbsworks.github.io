class Pufferfish extends Enemy {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = false;

    verticalDirection: -1|1 = 1;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        if (this.isOnGround) this.verticalDirection = -1;
        if (this.isOnCeiling) this.verticalDirection = 1;
        if (!this.isInWater) this.verticalDirection = 1;

        this.dy = this.verticalDirection * 0.125;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(this.age / 20) % 2;
        return {
            imageTile: tiles["pufferfish"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}