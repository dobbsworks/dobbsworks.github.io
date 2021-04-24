class WeaponFollowerGun extends Weapon {
    name = "Kitten Caboodle";
    flavor = "All together, meow. "
    initialUpgrades = [
    ];

    reloadSpeed = 0.125;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    follower = true;
    clipSize = 1;

    upgrades = [
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ReloadSpeedScale(20, 0.1),
    ]
}