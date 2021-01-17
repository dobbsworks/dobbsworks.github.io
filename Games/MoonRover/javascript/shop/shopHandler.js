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

        let availableUpgrades = weaponHandler.inventory.flatMap(w => {
            let weaponUpgrades = w.GetAvailableUpgrades();
            let indexes = weaponUpgrades.map(u => w.upgrades.indexOf(u));
            return indexes.map(i => ({ weapon: w, upgradeIndex: i, upgrade: w.upgrades[i] }));
        })

        let buttonLocations = [50, 175, 300].flatMap(y => [25, 200].map(x => ({ x: x, y: y })));
        this.buyButtons = [];
        for (let buttonLocation of buttonLocations) {
            let upgrade = availableUpgrades.pop();
            if (upgrade) {
                let buttonText = upgrade.weapon.name + " Upgrade"
                    + "\n" + upgrade.upgrade.shortDescription
                    + "\n$" + upgrade.upgrade.cost;
                let buyButton = new Button(buttonLocation.x, buttonLocation.y, buttonText);

                let buttonAction = () => {
                    upgrade.weapon.ApplyUpgrade(upgrade.upgradeIndex);
                    buyButton.isDisabled = true;
                    buyButton.text = buyButton.text.split("$")[0] + "SOLD!";
                    loot -= upgrade.upgrade.cost;
                    shopHandler.RefreshAvailability();
                }
                buyButton.onClick = () => { shopHandler.GetPurchaseConfirmation(buttonAction); }
                buyButton.cost = upgrade.upgrade.cost;
                buyButton.upgrade = upgrade.upgrade;
                this.buyButtons.push(buyButton);
            }
        }
        shopHandler.RefreshAvailability();

        this.exitButton = new Button(550, 450, "Exit Shop");

        this.buyButtons.forEach(x => x.x = -300);
        this.exitButton.y += 300;
        this.exitButton.height = 50;
        this.exitButton.onClick = this.ExitShop;

        uiHandler.buttons = [];

        let buttonsToAdd = [...(this.buyButtons), this.exitButton];
        let buttonDelay = this.mogFace === this.mogFaces.logo ? 6500 : 100;
        for (let i = 0; i < buttonsToAdd.length; i++) {
            let button = buttonsToAdd[i];
            setTimeout(() => {
                uiHandler.buttons.push(button);
            }, buttonDelay + i * 300);
        }

        // easter egg buttons
        let eggs = [
            new Button(515, 373, ""),
            new Button(560, 356, ""),
            new Button(560, 403, ""),
            new Button(605, 417, ""),
        ];
        let faceList = Object.keys(shopHandler.mogFaces);
        eggs.forEach(x => {
            x.width = 30;
            x.height = 30;
            x.colorPrimary = "#F003";
            x.onClick = () => {shopHandler.SetTempFace(this.mogFaces[faceList[Math.floor(Math.random() * faceList.length)]])}
        });
        uiHandler.buttons.push(...eggs);
    }

    RefreshAvailability() {
        for (let button of this.buyButtons) {
            if (loot < button.cost) {
                button.isDisabled = true;
                if (!button.upgrade.isActive) {
                    button.tooExpensive = true;
                }
            }
        }
    }

    GetPurchaseConfirmation(onConfirmCallback) {
        uiHandler.buttons.forEach(x => {
            if (x !== shopHandler.exitButton) x.targetX -= 1000;
        });
        let cancelButton = new Button(25, 50, "Cancel");
        let confirmButton = new Button(200, 50, "Confirm!");
        [cancelButton, confirmButton].forEach(x => x.y -= 1000);
        let removeCancelConfirmButtons = () => {
            uiHandler.buttons = uiHandler.buttons.filter(x => x != cancelButton && x != confirmButton);
            uiHandler.buttons.forEach(x => {
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
        uiHandler.buttons.push(cancelButton, confirmButton);
        shopHandler.mogFace = (Math.random() > 0.5 ? this.mogFaces.hmm : this.mogFaces.owo);
    }

    ExitShop() {
        shopHandler.isInShop = false;
        shopHandler.mogFace = shopHandler.mogFaces.happy;
        uiHandler.buttons = [];
    }

    Update() {
        this.mogIntroTimer++;
        this.mogBlinkTimer--;
        if (this.mogBlinkTimer < -this.mogBlinkDuration) {
            this.mogBlinkTimer = Math.random() < 0.8 ? this.mogBlinkGapDuration : this.mogBlinkGapDurationShort;
        }
        if (this.mogIntroTimer === 200) this.mogFace = this.mogFaces.happy;
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
            ctx.drawImage(mogShopImage, 395, 65);
        }

        ctx.imageSmoothingEnabled = false;


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
            this.displayCtx.drawImage(mogs, face.x, face.y, face.w, face.h, 5, verticalOffset, face.w, face.h);
        }

        ctx.drawImage(this.displayCanvas, 441, 124, this.displayCanvas.width * 5, this.displayCanvas.height * 5)

        let mogShopGridImage = document.getElementById("image-mogshop-grid");
        if (mogShopGridImage && mogShopGridImage.width) {
            ctx.drawImage(mogShopGridImage, 441, 124);
        }

    }


}