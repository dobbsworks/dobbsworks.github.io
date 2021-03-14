class MainMenuHandler {

    isOnMainMenu = true;
    starsX = [];
    starsY = [];
    starLayers = []; // parallax stuff
    scroll = 0;
    logo = null;
    isOnCredits = false;
    shootingStars = [];
    hiddenStartButton = null;

    creditItems = [
        "A game by Dobbs",
        [
            "Created on stream at twitch.tv/dobbsworks"
        ],
        "Special Thanks",
        [
            "germdove",
            "daesnek",
            "ShinerMax",
            "gamequeued",
            "erictheformer",
            "Kirbska",
            "mastertank56",
            "GFE_12",
            "McFixit",
            "MmmDoggy",
            "warios_warehouse",
            "MarioMakerFanGPB",
            "zombieslicer15_",
            "IAmTheSupernova",
            "notnowgwen",
            "oofprobich",
            "Ehnu",
            "SirBroozer_",
            "hudson_smm",
            "Pixel_Yosh_Gamer",
            "McRiot",
            "skizoo___",
            "hover_cat13",
        ],
        "Tools",
        [
            "Music and sounds created with:",
            "BeepBox - beepbox.co",
            "Audacity",
            "",
            "Artwork created with:",
            "Adobe Photoshop CS2",
            "(15 years old and still works fine)",
            "Title Font: Grobold",
            "",
            "Visual Studio Code",
            "Github",
        ],
        "Thank you for playing!",
    ];


    InitializeMenu() {
        this.starsX = [];
        this.starsY = [];
        for (let i = 0; i < 100; i++) {
            this.starsX.push(Math.floor(Math.random() * canvas.width));
            this.starsY.push(Math.floor(Math.random() * canvas.height));
        }
        this.starLayers = [];
        this.starLayers.push(this.CreateStarLayerImage(1, "#FFFD"));
        this.starLayers.push(this.CreateStarLayerImage(2, "#FFFA"));
        this.starLayers.push(this.CreateStarLayerImage(4, "#FFF4"));
        this.starLayers.push(this.CreateStarLayerImage(6, "#FFF3"));

        let titleImage = document.getElementById("title");
        let title = new UiImage(titleImage, canvas.width / 2 - titleImage.width / 2, 30);
        this.logo = title;

        let versionNum = new Button(canvas.width - 60, canvas.height - 40, "v" + versionNumber);
        versionNum.colorPrimary = "#0007";
        versionNum.colorSecondary = "#0000";
        versionNum.colorHighlight = "#000B";
        versionNum.width = 60;
        versionNum.height = 40;
        versionNum.onClick = mainMenuHandler.OnClickVersionNum;

        this.hiddenStartButton = new Button(0, 0, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nClick or tap");
        this.hiddenStartButton.colorPrimary = "#0000";
        this.hiddenStartButton.colorSecondary = "#0000";
        this.hiddenStartButton.colorHighlight = "#0000";
        this.hiddenStartButton.width = canvas.width;
        this.hiddenStartButton.height = canvas.height;
        this.hiddenStartButton.onClick = () => {
            mainMenuHandler.StartMainMenu();
        }

        let newElements = [title, this.hiddenStartButton, versionNum];
        uiHandler.elements.push(...newElements);
    }

    ReturnToMainMenu() {
        loot = 0;
        sprites = [];
        borders = [];
        uiHandler.elements = [];
        levelHandler = new LevelHandler();
        weaponHandler = new WeaponHandler();
        shopHandler = new ShopHandler();
        mainMenuHandler.starLayers = [];
        mainMenuHandler.isOnMainMenu = true;
        mainMenuHandler.InitializeMenu();
        mainMenuHandler.StartMainMenu();
        achievementHandler.RunReset();
    }

    StartMainMenu() {
        uiHandler.elements = uiHandler.elements.filter(x => x !== this.hiddenStartButton);

        let bigButtonWidth = 200;
        let smallButtonWidth = 150;
        let contentHeight = 125;
        let margin = 25;
        let smallButtonHeight = (contentHeight - margin) / 2;
        let y1 = 300;
        let y2 = y1 + margin + smallButtonHeight

        let xMid = (canvas.width - bigButtonWidth) / 2;
        let x1 = xMid - smallButtonWidth - margin;
        let x2 = xMid + bigButtonWidth + margin;

        let playButton = new Button(xMid, y1, "Play");
        playButton.height = contentHeight;
        playButton.width = bigButtonWidth;
        playButton.onClick = mainMenuHandler.OnClickPlay;

        let optionsButton = new Button(x1, y1, "Options");
        optionsButton.onClick = null;
        let helpButton = new Button(x1, y2, "Help");
        helpButton.onClick = null;
        let achievementsButton = new Button(x2, y1, "Achievements");
        achievementsButton.onClick = mainMenuHandler.OnClickAchievements;
        let creditsButton = new Button(x2, y2, "Credits");
        creditsButton.onClick = mainMenuHandler.OnClickCredits;
        [creditsButton, optionsButton, helpButton, achievementsButton].forEach(a => a.height = smallButtonHeight);
        [optionsButton, helpButton].forEach(a => a.isDisabled = true);


        uiHandler.elements.push(playButton, creditsButton, optionsButton, helpButton, achievementsButton);
    }

    OnClickPlay() {
        uiHandler.Shelve();

        let contentWidth = canvas.width - 300;
        let margin = 20;
        let columnCount = 4;
        let rowCount = 2;
        let buttonWidth = (contentWidth + margin) / columnCount - margin;
        let panel = new Panel(canvas.width / 2 - contentWidth / 2, 20, contentWidth, 60);
        let title = new Text(canvas.width / 2, 60, "Who's a good boy?");
        title.fontSize = 20;
        title.isBold = true;
        panel.colorPrimary = "#020a2eCC";

        let backButton = new Button(panel.x, rowCount * (buttonWidth + margin) + panel.y + panel.height + margin, "Back to main menu");
        backButton.width = panel.width;
        backButton.height = panel.height;
        backButton.onClick = () => {
            uiHandler.Restore();
        }


        let newElements = [panel, title, backButton];
        let charList = [...characters];
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < columnCount; col++) {
                let char = charList.splice(0, 1)[0];
                let x = col * (buttonWidth + margin) + panel.x;
                let y = row * (buttonWidth + margin) + panel.y + panel.height + margin;
                let charButton = new Button(x, y, " ");
                charButton.width = buttonWidth;
                charButton.height = buttonWidth;
                charButton.onClick = () => {
                    mainMenuHandler.OnClickChar(char);
                }
                if (char) {
                    let image = document.getElementById(char.imageId + "-lit");
                    let imageEl = new UiImage(image, charButton.x + 17, charButton.y + 55);
                    let charText = new Text(charButton.x + charButton.width / 2, charButton.y + 25, char.name.toUpperCase());
                    charText.isBold = true;
                    charText.maxWidth = buttonWidth - 10;
                    if (!char.unlocked) {
                        charText.text = "???";
                        charButton.isDisabled = !char.unlocked;
                        imageEl.isSilhoutte = true;
                    }
                    newElements.push(charButton);
                    newElements.push(charText);
                    newElements.push(imageEl);
                }
            }
        }

        newElements.forEach(a => a.y += canvas.height);
        uiHandler.elements.push(...newElements);
    }

    OnClickChar(char) {
        uiHandler.Shelve();
        let contentWidth = 500;
        let margin = 20;

        let panel = new Panel(canvas.width / 2 - contentWidth / 2, 20, contentWidth, 60);
        let title = new Text(canvas.width / 2, 60, "Pilot overview");
        title.fontSize = 20;
        title.isBold = true;
        panel.colorPrimary = "#020a2eCC";

        let portraitSize = (contentWidth + margin) / 2 - margin;
        let portraitBg = new Panel(panel.x, panel.y + panel.height + margin, portraitSize, portraitSize);
        portraitBg.colorPrimary = "#020a2eCC";

        let image = document.getElementById(char.imageId + "-lit");
        let imageEl = new UiImage(image, portraitBg.x - 30, portraitBg.y + 25);
        imageEl.scale = 3;

        let textPanel = new Panel(panel.x + margin + portraitSize, panel.y + panel.height + margin, portraitSize, portraitSize);
        textPanel.colorPrimary = "#020a2eCC";

        let name = new Text(portraitBg.x + portraitBg.width / 2, portraitBg.y + 30, char.name);
        name.fontSize = 20;
        name.maxWidth = portraitBg.width - 20;
        name.isBold = true;
        let text = new Text(textPanel.x + 10, textPanel.y + 30, char.bio);
        text.maxWidth = textPanel.width - 20;
        text.textAlign = "left";

        let backButton = new Button(portraitBg.x, portraitBg.y + portraitBg.height + margin, "Back");
        backButton.width = portraitBg.width;
        backButton.height = 60;
        backButton.onClick = () => {
            uiHandler.Restore();
        }
        let playButton = new Button(textPanel.x, textPanel.y + textPanel.height + margin, "Let's go!");
        playButton.width = portraitBg.width;
        playButton.height = 60;
        playButton.onClick = () => {
            mainMenuHandler.StartGame();
        }

        let newElements = [portraitBg, imageEl, textPanel, name, text, backButton, playButton];
        newElements.forEach(a => a.y += canvas.height);
        uiHandler.elements.push(...newElements);
    }

    OnClickCredits() {
        mainMenuHandler.isOnCredits = true;
        uiHandler.Shelve();
        audioHandler.SetBackgroundMusic("music-credits");

        // shuffle special thanks
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffleArray(mainMenuHandler.creditItems[3]);

        let hiddenReturnButton = new Button(0, 0, "");
        hiddenReturnButton.width = canvas.width;
        hiddenReturnButton.height = canvas.height;
        hiddenReturnButton.onClick = () => {
            uiHandler.Restore();
            title.targetX += canvas.width / 4;
            mainMenuHandler.isOnCredits = false;
            audioHandler.SetBackgroundMusic("music-title");
        }

        let title = mainMenuHandler.logo;
        title.targetX -= canvas.width / 4;

        let newElements = [title, hiddenReturnButton];
        let creditItemY = canvas.height / 2;
        for (let item of mainMenuHandler.creditItems) {
            let x = canvas.width * 3 / 4;
            if (typeof item === "string") {
                creditItemY += 60;
                let header = new Text(x, creditItemY, item);
                header.x += canvas.width / 2;
                header.fontSize = 24;
                newElements.push(header);
                creditItemY += 40;
            } else {
                for (let subItem of item) {
                    let row = new Text(x, creditItemY, subItem);
                    row.fontSize = 16;
                    row.x += canvas.width / 2;
                    newElements.push(row);
                    creditItemY += 20;
                }
            }
        }
        uiHandler.elements.push(...newElements);
    }

    OnClickVersionNum() {
        uiHandler.Shelve();

        let scrollAmount = 100;

        let textObj = new Text(200, 50, versionHistory.join('\n\n'));
        textObj.textAlign = "left";
        textObj.SplitTextIntoLines();

        let nextButton = new Button(550, 200, "Scroll Down");
        nextButton.isDisabled = (textObj.targetY + textObj.height <= 450);
        nextButton.onClick = () => {
            textObj.targetY -= scrollAmount;
            nextButton.isDisabled = (textObj.targetY + textObj.height <= 450);
            prevButton.isDisabled = (textObj.targetY >= 50);
        }

        let prevButton = new Button(550, 50, "Scroll Up");
        prevButton.isDisabled = true;
        prevButton.onClick = () => {
            textObj.targetY += scrollAmount;
            nextButton.isDisabled = (textObj.targetY + textObj.height <= 450);
            prevButton.isDisabled = (textObj.targetY >= 50);
        }


        let backButton = new Button(550, 350, "Main Menu");
        backButton.onClick = () => { uiHandler.Restore() };

        let newElements = [backButton, textObj, nextButton, prevButton];
        uiHandler.elements.push(...newElements);
    }

    OnClickAchievements() {
        uiHandler.Shelve();

        let achieves = Object.values(achievementHandler.achievements);
        let margin = 25;
        let size = 72;

        let cols = 5;
        let rows = 2;
        let totalWidth = cols * size + (cols - 1) * margin;

        let titleObj = new Text(canvas.width / 2 - totalWidth / 2, 350 + 20, "");
        titleObj.fontSize = 20;
        titleObj.isBold = true;
        titleObj.textAlign = "left";

        let textObj = new Text(titleObj.x, titleObj.y + 20, "Click or tap for details");
        textObj.maxWidth = size * 3 + margin * 2;
        textObj.textAlign = "left";

        let achieveButtons = [];
        for (let y = 50, row = 0; row < rows; row++, y += margin + size) {
            for (let x = canvas.width / 2 - totalWidth / 2, col = 0; col < cols; col++, x += margin + size) {
                let achieve = achieves.splice(0, 1)[0];
                if (achieve) {
                    let b = new Button(x, y, " ");
                    b.width = size;
                    b.height = size;
                    b.colorPrimary = "#0000";
                    b.onClick = () => {
                        titleObj.text = achieve.name;
                        if (achieve.unlocked) {
                            textObj.text = achieve.descr + "\nUnlocked: " + achieve.unlockedTimestamp.toLocaleString();
                        } else {
                            textObj.text = achieve.descr + "\nLOCKED"
                        }
                    }
                    let backdropTileIndex = (achieve.unlocked ? 0 : 1);
                    let backdrop = new UiImage(tileset.achievements.tiles[backdropTileIndex], x, y);
                    backdrop.scale = 2;
                    let img = new UiImage(tileset.achievements.tiles[achieve.imageIndex], x, y);
                    img.scale = 2;
                    img.isSilhoutte = !achieve.unlocked;
                    achieveButtons.push(b, backdrop, img);
                }
            }
        }

        let backButton = new Button(canvas.width / 2 + totalWidth / 2 + margin - (margin + size) * 2, 350, "Main Menu");
        backButton.height = size;
        backButton.width = size * 2 + margin;
        backButton.onClick = () => { uiHandler.Restore() };

        let newElements = [titleObj, textObj, backButton, ...achieveButtons];
        uiHandler.elements.push(...newElements);
    }

    DrawMenuBg() {
        if (!this.isOnMainMenu) return;

        if (this.isOnCredits) {
            let scrollElements = uiHandler.elements.filter(a => !(a instanceof Button || a instanceof UiImage));
            scrollElements.forEach(a => a.targetY -= 0.6);
            ctx.fillStyle = "#FFFA";
            ctx.font = "12px Arial";
            ctx.textAlign = "left";
            ctx.fillText("Click anywhere to return to the main menu", 10, canvas.height - 10);
            let lowestElementY = Math.max(...scrollElements.map(a => a.targetY));
            if (lowestElementY < -100) {
                let highestElementY = Math.min(...scrollElements.map(a => a.targetY));
                scrollElements.forEach(a => a.targetY += -highestElementY + canvas.height + 30);
                scrollElements.forEach(a => a.y = a.targetY);
            }
        }

        if (this.logo) {
            this.logo.targetY += Math.sin(this.scroll / 40) / 4;
        }

        this.scroll--;
        ctx.fillStyle = "#2042";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < this.starLayers.length; i++) {
            let y = this.scroll / (i + 1);
            y %= canvas.height;
            let x = this.scroll / 2 / (i + 1);
            x %= canvas.width;
            ctx.drawImage(this.starLayers[i], x, y);
            ctx.drawImage(this.starLayers[i], x, y + canvas.height);
            ctx.drawImage(this.starLayers[i], x + canvas.width, y);
            ctx.drawImage(this.starLayers[i], x + canvas.width, y + canvas.height);
        }

        function AddShootingStar(x, y) {
            mainMenuHandler.shootingStars.push({ x: x, y: y, dx: Math.random() + 1, dy: Math.random() + 1 });
        }
        if (this.shootingStars.length < 2) {
            AddShootingStar(canvas.width * Math.random() - canvas.width / 2, 0);
        }
        if (this.shootingStars.length < 100 && isMouseDown) {
            AddShootingStar(mouseX, mouseY);
        }

        ctx.fillStyle = "#FFF";
        for (let star of this.shootingStars) {
            ctx.fillRect(star.x, star.y, 2, 2);
            star.x += star.dx;
            star.y += star.dy;
        }
        this.shootingStars = this.shootingStars.filter(a => a.y < canvas.height);
    }


    CreateStarLayerImage(scale, color) {
        let newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        let ct = newCanvas.getContext("2d");

        ct.fillStyle = color;

        for (let i = 0; i < this.starsX.length; i++) {
            for (let sx = 0; sx < scale; sx++) {
                for (let sy = 0; sy < scale; sy++) {
                    let x = this.starsX[i] / scale + sx * canvas.width / scale;
                    let y = this.starsY[i] / scale + sy * canvas.height / scale;
                    ct.fillRect(x, y, 1, 1);
                }
            }
        }
        return newCanvas;
    }


    StartGame() {
        uiHandler.elements = [];
        mainMenuHandler.isOnMainMenu = false;
        levelHandler.LoadZone();
    }
}