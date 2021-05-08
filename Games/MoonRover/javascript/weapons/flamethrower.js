class WeaponFlamethrower extends Weapon {
    name = "Flamethrower";
    flavor = "Great for dealing with crowds of baddies. "
    fireSound = "ow-01";

    initialUpgrades = [
        Upgrade.Flavor("Set foes aflame to deal steady damage", Upgrade.Direction.Good),
        Upgrade.Flavor("No kickback", Upgrade.Direction.Bad),
        Upgrade.Flavor("\nCreates flames in a vacuum... somehow", Upgrade.Direction.Neutral),
    ]
    
    kickbackPower = 0;
    fireRate = 20;
    reloadSpeed = 8;
    pelletSpeed = 0.5;
    fixedSpread = false;
    clipSize = 30;
    cost = 25;
    pierce = 10;
    pelletSpread = Math.PI / 6;
    pelletType = PlayerFlame;
    pelletDuration = 60 * 2;
    pelletGravityScale = 0;
    
    upgrades = [
        Upgrade.PelletsScale(35, .3),
        Upgrade.ReloadSpeedScale(40, 0.2),
        Upgrade.PelletSpeedScale(50, 0.2),
        Upgrade.PelletDurationScale(80, 0.3),
        Upgrade.SpreadScale(90, -0.5),
        Upgrade.PelletsScale(100, .3),
        Upgrade.ReloadSpeedScale(120, 0.2),
        Upgrade.PelletSpeedScale(150, 0.2),
    ]
}