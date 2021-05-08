class WeaponBouncer extends Weapon {
    name = "Kinetic Launcher";
    flavor = "Shots will bounce off of walls and enemies"
    initialUpgrades = [
        Upgrade.RicochetsChange(0, 2),
    ];

    upgrades = [
        Upgrade.FireRateScale(30, 0.3),
        Upgrade.RicochetsChange(40, 1),
        Upgrade.ShotsChange(30, 1),
        Upgrade.DamageScale(60, 1),
        Upgrade.ReloadSpeedScale(40, 0.2),
        Upgrade.ShotsChange(70, 1),
        Upgrade.RicochetsChange(80, 1),
        Upgrade.DamageScale(150, 1),
    ]
}