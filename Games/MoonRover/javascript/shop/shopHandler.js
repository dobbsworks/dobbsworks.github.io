class ShopHandler {
    
    constructor() {
        this.displayCanvas = document.createElement("canvas");
        this.displayCanvas.width = 47;
        this.displayCanvas.height = 36;
        this.displayCanvas.style.display = "none";
        this.displayCtx = this.displayCanvas.getContext('2d');
        setTimeout(() => {
            document.body.appendChild(this.displayCanvas);
        },100);

        setTimeout(() => {
            //shopHandler.EnterShop()
        },200);
    }

    displayCanvas = null;
    displayCtx = null;
    isInShop = false;
    mogBlinkTimer = 0;
    mogBlinkGapDuration = 60*4;
    mogBlinkGapDurationShort = 30;
    mogBlinkDuration = 7;
    mogIntroTimer = -180;
    mogTempFaceTimer = 0;

    mogFaces = {
        "logo": {x: 0, y: 0, w: 37, h: 36},
        "happy": {x: 37, y: 0, w: 37, h: 36},
        "sad": {x: 74, y: 0, w: 37, h: 36},
        "champ": {x: 111, y: 0, w: 37, h: 36},
        "hmm": {x: 0, y: 36, w: 37, h: 36},
        "blink": {x: 37, y: 36, w: 37, h: 36},
        "dead": {x: 74, y: 36, w: 37, h: 36},
        "owo": {x: 111, y: 36, w: 37, h: 36},
    }
    mogFace = this.mogFaces.logo;

    EnterShop() {
        this.isInShop = true;

        let availableUpgrades = weaponHandler.inventory.flatMap(w => {
            let weaponUpgrades = w.GetAvailableUpgrades();
            let indexes = weaponUpgrades.map(u => w.upgrades.indexOf(u));
            return indexes.map(i => ({weapon: w, upgradeIndex: i}));
        })

        let buttonLocations = [50, 175, 300].flatMap(y => [25,200].map(x => ({x:x, y:y})));
        let buyButtons = [];
        for (let buttonLocation of buttonLocations) {
            let upgrade = availableUpgrades.pop();
            if (upgrade) {
                let buyButton = new Button(buttonLocation.x, buttonLocation.y, "Upgrade \n" + upgrade.weapon.name);
                buyButton.onClick = () => {
                    upgrade.weapon.ApplyUpgrade(upgrade.upgradeIndex);
                    buyButton.isDisabled = true;
                }
                buyButtons.push(buyButton);
            }
        }

        let exitButton = new Button(550,450, "Exit Shop");

        buyButtons.forEach(x => x.x = -300);
        exitButton.y += 300;
        exitButton.onClick = this.ExitShop;

        uiHandler.buttons = [];

        let buttonsToAdd = [...buyButtons, exitButton];
        let buttonDelay = this.mogFace === this.mogFaces.logo ? 6500 : 100;
        for (let i=0; i<buttonsToAdd.length; i++) {
            let button = buttonsToAdd[i];
            setTimeout(() => {
                uiHandler.buttons.push(button);
            }, buttonDelay + i*300);
        }

    }

    ExitShop() {
        shopHandler.isInShop = false;
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

    OnBuy() {
        this.SetTempFace(this.mogFaces.champ);
    }

    OnCancel() {
        this.SetTempFace(this.mogFaces.sad);
    }

    SetTempFace(face) {
        this.mogFace = face;
        this.mogTempFaceTimer = 60;
    }

    DrawShop() {
        if (!this.isInShop) return;

        let mogShopImage = document.getElementById("image-mogshop");
        if (mogShopImage && mogShopImage.width) {
            ctx.drawImage(mogShopImage, 395,65);
        }

        ctx.imageSmoothingEnabled = false;


        this.displayCtx.clearRect(0,0,this.displayCanvas.width,this.displayCanvas.height);
        // this.displayCtx.font = "900 8px Verdana";
        // this.displayCtx.fillStyle = "#141414";
        // this.displayCtx.fillText("TEST",4,12);

        let mogs = document.getElementById("image-mogs");
        if (mogs && mogs.width) {
            let face = this.mogFace;

            let verticalOffset = face === this.mogFaces.happy ?
                -2 + Math.floor(Math.sin((new Date())/1000*3)*2) :
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

        ctx.drawImage(this.displayCanvas,441,124,this.displayCanvas.width*5, this.displayCanvas.height*5)

        let mogShopGridImage = document.getElementById("image-mogshop-grid");
        if (mogShopGridImage && mogShopGridImage.width) {
            ctx.drawImage(mogShopGridImage, 441,124);
        }

    }


}