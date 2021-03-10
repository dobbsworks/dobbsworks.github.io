class WeaponFireCannon extends Weapon {
    name = "Solar Flare";
    flavor = "A tight-cone flamethrower that rewards more precise aim. "
    fireSound = "ow-01";

    initialUpgrades = [
        Upgrade.Flavor("Set foes aflame to deal steady damage", Upgrade.Direction.Good),
    ]
    
    pelletSpeed = 2;
    fixedSpread = true;
    clipSize = 4;
    pelletCount = 5;
    cost = 25;
    pelletSpread = Math.PI / 24;
    pelletType = PlayerFlame;
    pelletDuration = 60 * 2;
    
    upgrades = [
    ]
}