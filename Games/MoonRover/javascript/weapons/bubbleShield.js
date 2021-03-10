class WeaponBubbleShield extends Weapon {
    name = "Bubble Shield";
    flavor = "Blocks robot damage for a short time."
    fireSound = "notify-01";

    initialUpgrades = [
        Upgrade.Flavor("Reloads while holstered", Upgrade.Direction.Good),
        Upgrade.Flavor("Ram enemies while shielded", Upgrade.Direction.Good),
    ]
    
    shieldDuration = 60 * 5;
    clipSize = 1;
    reloadSpeed = 0.04;
    kickbackPower = 0;
    cost = 30;
    pelletType = null;
    pelletDamage = 0;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    
    upgrades = [
        Upgrade.ShieldDurationScale(10, 0.2),
        Upgrade.ReloadSpeedScale(20, 0.3),
    ]
}