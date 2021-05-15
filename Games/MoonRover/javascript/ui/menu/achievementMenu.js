function OnClickAchievements() {
    uiHandler.Shelve();

    let margin = 25;
    let size = 72;

    let cols = 5;
    let rows = 3;
    let totalWidth = cols * size + (cols - 1) * margin;

    let titleObj = new Text(canvas.width / 2 - totalWidth / 2, 350 + 20, "");
    titleObj.fontSize = 20;
    titleObj.isBold = true;
    titleObj.textAlign = "left";

    let textObj = new Text(titleObj.x, titleObj.y + 20, "Click or tap for details");
    textObj.maxWidth = size * 3 + margin * 2;
    textObj.textAlign = "left";

    let backButton = new Button(canvas.width / 2 + totalWidth / 2 + margin - (margin + size) * 2, 350, "Main Menu");
    backButton.height = size;
    backButton.width = size * 2 + margin;
    backButton.onClick = () => { uiHandler.Restore() };

    let achieveButtons = [];
    let isSolarTierDiscovered = Object.values(achievementHandler.achievements).some(a => a.unlocked[1]);
    let isGalacticTierDiscovered = Object.values(achievementHandler.achievements).some(a => a.unlocked[2]);

    for (let tierIndex of [0, 1, 2]) {
        let pageOffset = tierIndex * 2000;

        let pageOver = (deltaX) => {
            let shift = uiHandler.elements.filter(a => (a instanceof Button || a instanceof UiImage) && a != backButton);
            shift.forEach(a => a.targetX += deltaX);
            titleObj.text = "";
            textObj.text = "Click or tap for details";
        }

        let leftButton = new Button(73 + pageOffset, 147, " ");
        leftButton.width = size;
        leftButton.height = size;
        leftButton.colorPrimary = "#0000";
        leftButton.onClick = () => { pageOver(2000) }
        let rightButton = new Button(755 + pageOffset, 147, " ");
        rightButton.width = size;
        rightButton.height = size;
        rightButton.colorPrimary = "#0000";
        rightButton.onClick = () => { pageOver(-2000) }

        let leftButtonImage = new UiImage(tileset.achievements.tiles[7], leftButton.x, leftButton.y);
        leftButtonImage.scale = 2;
        let rightButtonImage = new UiImage(tileset.achievements.tiles[6], rightButton.x, rightButton.y);
        rightButtonImage.scale = 2;

        if (tierIndex > 0) {
            achieveButtons.push(leftButton, leftButtonImage);
        }
        if ((tierIndex == 0 && isSolarTierDiscovered) || (tierIndex == 1 && isGalacticTierDiscovered)) {
            achieveButtons.push(rightButton, rightButtonImage);
        }


        let achieves = Object.values(achievementHandler.achievements);
        for (let y = 50, row = 0; row < rows; row++, y += margin + size) {
            for (let x = pageOffset + canvas.width / 2 - totalWidth / 2, col = 0; col < cols; col++, x += margin + size) {
                let achieve = achieves.splice(0, 1)[0];
                if (achieve) {
                    if (tierIndex > 0) {
                        let isPreviousTierUnlocked = achieve.unlocked[tierIndex - 1];
                        if (!isPreviousTierUnlocked) continue;
                    }
                    let b = new Button(x, y, " ");
                    b.width = size;
                    b.height = size;
                    b.colorPrimary = "#0000";
                    b.onClick = () => {
                        titleObj.text = achieve.name[tierIndex];
                        let achieveText = "   " + achievementHandler.tiers[tierIndex] + " tier";
                        achieveText += "\n" + achieve.descr[tierIndex];
                        if (achieve.unlocked[tierIndex]) {
                            achieveText += "\nUnlocked: " + (new Date(achieve.unlockedTimestamp[tierIndex])).toLocaleString();
                        } else {
                            achieveText += "\nLOCKED";
                        }
                        textObj.text = achieveText;
                    }
                    let backdropTileIndex = 1;
                    if (achieve.unlocked[tierIndex]) backdropTileIndex = tierIndex + 3;
                    let backdrop = new UiImage(tileset.achievements.tiles[backdropTileIndex], x, y);
                    backdrop.scale = 2;
                    let img = new UiImage(tileset.achievements.tiles[achieve.imageIndex], x, y);
                    img.scale = 2;
                    img.isSilhoutte = !achieve.unlocked[tierIndex];
                    achieveButtons.push(b, backdrop, img);
                }
            }
        }
    }

    let newElements = [titleObj, textObj, backButton, ...achieveButtons];
    uiHandler.elements.push(...newElements);
}