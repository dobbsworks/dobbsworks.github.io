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
    pelletGravityScale = 0;
    
    upgrades = [
        Upgrade.FireRateScale(30, 0.10),
        Upgrade.ShotsChange(50, 1),
        Upgrade.PelletsScale(60, 1),
        Upgrade.SpreadScale(40, 0.8),
        Upgrade.FireRateScale(70, 0.10),
        Upgrade.PelletsScale(60, 0.5),
        Upgrade.SpreadScale(130, 0.5),
        Upgrade.ShotsChange(150, 1),
    ]
}