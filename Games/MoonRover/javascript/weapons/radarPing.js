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
        Upgrade.ReloadSpeedScale(30, 0.1),
        Upgrade.ShotsChange(40, 1),
        Upgrade.ReloadSpeedScale(50, 0.1),
        Upgrade.ShotsChange(70, 1),
        Upgrade.ReloadSpeedScale(90, 0.1),
        Upgrade.ShotsChange(100, 1),
        Upgrade.ReloadSpeedScale(120, 0.1),
        Upgrade.ShotsChange(140, 1),
        Upgrade.ReloadSpeedScale(150, 0.1),
    ]
}