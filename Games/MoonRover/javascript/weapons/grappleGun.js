class WeaponGrapplingHook extends Weapon {
    name = "Grappling Hook";
    flavor = "text text text. "
    fireSound = "pow-01";

    initialUpgrades = [
        Upgrade.Flavor("Reloads while holstered", Upgrade.Direction.Good),
    ]
    
    fixedSpread = true;
    reloadSpeed = 1.5;
    clipSize = 1;
    kickbackPower = 0;
    cost = 25;
    pelletType = PlayerGrapplePellet;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    pelletGravityScale = 0;
    pelletDuration = 60 * 1;
    
    upgrades = [
        Upgrade.ReloadSpeedScale(40, 0.1),
        Upgrade.ReloadSpeedScale(60, 0.1),
        Upgrade.ReloadSpeedScale(80, 0.1),
    ]

    OnPullTrigger() {
        player.grappleTarget = null;
    }
}