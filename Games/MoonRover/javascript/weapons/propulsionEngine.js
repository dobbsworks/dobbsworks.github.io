class WeaponPropulsionEngine extends Weapon {
    name = "Propulsion Engine";
    flavor = "Fires compressed bursts of energy that propel the wielder forward. "
    fireSound = "pow-01";
    initialUpgrades = [
        Upgrade.DamageScale(0, -0.5),
        Upgrade.KickbackScale(0, 2),
        Upgrade.FireRateScale(0, -0.3),
        Upgrade.ShotsChange(0, -1),
        Upgrade.ReloadSpeedScale(0, -0.3),
    ];

    upgrades = [
        Upgrade.FireRateScale(40, 0.2),
        Upgrade.KickbackScale(50, 0.3),
        Upgrade.ReloadSpeedScale(40, 0.1),
        Upgrade.ShotsChange(50, 1),
        Upgrade.DamageScale(60, 1),
        Upgrade.FireRateScale(60, 0.2),
        Upgrade.ReloadSpeedScale(70, 0.1),
        Upgrade.KickbackScale(90, 0.3),
    ]
}