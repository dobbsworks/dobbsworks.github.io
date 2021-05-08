class WeaponBubbleShieldRex extends Weapon {
    name = "Wrecking Ball";
    flavor = "Rex wrecks."
    fireSound = "notify-01";

    initialUpgrades = [
        Upgrade.Flavor("Reloads while holstered", Upgrade.Direction.Good),
        Upgrade.Flavor("Ram enemies while shielded", Upgrade.Direction.Good),
    ]
    
    shieldDuration = 60 * 5;
    clipSize = 1;
    reloadSpeed = 0.15;
    kickbackPower = 0;
    cost = 30;
    pelletType = null;
    pelletDamage = 0;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    
    upgrades = [
        Upgrade.ShieldDurationScale(20, 0.1),
        Upgrade.ReloadSpeedScale(40, 0.1),
        Upgrade.ShieldDamageChange(60, 1),
        Upgrade.ShieldDurationScale(60, 0.1),
        Upgrade.ReloadSpeedScale(80, 0.1),
        Upgrade.ShieldDamageChange(100, 1),
        Upgrade.ShieldDurationScale(120, 0.1),
        Upgrade.ReloadSpeedScale(150, 0.1),
    ]
}