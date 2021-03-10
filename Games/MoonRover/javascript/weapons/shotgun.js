class WeaponShotgun extends Weapon {
    name = "The Blunderbuss";
    flavor = "Fires multiple pellets, but in a wide area."
    fireSound = "pow-01";
    cost = 25;
    initialUpgrades = [
        Upgrade.PelletsChange(0, 2),
    ];

    upgrades = [
        Upgrade.FireRateScale(10, 0.5),
        Upgrade.ShotsChange(10, 1),
        Upgrade.SpreadScale(15, -0.5),
        Upgrade.DamageScale(25, 1),
    ]
}