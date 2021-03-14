class WeaponPeashooter extends Weapon {
    name = "Peashooter";
    flavor = "Not very strong at first, but compatible with lots of upgrades. "
    initialUpgrades = [
    ];

    clipSize = 4;

    upgrades = [
        Upgrade.FireRateScale(10, 0.5),
        Upgrade.ShotsChange(10, 2),
        Upgrade.DamageScale(20, 1),
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ShotsChange(30, 2),
    ]
}