class Blueprint {

    constructor(baseCost, constructedSprite, baseBuildTime) {
        // price to build (before buffs/modifiers)
        this.baseCost = baseCost;

        // what sprite gets created after build completes?
        this.constructedSprite = constructedSprite;

        // time to build (before buffs) in frames
        this.baseBuildTime = baseBuildTime;
    }

}

let second = 60;
var allBlueprints = [
    new Blueprint(100, Snowman, 2 * second),
    new Blueprint(20, SnowWall, 1 * second),
];

var currentBlueprints = allBlueprints;