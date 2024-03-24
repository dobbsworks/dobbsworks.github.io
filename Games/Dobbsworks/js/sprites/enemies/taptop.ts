class Taptop extends Enemy {

    public height: number = 14;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.GroundPatrol(0.4, true);
        this.ApplyGravity();
        this.ApplyInertia();
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        let barrel = this.ReplaceWithSpriteType(Barrel);
        barrel.dx = 0;
        barrel.dy = 0;
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 60 * 4) % 4;
        return {
            imageTile: tiles["taptop"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}