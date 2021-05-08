class WeaponShotgun extends Weapon {
    name = "Blunderbuss";
    flavor = "Fires multiple pellets, but in a wide area."
    fireSound = "pow-01";
    cost = 25;
    initialUpgrades = [
        Upgrade.PelletsChange(0, 2),
    ];

    upgrades = [
        Upgrade.FireRateScale(30, 0.3),
        Upgrade.ShotsChange(40, 1),
        Upgrade.SpreadScale(30, -0.2),
        Upgrade.ReloadSpeedScale(50, 0.1),
        Upgrade.PelletsChange(60, 2),
        Upgrade.KnockbackScale(70, 0.3),
        Upgrade.DamageScale(90, 1),
        Upgrade.ReloadSpeedScale(100, 0.2),
    ]
}