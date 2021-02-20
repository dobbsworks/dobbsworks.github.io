class WeaponTest extends Weapon {
    name = "The Dev Exit";
    flavor = "The rise and fall of Rover"
    initialUpgrades = [
        Upgrade.PelletsChange(0, 127),
        Upgrade.FireRateScale(3, 3),
        Upgrade.ShotsScale(3, 99),
        Upgrade.ReloadSpeedScale(0, 99),
        Upgrade.DamageScale(0, 99),
        Upgrade.Flavor("-35% respect", Upgrade.Direction.Bad),
    ];
    pelletSpread = Math.PI*2;

}