class Sparky extends Enemy {

    public height: number = 6;
    public width: number = 6;
    respectsSolidTiles = false;

    dir: Direction = Direction.Right;
    anchor = null;
    killedByProjectiles = false;
    timer = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) {
            return;
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
                if (tile?.tileType != TileType.Air) {
                    this.dir = dir;
                    break;
                }
            }
        }
        this.timer++;

        // let targetX = +((this.x + this.dir.x * speed).toFixed(3));
        // let targetY = +((this.y + this.dir.y * speed).toFixed(3));

        // let currentTileX = Math.floor((this.x + this.width/2 + this.dir.x * 3) / 12);
        // let currentTileY = Math.floor((this.y + this.height/2 + this.dir.x * 3) / 12);
        // let targetTileX = Math.floor((targetX + this.width/2 + this.dir.x * 3) / 12);
        // let targetTileY = Math.floor((targetY + this.height/2 + this.dir.y * 3) / 12);

        // let targetTile = this.layer.GetTileByIndex(targetTileX, targetTileY).GetWireNeighbor();
        // let hitEndOfLine = false;

        // let changingTile = currentTileX != targetTileX || currentTileY != targetTileY;
        // console.log(currentTileX, targetTileX )
        // if (changingTile && targetTile?.tileType == TileType.Air) {
        //     hitEndOfLine = true;
        // }

        // if (hitEndOfLine) {
        //     this.dir = this.dir.Clockwise();
        //     hitEndOfLine = true;
        //     this.dx = currentTileX * 12 + 3 - this.x;
        //     this.dy = currentTileY * 12 + 3 - this.y;
        // } else {
            this.dx = speed * this.dir.x;
            this.dy = speed * this.dir.y;
        //}
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