class WeaponHandler {
    inventory = [
        new WeaponShotgun(),
        new WeaponShotgun(),
        new WeaponTest(),
    ];

    oldWeaponIndex = 0;
    selectedWeaponIndex = 0;

    AddWeapon(weapon) {
        this.inventory.push(weapon);
    }

    GetWeaponSelectHandler(index) {
        return () => weaponHandler.SelectWeaponByIndex(index);
    }

    SelectWeaponByIndex(index) {
        this.selectedWeaponIndex = index;
        if (this.selectedWeaponIndex < 0) {
            this.selectedWeaponIndex = 0;
        }
        if (this.selectedWeaponIndex >= this.inventory.length) {
            this.selectedWeaponIndex = this.inventory.length - 1;
        }
    }

    GetCurrent() {
        return this.inventory[this.selectedWeaponIndex];
    }

    ReloadAll() {
        for (let weapon of this.inventory) {
            weapon.shotsRemaining = weapon.clipSize;
        }
    }

    Update() {
        if (mouseScroll !== 0) {
            let chosenIndex = this.selectedWeaponIndex + mouseScroll;
            this.SelectWeaponByIndex(chosenIndex);
        }

        let currentWeapon = this.GetCurrent();
        if (currentWeapon) {
            currentWeapon.Update();
        }
        if (this.oldWeaponIndex !== this.selectedWeaponIndex) {
            let oldWeapon = weaponHandler.inventory[this.oldWeaponIndex];
            if (oldWeapon) oldWeapon.SwitchFrom();
            currentWeapon.SwitchTo();
        }
        this.oldWeaponIndex = this.selectedWeaponIndex;

        for (let weapon of this.inventory) {
            if (!weapon.initialized) {
                weapon.initialized = true;
                weapon.ApplyInitialUpgrades();
            }
        }
    }
}