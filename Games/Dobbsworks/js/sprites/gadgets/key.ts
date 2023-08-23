class Key extends Sprite {

    public height: number = 9;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = true;
    poofTimer = -1;
    frameRow = 0;
    frameCol = 0;

    KeyPhysics(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
    }

    Update(): void {
        if (this.poofTimer >= 0) {
            this.poofTimer++;
            if (this.poofTimer >= 20) this.isActive = false;
        } else {
            this.KeyPhysics();
            this.MoveByVelocity();

            // check if touching any locks
            // 8 points
            //     #          #
            //     #X        X#
            //#####################
            //    X#          #X
            //     #          #
            //     #          #
            //     #          #
            //    X#          #X
            //#####################
            //     #X        X#
            //     #          #

            let tilesToCheck = [
                ...this.GetTilesByCoords([this.x, this.xRight - 0.1], [this.y - 0.1, this.yBottom]),
                ...this.GetTilesByCoords([this.x - 0.1, this.xRight], [this.y, this.yBottom - 0.1])
            ];
            let lockTiles = [
                ...this.touchedRightWalls.filter(a => a instanceof LevelTile && a.tileType == TileType.Lock),
                ...this.touchedLeftWalls.filter(a => a instanceof LevelTile && a.tileType == TileType.Lock),
                ...this.touchedCeilings.filter(a => a instanceof LevelTile && a.tileType == TileType.Lock),
                ...this.standingOn.filter(a => a instanceof LevelTile && a.tileType == TileType.Lock),
            ] as LevelTile[];
            for (let tileToCheck of tilesToCheck) {
                if (tileToCheck.tileType == TileType.Lock) {
                    if (lockTiles.indexOf(tileToCheck) == -1) lockTiles.push(tileToCheck);
                }
            }

            if (lockTiles.length > 0) {
                for (let lockTile of lockTiles) {
                    this.layer.SetTile(lockTile.tileX, lockTile.tileY, TileType.Air);
                    let propogatingUnlockEffect = new KeyDomino(lockTile.tileX * this.layer.tileWidth, lockTile.tileY * this.layer.tileHeight, this.layer, []);
                    this.layer.sprites.push(propogatingUnlockEffect);
                }
                this.Disappear();
            }
        }
    }

    Disappear(): void {
        this.poofTimer = 0;
    }

    GetTilesByCoords(xCoords: number[], yCoords: number[]): LevelTile[] {
        let xTiles = xCoords.map(x => Math.floor(x / this.layer.tileWidth)).filter(Utility.OnlyUnique);
        let yTiles = yCoords.map(y => Math.floor(y / this.layer.tileHeight)).filter(Utility.OnlyUnique);
        let tiles = [];
        for (let xTile of xTiles) for (let yTile of yTiles) {
            tiles.push(this.layer.GetTileByIndex(xTile, yTile));
        }
        return tiles;
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = this.frameCol;
        if (this.poofTimer >= 0) {
            frame = Math.floor(this.poofTimer / 20 * 4);
            this.frameRow = 0;
        }
        return {
            imageTile: tiles["key"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1 + this.GetYOffset(frameNum)
        };
    }

    GetYOffset(frameNum: number): number {
        return 0;
    }
}

class FlatKey extends Key {
    public isPlatform: boolean = true;
    frameRow = 1;
}

class BubbleKey extends Key {
    frameRow = 1;
    frameCol = 1;
    canBeHeld = false;
    target: Player | null = null;
    theta = 0;

    KeyPhysics(): void {
        // look for overlap
        if (!this.target) {
            for (let player of this.layer.sprites.filter(a => a instanceof Player && !a.isDuplicate)) {
                if (player.Overlaps(this)) {
                    this.target = player as Player;
                }
            }
        }

        if (this.target) {
            this.theta += 0.06;

            let radius = 16;
            let targetX = radius * Math.cos(this.theta) + this.target.xMid - this.width / 2;
            let targetY = radius * Math.sin(this.theta) + this.target.yMid - this.height / 2;

            this.dx = (targetX - this.x) * 0.8;
            this.dy = (targetY - this.y) * 0.8;
        }
    }

    GetYOffset(frameNum: number): number {
        return Math.sin(frameNum / 30);
    }
}