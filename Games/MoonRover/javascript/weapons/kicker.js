class WeaponKicker extends Weapon {
    name = "Supermatter Flinger";
    flavor = "Launches heavily condensed matter that can send enemies flying. "
    fireSound = "pow-01";
    initialUpgrades = [
        Upgrade.DamageScale(0, -0.5),
        Upgrade.KnockbackScale(0, 2),
        Upgrade.FireRateScale(0, -0.3),
        Upgrade.ReloadSpeedScale(0, -0.3),
    ];

    upgrades = [
        Upgrade.FireRateScale(30, 0.3),
        Upgrade.ReloadSpeedScale(50, 0.1),
        Upgrade.ShotsChange(60, 1),
        Upgrade.KnockbackScale(60, 0.5),
        Upgrade.ReloadSpeedScale(70, 0.1),
        Upgrade.FireRateScale(90, 0.3),
        Upgrade.ReloadSpeedScale(120, 0.1),
        Upgrade.ShotsChange(150, 1),
    ]
}