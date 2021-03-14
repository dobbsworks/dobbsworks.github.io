class WeaponBouncer extends Weapon {
    name = "Kinetic Launcher";
    flavor = "Shots will bounce off of walls and enemies"
    initialUpgrades = [
        Upgrade.RicochetsChange(0, 2),
    ];

    upgrades = [
        Upgrade.FireRateScale(15, 0.3),
        Upgrade.RicochetsChange(20, 1),
        Upgrade.ShotsChange(10, 1),
        Upgrade.DamageScale(20, 1),
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ShotsChange(30, 1),
    ]
}