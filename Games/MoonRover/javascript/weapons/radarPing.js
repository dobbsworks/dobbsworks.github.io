class WeaponRadarPing extends Weapon {
    name = "Radar Blast";
    flavor = "The sight tool for the job. "
    initialUpgrades = [
    ];

    clipSize = 3;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    reloadSpeed = 0.125/2;
    pelletType = null;
    radarPing = 2000;
    kickbackPower = 0;

    upgrades = [
        Upgrade.ReloadSpeedScale(20, 0.1),
        Upgrade.ReloadSpeedScale(20, 0.1),
    ]
}