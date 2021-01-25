class Upgrade {
    constructor(cost, changes, shortDescription) {
        this.cost = cost;
        this.changes = changes;
        let descr = "Multiple changes"
        if (changes.length === 1) {
            let changeType = Upgrade.PropMap[changes[0].prop];
            descr = changeType.shortDescription;
        }
        this.shortDescription = descr;
    }
    isActive = false;
    static Type = {
        "add": 0,
        "scale": 1
    }

    GetBreakdownText() {
        let lines = [];
        for (let change of this.changes) {
            let propInfo = Upgrade.PropMap[change.prop];
            let isGoodChange = (change.delta * propInfo.goodDirection > 0);
            let isBadChange = (change.delta * propInfo.goodDirection < 0);
            let colorPrefix = isGoodChange ? "[good]" : (isBadChange ? "[bad]" : "");

            let changeValue = change.delta;
            if (change.type === Upgrade.Type.scale) changeValue *= 100;
            let changeNumber = changeValue.toFixed(1);
            if (changeNumber.endsWith(".0")) changeNumber = changeValue.toFixed(0);
            if (changeValue > 0) changeNumber = "+" + changeNumber;
            if (change.type === Upgrade.Type.scale) changeNumber += "%";

            let propText = propInfo.statDescription;
            if (!propText) {
                if (isGoodChange) propText = propInfo.statDescriptionGood;
                else propText = propInfo.statDescriptionBad;
            }

            lines.push(colorPrefix + changeNumber + " " + propText);
        }
        return lines.join("\n");
    }

    static PropMap = {
        pelletDamage: {
            goodDirection: +1,
            shortDescription: "Greater damage",
            statDescriptionGood: "damage bonus",
            statDescriptionBad: "damage penalty",
        },
        kickbackPower: {
            goodDirection: +1,
            shortDescription: "Increase kickback",
            statDescription: "kickback",
        },
        clipSize: {
            goodDirection: +1,
            shortDescription: "More mid-air shots",
            statDescription: "shot(s) before landing"
        },
        pelletSpread: {
            goodDirection: -1,
            shortDescription: "Tighter cone",
            statDescriptionGood: "more accurate",
            statDescriptionBad: "less accurate",
        },
        fireRate: {
            goodDirection: +1,
            shortDescription: "Faster fire rate",
            statDescriptionGood: "faster firing speed",
            statDescriptionBad: "slower firing speed",
        },
        reloadSpeed: {
            goodDirection: +1,
            shortDescription: "Faster reloads",
            statDescriptionGood: "faster reload time",
            statDescriptionBad: "slower reload time",
        },
        pelletCount: {
            goodDirection: +1,
            shortDescription: "pellets per shot",
            statDescription: "pellets per shot",
        }
    }

    static DamageScale(cost, damageScale) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletDamage",
                delta: damageScale,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static KickbackScale(cost, kickbackRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "kickbackPower",
                delta: kickbackRatio,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static ShotsChange(cost, shotsPlus) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "clipSize",
                delta: shotsPlus,
                type: Upgrade.Type.add
            }
        ]);
        return upgrade;
    }

    static ShotsScale(cost, shotsRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "clipSize",
                delta: shotsRatio,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static SpreadScale(cost, spreadRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletSpread",
                delta: spreadRatio,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static FireRateScale(cost, fireRateRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "fireRate",
                delta: fireRateRatio,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static ReloadSpeedScale(cost, reloadSpeedRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "reloadSpeed",
                delta: reloadSpeedRatio,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static PelletsChange(cost, pelletsPlus) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletCount",
                delta: pelletsPlus,
                type: Upgrade.Type.add
            }
        ]);
        return upgrade;
    }

}