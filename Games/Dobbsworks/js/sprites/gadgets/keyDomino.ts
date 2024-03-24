class KeyDomino extends Key {
    // an effect that causes surrounding locks to break

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    canBeHeld = false;
    private numFrames = 15;

    Update(): void {
        if (this.age == 1) {
            audioHandler.PlaySound("unlock", true);
        }
        if (this.age < this.numFrames) return;
        let tilesToCheck = [
            ...this.GetTilesByCoords([this.xMid], [this.y - 0.1, this.yBottom]),
            ...this.GetTilesByCoords([this.x - 0.1, this.xRight], [this.yMid])
        ];
        let lockTiles = [];
        for (let tileToCheck of tilesToCheck) {
            if (tileToCheck.tileType == TileType.Lock) {
                lockTiles.push(tileToCheck);
            }
        }

        if (lockTiles.length > 0) {
            for (let lockTile of lockTiles) {
                this.layer.SetTile(lockTile.tileX, lockTile.tileY, TileType.Air);
                let propogatingUnlockEffect = new KeyDomino(lockTile.tileX * this.layer.tileWidth, lockTile.tileY * this.layer.tileHeight, this.layer, []);
                this.layer.sprites.push(propogatingUnlockEffect);
            }
        } 
        this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData[] {
        let totalFrames = Object.keys(tiles["lockpoof"]).length;
        let frame = Math.floor(this.age * totalFrames / this.numFrames);
        if (frame < 0) frame = 0;
        if (frame >= totalFrames) frame = totalFrames - 1;
        return [{
            imageTile: tiles["lockpoof"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }];
    }
}