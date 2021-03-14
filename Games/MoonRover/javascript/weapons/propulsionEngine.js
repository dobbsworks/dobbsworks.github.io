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
        Upgrade.FireRateScale(15, 0.3),
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ShotsChange(35, 1),
    ]
}