class Escarghost extends Enemy {

    public height: number = 11;
    public width: number = 10;
    respectsSolidTiles = false;
    canBeBouncedOn = false;
    isDestroyedByLight = true;
    killedByProjectiles = false;
    immuneToSlideKill = true;

    patrolTimer = 0;

    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        let shell = this.ReplaceWithSpriteType(SnailShell);
        shell.dx = 0;
        shell.dy = 0;
    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.ApplyInertia();
        this.ReactToWater();
        this.AccelerateHorizontally(0.01, 0.2 * this.direction);
        this.ReactToVerticalWind();
        this.AccelerateVertically(0.01, Math.sin(this.age / 40) / 20);

        this.patrolTimer++;
        if (this.patrolTimer > 300) {
            this.patrolTimer = 0;
            this.direction *= -1
        }

        let backdropTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetBackdropNeighbor();
        let isOnBackdrop =  (backdropTile?.tileType != TileType.Air);

        this.canBeBouncedOn = !isOnBackdrop;
        this.killedByProjectiles = !isOnBackdrop;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["escarghost"][col][this.canBeBouncedOn ? 1 : 0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    }
}