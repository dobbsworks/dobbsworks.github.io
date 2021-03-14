class WeaponBaseGrenade extends Weapon {
    name = "Base Grenade";
    flavor = "This shouldn't ever show up! :) "

    clipSize = 1;
    holsterReloadRatio = 1;
    midAirReloadRatio = 1;
    reloadSpeed = 0.125;

    triggeredWeapon = null; // NEED TO OVERRIDE IN SUBCLASS
    explodeOnEnemy = true;
    explodeOnWall = true;
    explodeOnExpire = true;
    pelletDuration = 60 * 3;
    pelletGravityScale = 1;
    pelletSpeed = 2;
}