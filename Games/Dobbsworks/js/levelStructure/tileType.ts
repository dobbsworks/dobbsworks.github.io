interface TileTypeChange {
    tileTypeName: string,
    delay: number
}

class TileType {
    constructor(
        public imageTile: ImageTile,
        public solidity: BaseSolidity,
        public key: string,
        public targetLayer: TargetLayer
    ) { }

    public isSwimmable: boolean = false;
    public isWaterfall: boolean = false;
    public isQuicksand: boolean = false;
    public isClimbable: boolean = false;
    public isBumper: boolean = false;
    public isHangable: boolean = false;
    public conveyorSpeed: number = 0; // positive = clockwise
    public drainsAir: boolean = false;
    public canWalkOn: boolean = true; //sticky honey blocks
    public isStickyWall: boolean = false;
    public isTrack: boolean = false;
    public isTrackCap: boolean = false;
    public trackEquation: (x: number, y: number) => { x: number, y: number } = (x: number, y: number) => ({ x: x, y: y });
    public trackCrossedEquation: (x1: number, y1: number, x2: number, y2: number) => boolean = (x1: number, y1: number, x2: number, y2: number) => false;
    public trackDirectionEquation: (x: number, y: number) => { dx: number, dy: number } = (x: number, y: number) => ({ dx: 0, dy: 0 });
    public trackCurveHorizontalDirection: -1 | 0 | 1 = 0;
    public trackCurveVerticalDirection: -1 | 0 | 1 = 0;
    // track equation maps based on ratio within block [0,1]=>[0,1]

    public isSlippery = false;

    public hurtOnSides: boolean = false;
    public hurtOnTop: boolean = false;
    public hurtOnBottom: boolean = false;
    public hurtOnOverlap: boolean = false; // other hurtOn props only activate on solid interaction
    public instaKill: boolean = false; //hurtOn causes full death instead of damage

    public pickUpSprite: SpriteType | null = null;
    public autoChange: TileTypeChange | null = null;
    public standChange: TileTypeChange | null = null;

    public requiredPowerDelay: number = 1;
    public canBePowered: boolean = false;
    public isPowerSource: boolean = false;
    public onPowered: (tile: LevelTile) => void = (tile: LevelTile) => { };
    public onUnpowered: (tile: LevelTile) => void = (tile: LevelTile) => { };

    public powerOutputDirection: Direction | null = null;
    public powerInputDirection: Direction | null = null;
    public calcPowerFromNeighbors: (neighbors: LevelTile[]) => number = CircuitHandler.NormalPowerCalc;
    public poweredTileName: string | null = null;
    public unpoweredTileName: string | null = null;
    public get poweredTile(): TileType | null {
        return this.poweredTileName ? (<any>TileType)[this.poweredTileName] : null;
    }
    public get unpoweredTile(): TileType | null {
        return this.unpoweredTileName ? (<any>TileType)[this.unpoweredTileName] : null;
    }

    public static TileMap: any = {};








    public static get Air(): TileType {
        return TileType.GetTileType("Air", "empty", 0, 0, Solidity.None, TargetLayer.main);
    }


    // public static RegisterSimpleTiles(keyBase: string, imageTile: ImageTile, solidity: BaseSolidity, targetLayer: TargetLayer, tiles: {x:number,y:number}[]): void {
    //     for (let tile of tiles) {

    //     }
    // }

    public static RegisterTiles(): void {
        //IMPORTANT
        // Order of tile registration must be constant, that's what sets ids
        // Only add new tiles to the end of this registration step
        TileType.Air;

        TileType.Dirt;
        TileType.DirtTile;
        TileType.RedBlock;
        TileType.GrassyTop;
        TileType.DirtBack;
        TileType.Ladder;
        TileType.SpikeBlock;
        TileType.Flower;
        TileType.RegisterSlope("Grassy", 0);

        TileType.Tree;
        TileType.Leaves;
        TileType.OrangeBlock;
        TileType.BranchTop;
        TileType.TreeBack;
        TileType.Vine;
        TileType.Thorns;
        TileType.Bush;
        TileType.RegisterSlope("Leafy", 1);

        TileType.SandyGround;
        TileType.Sandstone;
        TileType.YellowBlock;
        TileType.WoodPlank;
        TileType.SandyBack;
        TileType.RoughLadder;
        TileType.Cactus;
        TileType.Rock;
        TileType.RegisterSlope("Sandy", 2);

        TileType.GreenStone;
        TileType.RedGirder;
        TileType.GreenBlock;
        TileType.PinkTop;
        TileType.ScaleBack;
        TileType.MetalLadder;
        TileType.WaterZap;
        TileType.Kelp;
        TileType.RegisterSlope("GreenStone", 3);

        TileType.WoodPlanks;
        TileType.Crate;
        TileType.TealBlock;
        TileType.MetalPlate;
        TileType.BrownBack;
        TileType.Rigging;
        TileType.Spears;
        TileType.RopeRail;
        TileType.RegisterSlope("Plank", 4);

        TileType.BlueGround;
        TileType.PointyBlueBlock;
        TileType.CyanBlock;
        TileType.SnowTop;
        TileType.IceBack;
        TileType.RedLadder;
        TileType.Icicles;
        TileType.DangerSign;
        TileType.RegisterSlope("Blue", 5);

        TileType.PurpleGround;
        TileType.PurpleBrick;
        TileType.PurpleBlock;
        TileType.PurpleTop;
        TileType.PurplePillar;
        TileType.PurpleLadder;
        TileType.DeathBlock;
        TileType.Lantern;
        TileType.RegisterSlope("Purple", 6);

        TileType.PowerBlock;
        TileType.CircuitOn;
        TileType.ConveyorRightOn;
        TileType.Lock;
        TileType.CircuitOff;
        TileType.SlowCircuitOff;
        TileType.ConveyorLeftOff;
        TileType.ConveyorRightOff;
        TileType.Water;
        TileType.Waterfall;
        TileType.WaterSurface;

        TileType.DiodeRightOff;
        TileType.DiodeRightOn;
        TileType.DiodeDownOff;
        TileType.DiodeDownOn;
        TileType.DiodeLeftOff;
        TileType.DiodeLeftOn;
        TileType.DiodeUpOff;
        TileType.DiodeUpOn;

        TileType.AndGateRightOff;
        TileType.AndGateRightOn;
        TileType.AndGateDownOff;
        TileType.AndGateDownOn;
        TileType.AndGateLeftOff;
        TileType.AndGateLeftOn;
        TileType.AndGateUpOff;
        TileType.AndGateUpOn;

        TileType.InverterRightOff;
        TileType.InverterRightOn;
        TileType.InverterDownOff;
        TileType.InverterDownOn;
        TileType.InverterLeftOff;
        TileType.InverterLeftOn;
        TileType.InverterUpOff;
        TileType.InverterUpOn;

        TileType.AppearingBlockOff;
        TileType.AppearingBlockOn;
        TileType.DisappearingBlockOff;
        TileType.DisappearingBlockOn;

        TileType.ConveyorRight;
        TileType.ConveyorLeft;
        TileType.ConveyorRightFast;
        TileType.ConveyorLeftFast;

        TileType.Barrel;
        TileType.BubbleBlock1;
        TileType.Quicksand;
        TileType.CircuitCrossOff;
        TileType.CircuitCrossOn;

        TileType.HangingVine;
        TileType.HangingBars;
        TileType.CircuitHurtOff;
        TileType.CircuitHurtOn;
        TileType.CircuitHurtSolidOff;
        TileType.CircuitHurtSolidOn;

        TileType.PurpleWater;
        TileType.PurpleWaterSurface;
        TileType.Lava;
        TileType.LavaSurface;
        TileType.PoisonGas;
        TileType.Honey;
        TileType.HoneyLeft;
        TileType.HoneyRight;

        TileType.CircuitMusicOff;
        TileType.CircuitMusicOn;
        TileType.Pumpkin;

        TileType.WaterTapOff;
        TileType.WaterTapOn;
        TileType.PurpleWaterTapOff;
        TileType.PurpleWaterTapOn;
        TileType.LavaTapOff;
        TileType.LavaTapOn;
        TileType.Drain;

        TileType.InitialWaterLevel;
        TileType.InitialPurpleWaterLevel;
        TileType.InitialLavaLevel;

        TileType.ExtraSlowCircuitOff;


        TileType.MetalGround;
        TileType.MetalBrick;
        TileType.MetalBlock;
        TileType.MetalTop;
        TileType.MetalBack;
        TileType.ChainLadder;
        TileType.MetalSpikes;
        TileType.DecorChain;
        TileType.RegisterSlope("Metal", 7);

        TileType.TrackHorizontal;
        TileType.TrackVertical;
        TileType.TrackCurveDownRight;
        TileType.TrackCurveDownLeft;
        TileType.TrackCurveUpLeft;
        TileType.TrackCurveUpRight;
        TileType.TrackLeftCap;
        TileType.TrackTopCap;
        TileType.TrackRightCap;
        TileType.TrackBottomCap;

        TileType.CaveGround;
        TileType.CaveBrick;
        TileType.CaveBlock;
        TileType.CaveTop;
        TileType.CaveBack;
        TileType.CaveLadder;
        TileType.CaveSpikes;
        TileType.DecorCave;
        TileType.RegisterSlope("Cave", 8);

        TileType.Ice;
    }


