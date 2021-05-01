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
    ]
}