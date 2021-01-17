class WeaponJetpack extends Weapon {
    name = "Jetpack";
    
    kickbackPower = 0.4;
    pelletCount = 1;
    pelletDamage = 0;
    pelletSpeed = 0.5;
    fixedSpread = false;
    cooldownTime = 3;
    maxShotsBeforeLanding = 50;
    
    upgrades = [
        Upgrade.KickbackScaleUp(3, 1.4),
        Upgrade.ShotsScaleUp(3, 1.5),
    ]
}