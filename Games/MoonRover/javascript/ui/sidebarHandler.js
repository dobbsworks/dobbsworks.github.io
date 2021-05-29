class SidebarHandler {

    initialized = false;
    goldenGradient = null;
    toMoveIndex = -1;

    Initialize() {
        this.initialized = true;
        this.goldenGradient = ctx.createLinearGradient(0, 0, 200, 50);
        this.goldenGradient.addColorStop(0, "#BF953F");
        this.goldenGradient.addColorStop(.25, "#FCF6BA");
        this.goldenGradient.addColorStop(.5, "#B38728");
        this.goldenGradient.addColorStop(.75, "#FBF5B7");
        this.goldenGradient.addColorStop(1, "#AA771C");
    }

    DrawSideBar() {
        this.Initialize();
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

        this.DrawPortrait(margin, margin, contentWidth, portraitHeight);

        // speedometer
        let text = "";
        let speeds = achievementHandler.playerSpeeds;
        if (speeds.length) {
            let speed = speeds[speeds.length - 1];
            text = speed.toFixed(1);
            if (text.length === 3) text = "0" + text;
        }
        ctx.fillStyle = "#47d59b";
        let fontSize = 12;
        ctx.font = fontSize + "px Courier New";
        ctx.textAlign = "left";
        ctx.fillText(text, margin + 4, margin + portraitHeight - 5);

        let weaponButtonYs = [0, 1, 2, 3].map(i => portraitHeight + margin * 2 + i * (weaponBlockHeight + margin))
        let weaponButtonX = margin;
        let weaponButtonWidth = contentWidth;
        let weaponButtonHeight = weaponBlockHeight;

        for (let i = 0; i < weaponButtonYs.length; i++) {
            let weapon = weaponHandler.inventory[i];
            let xOffset = 0;
            let isMoving = (this.toMoveIndex === i);
            this.DrawWeaponButton(weaponButtonX + xOffset, weaponButtonYs[i], weaponButtonWidth, weaponButtonHeight, weapon, isMoving);
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
        let srcIndex = Math.floor(uiHandler.timer / 4) % (coinImage.width / coinSrcSize);
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



    DrawWeaponButton(x, y, w, h, weapon, isMoving) {
        if (isMoving) {
            x += Math.sin(uiHandler.timer / 20) * 4 + 4;
        }
        if (!weapon) return;
        let padding = 5;

        ctx.lineWidth = 4;
        let isSelected = (weaponHandler.GetCurrent() === weapon);
        let isMouseOver = (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h);
        ctx.fillStyle = "#170043cc";
        if (weapon.shotsRemaining >= weapon.clipSize) ctx.fillStyle = "#070043cc";
        if (weapon.isGold) ctx.fillStyle = this.goldenGradient;
        if (weapon.shotsRemaining <= 0) ctx.fillStyle = "#330007";
        ctx.fillRect(x, y, w, h);
        if (isMouseOver) {
            ctx.fillStyle = "#00000044";
            ctx.fillRect(x, y, w, h);
        }

        if (isSelected) {
            ctx.strokeStyle = "#FFF4";
            ctx.strokeRect(x, y, w, h);
        }

        ctx.font = "700 15px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "#EEE";
        if (weapon.isGold) ctx.fillStyle = "#000";
        let name = weapon.GetDisplayName();
        ctx.fillText(name, x + padding, y + 15 + padding);

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
            if (weapon.canReload) {
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
            } else {
                ctx.beginPath()
                ctx.arc(x + padding + 25 * i + 10, ammoBoxY + 10, 10, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        if (isMoving) {
            ctx.fillStyle = "#00000088";
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "700 12px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Click a weapon to swap slots", x + w / 2, y + h * 0.6, w);
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
        let blockWidth = (fullWidth) / drawnMax;
        for (let i = 1; i <= drawnMax; i++) {
            ctx.fillRect(x + blockBorder / 2 + blockWidth * i, y + blockBorder, blockBorder, h - blockBorder * 2);
        }
    }

    InitializeMainUI(x, ys, w, h) {
        if (uiHandler.initialized) return;
        uiHandler.initialized = true;

        for (let i = 0; i < ys.length; i++) {
            let button = new Button(x, ys[i], "");
            button.width = w;
            button.height = h;
            button.ignoreGamepad = true;
            button.sidebarWeapon = i;
            button.onClick = () => {
                if (sidebarHandler.toMoveIndex === -1) {
                    weaponHandler.SelectWeaponByIndex(i);
                } else {
                    weaponHandler.SwapWeapons(i, sidebarHandler.toMoveIndex);
                }
            }
            button.onHold = () => {
                sidebarHandler.toMoveIndex = i;
            }
            uiHandler.elements.push(button);
        }

        let pauseButton = new Button(10, 10, "");
        pauseButton.width = 180;
        pauseButton.height = 120;
        pauseButton.ignoreGamepad = true;
        pauseButton.onClick = pauseHandler.onPauseButtonPressed;
        uiHandler.elements.push(pauseButton)
    }
}