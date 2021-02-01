class WeaponPeashooter extends Weapon {
    name = "The Peashooter";
    flavor = "Pew pew!"
    initialUpgrades = [
        Upgrade.ShotsChange(0, 1),
    ];

    upgrades = [
        Upgrade.FireRateScale(10, 0.5),
        Upgrade.ShotsChange(10, 2),
        Upgrade.DamageScale(20, 1),
    ]
}