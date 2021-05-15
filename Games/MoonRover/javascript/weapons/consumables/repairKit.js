class WeaponRepairKit extends WeaponBaseConsumable {
    name = "Repair Kit";
    pelletType = null;
    OnFire() {
        if (!player) return false;
        if (player.hp <= 0) return false;
        if (player.hp >= player.maxHp) return false;
        player.hp += 1;
        if (player.hp > player.maxHp) player.hp = player.maxHp;
        return true;
    }
}