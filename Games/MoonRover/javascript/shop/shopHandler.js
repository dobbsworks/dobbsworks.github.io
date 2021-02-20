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
    sellButton = null;
    exitButton = null;



    // menu stack
    currentButtonSet = []; // list of buttons/panels [cancelButton, buyButton, infoPanel]
    savedButtonSets = [];  // list of lists of previous menus [mainMenu, sellMenu]
    ReturnToPreviousMenu() {
        uiHandler.elements = uiHandler.elements.filter(x => this.currentButtonSet.indexOf(x) === -1);
        shopHandler.currentButtonSet = shopHandler.savedButtonSets.pop();
        shopHandler.currentButtonSet.forEach(a => a.targetY += 1000);
    }
    MoveToNewMenu(items) {
        uiHandler.elements.push(...items);
        shopHandler.currentButtonSet.forEach(a => a.targetY -= 1000);
        shopHandler.savedButtonSets.push(shopHandler.currentButtonSet);
        shopHandler.currentButtonSet = items;
        shopHandler.currentButtonSet.forEach(a => a.y += 1000);
    }



    EnterShop() {
        audioHandler.SetBackgroundMusic("");
        weaponHandler.ReloadAll();
        isMouseDown = false;
        isMouseChanged = false;
        this.isInShop = true;
        uiHandler.Shelve();
        if (this.mogIntroTimer > 0) {
            this.InitializeButtons();
            audioHandler.SetBackgroundMusic("music-shop");
        }
    }

    GetRandomWeapon() {
        let weaponClasses = [WeaponShotgun, WeaponJetpack];
        let unowned = weaponClasses.filter(x => !weaponHandler.inventory.some(y => y instanceof x));
        if (unowned.length === 0) return null;
        let toSell = unowned[Math.floor(Math.random() * unowned.length)];
        return new toSell();
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

    GetButtonLocations() {
        return [50, 175, 300].flatMap(y => [225, 400].map(x => ({ x: x, y: y })));
    }

    InitializeButtons() {
        this.currentButtonSet = [];
        this.savedButtonSets = [];
        let availableWeapon = this.GetRandomWeapon();
        let availableUpgrades = this.GetRandomUpgrades(4);
        let buttonLocations = this.GetButtonLocations();
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

        let sellButtonlocation = buttonLocations.splice(0,1)[0];
        this.sellButton = new Button(sellButtonlocation.x, sellButtonlocation.y, "Sell Weapons");
        this.sellButton.onClick = this.OnClickSell;
        this.sellButton.colorPrimary = this.sellButton.colorPrimaryVariant;
        this.buyButtons.push(this.sellButton);

        // upgrade buttons
        for (let buttonLocation of buttonLocations) {
            let upgrade = availableUpgrades.pop();
            if (upgrade) {
                let buyButton = this.GetBuyButton(buttonLocation, upgrade, 
                    upgrade.weapon.name,
                    upgrade.upgrade.shortDescription,
                    upgrade.upgrade.cost);
                this.buyButtons.push(buyButton);
            }
        }
        shopHandler.RefreshAvailability();

        this.exitButton = new Button(canvas.width - 150, 450, "Exit Shop");
        this.exitButton.height = 50;
        this.exitButton.onClick = this.ExitShop;
        uiHandler.elements.push(this.exitButton);

        let buttonsToAdd = [...(this.buyButtons)];
        shopHandler.MoveToNewMenu(buttonsToAdd);
        this.CreateEasterEggButtons();
    }


    OnClickSell() {
        let buttonLocations = shopHandler.GetButtonLocations();
        
        let sellButtons = [];
        for (let i=0; i<weaponHandler.inventory.length; i++) {
            let weapon = weaponHandler.inventory[i];
            if (weapon) {
                let pos = buttonLocations[i+2];
                let cost = weapon.GetSellPrice();
                let button = new Button(pos.x, pos.y, `${weapon.name}\n$${cost}`);
                button.onClick = () => {
                    let promptText = `Sell ${weapon.name} for $${cost}?`;
                    let sellAction = () => {
                        loot += cost;
                        let index = weaponHandler.inventory.indexOf(weapon);
                        weaponHandler.inventory.splice(index,1);
                        shopHandler.ReturnToPreviousMenu();
                        shopHandler.RefreshAvailability();
                    }
                    shopHandler.ConfirmSelection(promptText, weapon.name, "", weapon.flavor + "\n\n" + weapon.GetBreakdownText(), sellAction); 
                }
                sellButtons.push(button);
            }
        }
        let cancelButton = new Button(buttonLocations[0].x, buttonLocations[0].y, "Cancel");
        sellButtons.push(cancelButton);
        cancelButton.width += buttonLocations[1].x - buttonLocations[0].x;
        cancelButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
        }

        shopHandler.MoveToNewMenu(sellButtons);
    }

    GetBuyButton(buttonLocation, upgradeOrWeapon, name, shortDescr, cost) {
        let upgrade = upgradeOrWeapon.upgrade;
        let weapon = upgrade ? null : upgradeOrWeapon;
        let buttonText = name + "\n" + shortDescr + "\n$" + (cost ? cost : "FREE!");
        let buyButton = new Button(buttonLocation.x, buttonLocation.y, buttonText);

        let buttonAction = () => {
            if (upgrade) {
                upgradeOrWeapon.weapon.ApplyUpgradeByIndex(upgradeOrWeapon.upgradeIndex);
                upgradeOrWeapon.weapon.level++;
            }
            if (weapon) {
                weaponHandler.AddWeapon(weapon);
            }
            buyButton.isDisabled = true;
            buyButton.text = buyButton.text.split("$")[0] + "SOLD!";
            loot -= cost;
            shopHandler.RefreshAvailability();
        }
        buyButton.cost = cost;
        buyButton.upgrade = weapon || upgrade;
        buyButton.title = name;
        buyButton.flavor = weapon ? weapon.flavor : `Give the ${upgradeOrWeapon.weapon.name} a little bit extra!`;
        buyButton.shortDescription = shortDescr;
        buyButton.breakdownText = (upgrade || weapon).GetBreakdownText();
        let promptText = `Purchase ${buyButton.title} for $${buyButton.cost}?`;
        buyButton.onClick = () => { shopHandler.ConfirmSelection(promptText, buyButton.title, buyButton.shortDescription, buyButton.flavor + "\n\n" + buyButton.breakdownText, buttonAction); }
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
        for (let button of shopHandler.buyButtons) {
            if (loot < button.cost) {
                button.isDisabled = true;
                if (button.upgrade && !button.upgrade.isActive) {
                    button.tooExpensive = true;
                }
            } else {
                if (button.tooExpensive) {
                    button.tooExpensive = false;
                    button.isDisabled = false;
                }
            }
        }
        if (weaponHandler.inventory.length <= 1) {
            this.sellButton.isDisabled = true;
        } else {
            this.sellButton.isDisabled = false;
        }
    }

    ConfirmSelection(prompt, panelTitle, panelSub, flavor, onConfirm) {
        let buttonLocations = this.GetButtonLocations();
        let cancelButton = new Button(buttonLocations[0].x, buttonLocations[0].y+50, "Cancel");
        let confirmButton = new Button(buttonLocations[1].x, buttonLocations[1].y+50, "Confirm!");
        [cancelButton, confirmButton].forEach(a => { a.height -=50})

        let titlePanel = new Panel(buttonLocations[0].x, buttonLocations[0].y, 325, 25);
        titlePanel.colorPrimary = "#022e0aCC";
        let confirmText = new Text(buttonLocations[0].x + 10, buttonLocations[0].y + 18, prompt);
        confirmText.isBold = true;
        confirmText.textAlign = "left";

        let bgPanel = new Panel(buttonLocations[2].x, buttonLocations[2].y, 325, 250);
        bgPanel.colorPrimary = "#020a2eCC";
        let titleBox = new Text(235, 200, panelTitle);
        titleBox.textAlign = "left";
        titleBox.isBold = true;
        let shortDescrBox = new Text(540, 200, panelSub);
        shortDescrBox.textAlign = "right";

        let flavorText = new Text(382, 240, flavor);
        flavorText.maxWidth = bgPanel.width - 20;

        let newElements = [titlePanel, confirmText, bgPanel, cancelButton, confirmButton, titleBox, shortDescrBox, flavorText];

        cancelButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
            shopHandler.mogFace = (this.mogFaces.sad);
            audioHandler.PlaySound("mog-sad");
        }
        confirmButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
            onConfirm();
            weaponHandler.ReloadAll();
            shopHandler.SetTempFace(this.mogFaces.champ);
            audioHandler.PlaySound("mog-happy");
        }
        shopHandler.MoveToNewMenu(newElements);
        shopHandler.mogFace = (Math.random() > 0.5 ? this.mogFaces.hmm : this.mogFaces.owo);
        audioHandler.PlaySound("mog-hmm");
    }

    ExitShop() {
        shopHandler.isInShop = false;
        shopHandler.mogFace = shopHandler.mogFaces.happy;
        uiHandler.Restore();
        levelHandler.LoadZone();
        audioHandler.SetBackgroundMusic(levelHandler.currentMusic);
    }

    Update() {
        this.mogBlinkTimer--;
        if (this.mogBlinkTimer < -this.mogBlinkDuration) {
            this.mogBlinkTimer = Math.random() < 0.8 ? this.mogBlinkGapDuration : this.mogBlinkGapDurationShort;
        }

        if (this.mogIntroTimer < 200) {
            this.mogIntroTimer++;
            if (isMouseDown) this.mogIntroTimer += 5;
            if (this.mogIntroTimer <= 100 && this.mogIntroTimer >= 94) {
                audioHandler.PlaySound("mog-intro");
            }
            if (this.mogIntroTimer >= 200) {
                this.mogFace = this.mogFaces.happy;
                this.InitializeButtons();
                audioHandler.SetBackgroundMusic("music-shop");
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