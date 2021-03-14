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
        Upgrade.ReloadSpeedScale(20, 0.3),
        Upgrade.EffectDurationScale(30, 0.5),
    ]
}