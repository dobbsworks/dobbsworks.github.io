class WeaponMagnetCannon extends Weapon {
    name = "Lode Stone";
    flavor = "A directional EMP that stuns enemies and draws in coins. "
    fireSound = "pew-02";

    initialUpgrades = [
        Upgrade.Flavor("Reloads while holstered", Upgrade.Direction.Good),
    ]
    
    pelletSpeed = 2;
    fixedSpread = true;
    clipSize = 1;
    reloadSpeed = 0.08;
    kickbackPower = 0;
    pelletCount = 7;
    cost = 25;
    pelletSpread = Math.PI / 8;
    pelletType = PlayerMagnetPellet;
    pelletDuration = 60 * 1.5;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    effectDuration = 60 * 5;
    pelletGravityScale = 0;
    
    upgrades = [
        Upgrade.ReloadSpeedScale(40, 0.2),
        Upgrade.PelletSpeedScale(50, 0.2),
        Upgrade.PelletsScale(60, 0.5),
        Upgrade.EffectDurationScale(70, 0.5),
        Upgrade.PelletSpeedScale(80, 0.2),
        Upgrade.ReloadSpeedScale(90, 0.2),
        Upgrade.EffectDurationScale(100, 0.5),
        Upgrade.ReloadSpeedScale(160, 0.2),
    ]
}