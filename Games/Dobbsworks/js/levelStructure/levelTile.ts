class LevelTile {
    constructor(
        public tileX: number,
        public tileY: number,
        public tileType: TileType,
        public layer: LevelLayer
    ) {
        this.SetPropertiesByTileType();
     }

    public isSpritePowered: boolean = false;
    public powerValue: number = -1; // -1 no power, 0+ distance from powersource
    public powerDelay: number = 0;
    public uncoatedType!: TileType;

    private isPoweredUp: boolean = false;

    GetMainNeighbor(): LevelTile | undefined {
        return this.layer.map?.mainLayer.GetTileByIndex(this.tileX, this.tileY);
    }

    GetSemisolidNeighbor(): LevelTile | undefined {
        return this.layer.map?.semisolidLayer.GetTileByIndex(this.tileX, this.tileY);
    }

    GetWireNeighbor(): LevelTile | undefined {
        return this.layer.map?.wireLayer.GetTileByIndex(this.tileX, this.tileY);
    }

    GetWaterNeighbor(): LevelTile | undefined {
        return this.layer.map?.waterLayer.GetTileByIndex(this.tileX, this.tileY);
    }

    GetBackdropNeighbor(): LevelTile | undefined {
        return this.layer.map?.backdropLayer.GetTileByIndex(this.tileX, this.tileY);
    }

    GetTopPixel(): number {
        return this.tileY * this.layer.tileHeight;
    }

    SetPropertiesByTileType() {
        if (this.tileType == TileType.PowerBlock) {
            this.powerValue = 0;
        }
        if (this.tileType == TileType.CircuitOn || this.tileType == TileType.ConveyorRightOn) {
            this.powerValue = 1;
        }
        this.uncoatedType = this.tileType;
        if (this.tileType == TileType.FireTop) {
            this.uncoatedType = TileType.BranchTop;
        } else if (this.tileType == TileType.Slime) {
            this.uncoatedType = TileType.GrassyTop;
        } else if (this.tileType == TileType.IceTop) {
            this.uncoatedType = TileType.SnowTop;
        }
    }

    public isPowered(): boolean {
        return this.tileType == TileType.PowerBlock || (this.powerValue >= 0 && this.powerValue < 20);
    }

    public PowerUp(): void {
        if (!this.tileType.canBePowered) return;
        if (!this.isPoweredUp) this.tileType.onPowered(this);
        this.isPoweredUp = true;
        this.powerDelay++;

        let poweredVersionOfTile = this.tileType.poweredTile;
        if (poweredVersionOfTile) {
            this.layer.SetTile(this.tileX, this.tileY, poweredVersionOfTile);
        }

        if (this.layer === this.layer.map?.wireLayer) {
            this.layer.map?.mainLayer.GetTileByIndex(this.tileX, this.tileY).PowerUp();
        }
    }
    public PowerDown(): void {
        this.powerDelay = 0;
        this.isPoweredUp = false;
        this.tileType.onUnpowered(this);
        
        let unpoweredVersionOfTile = this.tileType.unpoweredTile;
        if (unpoweredVersionOfTile) {
            this.layer.SetTile(this.tileX, this.tileY, unpoweredVersionOfTile);
        }
        this.powerValue = -1;

        if (this.layer === this.layer.map?.wireLayer) {
            this.layer.map?.mainLayer.GetTileByIndex(this.tileX, this.tileY).PowerDown();
        }
    }

    public Neighbors(): {dir: Direction, tile: LevelTile}[] {
        return Direction.All.map(d => ({dir: d, tile: this.layer.GetTileByIndex(this.tileX + d.x, this.tileY + d.y)})).filter(a => 
            a.tile.tileX >= 0 && a.tile.tileY >= 0 && a.tile.tileX < this.layer.tiles.length && a.tile.tileY < this.layer.tiles[0].length
        )
    }

    public Neighbor(dir: Direction): LevelTile {
        return this.layer.GetTileByIndex(this.tileX + dir.x, this.tileY + dir.y);
    }
}