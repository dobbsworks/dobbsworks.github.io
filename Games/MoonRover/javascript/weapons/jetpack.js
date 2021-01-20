class WeaponJetpack extends Weapon {
    name = "Jetpack";
    flavor = "It may not do any damage, but sometimes the best offense is a good retreat."

    initialUpgrades = [
        Upgrade.DamageScale(10, -1),
        Upgrade.FireRateScale(3, 9),
        Upgrade.ShotsScale(3, 20),
    ]
    
    kickbackPower = 0.4;
    pelletSpeed = 0.5;
    fixedSpread = false;
    cost = 0;
    
    upgrades = [
        Upgrade.KickbackScale(3, .4),
        Upgrade.ShotsScale(3, .5),
    ]
}