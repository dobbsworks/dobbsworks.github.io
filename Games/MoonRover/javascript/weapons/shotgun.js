class WeaponShotgun extends Weapon {
    name = "Shotgun";

    upgrades = [
        Upgrade.CooldownScaleDown(3, 0.6),
        Upgrade.ShotsUp(3, 1),
        Upgrade.SpreadScaleDown(3, 0.5),
        Upgrade.DamageUp(10, 1),
    ]
}