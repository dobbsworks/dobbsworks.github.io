class WeaponJetpack extends Weapon {
    name = "Jetpack";
    
    knockbackPower = 0.4;
    pelletCount = 1;
    pelletDamage = 0;
    pelletSpeed = 0.5;
    fixedSpread = false;
    cooldownTime = 3;
    maxShotsBeforeLanding = 50;
    
    upgrades = [
        new Upgrade(3, Upgrade.Type.scale, "knockbackPower", 1.4),
        new Upgrade(3, Upgrade.Type.scale, "maxShotsBeforeLanding", 1.5),
    ]
}