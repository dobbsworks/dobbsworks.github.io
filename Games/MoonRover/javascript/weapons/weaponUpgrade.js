class Upgrade {
    constructor(cost, changes, shortDescription) {
        this.cost = cost;
        this.changes = changes;
        let descr = "Multiple changes"
        if (changes.length === 1) {
            let changeType = Upgrade.PropMap[changes[0].prop];
            if (changeType) descr = changeType.shortDescription;
        }
        this.shortDescription = descr;
    }
    isActive = false;
    static Type = {
        "add": 0,
        "scale": 1,
        "flavor": 2,
    }
    static Direction = {
        "Good": "[good]",
        "Bad": "[bad]",
        "Neutral": "",
    }

    GetBreakdownText() {
        let lines = [];
        for (let change of this.changes) {
            if (change.type === Upgrade.Type.flavor) {
                lines.push(change.delta);
                continue;
            }
            let propInfo = Upgrade.PropMap[change.prop];
            let isGoodChange = true;
            let isBadChange = false;
            if (propInfo) {
                isGoodChange = (change.delta * propInfo.goodDirection > 0);
                isBadChange = (change.delta * propInfo.goodDirection < 0);
            } else {
                console.error("MISSING PROP INFO FOR: " + change.prop);
            }
            let colorPrefix = isGoodChange ? "[good]" : (isBadChange ? "[bad]" : "");

            let changeValue = change.delta;
            if (change.type === Upgrade.Type.scale) changeValue *= 100;
            let changeNumber = changeValue.toFixed(1);
            if (changeNumber.endsWith(".0")) changeNumber = changeValue.toFixed(0);
            if (changeValue > 0) changeNumber = "+" + changeNumber;
            if (change.type === Upgrade.Type.scale) changeNumber += "%";

            if (change.type === Upgrade.Type.scale &&
                change.delta % 1 === 0 &&
                change.delta > 0) {
                changeNumber = "x" + (change.delta + 1);
            }

            let propText = "";
            if (propInfo) {
                propText = propInfo.statDescription;
                if (!propText) {
                    if (isGoodChange) propText = propInfo.statDescriptionGood;
                    else propText = propInfo.statDescriptionBad;
                }
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
        knockbackPower: {
            goodDirection: +1,
            shortDescription: "Increase knockback",
            statDescription: "knockback",
        },
        clipSize: {
            goodDirection: +1,
            shortDescription: "More shots",
            statDescription: "shot(s) before reloading"
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
            shortDescription: "Pellets per shot",
            statDescription: "pellets per shot",
        },
        pelletDuration: {
            goodDirection: +1,
            shortDescription: "Projectile range",
            statDescription: "longer lasting shots",
        },
        shieldDuration: {
            goodDirection: +1,
            shortDescription: "Longer shield",
            statDescription: "longer shield duration",
        },
        effectDuration: {
            goodDirection: +1,
            shortDescription: "Longer effect",
            statDescriptionGood: "longer effect duration",
            statDescriptionBad: "shorter effect duration",
        },
        maxBounces: {
            goodDirection: +1,
            shortDescription: "More ricochets",
            statDescription: "more ricochets"
        },
        shieldDamageBonus: {
            goodDirection: +1,
            shortDescription: "Stronger bash",
            statDescription: "stronger shield bash"
        },
        pelletSpeed: {
            goodDirection: +1,
            shortDescription: "Pellet speed",
            statDescription: "faster pellet speed"
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

    static KnockbackScale(cost, knockbackRatio) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "knockbackPower",
                delta: knockbackRatio,
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

    static PelletsScale(cost, pelletsScale) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletCount",
                delta: pelletsScale,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static PelletSpeedScale(cost, pelletSpeedScale) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletSpeed",
                delta: pelletSpeedScale,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static ShieldDurationScale(cost, shieldDurationScale) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "shieldDuration",
                delta: shieldDurationScale,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static ShieldDamageChange(cost, shieldDamageChange) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "shieldDamageBonus",
                delta: shieldDamageChange,
                type: Upgrade.Type.add
            }
        ]);
        return upgrade;
    }

    static PelletDurationScale(cost, pelletDurationScale) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "pelletDuration",
                delta: pelletDurationScale,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static EffectDurationScale(cost, effectDurationScale) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "effectDuration",
                delta: effectDurationScale,
                type: Upgrade.Type.scale
            }
        ]);
        return upgrade;
    }

    static RicochetsChange(cost, maxBouncesPlus) {
        let upgrade = new Upgrade(cost, [
            {
                prop: "maxBounces",
                delta: maxBouncesPlus,
                type: Upgrade.Type.add
            }
        ]);
        return upgrade;
    }

    static Flavor(text, direction) {
        if (!direction) direction = Upgrade.Direction.Neutral;
        let upgrade = new Upgrade(0, [{
            delta: direction + text,
            type: Upgrade.Type.flavor
        }]);
        return upgrade;
    }

}