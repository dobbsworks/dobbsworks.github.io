class WeaponJetpack extends Weapon {
    name = "Jetpack";
    flavor = "It may not do any damage, but sometimes the best offense is a good retreat."

    initialUpgrades = [
        Upgrade.DamageScale(10, -1),
        Upgrade.FireRateScale(3, 10),
        Upgrade.ShotsScale(3, 20),
    ]
    
    reloadSpeed = 60;
    kickbackPower = 0.4;
    pelletSpeed = 0.5;
    fixedSpread = false;
    cost = 0;
    initialPelletDistance = 30;
    
    upgrades = [
        Upgrade.KickbackScale(30, .2),
        Upgrade.ShotsScale(40, .3),
        Upgrade.KickbackScale(60, .2),
        Upgrade.ShotsScale(80, .3),
        Upgrade.KickbackScale(100, .2),
        Upgrade.ShotsScale(120, .3),
        Upgrade.KickbackScale(150, .2),
        Upgrade.ShotsScale(160, .3),
    ]
}