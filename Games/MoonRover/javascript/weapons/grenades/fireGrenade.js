class WeaponFireGrenade extends WeaponBaseGrenade {
    name = "Fire Bomb";
    flavor = "This bomb creates a burst of flames that can ignite enemies. "
    initialUpgrades = [
    ];

    cost = 35;
    triggeredWeapon = new WeaponFireGrenadeEffect();
    explodeOnEnemy = true;
    explodeOnWall = true;
    explodeOnExpire = true;

    upgrades = [
        Upgrade.ReloadSpeedScale(40, 0.2),
        Upgrade.ReloadSpeedScale(70, 0.2),
    ]
}