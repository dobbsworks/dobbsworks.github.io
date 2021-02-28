class UIHandler {

    elements = [];
    history = [];
    debugMode = false;
    initialized = false;


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
                            button.onClick();
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
            shopHandler.DrawShop();
            this.DrawSideBar();
            this.DrawLevelInfo();
        } else if (pauseHandler.isPaused) {
            this.DrawLevelInfo();
        } else if (mainMenuHandler.isOnMainMenu) {

        } else {
            this.DrawSideBar();
            this.DrawLevelInfo();
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

    DrawLevelInfo() {
        ctx.fillStyle = "#00000077";
        ctx.fillRect(240, 0, 430, 31);
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.fillText("Loot: " + loot, 250, 21);
        ctx.fillText("Kills: " + killCount, 350, 21);
        ctx.fillText("Deaths: " + deathCount, 450, 21);
        ctx.fillText("Level: " + levelHandler.GetLevelNumber(), 570, 21);
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

        let weaponCount = 4;
        let weaponBlockHeight = (barHeight - portraitHeight - hpHeight - margin * 4) / weaponCount - margin;

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

        this.InitializeMainUI(weaponButtonX, weaponButtonYs, weaponButtonWidth, weaponButtonHeight);
        this.DrawHP(margin, barHeight - hpHeight - margin, contentWidth, hpHeight);
    }

    DrawPortrait(x, y, w, h) {
        let portraitBg = document.getElementById("dog-bg");
        let portraitImage = document.getElementById("dog-rover");

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

        if (player.hurtTimer > 0 || player.hp <= 1) {
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
        let ammoBoxY = y + 40;
        for (let i = 0; i < weapon.clipSize; i++) {
            if (i >= weapon.shotsRemaining) {
                ctx.fillStyle = "#F77";
            }
            ctx.fillRect(x + padding + ammoBoxWidth * i, ammoBoxY, ammoBoxWidth - 1, ammoBoxHeight);
            if (i == weapon.shotsRemaining) {
                let reloadRatio = Math.min(1, weapon.reloadTimer / weapon.reloadTime);
                ctx.fillStyle = "#949";
                ctx.fillRect(x + padding + ammoBoxWidth * i, ammoBoxY + ammoBoxHeight, ammoBoxWidth - 1, -ammoBoxHeight * reloadRatio);
            }
        }
    }

    DrawHP(x, y, w, h) {
        let blockBorder = 2;    // dark border around indiviual blocks
        let blockWidth = (w - blockBorder) / player.maxHp - blockBorder;

        ctx.fillStyle = "#0208";
        ctx.fillRect(x, y, w, h);
        for (let i = 0; i < player.maxHp; i++) {
            ctx.fillStyle = i < player.hp ? "#0A0A" : "#3008";
            ctx.fillRect(x + i * (blockWidth + blockBorder) + blockBorder,
                y + blockBorder, blockWidth, h - blockBorder * 2);
        }
    }
}