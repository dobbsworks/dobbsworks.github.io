"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TileType = /** @class */ (function () {
    function TileType(imageTile, solidity, key, targetLayer) {
        this.imageTile = imageTile;
        this.solidity = solidity;
        this.key = key;
        this.targetLayer = targetLayer;
        this.editorTile = null;
        this.isSwimmable = false;
        this.isWaterfall = false;
        this.isQuicksand = false;
        this.isClimbable = false;
        this.isHangable = false;
        this.conveyorSpeed = 0; // positive = clockwise
        this.windX = 0;
        this.windY = 0;
        this.drainsAir = false;
        this.canWalkOn = true; //sticky honey blocks
        this.canJumpFrom = true; //sticky slime blocks
        this.isFire = false;
        this.isStickyWall = false;
        this.isJumpWall = false;
        this.isWarpWall = false;
        this.isExemptFromSlime = false;
        this.trackDirections = [];
        this.isTrackPipe = false;
        this.isSlippery = false;
        this.hurtOnLeft = false;
        this.hurtOnRight = false;
        this.hurtOnTop = false;
        this.hurtOnBottom = false;
        this.hurtOnOverlap = false; // other hurtOn props only activate on solid interaction
        this.instaKill = false; //hurtOn causes full death instead of damage
        this.pickUpSprite = null;
        this.autoChange = null;
        this.standChange = null;
        this.shimmers = false;
        this.clockWiseRotationTileName = "";
        this.requiredPowerDelay = 1;
        this.canBePowered = false;
        this.isPowerSource = false;
        this.onPowered = function (tile) { };
        this.onUnpowered = function (tile) { };
        this.powerOutputDirection = null;
        this.powerInputDirection = null;
        this.calcPowerFromNeighbors = CircuitHandler.NormalPowerCalc;
        this.poweredTileName = null;
        this.unpoweredTileName = null;
    }
    Object.defineProperty(TileType.prototype, "poweredTile", {
        get: function () {
            return this.poweredTileName ? TileType[this.poweredTileName] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType.prototype, "unpoweredTile", {
        get: function () {
            return this.unpoweredTileName ? TileType[this.unpoweredTileName] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Air", {
        get: function () {
            return TileType.GetTileType("Air", "empty", 0, 0, Solidity.None, TargetLayer.main);
        },
        enumerable: false,
        configurable: true
    });
    // public static RegisterSimpleTiles(keyBase: string, imageTile: ImageTile, solidity: BaseSolidity, targetLayer: TargetLayer, tiles: {x:number,y:number}[]): void {
    //     for (let tile of tiles) {
    //     }
    // }
    TileType.RegisterTiles = function () {
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
        TileType.SpearsUp;
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
        TileType.OneWayRight;
        TileType.OneWayDown;
        TileType.OneWayLeft;
        TileType.OneWayUp;
        TileType.IceTop;
        TileType.ArrowRight;
        TileType.ArrowUpRight;
        TileType.ArrowUp;
        TileType.ArrowUpLeft;
        TileType.ArrowLeft;
        TileType.ArrowDownLeft;
        TileType.ArrowDown;
        TileType.ArrowDownRight;
        TileType.SolidForPlayer;
        TileType.SolidForNonplayer;
        TileType.SpriteKiller;
        TileType.WhiteGround;
        TileType.WhiteBrick;
        TileType.WhiteBlock;
        TileType.WhiteTop;
        TileType.WhiteBack;
        TileType.WhiteLadder;
        TileType.WhiteSpikes;
        TileType.DecorWhite;
        TileType.RegisterSlope("White", 9);
        TileType.SteelBarrel;
        TileType.WallJumpLeft;
        TileType.WallJumpRight;
        TileType.Slime;
        TileType.MetalSpikesDown;
        TileType.MetalSpikesLeft;
        TileType.MetalSpikesRight;
        TileType.SpearsDown;
        TileType.SpearsLeft;
        TileType.SpearsRight;
        TileType.HangingConveyorRight;
        TileType.HangingConveyorLeft;
        TileType.CandyGround;
        TileType.CandyBrick;
        TileType.CandyBlock;
        TileType.CandyTop;
        TileType.CandyBack;
        TileType.CandyLadder;
        TileType.CandySpikes;
        TileType.DecorCandy;
        TileType.RegisterSlope("Candy", 10);
        TileType.DecorCandyDown;
        TileType.DecorCandyLeft;
        TileType.DecorCandyRight;
        TileType.ConveyorRightOffFast;
        TileType.ConveyorLeftOffFast;
        TileType.ShimmerInitial;
        TileType.WindUp;
        TileType.WindDown;
        TileType.WindLeft;
        TileType.WindRight;
        TileType.FastWindUp;
        TileType.FastWindDown;
        TileType.FastWindLeft;
        TileType.FastWindRight;
        TileType.PoweredWindLeft;
        TileType.PoweredWindRight;
        TileType.PoweredWindUp;
        TileType.PoweredWindDown;
        TileType.UnpoweredWindLeft;
        TileType.UnpoweredWindRight;
        TileType.UnpoweredWindUp;
        TileType.UnpoweredWindDown;
        TileType.TrackBranchDownRightOff;
        TileType.TrackBranchDownLeftOff;
        TileType.TrackBranchLeftDownOff;
        TileType.TrackBranchLeftUpOff;
        TileType.TrackBranchUpLeftOff;
        TileType.TrackBranchUpRightOff;
        TileType.TrackBranchRightUpOff;
        TileType.TrackBranchRightDownOff;
        TileType.TrackBridge;
        TileType.MountainGround;
        TileType.MountainBrick;
        TileType.MountainBlock;
        TileType.MountainTop;
        TileType.MountainBack;
        TileType.MountainLadder;
        TileType.MountainSpikes;
        TileType.DecorMountain;
        TileType.RegisterSlope("Mountain", 11);
        TileType.TrackLeftCapEntry;
        TileType.TrackTopCapEntry;
        TileType.TrackRightCapEntry;
        TileType.TrackBottomCapEntry;
        // TileType.WallWarpLeft;
        // TileType.WallWarpRight;
        TileType.MountainSpikesDown;
        TileType.MountainSpikesLeft;
        TileType.MountainSpikesRight;
        TileType.TrackBridgeHorizontalOff;
        TileType.TrackBridgeVerticalOff;
        TileType.MetalGround2;
        TileType.HauntGround;
        TileType.HauntBrick;
        TileType.HauntBlock;
        TileType.HauntTop;
        TileType.HauntBack;
        TileType.HauntLadder;
        TileType.HauntSpikes;
        TileType.DecorHaunt;
        TileType.RegisterSlope("Haunt", 12);
        TileType.DecorHauntDown;
        TileType.DecorHauntLeft;
        TileType.DecorHauntRight;
        TileType.DerelictGround;
        TileType.DerelictBrick;
        TileType.DerelictBlock;
        TileType.DerelictTop;
        TileType.DerelictBack;
        TileType.DerelictLadder;
        TileType.DerelictSpikes;
        TileType.DecorDerelict;
        TileType.RegisterSlope("Derelict", 13);
        TileType.DerelictSpikesDown;
        TileType.DerelictSpikesLeft;
        TileType.DerelictSpikesRight;
        TileType.Cracks;
        TileType.FireTop;
    };
    TileType.RegisterSlope = function (keyBase, tileRow) {
        var colIter = 8;
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
    };
    Object.defineProperty(TileType, "Dirt", {
        get: function () { return TileType.GetTileType("Dirt", "terrain", 0, 0, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DirtTile", {
        get: function () { return TileType.GetTileType("DirtTile", "terrain", 1, 0, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "RedBlock", {
        get: function () { return TileType.GetTileType("RedBlock", "terrain", 2, 0, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "GrassyTop", {
        get: function () { return TileType.GetTileType("GrassyTop", "terrain", 3, 0, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DirtBack", {
        get: function () { return TileType.GetTileType("DirtBack", "terrain", 4, 0, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Ladder", {
        get: function () { return TileType.GetTileType("Ladder", "terrain", 5, 0, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SpikeBlock", {
        get: function () {
            return TileType.GetTileType("SpikeBlock", "terrain", 6, 0, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Flower", {
        get: function () { return TileType.GetTileType("Flower", "terrain", 7, 0, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Tree", {
        get: function () { return TileType.GetTileType("Tree", "terrain", 0, 1, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Leaves", {
        get: function () { return TileType.GetTileType("Leaves", "terrain", 1, 1, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "OrangeBlock", {
        get: function () { return TileType.GetTileType("OrangeBlock", "terrain", 2, 1, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BranchTop", {
        get: function () { return TileType.GetTileType("BranchTop", "terrain", 3, 1, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TreeBack", {
        get: function () { return TileType.GetTileType("TreeBack", "terrain", 4, 1, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Vine", {
        get: function () { return TileType.GetTileType("Vine", "terrain", 5, 1, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Thorns", {
        get: function () {
            return TileType.GetTileType("Thorns", "terrain", 6, 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.hurtOnOverlap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Bush", {
        get: function () { return TileType.GetTileType("Bush", "terrain", 7, 1, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SandyGround", {
        get: function () { return TileType.GetTileType("SandyGround", "terrain", 0, 2, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Sandstone", {
        get: function () { return TileType.GetTileType("Sandstone", "terrain", 1, 2, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "YellowBlock", {
        get: function () { return TileType.GetTileType("YellowBlock", "terrain", 2, 2, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WoodPlank", {
        get: function () { return TileType.GetTileType("WoodPlank", "terrain", 3, 2, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SandyBack", {
        get: function () { return TileType.GetTileType("SandyBack", "terrain", 4, 2, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "RoughLadder", {
        get: function () { return TileType.GetTileType("RoughLadder", "terrain", 5, 2, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Cactus", {
        get: function () {
            return TileType.GetTileType("Cactus", "terrain", 6, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Rock", {
        get: function () { return TileType.GetTileType("Rock", "terrain", 7, 2, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "GreenStone", {
        get: function () { return TileType.GetTileType("GreenStone", "terrain", 0, 3, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "RedGirder", {
        get: function () { return TileType.GetTileType("RedGirder", "terrain", 1, 3, Solidity.Block, TargetLayer.main, function (tileType) { tileType.clockWiseRotationTileName = "RedGirder2"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "RedGirder2", {
        get: function () { return TileType.GetTileType("RedGirder2", "terrain", 17, 19, Solidity.Block, TargetLayer.main, function (tileType) { tileType.clockWiseRotationTileName = "RedGirder"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "GreenBlock", {
        get: function () { return TileType.GetTileType("GreenBlock", "terrain", 2, 3, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PinkTop", {
        get: function () { return TileType.GetTileType("PinkTop", "terrain", 3, 3, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ScaleBack", {
        get: function () { return TileType.GetTileType("ScaleBack", "terrain", 4, 3, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalLadder", {
        get: function () { return TileType.GetTileType("MetalLadder", "terrain", 5, 3, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WaterZap", {
        get: function () {
            return TileType.GetAnimatedTileType("WaterZap", "terrain", [{ x: 6, y: 3 }, { x: 0, y: 19 }], 15, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.hurtOnOverlap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Kelp", {
        get: function () { return TileType.GetTileType("Kelp", "terrain", 7, 3, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WoodPlanks", {
        get: function () { return TileType.GetTileType("WoodPlanks", "terrain", 0, 4, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Crate", {
        get: function () { return TileType.GetTileType("Crate", "terrain", 1, 4, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TealBlock", {
        get: function () { return TileType.GetTileType("TealBlock", "terrain", 2, 4, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalPlate", {
        get: function () { return TileType.GetTileType("MetalPlate", "terrain", 3, 4, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BrownBack", {
        get: function () { return TileType.GetTileType("BrownBack", "terrain", 4, 4, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Rigging", {
        get: function () { return TileType.GetTileType("Rigging", "terrain", 5, 4, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SpearsUp", {
        get: function () {
            return TileType.GetTileType("SpearsUp", "terrain", 6, 4, Solidity.Top, TargetLayer.main, function (tileType) {
                tileType.hurtOnTop = true;
                tileType.clockWiseRotationTileName = "SpearsRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SpearsLeft", {
        get: function () {
            return TileType.GetTileType("SpearsLeft", "terrain", 7, 19, Solidity.RightWall, TargetLayer.main, function (tileType) {
                tileType.hurtOnLeft = true;
                tileType.clockWiseRotationTileName = "SpearsUp";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SpearsRight", {
        get: function () {
            return TileType.GetTileType("SpearsRight", "terrain", 8, 19, Solidity.LeftWall, TargetLayer.main, function (tileType) {
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "SpearsDown";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SpearsDown", {
        get: function () {
            return TileType.GetTileType("SpearsDown", "terrain", 9, 19, Solidity.Bottom, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.clockWiseRotationTileName = "SpearsLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "RopeRail", {
        get: function () { return TileType.GetTileType("RopeRail", "terrain", 7, 4, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BlueGround", {
        get: function () { return TileType.GetTileType("BlueGround", "terrain", 0, 5, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PointyBlueBlock", {
        get: function () { return TileType.GetTileType("PointyBlueBlock", "terrain", 1, 5, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CyanBlock", {
        get: function () { return TileType.GetTileType("CyanBlock", "terrain", 2, 5, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SnowTop", {
        get: function () { return TileType.GetTileType("SnowTop", "terrain", 3, 5, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "IceBack", {
        get: function () { return TileType.GetTileType("IceBack", "terrain", 4, 5, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "RedLadder", {
        get: function () { return TileType.GetTileType("RedLadder", "terrain", 5, 5, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Icicles", {
        get: function () {
            return TileType.GetTileType("Icicles", "terrain", 6, 5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.isSlippery = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DangerSign", {
        get: function () { return TileType.GetTileType("DangerSign", "terrain", 7, 5, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleGround", {
        get: function () { return TileType.GetTileType("PurpleGround", "terrain", 0, 6, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleBrick", {
        get: function () { return TileType.GetTileType("PurpleBrick", "terrain", 1, 6, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleBlock", {
        get: function () { return TileType.GetTileType("PurpleBlock", "terrain", 2, 6, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleTop", {
        get: function () { return TileType.GetTileType("PurpleTop", "terrain", 3, 6, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurplePillar", {
        get: function () { return TileType.GetTileType("PurplePillar", "terrain", 4, 6, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleLadder", {
        get: function () { return TileType.GetTileType("PurpleLadder", "terrain", 5, 6, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DeathBlock", {
        get: function () {
            return TileType.GetTileType("DeathBlock", "terrain", 6, 6, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.instaKill = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Lantern", {
        get: function () { return TileType.GetTileType("Lantern", "terrain", 7, 6, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalGround", {
        get: function () { return TileType.GetTileType("MetalGround", "terrain", 0, 7, Solidity.Block, TargetLayer.main, function (tileType) { tileType.clockWiseRotationTileName = "MetalGround2"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalGround2", {
        get: function () { return TileType.GetTileType("MetalGround2", "terrain", 16, 19, Solidity.Block, TargetLayer.main, function (tileType) { tileType.clockWiseRotationTileName = "MetalGround"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalBrick", {
        get: function () { return TileType.GetTileType("MetalBrick", "terrain", 1, 7, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalBlock", {
        get: function () { return TileType.GetTileType("MetalBlock", "terrain", 2, 7, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalTop", {
        get: function () { return TileType.GetTileType("MetalTop", "terrain", 3, 7, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalBack", {
        get: function () { return TileType.GetTileType("MetalBack", "terrain", 4, 7, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ChainLadder", {
        get: function () { return TileType.GetTileType("ChainLadder", "terrain", 5, 7, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalSpikes", {
        get: function () {
            return TileType.GetTileType("MetalSpikes", "terrain", 6, 7, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnTop = true;
                tileType.clockWiseRotationTileName = "MetalSpikesRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalSpikesDown", {
        get: function () {
            return TileType.GetTileType("MetalSpikesDown", "terrain", 6, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.clockWiseRotationTileName = "MetalSpikesLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalSpikesRight", {
        get: function () {
            return TileType.GetTileType("MetalSpikesRight", "terrain", 5, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "MetalSpikesDown";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MetalSpikesLeft", {
        get: function () {
            return TileType.GetTileType("MetalSpikesLeft", "terrain", 4, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnLeft = true;
                tileType.clockWiseRotationTileName = "MetalSpikes";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorChain", {
        get: function () { return TileType.GetTileType("DecorChain", "terrain", 7, 7, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveGround", {
        get: function () { return TileType.GetTileType("CaveGround", "terrain", 0, 8, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveBrick", {
        get: function () { return TileType.GetTileType("CaveBrick", "terrain", 1, 8, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveBlock", {
        get: function () { return TileType.GetTileType("CaveBlock", "terrain", 2, 8, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveTop", {
        get: function () { return TileType.GetTileType("CaveTop", "terrain", 3, 8, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveBack", {
        get: function () { return TileType.GetTileType("CaveBack", "terrain", 4, 8, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveLadder", {
        get: function () { return TileType.GetTileType("CaveLadder", "terrain", 5, 8, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CaveSpikes", {
        get: function () {
            return TileType.GetTileType("CaveSpikes", "terrain", 6, 8, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorCave", {
        get: function () { return TileType.GetTileType("DecorCave", "terrain", 7, 8, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteGround", {
        get: function () { return TileType.GetTileType("WhiteGround", "terrain", 0, 9, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteBrick", {
        get: function () { return TileType.GetTileType("WhiteBrick", "terrain", 1, 9, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteBlock", {
        get: function () { return TileType.GetTileType("WhiteBlock", "terrain", 2, 9, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteTop", {
        get: function () { return TileType.GetTileType("WhiteTop", "terrain", 3, 9, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteBack", {
        get: function () { return TileType.GetTileType("WhiteBack", "terrain", 4, 9, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteLadder", {
        get: function () { return TileType.GetTileType("WhiteLadder", "terrain", 5, 9, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WhiteSpikes", {
        get: function () {
            return TileType.GetAnimatedTileType("WhiteSpikes", "terrain", [{ x: 6, y: 9 }, { x: 1, y: 19 }, { x: 2, y: 19 }, { x: 3, y: 19 }], 5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorWhite", {
        get: function () { return TileType.GetTileType("DecorWhite", "terrain", 7, 9, Solidity.None, TargetLayer.wire); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandyGround", {
        get: function () { return TileType.GetTileType("CandyGround", "terrain", 0, 10, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandyBrick", {
        get: function () { return TileType.GetTileType("CandyBrick", "terrain", 1, 10, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandyBlock", {
        get: function () { return TileType.GetTileType("CandyBlock", "terrain", 2, 10, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandyTop", {
        get: function () { return TileType.GetTileType("CandyTop", "terrain", 3, 10, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandyBack", {
        get: function () { return TileType.GetTileType("CandyBack", "terrain", 4, 10, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandyLadder", {
        get: function () { return TileType.GetTileType("CandyLadder", "terrain", 5, 10, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CandySpikes", {
        get: function () {
            return TileType.GetTileType("CandySpikes", "terrain", 6, 10, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorCandy", {
        get: function () {
            return TileType.GetTileType("DecorCandy", "terrain", 7, 10, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorCandyRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorCandyRight", {
        get: function () {
            return TileType.GetTileType("DecorCandyRight", "terrain", 10, 19, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorCandyDown";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorCandyLeft", {
        get: function () {
            return TileType.GetTileType("DecorCandyLeft", "terrain", 11, 19, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorCandy";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorCandyDown", {
        get: function () {
            return TileType.GetTileType("DecorCandyDown", "terrain", 12, 19, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorCandyLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainGround", {
        get: function () { return TileType.GetTileType("MountainGround", "terrain", 0, 11, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainBrick", {
        get: function () { return TileType.GetTileType("MountainBrick", "terrain", 1, 11, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainBlock", {
        get: function () { return TileType.GetTileType("MountainBlock", "terrain", 2, 11, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainTop", {
        get: function () { return TileType.GetTileType("MountainTop", "terrain", 3, 11, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainBack", {
        get: function () { return TileType.GetTileType("MountainBack", "terrain", 4, 11, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainLadder", {
        get: function () { return TileType.GetTileType("MountainLadder", "terrain", 5, 11, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorMountain", {
        get: function () { return TileType.GetTileType("DecorMountain", "terrain", 7, 11, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainSpikes", {
        get: function () {
            return TileType.GetTileType("MountainSpikes", "terrain", 6, 11, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "MountainSpikesRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainSpikesRight", {
        get: function () {
            return TileType.GetTileType("MountainSpikesRight", "terrain", 13, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "MountainSpikesDown";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainSpikesLeft", {
        get: function () {
            return TileType.GetTileType("MountainSpikesLeft", "terrain", 14, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "MountainSpikes";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "MountainSpikesDown", {
        get: function () {
            return TileType.GetTileType("MountainSpikesDown", "terrain", 15, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "MountainSpikesLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntGround", {
        get: function () { return TileType.GetTileType("HauntGround", "terrain", 0, 12, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntBrick", {
        get: function () { return TileType.GetTileType("HauntBrick", "terrain", 1, 12, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntBlock", {
        get: function () { return TileType.GetTileType("HauntBlock", "terrain", 2, 12, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntTop", {
        get: function () { return TileType.GetTileType("HauntTop", "terrain", 3, 12, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntBack", {
        get: function () { return TileType.GetTileType("HauntBack", "terrain", 4, 12, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntLadder", {
        get: function () { return TileType.GetTileType("HauntLadder", "terrain", 5, 12, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HauntSpikes", {
        get: function () {
            return TileType.GetTileType("HauntSpikes", "terrain", 6, 12, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.hurtOnTop = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorHaunt", {
        get: function () {
            return TileType.GetTileType("DecorHaunt", "terrain", 7, 12, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorHauntRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorHauntRight", {
        get: function () {
            return TileType.GetTileType("DecorHauntRight", "terrain", 18, 19, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorHauntDown";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorHauntLeft", {
        get: function () {
            return TileType.GetTileType("DecorHauntLeft", "terrain", 20, 19, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorHaunt";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorHauntDown", {
        get: function () {
            return TileType.GetTileType("DecorHauntDown", "terrain", 19, 19, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.clockWiseRotationTileName = "DecorHauntLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictGround", {
        get: function () { return TileType.GetTileType("DerelictGround", "terrain", 0, 13, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictBrick", {
        get: function () { return TileType.GetTileType("DerelictBrick", "terrain", 1, 13, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictBlock", {
        get: function () { return TileType.GetTileType("DerelictBlock", "terrain", 2, 13, Solidity.Block, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictTop", {
        get: function () { return TileType.GetTileType("DerelictTop", "terrain", 3, 13, Solidity.Top, TargetLayer.semisolid); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictBack", {
        get: function () { return TileType.GetTileType("DerelictBack", "terrain", 4, 13, Solidity.None, TargetLayer.backdrop); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictLadder", {
        get: function () { return TileType.GetTileType("DerelictLadder", "terrain", 5, 13, Solidity.None, TargetLayer.main, function (tileType) { tileType.isClimbable = true; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DecorDerelict", {
        get: function () { return TileType.GetTileType("DecorDerelict", "terrain", 7, 13, Solidity.None, TargetLayer.main); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictSpikes", {
        get: function () {
            return TileType.GetTileType("DerelictSpikes", "terrain", 6, 13, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnTop = true;
                tileType.clockWiseRotationTileName = "DerelictSpikesLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictSpikesRight", {
        get: function () {
            return TileType.GetTileType("DerelictSpikesRight", "terrain", 21, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnLeft = true;
                tileType.clockWiseRotationTileName = "DerelictSpikes";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictSpikesLeft", {
        get: function () {
            return TileType.GetTileType("DerelictSpikesLeft", "terrain", 22, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnRight = true;
                tileType.clockWiseRotationTileName = "DerelictSpikesDown";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DerelictSpikesDown", {
        get: function () {
            return TileType.GetTileType("DerelictSpikesDown", "terrain", 23, 19, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.hurtOnBottom = true;
                tileType.clockWiseRotationTileName = "DerelictSpikesRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleWater", {
        get: function () {
            return TileType.GetTileType("PurpleWater", "purpleWater", 0, 0, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.isSwimmable = true;
                tileType.drainsAir = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleWaterSurface", {
        get: function () {
            return TileType.GetAnimatedTileType("PurpleWaterSurface", "purpleWater", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }], 15, Solidity.None, TargetLayer.water);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PoisonGas", {
        get: function () {
            var frames = [0, 0, 0, 1, 1, 2, 3, 4, 4, 5, 5, 5, 4, 4, 3, 2, 1, 1].map(function (a) { return ({ x: a, y: 7 }); });
            return TileType.GetAnimatedTileType("PoisonGas", "fluids", frames, 6, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.drainsAir = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Honey", {
        get: function () {
            return TileType.GetTileType("Honey", "fluids", 4, 2, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.yOffset = -2;
                tileType.canWalkOn = false;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Slime", {
        get: function () {
            return TileType.GetTileType("Slime", "fluids", 7, 2, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.yOffset = -2;
                tileType.canJumpFrom = false;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FireTop", {
        get: function () {
            var frames = [0, 1, 2, 3, 4, 5, 6, 7].map(function (a) { return ({ x: a, y: 0 }); });
            return TileType.GetAnimatedTileType("FireTop", "fluids", frames, 4, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.isFire = true;
                tileType.imageTiles.forEach(function (a) {
                    a.yOffset = -4;
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FireTopDecay1", {
        get: function () {
            var frames = [0, 1, 2, 3, 4, 5, 6, 7].map(function (a) { return ({ x: a, y: 0 }); });
            return TileType.GetAnimatedTileType("FireTopDecay1", "fluids", frames, 4, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.isFire = true;
                tileType.imageTiles.forEach(function (a) {
                    a.yOffset = -4;
                });
                tileType.autoChange = {
                    tileTypeName: "FireTopDecay2",
                    delay: 90
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FireTopDecay2", {
        get: function () {
            var frames = [0, 1, 2, 3, 4, 5, 6, 7].map(function (a) { return ({ x: a, y: 4 }); });
            return TileType.GetAnimatedTileType("FireTopDecay2", "fluids", frames, 4, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.isFire = true;
                tileType.imageTiles.forEach(function (a) {
                    a.yOffset = -4;
                });
                tileType.autoChange = {
                    tileTypeName: "FireTopDecay3",
                    delay: 90
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FireTopDecay3", {
        get: function () {
            var frames = [0, 1, 2, 3, 4, 5, 6, 7].map(function (a) { return ({ x: a, y: 5 }); });
            return TileType.GetAnimatedTileType("FireTopDecay3", "fluids", frames, 4, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.isFire = true;
                tileType.imageTiles.forEach(function (a) {
                    a.yOffset = -3;
                });
                tileType.autoChange = {
                    tileTypeName: "BranchTop",
                    delay: 90
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HoneyLeft", {
        get: function () {
            return TileType.GetTileType("HoneyLeft", "fluids", 5, 2, Solidity.LeftWall, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.xOffset = 8;
                tileType.isStickyWall = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HoneyRight", {
        get: function () {
            return TileType.GetTileType("HoneyRight", "fluids", 6, 2, Solidity.RightWall, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.xOffset = -8;
                tileType.isStickyWall = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Lava", {
        get: function () {
            return TileType.GetTileType("Lava", "lava", 0, 0, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.hurtOnOverlap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "LavaSurface", {
        get: function () {
            return TileType.GetAnimatedTileType("LavaSurface", "lava", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }], 40, Solidity.None, TargetLayer.water);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Water", {
        get: function () {
            return TileType.GetTileType("Water", "water", 0, 0, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.isSwimmable = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WaterSurface", {
        get: function () {
            return TileType.GetAnimatedTileType("WaterSurface", "water", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }], 10, Solidity.None, TargetLayer.water);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Waterfall", {
        get: function () {
            return TileType.GetAnimatedTileType("Waterfall", "water", [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], 10, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.isSwimmable = true;
                tileType.isWaterfall = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Quicksand", {
        get: function () {
            return TileType.GetAnimatedTileType("Quicksand", "fluids", [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }], 20, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.isQuicksand = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Lock", {
        get: function () {
            return TileType.GetTileType("Lock", "misc", 3, 2, Solidity.Block, TargetLayer.main);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Ice", {
        get: function () {
            return TileType.GetTileType("Ice", "misc", 2, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.isSlippery = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorRightOn", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorRightOn", "conveyor", [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], 2.5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = 0.4;
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "ConveyorRightOff";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorRightOff", {
        get: function () {
            return TileType.GetTileType("ConveyorRightOff", "conveyor", 0, 0, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "ConveyorRightOn";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorLeftOn", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorLeftOn", "conveyor", [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }], 2.5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = -0.4;
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "ConveyorLeftOff";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorLeftOff", {
        get: function () {
            return TileType.GetTileType("ConveyorLeftOff", "conveyor", 0, 0, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "ConveyorLeftOn";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PowerBlock", {
        get: function () {
            return TileType.GetTileType("PowerBlock", "wire", 2, 0, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.canBePowered = true;
                tileType.isPowerSource = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitOff", {
        get: function () {
            return TileType.GetTileType("CircuitOff", "wire", 0, 0, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.poweredTileName = "CircuitOn";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitOn", {
        get: function () {
            return TileType.GetTileType("CircuitOn", "wire", 1, 0, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.unpoweredTileName = "CircuitOff";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitCrossOff", {
        get: function () {
            return TileType.GetTileType("CircuitCrossOff", "wire", 4, 0, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.poweredTileName = "CircuitCrossOn";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitCrossOn", {
        get: function () {
            return TileType.GetTileType("CircuitCrossOn", "wire", 5, 0, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.unpoweredTileName = "CircuitCrossOff";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SlowCircuitOff", {
        get: function () {
            return TileType.GetTileType("SlowCircuitOff", "wire", 0, 1, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.poweredTileName = "SlowCircuitOn";
                tileType.requiredPowerDelay = 15;
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SlowCircuitOn", {
        get: function () {
            return TileType.GetTileType("SlowCircuitOn", "wire", 1, 1, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.unpoweredTileName = "SlowCircuitOff";
                tileType.requiredPowerDelay = 15;
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ExtraSlowCircuitOff", {
        get: function () {
            return TileType.GetTileType("ExtraSlowCircuitOff", "wire", 8, 3, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.poweredTileName = "ExtraSlowCircuitOn";
                tileType.requiredPowerDelay = 60;
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ExtraSlowCircuitOn", {
        get: function () {
            return TileType.GetTileType("ExtraSlowCircuitOn", "wire", 9, 3, Solidity.Block, TargetLayer.wire, function (tileType) {
                tileType.unpoweredTileName = "ExtraSlowCircuitOff";
                tileType.requiredPowerDelay = 60;
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitHurtOff", {
        get: function () {
            return TileType.GetTileType("CircuitHurtOff", "wire", 6, 0, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.poweredTileName = "CircuitHurtOn";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitHurtOn", {
        get: function () {
            return TileType.GetAnimatedTileType("CircuitHurtOn", "wire", [{ x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }], 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.unpoweredTileName = "CircuitHurtOff";
                tileType.canBePowered = true;
                tileType.hurtOnOverlap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitMusicOff", {
        get: function () {
            return TileType.GetTileType("CircuitMusicOff", "wire", 8, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.poweredTileName = "CircuitMusicOn";
                tileType.canBePowered = true;
                tileType.onPowered = function (tile) {
                    var _a;
                    var overlapped = ((_a = tile.GetMainNeighbor()) === null || _a === void 0 ? void 0 : _a.tileType) || TileType.Air;
                    // TODO - different overlap tiles map to different music sounds
                    var instrumentSegments = 25;
                    var segmentIndex = instrumentSegments - tile.tileY % instrumentSegments;
                    audioHandler.PlaySegment("instrument-square", segmentIndex);
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitMusicOn", {
        get: function () {
            return TileType.GetTileType("CircuitMusicOn", "wire", 9, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.unpoweredTileName = "CircuitMusicOff";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitHurtSolidOff", {
        get: function () {
            return TileType.GetTileType("CircuitHurtSolidOff", "wire", 6, 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.poweredTileName = "CircuitHurtSolidOn";
                tileType.canBePowered = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "CircuitHurtSolidOn", {
        get: function () {
            return TileType.GetAnimatedTileType("CircuitHurtSolidOn", "wire", [{ x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }], 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.unpoweredTileName = "CircuitHurtSolidOff";
                tileType.canBePowered = true;
                tileType.hurtOnBottom = true;
                tileType.hurtOnLeft = true;
                tileType.hurtOnRight = true;
                tileType.hurtOnTop = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    TileType.GetDiode = function (direction, artX, isOn) {
        return TileType.GetTileType("Diode" + direction.name + (isOn ? "On" : "Off"), "wire", artX, 2, Solidity.Block, TargetLayer.wire, function (tileType) {
            if (isOn)
                tileType.unpoweredTileName = "Diode" + direction.name + "Off";
            if (!isOn)
                tileType.poweredTileName = "Diode" + direction.name + "On";
            tileType.powerOutputDirection = direction;
            tileType.powerInputDirection = direction.Opposite();
            tileType.canBePowered = true;
            tileType.calcPowerFromNeighbors = CircuitHandler.DiodePowerCalc;
            tileType.clockWiseRotationTileName = "Diode" + direction.Clockwise().name + "Off";
        });
    };
    Object.defineProperty(TileType, "DiodeRightOff", {
        get: function () { return TileType.GetDiode(Direction.Right, 0, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeRightOn", {
        get: function () { return TileType.GetDiode(Direction.Right, 1, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeDownOff", {
        get: function () { return TileType.GetDiode(Direction.Down, 2, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeDownOn", {
        get: function () { return TileType.GetDiode(Direction.Down, 3, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeLeftOff", {
        get: function () { return TileType.GetDiode(Direction.Left, 4, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeLeftOn", {
        get: function () { return TileType.GetDiode(Direction.Left, 5, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeUpOff", {
        get: function () { return TileType.GetDiode(Direction.Up, 6, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DiodeUpOn", {
        get: function () { return TileType.GetDiode(Direction.Up, 7, true); },
        enumerable: false,
        configurable: true
    });
    TileType.GetAndGate = function (direction, artX, isOn) {
        return TileType.GetTileType("AndGate" + direction.name + (isOn ? "On" : "Off"), "wire", artX, 3, Solidity.Block, TargetLayer.wire, function (tileType) {
            if (isOn)
                tileType.unpoweredTileName = "AndGate" + direction.name + "Off";
            if (!isOn)
                tileType.poweredTileName = "AndGate" + direction.name + "On";
            tileType.powerOutputDirection = direction;
            tileType.calcPowerFromNeighbors = CircuitHandler.AndGatePowerCalc;
            tileType.canBePowered = true;
            tileType.clockWiseRotationTileName = "AndGate" + direction.Clockwise().name + "Off";
        });
    };
    Object.defineProperty(TileType, "AndGateRightOff", {
        get: function () { return TileType.GetAndGate(Direction.Right, 0, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateRightOn", {
        get: function () { return TileType.GetAndGate(Direction.Right, 1, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateDownOff", {
        get: function () { return TileType.GetAndGate(Direction.Down, 2, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateDownOn", {
        get: function () { return TileType.GetAndGate(Direction.Down, 3, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateLeftOff", {
        get: function () { return TileType.GetAndGate(Direction.Left, 4, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateLeftOn", {
        get: function () { return TileType.GetAndGate(Direction.Left, 5, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateUpOff", {
        get: function () { return TileType.GetAndGate(Direction.Up, 6, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AndGateUpOn", {
        get: function () { return TileType.GetAndGate(Direction.Up, 7, true); },
        enumerable: false,
        configurable: true
    });
    TileType.GetInverter = function (direction, artX, isOn) {
        return TileType.GetTileType("Inverter" + direction.name + (isOn ? "On" : "Off"), "wire", artX, 4, Solidity.Block, TargetLayer.wire, function (tileType) {
            if (isOn)
                tileType.unpoweredTileName = "Inverter" + direction.name + "Off";
            if (!isOn)
                tileType.poweredTileName = "Inverter" + direction.name + "On";
            tileType.powerOutputDirection = direction;
            tileType.powerInputDirection = direction.Opposite();
            tileType.calcPowerFromNeighbors = CircuitHandler.InverterPowerCalc;
            tileType.canBePowered = true;
            tileType.clockWiseRotationTileName = "Inverter" + direction.Clockwise().name + "Off";
        });
    };
    Object.defineProperty(TileType, "InverterRightOff", {
        get: function () { return TileType.GetInverter(Direction.Right, 0, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterRightOn", {
        get: function () { return TileType.GetInverter(Direction.Right, 1, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterDownOff", {
        get: function () { return TileType.GetInverter(Direction.Down, 2, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterDownOn", {
        get: function () { return TileType.GetInverter(Direction.Down, 3, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterLeftOff", {
        get: function () { return TileType.GetInverter(Direction.Left, 4, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterLeftOn", {
        get: function () { return TileType.GetInverter(Direction.Left, 5, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterUpOff", {
        get: function () { return TileType.GetInverter(Direction.Up, 6, false); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InverterUpOn", {
        get: function () { return TileType.GetInverter(Direction.Up, 7, true); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AppearingBlockOff", {
        get: function () {
            return TileType.GetTileType("AppearingBlockOff", "wire", 2, 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "AppearingBlockOn";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "AppearingBlockOn", {
        get: function () {
            return TileType.GetTileType("AppearingBlockOn", "wire", 3, 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "AppearingBlockOff";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DisappearingBlockOff", {
        get: function () {
            return TileType.GetTileType("DisappearingBlockOff", "wire", 4, 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "DisappearingBlockOn";
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "DisappearingBlockOn", {
        get: function () {
            return TileType.GetTileType("DisappearingBlockOn", "wire", 5, 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "DisappearingBlockOff";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorRight", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorRight", "conveyor", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], 2.5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = 0.4;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorLeft", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorLeft", "conveyor", [{ x: 0, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], 2.5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = -0.4;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorRightFast", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorRightFast", "conveyor", [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }], 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = 1;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorLeftFast", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorLeftFast", "conveyor", [{ x: 0, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }], 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = -1;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorRightOnFast", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorRightOnFast", "conveyor", [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }], 2.5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = 1;
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "ConveyorRightOffFast";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorRightOffFast", {
        get: function () {
            return TileType.GetTileType("ConveyorRightOffFast", "conveyor", 0, 3, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "ConveyorRightOnFast";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorLeftOnFast", {
        get: function () {
            return TileType.GetAnimatedTileType("ConveyorLeftOnFast", "conveyor", [{ x: 0, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }], 2.5, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.conveyorSpeed = -1;
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "ConveyorLeftOffFast";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ConveyorLeftOffFast", {
        get: function () {
            return TileType.GetTileType("ConveyorLeftOffFast", "conveyor", 0, 3, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "ConveyorLeftOnFast";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WaterTapOff", {
        get: function () {
            return TileType.GetTileType("WaterTapOff", "water", 6, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "WaterTapOn";
                tileType.onPowered = function (tile) { var _a; (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.waterLevel.AddFlowSource(tile); };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WaterTapOn", {
        get: function () {
            return TileType.GetTileType("WaterTapOn", "water", 7, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "WaterTapOff";
                tileType.onUnpowered = function (tile) { var _a; (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.waterLevel.RemoveFlowSource(tile); };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleWaterTapOff", {
        get: function () {
            return TileType.GetTileType("PurpleWaterTapOff", "purpleWater", 6, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "PurpleWaterTapOn";
                tileType.onPowered = function (tile) { var _a; (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.purpleWaterLevel.AddFlowSource(tile); };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleWaterTapOn", {
        get: function () {
            return TileType.GetTileType("PurpleWaterTapOn", "purpleWater", 7, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "PurpleWaterTapOff";
                tileType.onUnpowered = function (tile) { var _a; (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.purpleWaterLevel.RemoveFlowSource(tile); };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "LavaTapOff", {
        get: function () {
            return TileType.GetTileType("LavaTapOff", "lava", 6, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "LavaTapOn";
                tileType.onPowered = function (tile) { var _a; (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.lavaLevel.AddFlowSource(tile); };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "LavaTapOn", {
        get: function () {
            return TileType.GetTileType("LavaTapOn", "lava", 7, 2, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "LavaTapOff";
                tileType.onUnpowered = function (tile) { var _a; (_a = tile.layer.map) === null || _a === void 0 ? void 0 : _a.lavaLevel.RemoveFlowSource(tile); };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Drain", {
        get: function () {
            return TileType.GetTileType("Drain", "water", 6, 4, Solidity.None, TargetLayer.main, function (tileType) {
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InitialWaterLevel", {
        get: function () {
            return TileType.GetTileType("InitialWaterLevel", "water", 6, 5, Solidity.None, TargetLayer.main, function (tileType) { });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InitialPurpleWaterLevel", {
        get: function () {
            return TileType.GetTileType("InitialPurpleWaterLevel", "purpleWater", 6, 5, Solidity.None, TargetLayer.main, function (tileType) { });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InitialLavaLevel", {
        get: function () {
            return TileType.GetTileType("InitialLavaLevel", "lava", 6, 5, Solidity.None, TargetLayer.main, function (tileType) { });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Barrel", {
        get: function () {
            var frames = [];
            for (var i = 0; i < 120; i++) {
                frames.push({ x: 0, y: 0 });
            }
            for (var i = 1; i <= 7; i++) {
                frames.push({ x: i, y: 0 }, { x: i, y: 0 });
            }
            frames.push({ x: 0, y: 0 });
            return TileType.GetAnimatedTileType("Barrel", "barrel", frames, 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.pickUpSprite = Barrel;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SteelBarrel", {
        get: function () {
            var frames = [];
            for (var i = 0; i < 120; i++) {
                frames.push({ x: 0, y: 2 });
            }
            for (var i = 1; i <= 7; i++) {
                frames.push({ x: i, y: 2 }, { x: i, y: 2 });
            }
            frames.push({ x: 0, y: 2 });
            return TileType.GetAnimatedTileType("SteelBarrel", "barrel", frames, 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.pickUpSprite = SteelBarrel;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Pumpkin", {
        get: function () {
            var frames = [];
            for (var i = 0; i < 120; i++) {
                frames.push({ x: 0, y: 0 });
            }
            for (var i = 1; i <= 7; i++) {
                frames.push({ x: i, y: 0 }, { x: i, y: 0 });
            }
            frames.push({ x: 0, y: 0 });
            return TileType.GetAnimatedTileType("Pumpkin", "pumpkin", frames, 1, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.pickUpSprite = Pumpkin;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BubbleBlock1", {
        // tiles can have a "auto-change" tile type and time
        // layer manages list of tiles that are changing, something has to add it to the list
        // meanwhile player standingon triggers a separate change tiletype/timer
        // bubbleblocks 1-4 change based on standing timer
        // bubbleblock5 reverts to 1 with autotimer
        get: function () { return TileType.CreateBubbleBlock(1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BubbleBlock2", {
        get: function () { return TileType.CreateBubbleBlock(2); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BubbleBlock3", {
        get: function () { return TileType.CreateBubbleBlock(3); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BubbleBlock4", {
        get: function () { return TileType.CreateBubbleBlock(4); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "BubbleBlock5", {
        get: function () { return TileType.CreateBubbleBlock(5); },
        enumerable: false,
        configurable: true
    });
    TileType.CreateBubbleBlock = function (blockNum) {
        return TileType.GetAnimatedTileType("BubbleBlock" + blockNum, "bubbleBlock", [{ x: blockNum - 1, y: 0 }, { x: blockNum - 1, y: 1 }], 30, blockNum == 5 ? Solidity.None : Solidity.Block, TargetLayer.main, function (tileType) {
            if (blockNum == 1) {
                tileType.standChange = {
                    tileTypeName: ("BubbleBlock" + (blockNum + 1).toString()),
                    delay: 0
                };
            }
            else if (blockNum == 5) {
                tileType.autoChange = {
                    tileTypeName: "BubbleBlock1",
                    delay: 180
                };
            }
            else {
                tileType.autoChange = {
                    tileTypeName: ("BubbleBlock" + (blockNum + 1).toString()),
                    delay: 30
                };
            }
            tileType.isExemptFromSlime = true;
        });
    };
    Object.defineProperty(TileType, "HangingVine", {
        get: function () {
            return TileType.GetTileType("HangingVine", "hanging", 0, 0, Solidity.Bottom, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.yOffset = 3;
                tileType.isHangable = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HangingBars", {
        get: function () {
            return TileType.GetTileType("HangingBars", "hanging", 1, 0, Solidity.Bottom, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.yOffset = 3;
                tileType.isHangable = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HangingConveyorRight", {
        get: function () {
            return TileType.GetAnimatedTileType("HangingConveyorRight", "hanging", [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], 2.5, Solidity.Bottom, TargetLayer.semisolid, function (tileType) {
                //(<AnimatedTileType>tileType).imageTiles.forEach(a => a.yOffset = 3);
                tileType.isHangable = true;
                tileType.isExemptFromSlime = true;
                tileType.conveyorSpeed = -0.6;
                // bottom conveyor speed is inverted
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HangingConveyorLeft", {
        get: function () {
            return TileType.GetAnimatedTileType("HangingConveyorLeft", "hanging", [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }], 2.5, Solidity.Bottom, TargetLayer.semisolid, function (tileType) {
                //(<AnimatedTileType>tileType).imageTiles.forEach(a => a.yOffset = 3);
                tileType.isHangable = true;
                tileType.isExemptFromSlime = true;
                tileType.conveyorSpeed = 0.6;
                // bottom conveyor speed is inverted
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackHorizontal", {
        get: function () {
            return TileType.GetTileType("TrackHorizontal", "motorTrack", 2, 0, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Left, Direction.Right];
                tileType.clockWiseRotationTileName = "TrackVertical";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackVertical", {
        get: function () {
            return TileType.GetTileType("TrackVertical", "motorTrack", 3, 0, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Down, Direction.Up];
                tileType.clockWiseRotationTileName = "TrackHorizontal";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveDownRight", {
        get: function () {
            return TileType.GetTileType("TrackCurveDownRight", "motorTrack", 0, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Down, Direction.Right];
                tileType.clockWiseRotationTileName = "TrackCurveDownLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveDownLeft", {
        get: function () {
            return TileType.GetTileType("TrackCurveDownLeft", "motorTrack", 1, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Down, Direction.Left];
                tileType.clockWiseRotationTileName = "TrackCurveUpLeft";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveUpLeft", {
        get: function () {
            return TileType.GetTileType("TrackCurveUpLeft", "motorTrack", 2, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Up, Direction.Left];
                tileType.clockWiseRotationTileName = "TrackCurveUpRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveUpRight", {
        get: function () {
            return TileType.GetTileType("TrackCurveUpRight", "motorTrack", 3, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Up, Direction.Right];
                tileType.clockWiseRotationTileName = "TrackCurveDownRight";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackLeftCap", {
        get: function () {
            return TileType.GetTileType("TrackLeftCap", "motorTrack", 0, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Right];
                tileType.clockWiseRotationTileName = "TrackTopCap";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackTopCap", {
        get: function () {
            return TileType.GetTileType("TrackTopCap", "motorTrack", 1, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Down];
                tileType.clockWiseRotationTileName = "TrackRightCap";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackRightCap", {
        get: function () {
            return TileType.GetTileType("TrackRightCap", "motorTrack", 2, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Left];
                tileType.clockWiseRotationTileName = "TrackBottomCap";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBottomCap", {
        get: function () {
            return TileType.GetTileType("TrackBottomCap", "motorTrack", 3, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Up];
                tileType.clockWiseRotationTileName = "TrackLeftCap";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBridge", {
        get: function () {
            return TileType.GetTileType("TrackBridge", "motorTrack", 4, 4, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = Direction.All;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackLeftCapEntry", {
        get: function () {
            return TileType.GetTileType("TrackLeftCapEntry", "motorTrack", 4, 5, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Right];
                tileType.clockWiseRotationTileName = "TrackTopCapEntry";
                tileType.isTrackPipe = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackTopCapEntry", {
        get: function () {
            return TileType.GetTileType("TrackTopCapEntry", "motorTrack", 5, 5, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Down];
                tileType.clockWiseRotationTileName = "TrackRightCapEntry";
                tileType.isTrackPipe = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackRightCapEntry", {
        get: function () {
            return TileType.GetTileType("TrackRightCapEntry", "motorTrack", 6, 5, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Left];
                tileType.clockWiseRotationTileName = "TrackBottomCapEntry";
                tileType.isTrackPipe = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBottomCapEntry", {
        get: function () {
            return TileType.GetTileType("TrackBottomCapEntry", "motorTrack", 7, 5, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.trackDirections = [Direction.Up];
                tileType.clockWiseRotationTileName = "TrackLeftCapEntry";
                tileType.isTrackPipe = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchDownRightOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Down, Direction.Right, 4, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchDownRightOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Down, Direction.Right, 5, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchDownLeftOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Down, Direction.Left, 6, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchDownLeftOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Down, Direction.Left, 7, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchLeftDownOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Left, Direction.Down, 4, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchLeftDownOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Left, Direction.Down, 5, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchLeftUpOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Left, Direction.Up, 6, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchLeftUpOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Left, Direction.Up, 7, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchUpLeftOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Up, Direction.Left, 4, 2); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchUpLeftOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Up, Direction.Left, 5, 2); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchUpRightOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Up, Direction.Right, 6, 2); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchUpRightOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Up, Direction.Right, 7, 2); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchRightUpOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Right, Direction.Up, 4, 3); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchRightUpOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Right, Direction.Up, 5, 3); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchRightDownOff", {
        get: function () { return TileType.TrackBranchOff(Direction.Right, Direction.Down, 6, 3); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBranchRightDownOn", {
        get: function () { return TileType.TrackBranchOn(Direction.Right, Direction.Down, 7, 3); },
        enumerable: false,
        configurable: true
    });
    TileType.TrackBranchOff = function (sharedDir, offDir, x, y) {
        var baseName = "TrackBranch" + sharedDir.name + offDir.name;
        return TileType.GetTileType(baseName + "Off", "motorTrack", x, y, Solidity.None, TargetLayer.wire, function (tileType) {
            tileType.canBePowered = true;
            tileType.poweredTileName = baseName + "On";
            tileType.trackDirections = [sharedDir, offDir];
            tileType.clockWiseRotationTileName = "TrackBranch" + sharedDir.Clockwise().name + offDir.Clockwise().name + "Off";
        });
    };
    TileType.TrackBranchOn = function (sharedDir, offDir, x, y) {
        var baseName = "TrackBranch" + sharedDir.name + offDir.name;
        return TileType.GetTileType(baseName + "On", "motorTrack", x, y, Solidity.None, TargetLayer.wire, function (tileType) {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = baseName + "Off";
            tileType.trackDirections = [sharedDir, offDir.Opposite()];
        });
    };
    Object.defineProperty(TileType, "TrackBridgeHorizontalOff", {
        get: function () {
            return TileType.GetTileType("TrackBridgeHorizontalOff", "motorTrack", 0, 6, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "TrackBridgeHorizontalOn";
                tileType.trackDirections = [Direction.Left, Direction.Right];
                tileType.clockWiseRotationTileName = "TrackBridgeVerticalOff";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBridgeHorizontalOn", {
        get: function () {
            return TileType.GetTileType("TrackBridgeHorizontalOn", "motorTrack", 1, 6, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "TrackBridgeHorizontalOff";
                tileType.trackDirections = [Direction.Left, Direction.Right];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBridgeVerticalOff", {
        get: function () {
            return TileType.GetTileType("TrackBridgeVerticalOff", "motorTrack", 2, 6, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.canBePowered = true;
                tileType.poweredTileName = "TrackBridgeVerticalOn";
                tileType.trackDirections = [Direction.Up, Direction.Down];
                tileType.clockWiseRotationTileName = "TrackBridgeHorizontalOff";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBridgeVerticalOn", {
        get: function () {
            return TileType.GetTileType("TrackBridgeVerticalOn", "motorTrack", 3, 6, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.canBePowered = true;
                tileType.unpoweredTileName = "TrackBridgeVerticalOff";
                tileType.trackDirections = [Direction.Up, Direction.Down];
            });
        },
        enumerable: false,
        configurable: true
    });
    TileType.OneWay = function (direction) {
        var y = [Direction.Right, Direction.Down, Direction.Left, Direction.Up].indexOf(direction);
        var frames = [
            { x: 0, y: y },
            { x: 1, y: y },
            { x: 2, y: y },
        ];
        var solidity = [Solidity.LeftWall, Solidity.Bottom, Solidity.RightWall, Solidity.Top][y];
        return TileType.GetAnimatedTileType("OneWay" + direction.name, "oneway", frames, 4, solidity, TargetLayer.semisolid, function (tileType) {
            tileType.isExemptFromSlime = true;
            tileType.clockWiseRotationTileName = "OneWay" + direction.Clockwise().name;
        });
    };
    Object.defineProperty(TileType, "OneWayRight", {
        get: function () { return this.OneWay(Direction.Right); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TileType, "OneWayDown", {
        get: function () { return this.OneWay(Direction.Down); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TileType, "OneWayLeft", {
        get: function () { return this.OneWay(Direction.Left); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TileType, "OneWayUp", {
        get: function () { return this.OneWay(Direction.Up); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TileType, "IceTop", {
        get: function () {
            return TileType.GetTileType("IceTop", "misc", 0, 4, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.isSlippery = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowRight", {
        get: function () { return TileType.GetTileType("ArrowRight", "arrows", 0, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowDownRight"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowUpRight", {
        get: function () { return TileType.GetTileType("ArrowUpRight", "arrows", 1, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowRight"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowUp", {
        get: function () { return TileType.GetTileType("ArrowUp", "arrows", 2, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowUpRight"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowUpLeft", {
        get: function () { return TileType.GetTileType("ArrowUpLeft", "arrows", 3, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowUp"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowLeft", {
        get: function () { return TileType.GetTileType("ArrowLeft", "arrows", 4, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowUpLeft"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowDownLeft", {
        get: function () { return TileType.GetTileType("ArrowDownLeft", "arrows", 5, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowLeft"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowDown", {
        get: function () { return TileType.GetTileType("ArrowDown", "arrows", 6, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowDownLeft"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ArrowDownRight", {
        get: function () { return TileType.GetTileType("ArrowDownRight", "arrows", 7, 0, Solidity.None, TargetLayer.wire, function (tileType) { tileType.clockWiseRotationTileName = "ArrowDown"; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SolidForPlayer", {
        get: function () { return TileType.GetTileType("SolidForPlayer", "misc", 1, 4, Solidity.SolidForPlayer, TargetLayer.main, function (tileType) { }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SolidForNonplayer", {
        get: function () { return TileType.GetTileType("SolidForNonplayer", "misc", 2, 4, Solidity.SolidForNonplayer, TargetLayer.main, function (tileType) { }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "SpriteKiller", {
        get: function () { return TileType.GetTileType("SpriteKiller", "misc", 3, 4, Solidity.None, TargetLayer.main, function (tileType) { }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "ShimmerInitial", {
        get: function () {
            return TileType.GetTileType("ShimmerInitial", "shimmer", 10, 0, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.autoChange = {
                    tileTypeName: "Shimmer",
                    delay: 0
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Shimmer", {
        get: function () {
            return TileType.GetTileType("Shimmer", "shimmer", 0, 0, Solidity.Block, TargetLayer.main, function (tileType) {
                tileType.shimmers = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WallJumpLeft", {
        get: function () {
            return TileType.GetTileType("WallJumpLeft", "wallJump", 0, 0, Solidity.LeftWall, TargetLayer.semisolid, function (tileType) {
                tileType.isJumpWall = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WallJumpRight", {
        get: function () {
            return TileType.GetTileType("WallJumpRight", "wallJump", 1, 0, Solidity.RightWall, TargetLayer.semisolid, function (tileType) {
                tileType.isJumpWall = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WindRight", {
        get: function () {
            return TileType.GetAnimatedTileType("WindRight", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: a, y: 1 }); }), 2, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windX = 0.6;
                tileType.clockWiseRotationTileName = "WindDown";
                tileType.editorTile = tiles["gust"][0][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WindLeft", {
        get: function () {
            return TileType.GetAnimatedTileType("WindLeft", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: 11 - a, y: 1 }); }), 2, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windX = -0.6;
                tileType.clockWiseRotationTileName = "WindUp";
                tileType.editorTile = tiles["gust"][2][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WindUp", {
        get: function () {
            return TileType.GetAnimatedTileType("WindUp", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: a, y: 0 }); }), 2, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windY = -0.6;
                tileType.clockWiseRotationTileName = "WindRight";
                tileType.editorTile = tiles["gust"][1][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WindDown", {
        get: function () {
            return TileType.GetAnimatedTileType("WindDown", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: 11 - a, y: 0 }); }), 2, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windY = 0.6;
                tileType.clockWiseRotationTileName = "WindLeft";
                tileType.editorTile = tiles["gust"][3][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FastWindRight", {
        get: function () {
            return TileType.GetAnimatedTileType("FastWindRight", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: a, y: 1 }); }), 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windX = 1.2;
                tileType.clockWiseRotationTileName = "FastWindDown";
                tileType.editorTile = tiles["gust"][4][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FastWindLeft", {
        get: function () {
            return TileType.GetAnimatedTileType("FastWindLeft", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: 11 - a, y: 1 }); }), 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windX = -1.2;
                tileType.clockWiseRotationTileName = "FastWindUp";
                tileType.editorTile = tiles["gust"][6][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FastWindUp", {
        get: function () {
            return TileType.GetAnimatedTileType("FastWindUp", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: a, y: 0 }); }), 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windY = -1.2;
                tileType.clockWiseRotationTileName = "FastWindRight";
                tileType.editorTile = tiles["gust"][5][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "FastWindDown", {
        get: function () {
            return TileType.GetAnimatedTileType("FastWindDown", "gust", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (a) { return ({ x: 11 - a, y: 0 }); }), 1, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.windY = 1.2;
                tileType.clockWiseRotationTileName = "FastWindLeft";
                tileType.editorTile = tiles["gust"][7][2];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PoweredWindLeft", {
        get: function () { return TileType.CreatePoweredWindTrigger(Direction.Left); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PoweredWindRight", {
        get: function () { return TileType.CreatePoweredWindTrigger(Direction.Right); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PoweredWindUp", {
        get: function () { return TileType.CreatePoweredWindTrigger(Direction.Up); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PoweredWindDown", {
        get: function () { return TileType.CreatePoweredWindTrigger(Direction.Down); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "UnpoweredWindLeft", {
        get: function () { return TileType.CreateUnpoweredWindTrigger(Direction.Left); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "UnpoweredWindRight", {
        get: function () { return TileType.CreateUnpoweredWindTrigger(Direction.Right); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "UnpoweredWindUp", {
        get: function () { return TileType.CreateUnpoweredWindTrigger(Direction.Up); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "UnpoweredWindDown", {
        get: function () { return TileType.CreateUnpoweredWindTrigger(Direction.Down); },
        enumerable: false,
        configurable: true
    });
    TileType.CreatePoweredWindTrigger = function (direction) {
        var row = [1, 2, 3, 0][Direction.All.indexOf(direction)];
        return TileType.GetAnimatedTileType("PoweredWind" + direction.name, "wind", [4, 5, 6, 7].map(function (a) { return ({ x: a, y: row }); }), 1, Solidity.None, TargetLayer.main, function (tileType) {
            tileType.canBePowered = true;
            tileType.unpoweredTileName = "UnpoweredWind" + direction.name;
            tileType.onUnpowered = function (tile) {
                currentMap.globalWindX -= direction.x;
                currentMap.globalWindY -= direction.y;
            };
        });
    };
    TileType.CreateUnpoweredWindTrigger = function (direction) {
        var row = [1, 2, 3, 0][Direction.All.indexOf(direction)];
        return TileType.GetAnimatedTileType("UnpoweredWind" + direction.name, "wind", [0, 1, 2, 3].map(function (a) { return ({ x: a, y: row }); }), 20, Solidity.None, TargetLayer.main, function (tileType) {
            tileType.canBePowered = true;
            tileType.poweredTileName = "PoweredWind" + direction.name;
            tileType.onPowered = function (tile) {
                currentMap.globalWindX += direction.x;
                currentMap.globalWindY += direction.y;
            };
            tileType.clockWiseRotationTileName = "UnpoweredWind" + direction.Clockwise().name;
        });
    };
    Object.defineProperty(TileType, "Cracks", {
        get: function () { return TileType.GetTileType("Cracks", "bomb", 0, 2, Solidity.None, TargetLayer.wire); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WallWarpLeft", {
        get: function () {
            return TileType.GetAnimatedTileType("WallWarpLeft", "warpWall", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (y) { return ({ x: 0, y: y }); }), 6, Solidity.LeftWall, TargetLayer.semisolid, function (tileType) {
                tileType.isWarpWall = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "WallWarpRight", {
        get: function () {
            return TileType.GetAnimatedTileType("WallWarpRight", "warpWall", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (y) { return ({ x: 1, y: y }); }), 6, Solidity.RightWall, TargetLayer.semisolid, function (tileType) {
                tileType.isWarpWall = true;
                tileType.isExemptFromSlime = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    TileType.GetTileType = function (key, imageName, x, y, solidity, targetLayer, extraRules) {
        if (extraRules === void 0) { extraRules = function () { }; }
        var ret = TileType.TileMap[key];
        if (!ret) {
            var image = (tiles[imageName][x][y]);
            ret = new TileType(image, solidity, key, targetLayer);
            extraRules(ret);
            TileType.TileMap[key] = ret;
        }
        return ret;
    };
    TileType.GetTileTypeFromKey = function (key) {
        return TileType.TileMap[key];
    };
    TileType.GetAnimatedTileType = function (key, imageName, tileIndeces, framesPerTile, solidity, targetLayer, extraRules) {
        if (extraRules === void 0) { extraRules = function () { }; }
        var ret = TileType.TileMap[key];
        if (!ret) {
            var images = tileIndeces.map(function (a) { return (tiles[imageName][a.x][a.y]); });
            ret = new AnimatedTileType(images, solidity, targetLayer, framesPerTile, key);
            extraRules(ret);
            TileType.TileMap[key] = ret;
        }
        return ret;
    };
    TileType.TileMap = {};
    return TileType;
}());
var AnimatedTileType = /** @class */ (function (_super) {
    __extends(AnimatedTileType, _super);
    function AnimatedTileType(imageTiles, solidity, targetLayer, framesPerTile, key) {
        var _this = _super.call(this, imageTiles[0], solidity, key, targetLayer) || this;
        _this.imageTiles = imageTiles;
        _this.solidity = solidity;
        _this.targetLayer = targetLayer;
        _this.framesPerTile = framesPerTile;
        _this.key = key;
        return _this;
    }
    return AnimatedTileType;
}(TileType));
var TargetLayer;
(function (TargetLayer) {
    TargetLayer[TargetLayer["backdrop"] = 0] = "backdrop";
    TargetLayer[TargetLayer["water"] = 1] = "water";
    TargetLayer[TargetLayer["main"] = 2] = "main";
    TargetLayer[TargetLayer["semisolid"] = 3] = "semisolid";
    TargetLayer[TargetLayer["wire"] = 4] = "wire";
})(TargetLayer || (TargetLayer = {}));
