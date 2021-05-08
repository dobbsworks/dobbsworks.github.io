class WeaponPeashooter extends Weapon {
    name = "Peashooter";
    flavor = "Not very strong at first, but compatible with lots of upgrades. "
    initialUpgrades = [
    ];

    clipSize = 4;

    upgrades = [
        Upgrade.FireRateScale(25, 0.3),
        Upgrade.ShotsChange(30, 1),
        Upgrade.ReloadSpeedScale(30, 0.2),
        Upgrade.ShotsChange(30, 1),
        Upgrade.DamageScale(50, 1),
        Upgrade.KnockbackScale(50, 0.25),
        Upgrade.ReloadSpeedScale(60, 0.1),
        Upgrade.ShotsChange(80, 1),
        Upgrade.FireRateScale(100, 0.3),
        Upgrade.ShotsChange(100, 1),
        Upgrade.DamageScale(150, 1),
    ]
}