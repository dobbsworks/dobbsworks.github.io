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
        this.isSwimmable = false;
        this.isWaterfall = false;
        this.isQuicksand = false;
        this.isClimbable = false;
        this.isBumper = false;
        this.isHangable = false;
        this.conveyorSpeed = 0; // positive = clockwise
        this.drainsAir = false;
        this.canWalkOn = true; //sticky honey blocks
        this.isStickyWall = false;
        this.isTrack = false;
        this.isTrackCap = false;
        this.trackEquation = function (x, y) { return ({ x: x, y: y }); };
        this.trackCrossedEquation = function (x1, y1, x2, y2) { return false; };
        this.trackDirectionEquation = function (x, y) { return ({ dx: 0, dy: 0 }); };
        this.trackCurveHorizontalDirection = 0;
        this.trackCurveVerticalDirection = 0;
        // track equation maps based on ratio within block [0,1]=>[0,1]
        this.hurtOnSides = false;
        this.hurtOnTop = false;
        this.hurtOnBottom = false;
        this.hurtOnOverlap = false; // other hurtOn props only activate on solid interaction
        this.pickUpSprite = null;
        this.autoChange = null;
        this.standChange = null;
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
                tileType.hurtOnSides = true;
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
                tileType.hurtOnSides = true;
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
        get: function () { return TileType.GetTileType("RedGirder", "terrain", 1, 3, Solidity.Block, TargetLayer.main); },
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
            return TileType.GetTileType("WaterZap", "terrain", 6, 3, Solidity.None, TargetLayer.main, function (tileType) {
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
    Object.defineProperty(TileType, "Spears", {
        get: function () {
            return TileType.GetTileType("Spears", "terrain", 6, 4, Solidity.Top, TargetLayer.main, function (tileType) {
                tileType.hurtOnTop = true;
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
                tileType.hurtOnSides = true;
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
                tileType.hurtOnSides = true;
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
        get: function () { return TileType.GetTileType("MetalGround", "terrain", 0, 7, Solidity.Block, TargetLayer.main); },
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
                tileType.hurtOnSides = true;
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
    Object.defineProperty(TileType, "Bridge", {
        get: function () {
            return TileType.GetTileType("Bridge", "terrain", 2, 3, Solidity.Top, TargetLayer.semisolid);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Bumper", {
        get: function () {
            return TileType.GetTileType("Bumper", "bumper", 0, 0, Solidity.None, TargetLayer.main, function (tileType) {
                tileType.isBumper = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleWater", {
        get: function () {
            return TileType.GetTileType("PurpleWater", "water", 0, 3, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.isSwimmable = true;
                tileType.drainsAir = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PurpleWaterSurface", {
        get: function () {
            return TileType.GetAnimatedTileType("PurpleWaterSurface", "water", [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }], 10, Solidity.None, TargetLayer.water);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "PoisonGas", {
        get: function () {
            return TileType.GetAnimatedTileType("PoisonGas", "water", [{ x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }], 35, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.drainsAir = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Honey", {
        get: function () {
            return TileType.GetTileType("Honey", "water", 4, 2, Solidity.Top, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.yOffset = -2;
                tileType.canWalkOn = false;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HoneyLeft", {
        get: function () {
            return TileType.GetTileType("HoneyLeft", "water", 5, 2, Solidity.LeftWall, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.xOffset = 8;
                tileType.isStickyWall = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "HoneyRight", {
        get: function () {
            return TileType.GetTileType("HoneyRight", "water", 6, 2, Solidity.RightWall, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.xOffset = -8;
                tileType.isStickyWall = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "Lava", {
        get: function () {
            return TileType.GetTileType("Lava", "water", 0, 5, Solidity.None, TargetLayer.water, function (tileType) {
                tileType.hurtOnOverlap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "LavaSurface", {
        get: function () {
            return TileType.GetAnimatedTileType("LavaSurface", "water", [{ x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }], 20, Solidity.None, TargetLayer.water);
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
            return TileType.GetAnimatedTileType("Quicksand", "water", [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }], 20, Solidity.None, TargetLayer.water, function (tileType) {
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
                    console.log(tile.tileY);
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
                tileType.hurtOnSides = true;
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
    Object.defineProperty(TileType, "WaterTapOff", {
        get: function () {
            return TileType.GetTileType("WaterTapOff", "pipes", 0, 0, Solidity.Block, TargetLayer.main, function (tileType) {
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
            return TileType.GetTileType("WaterTapOn", "pipes", 1, 0, Solidity.Block, TargetLayer.main, function (tileType) {
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
            return TileType.GetTileType("PurpleWaterTapOff", "pipes", 2, 0, Solidity.Block, TargetLayer.main, function (tileType) {
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
            return TileType.GetTileType("PurpleWaterTapOn", "pipes", 3, 0, Solidity.Block, TargetLayer.main, function (tileType) {
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
            return TileType.GetTileType("LavaTapOff", "pipes", 4, 0, Solidity.Block, TargetLayer.main, function (tileType) {
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
            return TileType.GetTileType("LavaTapOn", "pipes", 5, 0, Solidity.Block, TargetLayer.main, function (tileType) {
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
            return TileType.GetTileType("Drain", "pipes", 0, 2, Solidity.None, TargetLayer.main, function (tileType) {
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InitialWaterLevel", {
        get: function () {
            return TileType.GetTileType("InitialWaterLevel", "waterChanger", 0, 0, Solidity.None, TargetLayer.main, function (tileType) { });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InitialPurpleWaterLevel", {
        get: function () {
            return TileType.GetTileType("InitialPurpleWaterLevel", "waterChanger", 0, 1, Solidity.None, TargetLayer.main, function (tileType) { });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "InitialLavaLevel", {
        get: function () {
            return TileType.GetTileType("InitialLavaLevel", "waterChanger", 0, 2, Solidity.None, TargetLayer.main, function (tileType) { });
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
    TileType.CreateBubbleBlock = function (blockNum) {
        return TileType.GetAnimatedTileType("BubbleBlock" + blockNum, "bubbleBlock", [{ x: blockNum - 1, y: 0 }, { x: blockNum - 1, y: 1 }], 30, Solidity.Block, TargetLayer.main, function (tileType) {
            if (blockNum == 1)
                tileType.standChange = {
                    tileTypeName: ("BubbleBlock" + (blockNum + 1).toString()),
                    delay: 0
                };
            else
                tileType.autoChange = {
                    tileTypeName: blockNum == 4 ? "Air" : ("BubbleBlock" + (blockNum + 1).toString()),
                    delay: 30
                };
        });
    };
    Object.defineProperty(TileType, "HangingVine", {
        get: function () {
            return TileType.GetTileType("HangingVine", "hanging", 0, 0, Solidity.Bottom, TargetLayer.semisolid, function (tileType) {
                tileType.imageTile.yOffset = 3;
                tileType.isHangable = true;
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
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackHorizontal", {
        get: function () {
            return TileType.GetTileType("TrackHorizontal", "motorTrack", 2, 0, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = function (x, y) { return ({ x: x, y: 0.5 }); };
                tileType.trackCrossedEquation = function (x1, y1, x2, y2) { return (y1 >= 0.5 && y2 <= 0.5) || (y1 <= 0.5 && y2 >= 0.5); };
                tileType.trackDirectionEquation = function (x, y) { return ({ dx: 1, dy: 0 }); };
                // track direction equation assumes traveling clock-wise from bottom-right
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackVertical", {
        get: function () {
            return TileType.GetTileType("TrackVertical", "motorTrack", 3, 0, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = function (x, y) { return ({ x: 0.5, y: y }); };
                tileType.trackCrossedEquation = function (x1, y1, x2, y2) { return (x1 >= 0.5 && x2 <= 0.5) || (x1 <= 0.5 && x2 >= 0.5); };
                tileType.trackDirectionEquation = function (x, y) { return ({ dx: 0, dy: -1 }); };
            });
        },
        enumerable: false,
        configurable: true
    });
    TileType.GetCurveTrackEquation = function (innerXDirection, innerYDirection) {
        var centerX = (innerXDirection + 1) / 2;
        var centerY = (innerYDirection + 1) / 2;
        return function (x, y) {
            if (x == centerX && y == centerY)
                return { x: centerX, y: centerY };
            //console.log("trackEquation inputs", x,y)
            if (innerXDirection == 1)
                x = 1 - x;
            if (innerYDirection == 1)
                y = 1 - y;
            var theta = Math.atan2(y, x);
            var retX = 0.5 * Math.cos(theta);
            var retY = 0.5 * Math.sin(theta);
            if (innerXDirection == 1)
                retX = 1 - retX;
            if (innerYDirection == 1)
                retY = 1 - retY;
            //console.log("trackEquation output", retX, retY)
            return ({ x: retX, y: retY });
        };
    };
    TileType.GetCurveTrackCrossedEquation = function (innerXDirection, innerYDirection) {
        var centerX = (innerXDirection + 1) / 2;
        var centerY = (innerYDirection + 1) / 2;
        return function (x1, y1, x2, y2) {
            var r1 = Math.sqrt(Math.pow((x1 - centerX), 2) + Math.pow((y1 - centerY), 2));
            var r2 = Math.sqrt(Math.pow((x2 - centerX), 2) + Math.pow((y2 - centerY), 2));
            return (r1 >= 0.5 && r2 <= 0.5) || (r1 <= 0.5 && r2 >= 0.5);
        };
    };
    TileType.GetCurveTrackDirectionEquation = function (innerXDirection, innerYDirection) {
        var centerX = (innerXDirection + 1) / 2;
        var centerY = (innerYDirection + 1) / 2;
        return function (x, y) {
            if (x == centerX && y == centerY)
                return { dx: 0, dy: 0 };
            //console.log(x,y)
            if (innerXDirection == 1)
                x = 1 - x;
            if (innerYDirection == 1)
                y = 1 - y;
            var theta = Math.atan2(y, x);
            theta -= Math.PI / 2;
            //console.log("speedtheta degrees",theta / 2 / Math.PI * 360)
            var retX = 0.5 * Math.cos(theta);
            var retY = 0.5 * Math.sin(theta);
            if (innerXDirection == 1)
                retX = 1 - retX;
            if (innerYDirection == 1)
                retY = 1 - retY;
            return ({ dx: retX, dy: retY });
        };
    };
    Object.defineProperty(TileType, "TrackCurveDownRight", {
        get: function () {
            return TileType.GetTileType("TrackCurveDownRight", "motorTrack", 0, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = TileType.GetCurveTrackEquation(1, 1);
                tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(1, 1);
                tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(1, 1);
                tileType.trackCurveHorizontalDirection = 1;
                tileType.trackCurveVerticalDirection = 1;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveDownLeft", {
        get: function () {
            return TileType.GetTileType("TrackCurveDownLeft", "motorTrack", 1, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = TileType.GetCurveTrackEquation(-1, 1);
                tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(-1, 1);
                tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(-1, 1);
                tileType.trackCurveHorizontalDirection = -1;
                tileType.trackCurveVerticalDirection = 1;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveUpLeft", {
        get: function () {
            return TileType.GetTileType("TrackCurveUpLeft", "motorTrack", 2, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = TileType.GetCurveTrackEquation(-1, -1);
                tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(-1, -1);
                tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(-1, -1);
                tileType.trackCurveHorizontalDirection = -1;
                tileType.trackCurveVerticalDirection = -1;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackCurveUpRight", {
        get: function () {
            return TileType.GetTileType("TrackCurveUpRight", "motorTrack", 3, 1, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = TileType.GetCurveTrackEquation(1, -1);
                tileType.trackCrossedEquation = TileType.GetCurveTrackCrossedEquation(1, -1);
                tileType.trackDirectionEquation = TileType.GetCurveTrackDirectionEquation(1, -1);
                tileType.trackCurveHorizontalDirection = 1;
                tileType.trackCurveVerticalDirection = -1;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackLeftCap", {
        get: function () {
            return TileType.GetTileType("TrackLeftCap", "motorTrack", 0, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = function (x, y) { return ({ x: Math.max(x, 0.5), y: 0.5 }); };
                tileType.trackCrossedEquation = function (x1, y1, x2, y2) { return ((y1 >= 0.5 && y2 <= 0.5) || (y1 <= 0.5 && y2 >= 0.5)) && x1 >= 0.5 && x2 >= 0.5; };
                tileType.trackDirectionEquation = function (x, y) { return ({ dx: 1, dy: 0 }); };
                tileType.isTrackCap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackTopCap", {
        get: function () {
            return TileType.GetTileType("TrackTopCap", "motorTrack", 1, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = function (x, y) { return ({ x: 0.5, y: Math.max(y, 0.5) }); };
                tileType.trackCrossedEquation = function (x1, y1, x2, y2) { return ((x1 >= 0.5 && x2 <= 0.5) || (x1 <= 0.5 && x2 >= 0.5)) && y1 >= 0.5 && y2 >= 0.5; };
                tileType.trackDirectionEquation = function (x, y) { return ({ dx: 0, dy: -1 }); };
                tileType.isTrackCap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackRightCap", {
        get: function () {
            return TileType.GetTileType("TrackRightCap", "motorTrack", 2, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = function (x, y) { return ({ x: Math.min(x, 0.5), y: 0.5 }); };
                tileType.trackCrossedEquation = function (x1, y1, x2, y2) { return ((y1 >= 0.5 && y2 <= 0.5) || (y1 <= 0.5 && y2 >= 0.5)) && x1 <= 0.5 && x2 <= 0.5; };
                tileType.trackDirectionEquation = function (x, y) { return ({ dx: 1, dy: 0 }); };
                tileType.isTrackCap = true;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileType, "TrackBottomCap", {
        get: function () {
            return TileType.GetTileType("TrackBottomCap", "motorTrack", 3, 2, Solidity.None, TargetLayer.wire, function (tileType) {
                tileType.isTrack = true;
                tileType.trackEquation = function (x, y) { return ({ x: 0.5, y: Math.min(y, 0.5) }); };
                tileType.trackCrossedEquation = function (x1, y1, x2, y2) { return ((x1 >= 0.5 && x2 <= 0.5) || (x1 <= 0.5 && x2 >= 0.5)) && y1 <= 0.5 && y2 <= 0.5; };
                tileType.trackDirectionEquation = function (x, y) { return ({ dx: 0, dy: -1 }); };
                tileType.isTrackCap = true;
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
