class WeaponHandler {
    inventory = [
        new WeaponShotgun(),
        //new WeaponJetpack(),
    ];

    oldWeaponIndex = 0;
    selectedWeaponIndex = 0;

    AddWeapon(weapon) {
        this.inventory.push(weapon);
        this.CreateInventoryBar();
    }

    CreateInventoryBar() {
        // creates the divs for inv bar, sets handlers
        let container = document.getElementById("weaponContainer");
        container.innerHTML = "";
        for (let weapon of this.inventory) {
            let div = document.createElement("div");
            div.innerHTML = weapon.name;
            let weaponIndex = this.inventory.indexOf(weapon);
            div.onclick = this.GetWeaponSelectHandler(weaponIndex);
            container.appendChild(div);
        }
    }

    GetWeaponSelectHandler(index) {
        return () => weaponHandler.SelectWeaponByIndex(index);
    }

    UpdateInventoryBar() {
        // draw cooldown animations, etc.

    }

    SelectWeaponByIndex(index) {
        this.selectedWeaponIndex = index;
        if (this.selectedWeaponIndex < 0) {
            this.selectedWeaponIndex = 0;
        }
        if (this.selectedWeaponIndex >= this.inventory.length) {
            this.selectedWeaponIndex = this.inventory.length-1;
        }
    }

    GetCurrent() {
        return this.inventory[this.selectedWeaponIndex];
    }

    Update() {
        if (mouseScroll !== 0) {
            let chosenIndex = this.selectedWeaponIndex + mouseScroll;
            this.SelectWeaponByIndex(chosenIndex);
        }

        let isPlayerOnGround = player && player.isOnGround;
        let currentWeapon = this.GetCurrent();
        if (currentWeapon) {
            currentWeapon.Update();
            if (isPlayerOnGround) {
                currentWeapon.shotsSinceLastLanding = 0;
            }
        }
        if (this.oldWeaponIndex !== this.selectedWeaponIndex) {
            currentWeapon.SwitchTo();
        }
        this.oldWeaponIndex = this.selectedWeaponIndex;
        this.UpdateInventoryBar();
    }
}