class Snail extends Enemy {

    public height: number = 11;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.GroundPatrol(0.2, true);
        this.ApplyGravity();
        this.ApplyInertia();
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        this.isActive = false;
        let shell = new SnailShell(this.x + 1, this.y, this.layer, []);
        this.layer.sprites.push(shell);
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["snail"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    }
}