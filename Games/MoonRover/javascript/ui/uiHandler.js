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
            if (button.isMouseOver() && !button.isDisabled) {
                mouseOverAnyButton = true;
                if (isMouseClicked()) {
                    button.onClick();
                    isMouseDown = false;
                    isMouseChanged = false;
                }
            }
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

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Loot: " + loot, 50, 21);
        ctx.fillText("Kills: " + killCount, 150, 21);
        ctx.fillText("Deaths: " + deathCount, 250, 21);
        ctx.fillText("Level: " + levelHandler.GetLevelNumber(), 370, 21);


        if (shopHandler.isInShop) {
            shopHandler.DrawShop();
        } else if (pauseHandler.isPaused) {

        } else {
            this.DrawSideBar();
            this.DrawHP()
        }

        for (let el of this.elements) {
            el.Draw();
        }

        let uiDrawTime = performance.now() - t0;
        if (this.debugMode) {
            this.DrawDebugLines([
                {text: "ms/frame", value: msPerFrame},
                {text: "ms/update", value: updateMsPerFrame},
                {text: "ms/draw", value: drawMsPerFrame},
                {text: "ms/ui", value: uiDrawTime},
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


    InitializeWeaponBar(x, ys, w, h) {
        if (this.initialized) return;
        this.initialized = true;

        for (let i=0; i<ys.length; i++) {
            let button = new Button(x, ys[i], "");
            button.width = w;
            button.height = h;
            button.onClick = weaponHandler.GetWeaponSelectHandler(i);
            this.elements.push(button);
        }
    }

    DrawSideBar() {
        let barWidth = 200;
        let barHeight = canvas.height;
        let margin = 10;

        let contentWidth = barWidth - margin*2;
        let portraitHeight = contentWidth / 1.5;

        let portraitImage = document.getElementById("dog-rover");

        let weaponCount = 4;
        let weaponBlockHeight = (barHeight - portraitHeight - 50 - margin*3) / weaponCount - margin; 

        ctx.fillStyle = "#3700B3cc";
        ctx.fillRect(0,0, barWidth, barHeight);
        
        ctx.fillStyle = "#170043cc";
        ctx.strokeStyle = "#170043";
        ctx.lineWidth = 4;
        ctx.fillRect(margin,margin, contentWidth, portraitHeight);
        ctx.drawImage(portraitImage, margin,margin, contentWidth, portraitHeight);
        ctx.strokeRect(margin,margin, contentWidth, portraitHeight);

        let weaponButtonYs = [0,1,2,3].map(i => portraitHeight + margin*2 + i * (weaponBlockHeight + margin))
        let weaponButtonX = margin;
        let weaponButtonWidth = contentWidth;
        let weaponButtonHeight = weaponBlockHeight;

        for (let i=0; i<weaponButtonYs.length; i++) {
            let weapon = weaponHandler.inventory[i];
            this.DrawWeaponButton(weaponButtonX, weaponButtonYs[i], weaponButtonWidth, weaponButtonHeight, weapon);
        }

        this.InitializeWeaponBar(weaponButtonX, weaponButtonYs, weaponButtonWidth, weaponButtonHeight);
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
        ctx.fillRect(x,y,w,h);
        if (isMouseOver) {
            ctx.fillStyle = "#00000044";
            ctx.fillRect(x,y,w,h);
        }
        
        if (isSelected) {
            ctx.strokeStyle = "#FFF4";
            ctx.strokeRect(x,y,w,h);
        }

        ctx.fillStyle = "#EEE";
        ctx.font = "700 15px Arial";
        ctx.textAlign = "left";
        ctx.fillText(weapon.name, x + padding, y + 15 + padding);

        // AMMO
        // might could cache out weapon boxes to a canvas to reduce draw calls per frame
        ctx.fillStyle = "#77F";
        let ammoBoxWidth = (w - padding*2) / weapon.clipSize;
        let ammoBoxHeight = 20;
        let ammoBoxY = y + 40;
        for (let i=0; i<weapon.clipSize; i++) {
            if (i >= weapon.shotsRemaining) {
                ctx.fillStyle = "#F77";
            }
            ctx.fillRect(x + padding + ammoBoxWidth*i,ammoBoxY,ammoBoxWidth-1,ammoBoxHeight);
            if (i == weapon.shotsRemaining) {
                let reloadRatio = Math.min(1, weapon.reloadTimer / weapon.reloadTime);
                ctx.fillStyle = "#77F";
                ctx.fillRect(x + padding + ammoBoxWidth*i,ammoBoxY+ammoBoxHeight,ammoBoxWidth-1,-ammoBoxHeight * reloadRatio);
            }
        }
    }

    DrawHP() {
        // HP
        let leftBound = 10;
        let upperBound = canvas.height - 50;
        let blockHeight = 40;
        let blockWidth = 17;
        let blockPadding = 0;   // space between HP blocks
        let blockBorder = 1;    // dark border around indiviual blocks

        ctx.fillStyle = "#0208";
        for (let i = 0; i < player.maxHp; i++) {
            ctx.fillRect(leftBound + i * (blockWidth + blockPadding + blockBorder),
                upperBound, blockWidth, blockHeight);
        }
        ctx.fillStyle = "#0A0A";
        for (let i = 0; i < player.hp; i++) {
            ctx.fillRect(leftBound + i * (blockWidth + blockPadding + blockBorder) + blockBorder,
                upperBound + blockBorder, blockWidth - blockBorder * 2, blockHeight - blockBorder * 2);
        }
    }

}