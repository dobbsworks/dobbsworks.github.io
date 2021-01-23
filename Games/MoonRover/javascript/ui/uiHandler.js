class UIHandler {

    elements = [];
    history = [];
    debugMode = false;

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
                }
            }
        }

        document.body.style.cursor = mouseOverAnyButton ? "pointer" : "unset";

        for (let el of this.elements) {
            el.x += (el.targetX - el.x) / 10;
            el.y += (el.targetY - el.y) / 10;
        }
    }

    FormatFPS(x) {
        return (Math.floor(1000 * x) / 1000).toFixed(3);
    }
    Draw() {
        let msPerFrame = performanceData.map(x => x.total).reduce((a, b) => a + b, 0) / performanceData.length;
        let drawMsPerFrame = performanceData.map(x => x.draw).reduce((a, b) => a + b, 0) / performanceData.length;
        let updateMsPerFrame = performanceData.map(x => x.update).reduce((a, b) => a + b, 0) / performanceData.length;
        //let fps = Math.floor(1000 / msPerFrame) * 1;
        let drawPercent = Math.floor(1000 * drawMsPerFrame / msPerFrame) / 10;

        let msPerFrameFormatted = this.FormatFPS(msPerFrame);
        let updateMsPerFrameFormatted = this.FormatFPS(updateMsPerFrame);
        let drawMsPerFrameFormatted = this.FormatFPS(drawMsPerFrame);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Loot: " + loot, 50, 21);
        ctx.fillText("Kills: " + killCount, 150, 21);
        ctx.fillText("Deaths: " + deathCount, 250, 21);
        ctx.fillText("Level: " + levelHandler.GetLevelNumber(), 370, 21);

        if (this.debugMode) {
            ctx.fillText("ms/frame: ", 550, 21);
            ctx.fillText("ms/update: ", 550, 40);
            ctx.fillText("ms/draw: ", 550, 59);
            ctx.fillText(msPerFrameFormatted, 650, 21);
            ctx.fillText(updateMsPerFrameFormatted, 650, 40);
            ctx.fillText(drawMsPerFrameFormatted, 650, 59);
        }


        // HP
        let leftBound = 10;
        let upperBound = canvas.height - 50;
        let blockHeight = 40;
        let blockWidth = 20;
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

        shopHandler.DrawShop();
        for (let el of this.elements) {
            el.Draw();
        }
    }

}