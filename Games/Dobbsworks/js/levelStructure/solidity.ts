
class BaseSolidity {
    
    public IsSolidFromTop(spriteDirection: -1|1|0): boolean {
        // for red koopa style movement
        if (this == Solidity.None) return false;
        if (this == Solidity.Top) return true;
        if (this == Solidity.Block) return true;
        if (this == Solidity.SolidForNonplayer) return true;
        if (this instanceof SlopeSolidity) {
            if (spriteDirection == 0) return this.verticalSolidDirection == -1;
            return this.verticalSolidDirection == -1 || this.horizontalSolidDirection == -spriteDirection;
        }
        return false;
    }
}

class SlopeSolidity extends BaseSolidity {
    constructor(
        public slopeFunc: (x: number) => number,
        // slopefunc is for tile (0,0) ie top left tile of map
        public verticalSolidDirection: -1 | 1,
        public horizontalSolidDirection: -1 | 1,
        public absoluteSlope: number
    ) { super(); }

    GetSlopePoint(x: number, layer: LevelLayer, tile: LevelTile): number {
        let tileXPixel = tile.tileX * layer.tileWidth;
        let xRatioInTile = (x - tileXPixel) / layer.tileWidth;
        let yRatioInTile = this.slopeFunc(xRatioInTile);
        let yPixel = (yRatioInTile + tile.tileY) * layer.tileHeight
        return yPixel;
    }

    GetIsPointInSolidSide(x: number, y: number, layer: LevelLayer, tile: LevelTile) {
        let slopePoint = Utility.Round(this.GetSlopePoint(x, layer, tile));
        let testY = Utility.Round(y);
        if (this.verticalSolidDirection == -1) return slopePoint > testY;
        else return slopePoint < testY;
    }
}

class Solidity {
    public static Block = new BaseSolidity();
    public static SolidForPlayer = new BaseSolidity();
    public static SolidForNonplayer = new BaseSolidity();
    public static None = new BaseSolidity();
    public static Top = new BaseSolidity();
    public static Bottom = new BaseSolidity();
    public static LeftWall = new BaseSolidity();
    public static RightWall = new BaseSolidity();

    public static SteepSlopeUp = new SlopeSolidity(x => 1 - x, 1, 1, 1);
    public static SteepSlopeDown = new SlopeSolidity(x => x, 1, -1, 1);
    public static SteepCeilingUp = new SlopeSolidity(x => 1 - x, -1, -1, 1);
    public static SteepCeilingDown = new SlopeSolidity(x => x, -1, 1, 1);

    public static HalfSlopeUpLeft = new SlopeSolidity(x => 1 - x/2, 1, 1, 0.5);
    public static HalfSlopeUpRight = new SlopeSolidity(x => 0.5 - x/2, 1, 1, 0.5);
    public static HalfSlopeDownLeft = new SlopeSolidity(x => x/2, 1, -1, 0.5);
    public static HalfSlopeDownRight = new SlopeSolidity(x => x/2 + 0.5, 1, -1, 0.5);

    public static HalfCeilingUpLeft = new SlopeSolidity(x => 1 - x/2, -1, -1, 0.5);
    public static HalfCeilingUpRight = new SlopeSolidity(x => 0.5 - x/2, -1, -1, 0.5);
    public static HalfCeilingDownLeft = new SlopeSolidity(x => x/2, -1, 1, 0.5);
    public static HalfCeilingDownRight = new SlopeSolidity(x => x/2 + 0.5, -1, 1, 0.5);
    
    public static DoubleSlopeUpLower = new SlopeSolidity(x => 1 - 2 * x, 1, 1, 2);
    public static DoubleSlopeUpUpper = new SlopeSolidity(x => 2 - 2 * x, 1, 1, 2);
    public static DoubleSlopeDownUpper = new SlopeSolidity(x => 2 * x, 1, -1, 2);
    public static DoubleSlopeDownLower = new SlopeSolidity(x => 2 * x - 1, 1, -1, 2);
    
    public static DoubleCeilingUpUpper = new SlopeSolidity(x => 2 * x, -1, 1, 2);
    public static DoubleCeilingUpLower = new SlopeSolidity(x => 2 * x - 1, -1, 1, 2);
    public static DoubleCeilingDownLower = new SlopeSolidity(x => 1 - 2 * x, -1, -1, 2);
    public static DoubleCeilingDownUpper = new SlopeSolidity(x => 2 - 2 * x, -1, -1, 2);
}
