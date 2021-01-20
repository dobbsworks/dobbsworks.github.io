class WeaponShotgun extends Weapon {
    name = "Shotgun";
    initialUpgrades = [
        Upgrade.PelletsChange(0, 2),
    ];

    upgrades = [
        Upgrade.FireRateScale(3, 0.5),
        Upgrade.ShotsChange(3, 1),
        Upgrade.SpreadScale(3, -0.5),
        Upgrade.DamageScale(10, 0.5),
    ]
}