    public static RegisterSlope(keyBase: string, tileRow: number): void {
        let colIter = 8;
        TileType.GetTileType(keyBase + "SteepSlopeUp", "terrain", colIter++, tileRow, Solidity.SteepSlopeUp, TargetLayer.main);
        TileType.GetTileType(keyBase + "SteepSlopeDown", "terrain", colIter++, tileRow, Solidity.SteepSlopeDown, TargetLayer.main);
        TileType.GetTileType(keyBase + "SteepCeilingDown", "terrain", colIter++, tileRow, Solidity.SteepCeilingDown, TargetLayer.main);
        TileType.GetTileType(keyBase + "SteepCeilingUp", "terrain", colIter++, tileRow, Solidity.SteepCeilingUp, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfSlopeUpLeft", "terrain", colIter++, tileRow, Solidity.HalfSlopeUpLeft, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfSlopeUpRight", "terrain", colIter++, tileRow, Solidity.HalfSlopeUpRight, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfSlopeDownLeft", "terrain", colIter++, tileRow, Solidity.HalfSlopeDownLeft, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfSlopeDownRight", "terrain", colIter++, tileRow, Solidity.HalfSlopeDownRight, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfCeilingUpLeft", "terrain", colIter++, tileRow, Solidity.HalfCeilingUpLeft, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfCeilingUpRight", "terrain", colIter++, tileRow, Solidity.HalfCeilingUpRight, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfCeilingDownLeft", "terrain", colIter++, tileRow, Solidity.HalfCeilingDownLeft, TargetLayer.main);
        TileType.GetTileType(keyBase + "HalfCeilingDownRight", "terrain", colIter++, tileRow, Solidity.HalfCeilingDownRight, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleSlopeUpLower", "terrain", colIter++, tileRow, Solidity.DoubleSlopeUpLower, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleSlopeUpUpper", "terrain", colIter++, tileRow, Solidity.DoubleSlopeUpUpper, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleSlopeDownUpper", "terrain", colIter++, tileRow, Solidity.DoubleSlopeDownUpper, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleSlopeDownLower", "terrain", colIter++, tileRow, Solidity.DoubleSlopeDownLower, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleCeilingUpUpper", "terrain", colIter++, tileRow, Solidity.DoubleCeilingUpUpper, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleCeilingUpLower", "terrain", colIter++, tileRow, Solidity.DoubleCeilingUpLower, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleCeilingDownLower", "terrain", colIter++, tileRow, Solidity.DoubleCeilingDownLower, TargetLayer.main);
        TileType.GetTileType(keyBase + "DoubleCeilingDownUpper", "terrain", colIter++, tileRow, Solidity.DoubleCeilingDownUpper, TargetLayer.main);
    }

    public static get Dirt(): TileType { return TileType.GetTileType("Dirt", "terrain", 0, 0, Solidity.Block, TargetLayer.main); }
    public static get DirtTile(): TileType { return TileType.GetTileType("DirtTile", "terrain", 1, 0, Solidity.Block, TargetLayer.main); }
    public static get RedBlock(): TileType { return TileType.GetTileType("RedBlock", "terrain", 2, 0, Solidity.Block, TargetLayer.main); }
    public static get GrassyTop(): TileType { return TileType.GetTileType("GrassyTop", "terrain", 3, 0, Solidity.Top, TargetLayer.semisolid); }
    public static get DirtBack(): TileType { return TileType.GetTileType("DirtBack", "terrain", 4, 0, Solidity.None, TargetLayer.backdrop); }
    public static get Ladder(): TileType { return TileType.GetTileType("Ladder", "terrain", 5, 0, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get SpikeBlock(): TileType {
        return TileType.GetTileType("SpikeBlock", "terrain", 6, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.hurtOnBottom = true; tileType.hurtOnTop = true; tileType.hurtOnSides = true;
        });
    }
    public static get Flower(): TileType { return TileType.GetTileType("Flower", "terrain", 7, 0, Solidity.None, TargetLayer.main); }

    public static get Tree(): TileType { return TileType.GetTileType("Tree", "terrain", 0, 1, Solidity.Block, TargetLayer.main); }
    public static get Leaves(): TileType { return TileType.GetTileType("Leaves", "terrain", 1, 1, Solidity.Block, TargetLayer.main); }
    public static get OrangeBlock(): TileType { return TileType.GetTileType("OrangeBlock", "terrain", 2, 1, Solidity.Block, TargetLayer.main); }
    public static get BranchTop(): TileType { return TileType.GetTileType("BranchTop", "terrain", 3, 1, Solidity.Top, TargetLayer.semisolid); }
    public static get TreeBack(): TileType { return TileType.GetTileType("TreeBack", "terrain", 4, 1, Solidity.None, TargetLayer.backdrop); }
    public static get Vine(): TileType { return TileType.GetTileType("Vine", "terrain", 5, 1, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get Thorns(): TileType {
        return TileType.GetTileType("Thorns", "terrain", 6, 1, Solidity.None, TargetLayer.main, tileType => {
            tileType.hurtOnOverlap = true;
        });
    }
    public static get Bush(): TileType { return TileType.GetTileType("Bush", "terrain", 7, 1, Solidity.None, TargetLayer.main); }

    public static get SandyGround(): TileType { return TileType.GetTileType("SandyGround", "terrain", 0, 2, Solidity.Block, TargetLayer.main); }
    public static get Sandstone(): TileType { return TileType.GetTileType("Sandstone", "terrain", 1, 2, Solidity.Block, TargetLayer.main); }
    public static get YellowBlock(): TileType { return TileType.GetTileType("YellowBlock", "terrain", 2, 2, Solidity.Block, TargetLayer.main); }
    public static get WoodPlank(): TileType { return TileType.GetTileType("WoodPlank", "terrain", 3, 2, Solidity.Top, TargetLayer.semisolid); }
    public static get SandyBack(): TileType { return TileType.GetTileType("SandyBack", "terrain", 4, 2, Solidity.None, TargetLayer.backdrop); }
    public static get RoughLadder(): TileType { return TileType.GetTileType("RoughLadder", "terrain", 5, 2, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get Cactus(): TileType {
        return TileType.GetTileType("Cactus", "terrain", 6, 2, Solidity.Block, TargetLayer.main, tileType => {
            tileType.hurtOnBottom = true; tileType.hurtOnTop = true; tileType.hurtOnSides = true;
        });
    }
    public static get Rock(): TileType { return TileType.GetTileType("Rock", "terrain", 7, 2, Solidity.None, TargetLayer.main); }

    public static get GreenStone(): TileType { return TileType.GetTileType("GreenStone", "terrain", 0, 3, Solidity.Block, TargetLayer.main); }
    public static get RedGirder(): TileType { return TileType.GetTileType("RedGirder", "terrain", 1, 3, Solidity.Block, TargetLayer.main); }
    public static get GreenBlock(): TileType { return TileType.GetTileType("GreenBlock", "terrain", 2, 3, Solidity.Block, TargetLayer.main); }
    public static get PinkTop(): TileType { return TileType.GetTileType("PinkTop", "terrain", 3, 3, Solidity.Top, TargetLayer.semisolid); }
    public static get ScaleBack(): TileType { return TileType.GetTileType("ScaleBack", "terrain", 4, 3, Solidity.None, TargetLayer.backdrop); }
    public static get MetalLadder(): TileType { return TileType.GetTileType("MetalLadder", "terrain", 5, 3, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get WaterZap(): TileType {
        return TileType.GetTileType("WaterZap", "terrain", 6, 3, Solidity.None, TargetLayer.main, tileType => {
            tileType.hurtOnOverlap = true;
        });
    }
    public static get Kelp(): TileType { return TileType.GetTileType("Kelp", "terrain", 7, 3, Solidity.None, TargetLayer.main); }

    public static get WoodPlanks(): TileType { return TileType.GetTileType("WoodPlanks", "terrain", 0, 4, Solidity.Block, TargetLayer.main); }
    public static get Crate(): TileType { return TileType.GetTileType("Crate", "terrain", 1, 4, Solidity.Block, TargetLayer.main); }
    public static get TealBlock(): TileType { return TileType.GetTileType("TealBlock", "terrain", 2, 4, Solidity.Block, TargetLayer.main); }
    public static get MetalPlate(): TileType { return TileType.GetTileType("MetalPlate", "terrain", 3, 4, Solidity.Top, TargetLayer.semisolid); }
    public static get BrownBack(): TileType { return TileType.GetTileType("BrownBack", "terrain", 4, 4, Solidity.None, TargetLayer.backdrop); }
    public static get Rigging(): TileType { return TileType.GetTileType("Rigging", "terrain", 5, 4, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get Spears(): TileType {
        return TileType.GetTileType("Spears", "terrain", 6, 4, Solidity.Top, TargetLayer.main, tileType => {
            tileType.hurtOnTop = true;
        });
    }
    public static get RopeRail(): TileType { return TileType.GetTileType("RopeRail", "terrain", 7, 4, Solidity.None, TargetLayer.main); }

    public static get BlueGround(): TileType { return TileType.GetTileType("BlueGround", "terrain", 0, 5, Solidity.Block, TargetLayer.main); }
    public static get PointyBlueBlock(): TileType { return TileType.GetTileType("PointyBlueBlock", "terrain", 1, 5, Solidity.Block, TargetLayer.main); }
    public static get CyanBlock(): TileType { return TileType.GetTileType("CyanBlock", "terrain", 2, 5, Solidity.Block, TargetLayer.main); }
    public static get SnowTop(): TileType { return TileType.GetTileType("SnowTop", "terrain", 3, 5, Solidity.Top, TargetLayer.semisolid); }
    public static get IceBack(): TileType { return TileType.GetTileType("IceBack", "terrain", 4, 5, Solidity.None, TargetLayer.backdrop); }
    public static get RedLadder(): TileType { return TileType.GetTileType("RedLadder", "terrain", 5, 5, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get Icicles(): TileType {
        return TileType.GetTileType("Icicles", "terrain", 6, 5, Solidity.Block, TargetLayer.main, tileType => {
            tileType.hurtOnBottom = true; tileType.hurtOnSides = true;
        });
    }
    public static get DangerSign(): TileType { return TileType.GetTileType("DangerSign", "terrain", 7, 5, Solidity.None, TargetLayer.main); }

    public static get PurpleGround(): TileType { return TileType.GetTileType("PurpleGround", "terrain", 0, 6, Solidity.Block, TargetLayer.main); }
    public static get PurpleBrick(): TileType { return TileType.GetTileType("PurpleBrick", "terrain", 1, 6, Solidity.Block, TargetLayer.main); }
    public static get PurpleBlock(): TileType { return TileType.GetTileType("PurpleBlock", "terrain", 2, 6, Solidity.Block, TargetLayer.main); }
    public static get PurpleTop(): TileType { return TileType.GetTileType("PurpleTop", "terrain", 3, 6, Solidity.Top, TargetLayer.semisolid); }
    public static get PurplePillar(): TileType { return TileType.GetTileType("PurplePillar", "terrain", 4, 6, Solidity.None, TargetLayer.backdrop); }
    public static get PurpleLadder(): TileType { return TileType.GetTileType("PurpleLadder", "terrain", 5, 6, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get DeathBlock(): TileType {
        return TileType.GetTileType("DeathBlock", "terrain", 6, 6, Solidity.Block, TargetLayer.main, tileType => {
            tileType.hurtOnBottom = true; tileType.hurtOnTop = true; tileType.hurtOnSides = true; tileType.instaKill = true;
        });
    }
    public static get Lantern(): TileType { return TileType.GetTileType("Lantern", "terrain", 7, 6, Solidity.None, TargetLayer.main); }

    public static get MetalGround(): TileType { return TileType.GetTileType("MetalGround", "terrain", 0, 7, Solidity.Block, TargetLayer.main); }
    public static get MetalBrick(): TileType { return TileType.GetTileType("MetalBrick", "terrain", 1, 7, Solidity.Block, TargetLayer.main); }
    public static get MetalBlock(): TileType { return TileType.GetTileType("MetalBlock", "terrain", 2, 7, Solidity.Block, TargetLayer.main); }
    public static get MetalTop(): TileType { return TileType.GetTileType("MetalTop", "terrain", 3, 7, Solidity.Top, TargetLayer.semisolid); }
    public static get MetalBack(): TileType { return TileType.GetTileType("MetalBack", "terrain", 4, 7, Solidity.None, TargetLayer.backdrop); }
    public static get ChainLadder(): TileType { return TileType.GetTileType("ChainLadder", "terrain", 5, 7, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get MetalSpikes(): TileType {
        return TileType.GetTileType("MetalSpikes", "terrain", 6, 7, Solidity.Block, TargetLayer.main, tileType => {
            tileType.hurtOnTop = true;
        });
    }
    public static get DecorChain(): TileType { return TileType.GetTileType("DecorChain", "terrain", 7, 7, Solidity.None, TargetLayer.main); }


    public static get CaveGround(): TileType { return TileType.GetTileType("CaveGround", "terrain", 0, 8, Solidity.Block, TargetLayer.main); }
    public static get CaveBrick(): TileType { return TileType.GetTileType("CaveBrick", "terrain", 1, 8, Solidity.Block, TargetLayer.main); }
    public static get CaveBlock(): TileType { return TileType.GetTileType("CaveBlock", "terrain", 2, 8, Solidity.Block, TargetLayer.main); }
    public static get CaveTop(): TileType { return TileType.GetTileType("CaveTop", "terrain", 3, 8, Solidity.Top, TargetLayer.semisolid); }
    public static get CaveBack(): TileType { return TileType.GetTileType("CaveBack", "terrain", 4, 8, Solidity.None, TargetLayer.backdrop); }
    public static get CaveLadder(): TileType { return TileType.GetTileType("CaveLadder", "terrain", 5, 8, Solidity.None, TargetLayer.main, tileType => { tileType.isClimbable = true; }); }
    public static get CaveSpikes(): TileType {
        return TileType.GetTileType("CaveSpikes", "terrain", 6, 8, Solidity.Block, TargetLayer.main, tileType => {
            tileType.hurtOnBottom = true; tileType.hurtOnTop = true; tileType.hurtOnSides = true;
        });
    }
    public static get DecorCave(): TileType { return TileType.GetTileType("DecorCave", "terrain", 7, 8, Solidity.None, TargetLayer.main); }




    public static get Bridge(): TileType {
        return TileType.GetTileType("Bridge", "terrain", 2, 3, Solidity.Top, TargetLayer.semisolid);
    }

    public static get Bumper(): TileType {
        return TileType.GetTileType("Bumper", "bumper", 0, 0, Solidity.None, TargetLayer.main, tileType => {
            tileType.isBumper = true;
        });
    }

    public static get PurpleWater(): TileType {
        return TileType.GetTileType("PurpleWater", "water", 0, 3, Solidity.None, TargetLayer.water, tileType => {
            tileType.isSwimmable = true;
            tileType.drainsAir = true;
        });
    }

    public static get PurpleWaterSurface(): AnimatedTileType {
        return TileType.GetAnimatedTileType("PurpleWaterSurface", "water", [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }], 10, Solidity.None, TargetLayer.water);
    }

    public static get PoisonGas(): TileType {
        return TileType.GetAnimatedTileType("PoisonGas", "water", [{ x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }], 35, Solidity.None, TargetLayer.water, tileType => {
            tileType.drainsAir = true;
        });
    }

    public static get Honey(): TileType {
        return TileType.GetTileType("Honey", "water", 4, 2, Solidity.Top, TargetLayer.semisolid, (tileType: TileType) => {
            tileType.imageTile.yOffset = -2;
            tileType.canWalkOn = false;
        })
    }

    public static get HoneyLeft(): TileType {
        return TileType.GetTileType("HoneyLeft", "water", 5, 2, Solidity.LeftWall, TargetLayer.semisolid, (tileType: TileType) => {
            tileType.imageTile.xOffset = 8;
            tileType.isStickyWall = true;
        })
    }

    public static get HoneyRight(): TileType {
        return TileType.GetTileType("HoneyRight", "water", 6, 2, Solidity.RightWall, TargetLayer.semisolid, (tileType: TileType) => {
            tileType.imageTile.xOffset = -8;
            tileType.isStickyWall = true;
        })
    }

    public static get Lava(): TileType {
        return TileType.GetTileType("Lava", "water", 0, 5, Solidity.None, TargetLayer.water, tileType => {
            tileType.hurtOnOverlap = true;
        });
    }

    public static get LavaSurface(): AnimatedTileType {
        return TileType.GetAnimatedTileType("LavaSurface", "water", [{ x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }], 20, Solidity.None, TargetLayer.water);
    }

    public static get Water(): TileType {
        return TileType.GetTileType("Water", "water", 0, 0, Solidity.None, TargetLayer.water, tileType => {
            tileType.isSwimmable = true;
        });
    }

    public static get WaterSurface(): AnimatedTileType {
        return TileType.GetAnimatedTileType("WaterSurface", "water", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }], 10, Solidity.None, TargetLayer.water);
    }

    public static get Waterfall(): AnimatedTileType {
        return TileType.GetAnimatedTileType("Waterfall", "water", [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], 10, Solidity.None, TargetLayer.water, tileType => {
            tileType.isSwimmable = true;
            tileType.isWaterfall = true;
        });
    }

    public static get Quicksand(): AnimatedTileType {
        return TileType.GetAnimatedTileType("Quicksand", "water", [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }], 20, Solidity.None, TargetLayer.water, tileType => {
            tileType.isQuicksand = true;
        });
    }



    public static get Lock(): TileType {
        return TileType.GetTileType("Lock", "misc", 3, 2, Solidity.Block, TargetLayer.main);
    }

    public static get Ice(): TileType {
        return TileType.GetTileType("Ice", "misc", 2, 2, Solidity.Block, TargetLayer.main, tileType => {
            tileType.isSlippery = true;
        });
    }


    public static get ConveyorRightOn(): AnimatedTileType {
        return TileType.GetAnimatedTileType("ConveyorRightOn", "conveyor", [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], 2.5, Solidity.Block, TargetLayer.main, tileType => {
            tileType.conveyorSpeed = 0.4;
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "ConveyorRightOff"
        });
    }
    public static get ConveyorRightOff(): TileType {
        return TileType.GetTileType("ConveyorRightOff", "conveyor", 0, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "ConveyorRightOn";
        });
    }


    public static get ConveyorLeftOn(): AnimatedTileType {
        return TileType.GetAnimatedTileType("ConveyorLeftOn", "conveyor", [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }], 2.5, Solidity.Block, TargetLayer.main, tileType => {
            tileType.conveyorSpeed = -0.4;
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "ConveyorLeftOff"
        });
    }
    public static get ConveyorLeftOff(): TileType {
        return TileType.GetTileType("ConveyorLeftOff", "conveyor", 0, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "ConveyorLeftOn";
        });
    }


    public static get PowerBlock(): TileType {
        return TileType.GetTileType("PowerBlock", "wire", 2, 0, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.canBePowered = true;
            tileType.isPowerSource = true;
        });
    }

    public static get CircuitOff(): TileType {
        return TileType.GetTileType("CircuitOff", "wire", 0, 0, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.poweredTileName = "CircuitOn";
            tileType.canBePowered = true;
        });
    }

    public static get CircuitOn(): TileType {
        return TileType.GetTileType("CircuitOn", "wire", 1, 0, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.unpoweredTileName = "CircuitOff";
            tileType.canBePowered = true;
        });
    }

    public static get CircuitCrossOff(): TileType {
        return TileType.GetTileType("CircuitCrossOff", "wire", 4, 0, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.poweredTileName = "CircuitCrossOn";
            tileType.canBePowered = true;
        });
    }

    public static get CircuitCrossOn(): TileType {
        return TileType.GetTileType("CircuitCrossOn", "wire", 5, 0, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.unpoweredTileName = "CircuitCrossOff";
            tileType.canBePowered = true;
        });
    }

    public static get SlowCircuitOff(): TileType {
        return TileType.GetTileType("SlowCircuitOff", "wire", 0, 1, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.poweredTileName = "SlowCircuitOn";
            tileType.requiredPowerDelay = 15;
            tileType.canBePowered = true;
        });
    }

    public static get SlowCircuitOn(): TileType {
        return TileType.GetTileType("SlowCircuitOn", "wire", 1, 1, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.unpoweredTileName = "SlowCircuitOff";
            tileType.requiredPowerDelay = 15;
            tileType.canBePowered = true;
        });
    }

    public static get ExtraSlowCircuitOff(): TileType {
        return TileType.GetTileType("ExtraSlowCircuitOff", "wire", 8, 3, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.poweredTileName = "ExtraSlowCircuitOn";
            tileType.requiredPowerDelay = 60;
            tileType.canBePowered = true;
        });
    }

    public static get ExtraSlowCircuitOn(): TileType {
        return TileType.GetTileType("ExtraSlowCircuitOn", "wire", 9, 3, Solidity.Block, TargetLayer.wire, tileType => {
            tileType.unpoweredTileName = "ExtraSlowCircuitOff";
            tileType.requiredPowerDelay = 60;
            tileType.canBePowered = true;
        });
    }

    public static get CircuitHurtOff(): TileType {
        return TileType.GetTileType("CircuitHurtOff", "wire", 6, 0, Solidity.None, TargetLayer.wire, tileType => {
            tileType.poweredTileName = "CircuitHurtOn";
            tileType.canBePowered = true;
        });
    }

    public static get CircuitHurtOn(): TileType {
        return TileType.GetAnimatedTileType("CircuitHurtOn", "wire", [{ x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }], 2, Solidity.None, TargetLayer.wire, tileType => {
            tileType.unpoweredTileName = "CircuitHurtOff";
            tileType.canBePowered = true;
            tileType.hurtOnOverlap = true;
        });
    }

    public static get CircuitMusicOff(): TileType {
        return TileType.GetTileType("CircuitMusicOff", "wire", 8, 2, Solidity.None, TargetLayer.wire, tileType => {
            tileType.poweredTileName = "CircuitMusicOn";
            tileType.canBePowered = true;
            tileType.onPowered = (tile) => {
                let overlapped = tile.GetMainNeighbor()?.tileType || TileType.Air;

                // TODO - different overlap tiles map to different music sounds
                console.log(tile.tileY)
                let instrumentSegments = 25;
                let segmentIndex = instrumentSegments - tile.tileY % instrumentSegments;
                audioHandler.PlaySegment("instrument-square", segmentIndex);
            }
        });
    }

    public static get CircuitMusicOn(): TileType {
        return TileType.GetTileType("CircuitMusicOn", "wire", 9, 2, Solidity.None, TargetLayer.wire, tileType => {
            tileType.unpoweredTileName = "CircuitMusicOff";
            tileType.canBePowered = true;
        });
    }

    public static get CircuitHurtSolidOff(): TileType {
        return TileType.GetTileType("CircuitHurtSolidOff", "wire", 6, 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.poweredTileName = "CircuitHurtSolidOn";
            tileType.canBePowered = true;
        });
    }

    public static get CircuitHurtSolidOn(): TileType {
        return TileType.GetAnimatedTileType("CircuitHurtSolidOn", "wire", [{ x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }], 2, Solidity.Block, TargetLayer.main, tileType => {
            tileType.unpoweredTileName = "CircuitHurtSolidOff";
            tileType.canBePowered = true;
            tileType.hurtOnBottom = true;
            tileType.hurtOnSides = true;
            tileType.hurtOnTop = true;
        });
    }


    private static GetDiode(direction: Direction, artX: number, isOn: boolean): TileType {
        return TileType.GetTileType(`Diode${direction.name}${isOn ? "On" : "Off"}`, "wire", artX, 2, Solidity.Block, TargetLayer.wire, tileType => {
            if (isOn) tileType.unpoweredTileName = `Diode${direction.name}Off`;
            if (!isOn) tileType.poweredTileName = `Diode${direction.name}On`;
            tileType.powerOutputDirection = direction;
            tileType.powerInputDirection = direction.Opposite();
            tileType.canBePowered = true;
            tileType.calcPowerFromNeighbors = CircuitHandler.DiodePowerCalc;
        });
    }
    public static get DiodeRightOff(): TileType { return TileType.GetDiode(Direction.Right, 0, false); }
    public static get DiodeRightOn(): TileType { return TileType.GetDiode(Direction.Right, 1, true); }
    public static get DiodeDownOff(): TileType { return TileType.GetDiode(Direction.Down, 2, false); }
    public static get DiodeDownOn(): TileType { return TileType.GetDiode(Direction.Down, 3, true); }
    public static get DiodeLeftOff(): TileType { return TileType.GetDiode(Direction.Left, 4, false); }
    public static get DiodeLeftOn(): TileType { return TileType.GetDiode(Direction.Left, 5, true); }
    public static get DiodeUpOff(): TileType { return TileType.GetDiode(Direction.Up, 6, false); }
    public static get DiodeUpOn(): TileType { return TileType.GetDiode(Direction.Up, 7, true); }


    private static GetAndGate(direction: Direction, artX: number, isOn: boolean): TileType {
        return TileType.GetTileType(`AndGate${direction.name}${isOn ? "On" : "Off"}`, "wire", artX, 3, Solidity.Block, TargetLayer.wire, tileType => {
            if (isOn) tileType.unpoweredTileName = `AndGate${direction.name}Off`;
            if (!isOn) tileType.poweredTileName = `AndGate${direction.name}On`;
            tileType.powerOutputDirection = direction;
            tileType.calcPowerFromNeighbors = CircuitHandler.AndGatePowerCalc;
            tileType.canBePowered = true;
        });
    }
    public static get AndGateRightOff(): TileType { return TileType.GetAndGate(Direction.Right, 0, false); }
    public static get AndGateRightOn(): TileType { return TileType.GetAndGate(Direction.Right, 1, true); }
    public static get AndGateDownOff(): TileType { return TileType.GetAndGate(Direction.Down, 2, false); }
    public static get AndGateDownOn(): TileType { return TileType.GetAndGate(Direction.Down, 3, true); }
    public static get AndGateLeftOff(): TileType { return TileType.GetAndGate(Direction.Left, 4, false); }
    public static get AndGateLeftOn(): TileType { return TileType.GetAndGate(Direction.Left, 5, true); }
    public static get AndGateUpOff(): TileType { return TileType.GetAndGate(Direction.Up, 6, false); }
    public static get AndGateUpOn(): TileType { return TileType.GetAndGate(Direction.Up, 7, true); }


    private static GetInverter(direction: Direction, artX: number, isOn: boolean): TileType {
        return TileType.GetTileType(`Inverter${direction.name}${isOn ? "On" : "Off"}`, "wire", artX, 4, Solidity.Block, TargetLayer.wire, tileType => {
            if (isOn) tileType.unpoweredTileName = `Inverter${direction.name}Off`;
            if (!isOn) tileType.poweredTileName = `Inverter${direction.name}On`;
            tileType.powerOutputDirection = direction;
            tileType.powerInputDirection = direction.Opposite();
            tileType.calcPowerFromNeighbors = CircuitHandler.InverterPowerCalc;
            tileType.canBePowered = true;
        });
    }
    public static get InverterRightOff(): TileType { return TileType.GetInverter(Direction.Right, 0, false); }
    public static get InverterRightOn(): TileType { return TileType.GetInverter(Direction.Right, 1, true); }
    public static get InverterDownOff(): TileType { return TileType.GetInverter(Direction.Down, 2, false); }
    public static get InverterDownOn(): TileType { return TileType.GetInverter(Direction.Down, 3, true); }
    public static get InverterLeftOff(): TileType { return TileType.GetInverter(Direction.Left, 4, false); }
    public static get InverterLeftOn(): TileType { return TileType.GetInverter(Direction.Left, 5, true); }
    public static get InverterUpOff(): TileType { return TileType.GetInverter(Direction.Up, 6, false); }
    public static get InverterUpOn(): TileType { return TileType.GetInverter(Direction.Up, 7, true); }



    public static get AppearingBlockOff(): TileType {
        return TileType.GetTileType("AppearingBlockOff", "wire", 2, 1, Solidity.None, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "AppearingBlockOn"
        });
    }
    public static get AppearingBlockOn(): TileType {
        return TileType.GetTileType("AppearingBlockOn", "wire", 3, 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "AppearingBlockOff";
        });
    }

    public static get DisappearingBlockOff(): TileType {
        return TileType.GetTileType("DisappearingBlockOff", "wire", 4, 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "DisappearingBlockOn"
        });
    }
    public static get DisappearingBlockOn(): TileType {
        return TileType.GetTileType("DisappearingBlockOn", "wire", 5, 1, Solidity.None, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "DisappearingBlockOff";
        });
    }


    public static get ConveyorRight(): AnimatedTileType {
        return TileType.GetAnimatedTileType("ConveyorRight", "conveyor", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], 2.5, Solidity.Block, TargetLayer.main, tileType => {
            tileType.conveyorSpeed = 0.4;
        });
    }
    public static get ConveyorLeft(): AnimatedTileType {
        return TileType.GetAnimatedTileType("ConveyorLeft", "conveyor", [{ x: 0, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], 2.5, Solidity.Block, TargetLayer.main, tileType => {
            tileType.conveyorSpeed = -0.4;
        });
    }

    public static get ConveyorRightFast(): AnimatedTileType {
        return TileType.GetAnimatedTileType("ConveyorRightFast", "conveyor", [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }], 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.conveyorSpeed = 1;
        });
    }
    public static get ConveyorLeftFast(): AnimatedTileType {
        return TileType.GetAnimatedTileType("ConveyorLeftFast", "conveyor", [{ x: 0, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }], 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.conveyorSpeed = -1;
        });
    }


    public static get WaterTapOff(): TileType {
        return TileType.GetTileType("WaterTapOff", "pipes", 0, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "WaterTapOn"
            tileType.onPowered = (tile: LevelTile) => { tile.layer.map?.waterLevel.AddFlowSource(tile); }
        });
    }
    public static get WaterTapOn(): TileType {
        return TileType.GetTileType("WaterTapOn", "pipes", 1, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "WaterTapOff"
            tileType.onUnpowered = (tile: LevelTile) => { tile.layer.map?.waterLevel.RemoveFlowSource(tile); }
        });
    }

    public static get PurpleWaterTapOff(): TileType {
        return TileType.GetTileType("PurpleWaterTapOff", "pipes", 2, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "PurpleWaterTapOn"
            tileType.onPowered = (tile: LevelTile) => { tile.layer.map?.purpleWaterLevel.AddFlowSource(tile); }
        });
    }
    public static get PurpleWaterTapOn(): TileType {
        return TileType.GetTileType("PurpleWaterTapOn", "pipes", 3, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "PurpleWaterTapOff"
            tileType.onUnpowered = (tile: LevelTile) => { tile.layer.map?.purpleWaterLevel.RemoveFlowSource(tile); }
        });
    }

    public static get LavaTapOff(): TileType {
        return TileType.GetTileType("LavaTapOff", "pipes", 4, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.poweredTileName = "LavaTapOn"
            tileType.onPowered = (tile: LevelTile) => { tile.layer.map?.lavaLevel.AddFlowSource(tile); }
        });
    }
    public static get LavaTapOn(): TileType {
        return TileType.GetTileType("LavaTapOn", "pipes", 5, 0, Solidity.Block, TargetLayer.main, tileType => {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "LavaTapOff"
            tileType.onUnpowered = (tile: LevelTile) => { tile.layer.map?.lavaLevel.RemoveFlowSource(tile); }
        });
    }
    public static get Drain(): TileType {
        return TileType.GetTileType("Drain", "pipes", 0, 2, Solidity.None, TargetLayer.main, tileType => {
        });
    }

    public static get InitialWaterLevel(): TileType {
        return TileType.GetTileType("InitialWaterLevel", "waterChanger", 0, 0, Solidity.None, TargetLayer.main, tileType => { });
    }
    public static get InitialPurpleWaterLevel(): TileType {
        return TileType.GetTileType("InitialPurpleWaterLevel", "waterChanger", 0, 1, Solidity.None, TargetLayer.main, tileType => { });
    }
    public static get InitialLavaLevel(): TileType {
        return TileType.GetTileType("InitialLavaLevel", "waterChanger", 0, 2, Solidity.None, TargetLayer.main, tileType => { });
    }



    public static get Barrel(): AnimatedTileType {
        let frames = [];
        for (let i = 0; i < 120; i++) {
            frames.push({ x: 0, y: 0 });
        }
        for (let i = 1; i <= 7; i++) {
            frames.push({ x: i, y: 0 }, { x: i, y: 0 });
        }
        frames.push({ x: 0, y: 0 });
        return TileType.GetAnimatedTileType("Barrel", "barrel", frames, 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.pickUpSprite = Barrel;
        });
    }

    public static get Pumpkin(): AnimatedTileType {
        let frames = [];
        for (let i = 0; i < 120; i++) {
            frames.push({ x: 0, y: 0 });
        }
        for (let i = 1; i <= 7; i++) {
            frames.push({ x: i, y: 0 }, { x: i, y: 0 });
        }
        frames.push({ x: 0, y: 0 });
        return TileType.GetAnimatedTileType("Pumpkin", "pumpkin", frames, 1, Solidity.Block, TargetLayer.main, tileType => {
            tileType.pickUpSprite = Pumpkin;
        });
    }


    // tiles can have a "auto-change" tile type and time
    // layer manages list of tiles that are changing, something has to add it to the list
    // meanwhile player standingon triggers a separate change tiletype/timer
    // bubbleblocks 1-4 change based on standing timer
    // bubbleblock5 reverts to 1 with autotimer

    public static get BubbleBlock1(): AnimatedTileType { return TileType.CreateBubbleBlock(1); }
    public static get BubbleBlock2(): AnimatedTileType { return TileType.CreateBubbleBlock(2); }
    public static get BubbleBlock3(): AnimatedTileType { return TileType.CreateBubbleBlock(3); }
    public static get BubbleBlock4(): AnimatedTileType { return TileType.CreateBubbleBlock(4); }
    public static get BubbleBlock5(): AnimatedTileType { return TileType.CreateBubbleBlock(5); }
    public static CreateBubbleBlock(blockNum: number): AnimatedTileType {
        return TileType.GetAnimatedTileType("BubbleBlock" + blockNum, "bubbleBlock", [{ x: blockNum - 1, y: 0 }, { x: blockNum - 1, y: 1 }], 30, 
            blockNum == 5 ? Solidity.None : Solidity.Block, TargetLayer.main, tileType => {
            if (blockNum == 1) {
                tileType.standChange = {
                    tileTypeName: ("BubbleBlock" + (blockNum + 1).toString()),
                    delay: 0
                }
            } else if (blockNum == 5) {
                tileType.autoChange = {
                    tileTypeName: "BubbleBlock1",
                    delay: 180
                }
            } else {
                tileType.autoChange = {
                    tileTypeName: ("BubbleBlock" + (blockNum + 1).toString()),
                    delay: 30
                }
            }
        });
    }


    public static get HangingVine(): TileType {
        return TileType.GetTileType("HangingVine", "hanging", 0, 0, Solidity.Bottom, TargetLayer.semisolid, (tileType: TileType) => {
            tileType.imageTile.yOffset = 3;
            tileType.isHangable = true;
        })
    }
    public static get HangingBars(): TileType {
        return TileType.GetTileType("HangingBars", "hanging", 1, 0, Solidity.Bottom, TargetLayer.semisolid, (tileType: TileType) => {
            tileType.imageTile.yOffset = 3;
            tileType.isHangable = true;
        })
    }


    public static get TrackHorizontal(): TileType {
        return TileType.GetTileType("TrackHorizontal", "motorTrack", 2, 0, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = (x, y) => ({ x: x, y: 0.5 });
            tileType.trackCrossedEquation = (x1, y1, x2, y2) => (y1 >= 0.5 && y2 <= 0.5) || (y1 <= 0.5 && y2 >= 0.5);
            tileType.trackDirectionEquation = (x, y) => ({ dx: 1, dy: 0 });
            // track direction equation assumes traveling clock-wise from bottom-right
        })
    }
    public static get TrackVertical(): TileType {
        return TileType.GetTileType("TrackVertical", "motorTrack", 3, 0, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = (x, y) => ({ x: 0.5, y: y });
            tileType.trackCrossedEquation = (x1, y1, x2, y2) => (x1 >= 0.5 && x2 <= 0.5) || (x1 <= 0.5 && x2 >= 0.5);
            tileType.trackDirectionEquation = (x, y) => ({ dx: 0, dy: -1 });
        })
    }
    static GetCurveTrackEquation(innerXDirection: -1 | 1, innerYDirection: -1 | 1): (x: number, y: number) => { x: number, y: number } {
        let centerX = (innerXDirection + 1) / 2;
        let centerY = (innerYDirection + 1) / 2;
        return (x, y) => {
            if (x == centerX && y == centerY) return { x: centerX, y: centerY };
            //console.log("trackEquation inputs", x,y)
            if (innerXDirection == 1) x = 1 - x;
            if (innerYDirection == 1) y = 1 - y;

            let theta = Math.atan2(y, x);
            let retX = 0.5 * Math.cos(theta);
            let retY = 0.5 * Math.sin(theta);
            if (innerXDirection == 1) retX = 1 - retX;
            if (innerYDirection == 1) retY = 1 - retY;

            //console.log("trackEquation output", retX, retY)
            return ({ x: retX, y: retY })
        };
    }
    static GetCurveTrackCrossedEquation(innerXDirection: -1 | 1, innerYDirection: -1 | 1): (x1: number, y1: number, x2: number, y2: number) => boolean {
        let centerX = (innerXDirection + 1) / 2;
        let centerY = (innerYDirection + 1) / 2;
        return (x1: number, y1: number, x2: number, y2: number) => {
            let r1 = Math.sqrt((x1 - centerX) ** 2 + (y1 - centerY) ** 2);
            let r2 = Math.sqrt((x2 - centerX) ** 2 + (y2 - centerY) ** 2);
            return (r1 >= 0.5 && r2 <= 0.5) || (r1 <= 0.5 && r2 >= 0.5);
        }
    }
    static GetCurveTrackDirectionEquation(innerXDirection: -1 | 1, innerYDirection: -1 | 1): (x: number, y: number) => { dx: number, dy: number } {
        let centerX = (innerXDirection + 1) / 2;
        let centerY = (innerYDirection + 1) / 2;
        return (x, y) => {
            if (x == centerX && y == centerY) return { dx: 0, dy: 0 };

            //console.log(x,y)
            if (innerXDirection == 1) x = 1 - x;
            if (innerYDirection == 1) y = 1 - y;

            let theta = Math.atan2(y, x);
            theta -= Math.PI / 2;

            //console.log("speedtheta degrees",theta / 2 / Math.PI * 360)
            let retX = 0.5 * Math.cos(theta);
            let retY = 0.5 * Math.sin(theta);
            if (innerXDirection == 1) retX = 1 - retX;
            if (innerYDirection == 1) retY = 1 - retY;

            return ({ dx: retX, dy: retY })
        };
    }
    public static get TrackCurveDownRight(): TileType {
        return TileType.GetTileType("TrackCurveDownRight", "motorTrack", 0, 1, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = TileType.GetCurveTrackEquation(1, 1);
            tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(1, 1);
            tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(1, 1);
            tileType.trackCurveHorizontalDirection = 1;
            tileType.trackCurveVerticalDirection = 1;
        })
    }
    public static get TrackCurveDownLeft(): TileType {
        return TileType.GetTileType("TrackCurveDownLeft", "motorTrack", 1, 1, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = TileType.GetCurveTrackEquation(-1, 1);
            tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(-1, 1);
            tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(-1, 1);
            tileType.trackCurveHorizontalDirection = -1;
            tileType.trackCurveVerticalDirection = 1;
        })
    }
    public static get TrackCurveUpLeft(): TileType {
        return TileType.GetTileType("TrackCurveUpLeft", "motorTrack", 2, 1, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = TileType.GetCurveTrackEquation(-1, -1);
            tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(-1, -1);
            tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(-1, -1);
            tileType.trackCurveHorizontalDirection = -1;
            tileType.trackCurveVerticalDirection = -1;
        })
    }
    public static get TrackCurveUpRight(): TileType {
        return TileType.GetTileType("TrackCurveUpRight", "motorTrack", 3, 1, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = TileType.GetCurveTrackEquation(1, -1);
            tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(1, -1);
            tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(1, -1);
            tileType.trackCurveHorizontalDirection = 1;
            tileType.trackCurveVerticalDirection = -1;
        })
    }
    public static get TrackLeftCap(): TileType {
        return TileType.GetTileType("TrackLeftCap", "motorTrack", 0, 2, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = (x, y) => ({ x: Math.max(x, 0.5), y: 0.5 });
            tileType.trackCrossedEquation = (x1, y1, x2, y2) => ((y1 >= 0.5 && y2 <= 0.5) || (y1 <= 0.5 && y2 >= 0.5)) && x1 >= 0.5 && x2 >= 0.5;
            tileType.trackDirectionEquation = (x, y) => ({ dx: 1, dy: 0 });
            tileType.isTrackCap = true;
        })
    }
    public static get TrackTopCap(): TileType {
        return TileType.GetTileType("TrackTopCap", "motorTrack", 1, 2, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = (x, y) => ({ x: 0.5, y: Math.max(y, 0.5) });
            tileType.trackCrossedEquation = (x1, y1, x2, y2) => ((x1 >= 0.5 && x2 <= 0.5) || (x1 <= 0.5 && x2 >= 0.5)) && y1 >= 0.5 && y2 >= 0.5;
            tileType.trackDirectionEquation = (x, y) => ({ dx: 0, dy: -1 });
            tileType.isTrackCap = true;
        })
    }
    public static get TrackRightCap(): TileType {
        return TileType.GetTileType("TrackRightCap", "motorTrack", 2, 2, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = (x, y) => ({ x: Math.min(x, 0.5), y: 0.5 });
            tileType.trackCrossedEquation = (x1, y1, x2, y2) => ((y1 >= 0.5 && y2 <= 0.5) || (y1 <= 0.5 && y2 >= 0.5)) && x1 <= 0.5 && x2 <= 0.5;
            tileType.trackDirectionEquation = (x, y) => ({ dx: 1, dy: 0 });
            tileType.isTrackCap = true;
        })
    }
    public static get TrackBottomCap(): TileType {
        return TileType.GetTileType("TrackBottomCap", "motorTrack", 3, 2, Solidity.None, TargetLayer.wire, (tileType: TileType) => {
            tileType.isTrack = true;
            tileType.trackEquation = (x, y) => ({ x: 0.5, y: Math.min(y, 0.5) });
            tileType.trackCrossedEquation = (x1, y1, x2, y2) => ((x1 >= 0.5 && x2 <= 0.5) || (x1 <= 0.5 && x2 >= 0.5)) && y1 <= 0.5 && y2 <= 0.5;
            tileType.trackDirectionEquation = (x, y) => ({ dx: 0, dy: -1 });
            tileType.isTrackCap = true;
        })
    }


    private static GetTileType(key: string, imageName: string, x: number, y: number, solidity: BaseSolidity, targetLayer: TargetLayer, extraRules: (tileType: TileType) => void = () => { }): TileType {
        let ret = TileType.TileMap[key];
        if (!ret) {
            let image = <ImageTile>(tiles[imageName][x][y]);
            ret = new TileType(image, solidity, key, targetLayer);
            extraRules(ret);
            TileType.TileMap[key] = ret;
        }
        return ret;
    }

    public static GetTileTypeFromKey(key: string): TileType {
        return TileType.TileMap[key];
    }

    private static GetAnimatedTileType(key: string, imageName: string, tileIndeces: { x: number, y: number }[], framesPerTile: number, solidity: BaseSolidity, targetLayer: TargetLayer, extraRules: (tileType: TileType) => void = () => { }): AnimatedTileType {
        let ret = TileType.TileMap[key];
        if (!ret) {
            let images = tileIndeces.map(a => <ImageTile>(tiles[imageName][a.x][a.y]));
            ret = new AnimatedTileType(images, solidity, targetLayer, framesPerTile, key);
            extraRules(ret);
            TileType.TileMap[key] = ret;
        }
        return ret;
    }
}

class AnimatedTileType extends TileType {
    constructor(
        public imageTiles: ImageTile[],
        public solidity: BaseSolidity,
        public targetLayer: TargetLayer,
        public framesPerTile: number,
        public key: string
    ) {
        super(imageTiles[0], solidity, key, targetLayer);
    }
}

enum TargetLayer {
    backdrop,
    water,
    main,
    semisolid,
    wire
}