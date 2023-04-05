class Sparky extends Enemy {

    public height: number = 6;
    public width: number = 6;
    respectsSolidTiles = false;

    dir: Direction = Direction.Right;
    anchor = null;
    killedByProjectiles = false;
    timer = 0;
    pathingType: "wire" | "track" | null = null;

    Update(): void {
        if (!this.WaitForOnScreen()) {
            return;
        }
        if (this.pathingType == null) {
            let currentTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor();
            if (currentTile && currentTile.tileType !== TileType.Air) {
                if (currentTile.tileType.trackDirections.length > 0) {
                    this.pathingType = "track";
                } else if (currentTile.tileType.canBePowered) {
                    this.pathingType = "wire";
                }
            }
        }
        let speed = 0.5;

        if (this.timer % 24 === 0) {
            // check upcoming tile
            let prioritizedDirections = [this.dir.Clockwise(), this.dir, this.dir.CounterClockwise()];
            this.dir = this.dir.Opposite();
            for (let dir of prioritizedDirections) {
                let targetX = Math.floor(this.xMid / 12) + dir.x;
                let targetY = Math.floor(this.yMid / 12) + dir.y;
                let tile = this.layer.GetTileByIndex(targetX, targetY).GetWireNeighbor();
                if (tile && tile.tileType != TileType.Air) {
                    if (this.pathingType == "wire" && tile.tileType.canBePowered) {
                        this.dir = dir;
                        break;
                    }
                    if (this.pathingType == "track" && tile.tileType.trackDirections.length > 0) {
                        if (tile.tileType.trackDirections.indexOf(dir.Opposite()) > -1) {
                            this.dir = dir;
                            break;
                        }
                    }
                }
            }
        }
        this.timer++;

        this.dx = speed * this.dir.x;
        this.dy = speed * this.dir.y;
    }


    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 4) % 4;
        return {
            imageTile: tiles["sparky"][frame][0],
            xFlip: frameNum % 2 == 0,
            yFlip: frameNum % 4 <= 2,
            xOffset: 3,
            yOffset: 3
        };
    }
}