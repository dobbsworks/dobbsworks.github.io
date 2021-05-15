class WeaponPelletShield extends Weapon {
    name = "Swarm Shield";
    flavor = "Surrounds you with an orbiting field of protective drones."
    fireSound = "notify-01";
    cost = 30;
    initialUpgrades = [
    ];
    
    pelletType = PlayerShieldPellet;
    pelletSpread = Math.PI * 2;
    fixedSpread = true;
    pelletCount = 3;
    initialPelletDistance = 120;
    clipSize = 1;
    reloadSpeed = 0.025;
    kickbackPower = 0;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    pelletDuration = 60 * 15;

    upgrades = [
        Upgrade.PelletsChange(40, 1),
        Upgrade.ReloadSpeedScale(50, 0.3),
        Upgrade.PelletDurationScale(60, 0.2),
        Upgrade.PelletsChange(70, 1),
        Upgrade.ReloadSpeedScale(80, 0.3),
        Upgrade.PelletDurationScale(90, 0.2),
        Upgrade.PelletsChange(100, 2),
        Upgrade.PelletsChange(120, 3),
    ]
}