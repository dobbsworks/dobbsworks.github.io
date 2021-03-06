class WeaponHandler {
    inventory = [];
    oldWeaponIndex = 0;
    selectedWeaponIndex = 0;

    GetWeaponsAndSubweapons() {
        // for weapons like grenades that trigger other weapons
        let ret = [...this.inventory];
        for (let i = 0; i < ret.length; i++) {
            let child = ret[i].triggeredWeapon;
            if (child) {
                let rootParent = ret[i].rootParent;
                if (!rootParent) rootParent = ret[i];
                child.rootParent = rootParent;
                ret.push(child);
            }
        }
        return ret;
    }

    AddWeapon(weapon) {
        if (!weapon.initialized) {
            weapon.initialized = true;
            weapon.ApplyInitialUpgrades();
        }
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
            if (weapon.canReload) {
                weapon.shotsRemaining = weapon.clipSize;
            }
        }
    }

    SwapWeapons(index1, index2) {
        if (this.inventory[index1] && this.inventory[index2]) {
            let tmp = this.inventory[index1];
            this.inventory[index1] = this.inventory[index2];
            this.inventory[index2] = tmp;
        }
    }

    Update() {
        if (!player.isActive) return;
        if (mouseScroll !== 0) {
            let chosenIndex = this.selectedWeaponIndex + mouseScroll;
            this.SelectWeaponByIndex(chosenIndex);
        }

        let currentWeapon = this.GetCurrent();
        if (!currentWeapon) return;
        for (let weapon of this.inventory) {
            let isHolstered = (weapon !== currentWeapon);
            weapon.Update(isHolstered);
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