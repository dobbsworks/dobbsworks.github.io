class WeaponMagnetGrenade extends WeaponBaseGrenade {
    name = "Ferrous Wheel";
    flavor = "This grenade creates a short-range EMP that stuns enemies and draws in coins. "
    initialUpgrades = [
    ];

    cost = 30;
    reloadSpeed = 0.025;
    triggeredWeapon = new WeaponMagnetPulse();
    explodeOnEnemy = true;
    explodeOnWall = true;
    explodeOnExpire = true;

    upgrades = [
        Upgrade.ReloadSpeedScale(40, 0.2),
        Upgrade.ReloadSpeedScale(70, 0.2),
    ]
}