class WeaponPelletShield extends Weapon {
    name = "The Swarm Shield";
    flavor = "Surrounds you with an orbiting field of protective drones."
    fireSound = "notify-01";
    cost = 35;
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
        Upgrade.PelletsChange(20, 1),
        Upgrade.ReloadSpeedScale(20, 0.3),
        Upgrade.PelletDurationScale(25, 0.2),
        Upgrade.PelletsChange(30, 1),
    ]
}