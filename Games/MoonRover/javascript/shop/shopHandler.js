class ShopHandler {

    constructor() {
        this.displayCanvas = document.createElement("canvas");
        this.displayCanvas.width = 47;
        this.displayCanvas.height = 36;
        this.displayCanvas.style.display = "none";
        this.displayCtx = this.displayCanvas.getContext('2d');
        setTimeout(() => {
            document.body.appendChild(this.displayCanvas);
        }, 100);

        setTimeout(() => {
            //shopHandler.EnterShop()
        }, 200);
    }

    displayCanvas = null;
    displayCtx = null;
    isInShop = false;
    mogBlinkTimer = 0;
    mogBlinkGapDuration = 60 * 4;
    mogBlinkGapDurationShort = 30;
    mogBlinkDuration = 7;
    mogIntroTimer = -180;
    mogTempFaceTimer = 0;

    mogFaces = {
        "logo": { x: 0, y: 0, w: 37, h: 36 },
        "happy": { x: 37, y: 0, w: 37, h: 36 },
        "sad": { x: 74, y: 0, w: 37, h: 36 },
        "champ": { x: 111, y: 0, w: 37, h: 36 },
        "hmm": { x: 0, y: 36, w: 37, h: 36 },
        "blink": { x: 37, y: 36, w: 37, h: 36 },
        "dead": { x: 74, y: 36, w: 37, h: 36 },
        "owo": { x: 111, y: 36, w: 37, h: 36 },
    }
    mogFace = this.mogFaces.logo;
    buyButtons = [];
    exitButton = null;

    EnterShop() {
        this.isInShop = true;
        uiHandler.Shelve();
        if (this.mogIntroTimer > 0) this.InitializeButtons();
    }

    GetRandomWeapon() {
        if (!weaponHandler.inventory.some(x => x instanceof WeaponJetpack)) {
            return new WeaponJetpack();
        }
        return null;
    }

    GetRandomUpgrades(num) {
        let availableUpgrades = weaponHandler.inventory.flatMap(w => {
            let weaponUpgrades = w.GetAvailableUpgrades();
            let indexes = weaponUpgrades.map(u => w.upgrades.indexOf(u));
            return indexes.map(i => ({ weapon: w, upgradeIndex: i, upgrade: w.upgrades[i] }));
        });
        let ret = [];
        for (let i=0; i<num; i++) {
            let upgrade = availableUpgrades.splice(Math.floor(Math.random() * availableUpgrades.length),1)[0];
            if (upgrade) ret.push(upgrade);
        }
        return ret;
    }

    InitializeButtons() {
        let availableWeapon = this.GetRandomWeapon();
        let availableUpgrades = this.GetRandomUpgrades(4);
        let buttonLocations = [50, 175, 300].flatMap(y => [25, 200].map(x => ({ x: x, y: y })));
        this.buyButtons = [];

        // new weapon
        let weaponButtonlocation = buttonLocations.splice(0,1)[0];
        if (availableWeapon) {
            let buyButton = this.GetBuyButton(weaponButtonlocation, availableWeapon,
                availableWeapon.name,
                "New weapon",
                availableWeapon.cost);
                buyButton.colorPrimary = buyButton.colorPrimaryVariant;
            this.buyButtons.push(buyButton);
        } else {
            let buyButton = new Button(weaponButtonlocation.x, weaponButtonlocation.y, "Out of stock!\nCheck back soon");
            buyButton.isDisabled = true;
            this.buyButtons.push(buyButton);
        }

        // upgrade buttons
        for (let buttonLocation of buttonLocations) {
            let upgrade = availableUpgrades.pop();
            if (upgrade) {
                let buyButton = this.GetBuyButton(buttonLocation, upgrade, 
                    upgrade.weapon.name + " Upgrade",
                    upgrade.upgrade.shortDescription,
                    upgrade.upgrade.cost);
                this.buyButtons.push(buyButton);
            }
        }
        shopHandler.RefreshAvailability();

        this.exitButton = new Button(canvas.width - 150, 450, "Exit Shop");
        this.exitButton.height = 50;
        this.exitButton.onClick = this.ExitShop;

        let buttonsToAdd = [...(this.buyButtons), this.exitButton];
        for (let i = 0; i < buttonsToAdd.length; i++) {
            let button = buttonsToAdd[i];
            button.x -= i * Math.pow(10,i);
            uiHandler.elements.push(button);
        }

        this.CreateEasterEggButtons();
    }

    GetBuyButton(buttonLocation, upgradeOrWeapon, name, shortDescr, cost) {
        let upgrade = upgradeOrWeapon.upgrade;
        let weapon = upgrade ? null : upgradeOrWeapon;
        let buttonText = name + "\n" + shortDescr + "\n$" + (cost ? cost : "FREE!");
        let buyButton = new Button(buttonLocation.x, buttonLocation.y, buttonText);

        let buttonAction = () => {
            if (upgrade) upgradeOrWeapon.weapon.ApplyUpgradeByIndex(upgradeOrWeapon.upgradeIndex);
            if (weapon) {
                weaponHandler.AddWeapon(weapon);
            }
            buyButton.isDisabled = true;
            buyButton.text = buyButton.text.split("$")[0] + "SOLD!";
            loot -= cost;
            shopHandler.RefreshAvailability();
        }
        buyButton.onClick = () => { shopHandler.GetPurchaseConfirmation(buyButton, buttonAction); }
        buyButton.cost = cost;
        buyButton.upgrade = weapon || upgrade;
        buyButton.title = name;
        buyButton.flavor = weapon ? weapon.flavor : `Give the ${upgradeOrWeapon.weapon.name} a little bit extra!`;
        buyButton.shortDescription = shortDescr;
        buyButton.breakdownText = (upgrade || weapon).GetBreakdownText();
        return buyButton;
    }

    CreateEasterEggButtons() {
        let eggs = [
            new Button(canvas.width - 185, 373, ""),
            new Button(canvas.width - 140, 356, ""),
            new Button(canvas.width - 140, 403, ""),
            new Button(canvas.width - 95, 417, ""),
        ];
        let faceList = Object.keys(shopHandler.mogFaces);
        eggs.forEach(x => {
            x.width = 30;
            x.height = 30;
            x.colorPrimary = "#F003";
            x.onClick = () => {shopHandler.SetTempFace(this.mogFaces[faceList[Math.floor(Math.random() * faceList.length)]])}
        });
        uiHandler.elements.push(...eggs);
    }

    RefreshAvailability() {
        for (let button of this.buyButtons) {
            if (loot < button.cost) {
                button.isDisabled = true;
                if (button.upgrade && !button.upgrade.isActive) {
                    button.tooExpensive = true;
                }
            }
        }
    }

    GetPurchaseConfirmation(buyButton, onConfirmCallback) {
        uiHandler.getButtons().forEach(x => {
            if (x !== shopHandler.exitButton) x.targetX -= 1000;
        });
        let cancelButton = new Button(25, 50, "Cancel");
        let confirmButton = new Button(200, 50, "Confirm!" + "\n$" + buyButton.cost);

        let bgPanel = new Panel(25, 175, 325, 250);
        bgPanel.colorPrimary = "#020a2eCC";
        let titleBox = new Text(35, 200, buyButton.title);
        titleBox.textAlign = "left";
        titleBox.isBold = true;
        let shortDescrBox = new Text(340, 200, buyButton.shortDescription);
        shortDescrBox.textAlign = "right";

        let flavorText = new Text(182, 240, buyButton.flavor + "\n\n" + buyButton.breakdownText);

        let newElements = [bgPanel, cancelButton, confirmButton, titleBox, shortDescrBox, flavorText];

        newElements.forEach(x => x.y -= 1000);
        let removeCancelConfirmButtons = () => {
            uiHandler.elements = uiHandler.elements.filter(x => (x instanceof Button) && (x != cancelButton && x != confirmButton));
            uiHandler.getButtons().forEach(x => {
                if (x !== shopHandler.exitButton) x.targetX += 1000;
            });
        }
        cancelButton.onClick = () => {
            removeCancelConfirmButtons();
            shopHandler.mogFace = (this.mogFaces.sad);
        }
        confirmButton.onClick = () => {
            removeCancelConfirmButtons();
            onConfirmCallback();
            shopHandler.SetTempFace(this.mogFaces.champ);
        }
        uiHandler.elements.push(...newElements);
        shopHandler.mogFace = (Math.random() > 0.5 ? this.mogFaces.hmm : this.mogFaces.owo);
    }

    ExitShop() {
        shopHandler.isInShop = false;
        shopHandler.mogFace = shopHandler.mogFaces.happy;
        uiHandler.Restore();
    }

    Update() {
        this.mogBlinkTimer--;
        if (this.mogBlinkTimer < -this.mogBlinkDuration) {
            this.mogBlinkTimer = Math.random() < 0.8 ? this.mogBlinkGapDuration : this.mogBlinkGapDurationShort;
        }

        if (this.mogIntroTimer < 200) {
            this.mogIntroTimer++;
            if (isMouseDown) this.mogIntroTimer += 5;
            if (this.mogIntroTimer >= 200) {
                this.mogFace = this.mogFaces.happy;
                this.InitializeButtons();
            }
        }

        if (this.mogTempFaceTimer > 0) {
            this.mogTempFaceTimer--;
            if (this.mogTempFaceTimer === 0) this.mogFace = this.mogFaces.happy;
        }
    }

    SetTempFace(face, duration) {
        this.mogFace = face;
        this.mogTempFaceTimer = duration || 120;
    }

    DrawShop() {
        if (!this.isInShop) return;

        let mogShopImage = document.getElementById("image-mogshop");
        if (mogShopImage && mogShopImage.width) {
            ctx.drawImage(mogShopImage, canvas.width - 305, 65);
        }

        this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        // this.displayCtx.font = "900 18px Verdana";
        // this.displayCtx.fillStyle = "#141414";
        // this.displayCtx.textAlign = "center"
        // this.displayCtx.fillText("TEST",this.displayCanvas.width/2,18);

        let mogs = document.getElementById("image-mogs");
        if (mogs && mogs.width) {
            let face = this.mogFace;

            let verticalOffset = face === this.mogFaces.happy || face === this.mogFaces.sad ?
                -2 + Math.floor(Math.sin((new Date()) / 1000 * 3) * 2) :
                0;
            if (face === this.mogFaces.logo) {
                verticalOffset = -10 + Math.floor(this.mogIntroTimer / 10);
                if (this.mogIntroTimer > 100) verticalOffset = 0;
            }
            if (face === this.mogFaces.happy && this.mogBlinkTimer < 0) {
                face = this.mogFaces.blink;
            }
            if (face) this.displayCtx.drawImage(mogs, face.x, face.y, face.w, face.h, 5, verticalOffset, face.w, face.h);
        }

        ctx.drawImage(this.displayCanvas, canvas.width - 259, 124, this.displayCanvas.width * 5, this.displayCanvas.height * 5)

        let mogShopGridImage = document.getElementById("image-mogshop-grid");
        if (mogShopGridImage && mogShopGridImage.width) {
            ctx.drawImage(mogShopGridImage, canvas.width - 259, 124);
        }

    }


}