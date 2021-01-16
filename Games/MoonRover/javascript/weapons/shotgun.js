class WeaponShotgun extends Weapon {
    name = "Shotgun";

    upgrades = [
        new Upgrade(3, Upgrade.Type.add, "cooldownTime", -5),
        new Upgrade(3, Upgrade.Type.add, "maxShotsBeforeLanding", 1),
        new Upgrade(3, Upgrade.Type.scale, "pelletSpread", 0.5),
    ]
}