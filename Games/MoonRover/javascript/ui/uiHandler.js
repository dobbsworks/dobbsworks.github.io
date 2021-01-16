class UIHandler {

    buttons = [];

    Update() {
        if (isMouseClicked()) {
            for (let button of this.buttons) {
                if (button.isMouseOver()) {
                    button.onClick();
                }
            }
        }
        
        for (let button of this.buttons) {
            button.x += (button.targetX - button.x) / 10;
            button.y += (button.targetY - button.y) / 10;
        }
    }

    Draw() {

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Loot: " + loot, 110, 21);
        ctx.fillText("Kills: " + killCount, 210, 21);
        ctx.fillText("Deaths: " + deathCount, 310, 21);
        ctx.fillText("Level: " + levelHandler.GetLevelNumber(), 460, 21);

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
        for (let button of this.buttons) {
            button.Draw();
        }
    }

}