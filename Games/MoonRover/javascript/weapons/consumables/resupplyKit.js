class WeaponResupplyKit extends WeaponBaseConsumable {
    name = "Resupply Kit";
    pelletType = null;
    OnFire() {
        let needReload = weaponHandler.inventory.some(a => a.canReload && a.shotsRemaining < a.clipSize);
        if (!needReload) return false;
        weaponHandler.ReloadAll();
        return true;
    }
}