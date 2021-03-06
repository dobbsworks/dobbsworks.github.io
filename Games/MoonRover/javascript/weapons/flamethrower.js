class WeaponFlamethrower extends Weapon {
    name = "Flamethrower";
    flavor = "How does it create flames in a vacuum? Nobody knows!"

    initialUpgrades = [
        Upgrade.Flavor("Launches fire instead of pellets", Upgrade.Direction.Good),
        Upgrade.FireRateScale(3, 10),
        Upgrade.KickbackScale(3, -1),
    ]
    
    pelletDamage = 0.25;
    reloadSpeed = 8;
    pelletSpeed = 0.5;
    fixedSpread = false;
    clipSize = 30;
    cost = 25;
    pelletSpread = Math.PI / 6;
    pelletType = PlayerFlame;
    
    upgrades = [
        // Upgrade.KickbackScale(3, .4),
        // Upgrade.ShotsScale(3, .5),
    ]
}