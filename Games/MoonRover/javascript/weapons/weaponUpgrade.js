class Upgrade {
    constructor(cost, changes, shortDescription) {
        this.cost = cost;
        this.changes = changes;
        this.shortDescription = shortDescription;
    }
    isActive = false;
    static Type = {
        "add": 0,
        "ratio": 1
    }

    static DamageUp(cost, damagePlus) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletDamage",
                delta: damagePlus,
                type: Upgrade.Type.add
            }
        ], "Greater damage");
        return upgrade;
    }

    static KickbackScaleUp(cost, kickbackRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "kickbackPower",
                delta: kickbackRatio,
                type: Upgrade.Type.ratio
            }
        ], "Increase kickback");
        return upgrade;
    }

    static ShotsUp(cost, shotsRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "maxShotsBeforeLanding",
                delta: shotsRatio,
                type: Upgrade.Type.add
            }
        ], "More mid-air shots");
        return upgrade;
    }

    static ShotsScaleUp(cost, shotsRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "maxShotsBeforeLanding",
                delta: shotsRatio,
                type: Upgrade.Type.ratio
            }
        ], "More mid-air shots");
        return upgrade;
    }

    static SpreadScaleDown(cost, spreadRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletSpread",
                delta: spreadRatio,
                type: Upgrade.Type.ratio
            }
        ], "Tighter cone");
        return upgrade;
    }

    static CooldownScaleDown(cost, fireRateRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "cooldownTime",
                delta: fireRateRatio,
                type: Upgrade.Type.ratio
            }
        ], "Faster fire rate");
        return upgrade;
    }

}