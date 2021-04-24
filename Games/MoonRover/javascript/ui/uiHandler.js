class UIHandler {

    elements = [];
    history = [];
    debugMode = false;
    initialized = false;
    timer = 0;

    getButtons() {
        return this.elements.filter(x => x instanceof Button);
    }
    RemoveButtons() {
        this.elements = this.elements.filter(x => !(x instanceof Button));
    }

    Shelve() {
        // throws all ui elements on a history stack for later retrieval
        this.history.push(this.elements);
        this.elements = [];
    }

    Restore() {
        this.elements = this.history.pop();
    }

    Update() {
        this.timer++;
        let mouseOverAnyButton = false;
        for (let button of this.getButtons()) {
            if (button.isMouseOver()) {
                if (button.isDisabled) {
                    if (isMouseClicked()) {
                        audioHandler.PlaySound("beep-03");
                    }
                } else {
                    mouseOverAnyButton = true;
                    if (isMouseClicked()) {
                        if (button instanceof Toggle) {
                            button.Toggle();
                        } else {
                            if (button.onClick) button.onClick();
                            audioHandler.PlaySound("beep-02");
                        }
                        isMouseDown = false;
                        isMouseChanged = false;
                    }
                }
            }
        }

        for (let toggle of this.elements.filter(x => x instanceof Toggle)) {
            if (toggle.IsOn) toggle.state = toggle.IsOn();
        }

        document.body.style.cursor = mouseOverAnyButton ? "pointer" : "unset";

        for (let el of this.elements) {
            el.x += (el.targetX - el.x) / 10;
            el.y += (el.targetY - el.y) / 10;
        }
    }

    Draw() {
        let t0 = performance.now();

        let msPerFrame = performanceData.map(x => x.total).reduce((a, b) => a + b, 0) / performanceData.length;
        let drawMsPerFrame = performanceData.map(x => x.draw).reduce((a, b) => a + b, 0) / performanceData.length;
        let updateMsPerFrame = performanceData.map(x => x.update).reduce((a, b) => a + b, 0) / performanceData.length;
        //let fps = Math.floor(1000 / msPerFrame) * 1;

        if (shopHandler.isInShop) {
            this.DrawSideBar();
            this.DrawTimer();
            shopHandler.DrawShop();
        } else if (pauseHandler.isPaused) {

        } else if (mainMenuHandler.isOnMainMenu) {

        } else {
            this.DrawSideBar();
            this.DrawTimer();
        }

        for (let el of this.elements) {
            el.Draw();
        }

        let uiDrawTime = performance.now() - t0;
        if (this.debugMode) {
            this.DrawDebugLines([
                { text: "ms/frame", value: msPerFrame },
                { text: "ms/update", value: updateMsPerFrame },
                { text: "ms/draw", value: drawMsPerFrame },
                { text: "ms/ui", value: uiDrawTime },
            ])
        }
    }

    FormatFPS(x) {
        return (Math.floor(1000 * x) / 1000).toFixed(3);
    }

    DrawDebugLines(lines) {
        let y = 21;
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 150 - 10, 0, 160, lines.length * 19 + 12);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        for (let line of lines) {
            ctx.fillText(line.text + ": ", canvas.width - 150, y);
            ctx.fillText(this.FormatFPS(line.value), canvas.width - 50, y);
            y += 19;
        }
    }


    InitializeMainUI(x, ys, w, h) {
        if (this.initialized) return;
        this.initialized = true;

        for (let i = 0; i < ys.length; i++) {
            let button = new Button(x, ys[i], "");
            button.width = w;
            button.height = h;
            button.onClick = weaponHandler.GetWeaponSelectHandler(i);
            this.elements.push(button);
        }

        let pauseButton = new Button(10, 10, "");
        pauseButton.width = 180;
        pauseButton.height = 120;
        pauseButton.onClick = pauseHandler.onPauseButtonPressed;
        this.elements.push(pauseButton)
    }

    DrawSideBar() {
        let barWidth = 200;
        let barHeight = canvas.height;
        let margin = 10;
        let hpHeight = 40;

        let contentWidth = barWidth - margin * 2;
        let portraitHeight = contentWidth / 1.5;
        let extraDataHeight = hpHeight / 2;

        let weaponCount = 4;
        let weaponBlockHeight = (barHeight - portraitHeight - hpHeight - extraDataHeight - margin * 5) / weaponCount - margin;

        ctx.fillStyle = "#3700B3cc";
        ctx.fillRect(0, 0, barWidth, barHeight);

        this.DrawPortrait(margin, margin, contentWidth, portraitHeight)

        let weaponButtonYs = [0, 1, 2, 3].map(i => portraitHeight + margin * 2 + i * (weaponBlockHeight + margin))
        let weaponButtonX = margin;
        let weaponButtonWidth = contentWidth;
        let weaponButtonHeight = weaponBlockHeight;

        for (let i = 0; i < weaponButtonYs.length; i++) {
            let weapon = weaponHandler.inventory[i];
            this.DrawWeaponButton(weaponButtonX, weaponButtonYs[i], weaponButtonWidth, weaponButtonHeight, weapon);
        }

        this.DrawExtraData(margin, barHeight - hpHeight - extraDataHeight - margin * 2, contentWidth, extraDataHeight);

        this.InitializeMainUI(weaponButtonX, weaponButtonYs, weaponButtonWidth, weaponButtonHeight);
        this.DrawHP(margin, barHeight - hpHeight - margin, contentWidth, hpHeight);
    }

    DrawExtraData(x, y, w, h) {
        let coinImage = document.getElementById("coin");
        let coinSrcSize = coinImage.height;
        let coinScale = 2;
        let coinUiSize = coinSrcSize * coinScale;
        let srcIndex = Math.floor(this.timer / 4) % (coinImage.width / coinSrcSize);
        ctx.drawImage(coinImage, coinSrcSize * srcIndex, 0, coinSrcSize, coinSrcSize, x + w - coinUiSize + coinScale, y - coinScale, coinUiSize, coinUiSize);

        let fontSize = h - 4;
        ctx.font = fontSize + "px Courier New";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.fillText(loot, x + w - coinUiSize, y + fontSize);

        ctx.textAlign = "left";
        ctx.fillText("Level " + levelHandler.GetLevelNumber(), x, y + fontSize);
    }

    DrawPortrait(x, y, w, h) {
        let portraitBg = document.getElementById("dog-bg");
        let imageId = currentCharacter.imageId;
        let portraitImage = document.getElementById(imageId);

        ctx.fillStyle = "#170043cc";
        ctx.strokeStyle = "#170043";
        ctx.lineWidth = 4;
        ctx.fillRect(x, y, w, h);

        let shakeFactor = Math.min(10, Math.max(0, player.shake));
        let wiggleX = shakeFactor * Math.random() - shakeFactor / 2;
        let wiggleY = shakeFactor * Math.random() - shakeFactor / 2;
        ctx.drawImage(portraitBg, wiggleX / 2 + 5, wiggleY / 2 + 5, w / 2, h / 2, x, y, w, h);
        ctx.drawImage(portraitImage, wiggleX + 5, wiggleY + 5, w / 2, h / 2, x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        if ((player.hurtTimer > 0 || player.hp <= 1) && player.maxHp > 1) {
            let opacity = Math.min(0.5, player.hurtTimer / 60);
            if (player.hp <= 1) opacity = Math.max(0.5, Math.min(Math.sin(new Date() / 100), 0.8));
            ctx.fillStyle = `rgba(255,0,0,${opacity.toFixed(2)})`;
            ctx.globalCompositeOperation = "color";
            ctx.fillRect(x, y, w, h);
            ctx.globalCompositeOperation = "source-over";
        }
    }

    DrawWeaponButton(x, y, w, h, weapon) {
        if (!weapon) return;
        let padding = 5;

        ctx.lineWidth = 4;
        let isSelected = (weaponHandler.GetCurrent() === weapon);
        let isMouseOver = (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h);
        ctx.fillStyle = "#170043cc";
        if (weapon.shotsRemaining <= 0) ctx.fillStyle = "#330007";
        if (weapon.shotsRemaining >= weapon.clipSize) ctx.fillStyle = "#070043cc";
        ctx.fillRect(x, y, w, h);
        if (isMouseOver) {
            ctx.fillStyle = "#00000044";
            ctx.fillRect(x, y, w, h);
        }

        if (isSelected) {
            ctx.strokeStyle = "#FFF4";
            ctx.strokeRect(x, y, w, h);
        }

        ctx.fillStyle = "#EEE";
        ctx.font = "700 15px Arial";
        ctx.textAlign = "left";
        ctx.fillText(weapon.name, x + padding, y + 15 + padding);

        // AMMO
        // might could cache out weapon boxes to a canvas to reduce draw calls per frame
        ctx.fillStyle = "#77F";
        let ammoBoxWidth = (w - padding * 2) / weapon.clipSize;
        let ammoBoxHeight = 20;
        let ammoBoxY = y + h - ammoBoxHeight - padding;
        for (let i = 0; i < weapon.clipSize; i++) {
            if (i >= weapon.shotsRemaining) {
                ctx.fillStyle = "#F77";
            }
            ctx.fillRect(x + padding + ammoBoxWidth * i, ammoBoxY, ammoBoxWidth - 1, ammoBoxHeight);
            if (i == weapon.shotsRemaining) {
                let reloadRatio = Math.min(1, weapon.reloadTimer / weapon.reloadTime);
                ctx.fillStyle = "#949";
                if (ammoBoxHeight > ammoBoxWidth) {
                    ctx.fillRect(x + padding + ammoBoxWidth * i, ammoBoxY + ammoBoxHeight, ammoBoxWidth - 1, -ammoBoxHeight * reloadRatio);
                } else {
                    ctx.fillRect(x + padding + ammoBoxWidth * i, ammoBoxY + ammoBoxHeight, ammoBoxWidth * reloadRatio - 1, -ammoBoxHeight);

                }
            }
        }
    }

    DrawHP(x, y, w, h) {
        let drawnMax = player.maxHp;
        if (drawnMax === 1) drawnMax = 10;
        let blockBorder = 2;    // dark border around indiviual blocks
        ctx.fillStyle = "#020";
        ctx.fillRect(x, y, w, h);

        let fullWidth = w - blockBorder;
        ctx.fillStyle = "#300"
        ctx.fillRect(x + blockBorder, y + blockBorder, fullWidth, h - blockBorder * 2);

        ctx.fillStyle = "#0A0"
        let filledWidth = player.hp / drawnMax * fullWidth;
        ctx.fillRect(x + blockBorder, y + blockBorder, filledWidth, h - blockBorder * 2);


        ctx.fillStyle = "#020";
        let blockWidth = (fullWidth ) / drawnMax;
        for (let i = 1; i <= drawnMax; i++) {
            ctx.fillRect(x + blockBorder/2 + blockWidth * i, y + blockBorder, blockBorder, h - blockBorder * 2);
        }
    }

    DrawTimer() {
        timerHandler.DrawTimer();
    }
}