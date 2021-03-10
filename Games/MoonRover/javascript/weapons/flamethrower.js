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
    
    upgrades = [
        Upgrade.ShotsScale(15, .5),
        Upgrade.PelletDurationScale(25, 0.3),
    ]
}