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
        Upgrade.FireRateScale(15, 0.3),
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ShotsChange(35, 1),
    ]
}