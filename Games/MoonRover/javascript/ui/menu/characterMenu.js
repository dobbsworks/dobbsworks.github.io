function OnClickPlay() {
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

    if (achievementHandler.currentStars) {
        let starImage = new UiImage(tileset.star.tiles[0], panel.x + panel.width - 80, panel.y + 20);
        let starCount = new Text(starImage.x + 28, starImage.y + 20, "x " + achievementHandler.currentStars);
        starCount.textAlign = "left";
        newElements.push(starImage, starCount);
    }

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
                OnClickChar(char);
            }
            if (char) {
                let image = document.getElementById(char.imageIdLit);
                let imageEl = new UiImage(image, charButton.x + 17, charButton.y + 55);
                if (!char.unlocked && char.imageIdLocked) {
                    image = document.getElementById(char.imageIdLocked);
                    imageEl = new UiImage(image, charButton.x + 17, charButton.y + 55);
                }
                let charNameText = char.name.toUpperCase();
                if (achievementHandler.completeRunCharacters.indexOf(char.name) > -1) {
                    charNameText = "★ " + charNameText + " ★";
                }
                let charText = new Text(charButton.x + charButton.width / 2, charButton.y + 25, charNameText);
                charText.isBold = true;
                charText.maxWidth = buttonWidth - 10;
                newElements.push(charButton);
                newElements.push(imageEl);
                if (char.unlocked) {
                    newElements.push(charText);
                } else {
                    charButton.isDisabled = !char.unlocked;
                    imageEl.isSilhoutte = true;

                    let allRequiredAchievesUnlocked = char.
                        achievementGate.every(gate => achievementHandler.
                            achievements[gate.name].unlocked[gate.tier]);

                    let hasStars = achievementHandler.currentStars > 0;

                    if (allRequiredAchievesUnlocked && hasStars) {
                        let unlockButton = new Button(charButton.x + 17, charButton.y + 15, " ")
                        unlockButton.width = 100;
                        unlockButton.height = 34;
                        unlockButton.isDisabled = achievementHandler.currentStars < char.starCost;
                        unlockButton.onClick = () => {
                            achievementHandler.currentStars -= char.starCost;
                            char.unlocked = true;
                            audioHandler.PlaySound("powerup-04");
                            uiHandler.Restore();
                            OnClickPlay();
                            uiHandler.Snap();
                            saveHandler.SaveGame();
                        }

                        let unlockImage = new UiImage(tileset.achievements.tiles[8], unlockButton.x + 4, unlockButton.y + 4);
                        let starCost = new UiImage(tileset.star.tiles[0], unlockButton.x + unlockButton.width - 25, unlockButton.y + 7);
                        let starCostText = new Text(unlockButton.x + unlockButton.width / 2, unlockButton.y + 24, "for " + char.starCost);
                        newElements.push(unlockButton, unlockImage, starCost, starCostText);
                    }
                }
            }
        }
    }

    newElements.forEach(a => a.y += canvas.height);
    uiHandler.elements.push(...newElements);
}

function OnClickChar(char) {
    currentCharacter = char;
    weaponHandler.inventory = char.initialWeapons.map(a => new a());
    uiHandler.Shelve();
    let contentWidth = 500;
    let margin = 20;

    let panel = new Panel(canvas.width / 2 - contentWidth / 2, 0, contentWidth, 60);
    let title = new Text(canvas.width / 2, 60, "Pilot overview");
    title.fontSize = 20;
    title.isBold = true;
    panel.colorPrimary = "#020a2eCC";

    let portraitSize = (contentWidth + margin) / 2 - margin;
    let portraitBg = new Panel(panel.x, panel.y + panel.height + margin, portraitSize, 250);
    portraitBg.colorPrimary = "#020a2eCC";

    let image = document.getElementById(char.imageIdLit);
    let imageEl = new UiImage(image, portraitBg.x - 30, portraitBg.y + 25);
    imageEl.scale = 3;

    let textPanel = new Panel(panel.x + margin + portraitSize, panel.y + panel.height + margin, portraitSize, portraitBg.height);
    textPanel.colorPrimary = "#020a2eCC";

    let nameTag = char.selectName || char.name;
    let name = new Text(portraitBg.x + portraitBg.width / 2, portraitBg.y + 30, nameTag);
    name.fontSize = 20;
    name.maxWidth = portraitBg.width - 20;
    name.isBold = true;
    let text = new Text(textPanel.x + 10, textPanel.y + 30, char.bio);
    text.maxWidth = textPanel.width - 20;
    text.textAlign = "left";

    let backButton = new Button(portraitBg.x, portraitBg.y + portraitBg.height + margin, "Back");
    backButton.width = portraitBg.width;
    backButton.height = 70;
    backButton.onClick = () => {
        currentCharacter = null;
        uiHandler.Restore();
    }
    let playButton = new Button(textPanel.x, textPanel.y + textPanel.height + margin, "Let's go!");
    playButton.width = portraitBg.width;
    playButton.height = 70;
    playButton.onClick = () => {
        mainMenuHandler.StartGame();
    }

    let newElements = [portraitBg, imageEl, textPanel, name, text, backButton, playButton];


    let canBuyBonus = !(currentCharacter.noShops) && achievementHandler.currentStars > 0;
    if (canBuyBonus) {
        newElements.forEach(a => { a.targetX -= 130; a.x -= 130 });

        // one-time bonus mode
        let bonusPanel = new Panel(textPanel.x + margin + portraitSize, playButton.y, portraitSize, 120);
        bonusPanel.colorPrimary = "#020a2eCC";
        let mogImage = document.getElementById("dog-mog-lit");
        let mogPic = new UiImage(mogImage, bonusPanel.x - 9, bonusPanel.y);
        let bonusTexts = [
            "Hi there! How about a little help this run?",
            "Well come on in! What can I get for you?",
            "You finding everything alright? Let me know if you need something!",
            "Feel free to browse, but try not to carouse! Ho ho!",
            "This is my satellite location! Get it?"
        ]
        let bonusText = new Text(bonusPanel.x + 87, bonusPanel.y + 25, bonusTexts[Math.floor(Math.random() * bonusTexts.length)]);
        bonusText.font = "Courier New";
        bonusText.maxWidth = bonusPanel.width - 90;
        bonusText.textAlign = "left";

        let starImage = new UiImage(tileset.star.tiles[0], bonusPanel.x + margin - 15, bonusPanel.y + 75);
        let starCount = new Text(starImage.x + 28, starImage.y + 20, "x " + achievementHandler.currentStars);
        starCount.textAlign = "left";

        let bonusSetups = GetRandomBonuses(3);
        let bonusButtons = [];
        for (let i = 0; i < 3; i++) {
            let bonus = bonusSetups[i];
            let bonusButton = new Button(bonusPanel.x, bonusPanel.y - 90 * (i + 1), "★ x " + bonus.cost + "\n" + bonus.text);
            bonusButton.width = bonusPanel.width;
            bonusButton.height = 70;
            bonusButton.isDisabled = achievementHandler.currentStars < bonus.cost;
            bonusButton.onClick = () => {
                bonus.action();
                achievementHandler.currentStars -= bonus.cost;
                saveHandler.SaveGame();
                mainMenuHandler.StartGame();
            }
            bonusButtons.push(bonusButton);
        }
        newElements.push(bonusPanel, bonusText, mogPic, starImage, starCount, ...bonusButtons)
    }

    newElements.forEach(a => a.y += canvas.height);
    uiHandler.elements.push(...newElements);
}

function GetRandomBonuses(num) {
    let bonusSetups = [
        {
            cost: 2, text: "Start with +1 random weapon", action: () => {
                let weaponList = shopHandler.GetAvailableWeapons();
                let weapon = weaponList[Math.floor(Math.random() * weaponList.length)];
                weaponHandler.inventory.push(new weapon());
            }
        },
        {
            cost: 5, text: "Start with +2 max HP", action: () => {
                bonusStartHp = 2;
            }
        },
        {
            cost: 4, text: "Start with +50 Mooney", action: () => {
                loot += 50;
            }
        },
        {
            cost: 5, text: "Start with Repair Kit (limited use)", action: () => {
                weaponHandler.inventory.push(new WeaponRepairKit());
            }
        },
        {
            cost: 1, text: "Start with Ammo Kit (limited use)", action: () => {
                weaponHandler.inventory.push(new WeaponResupplyKit());
            }
        },
        {
            cost: 4, text: "Start with Bomb (limited use)", action: () => {
                weaponHandler.inventory.push(new WeaponBombKit());
            }
        }
    ];

    if (achievementHandler.currentStars >= 150) {
        bonusSetups.push(
            {
                cost: 50, text: "Start with +full random weapons", action: () => {
                    while (weaponHandler.inventory.length < 4) {
                        let weaponList = shopHandler.GetAvailableWeapons();
                        let weapon = weaponList[Math.floor(Math.random() * weaponList.length)];
                        weaponHandler.inventory.push(new weapon());
                    }
                }
            },
            {
                cost: 50, text: "Start with +5 max HP", action: () => {
                    bonusStartHp = 5;
                }
            }
        )
    }

    let ret = [];
    for (let i = 0; i < num; i++) {
        let index = Math.floor(Math.random() * bonusSetups.length);
        if (bonusSetups[index]) {
            ret.push(bonusSetups[index]);
            bonusSetups.splice(index, 1);
        }
    }
    return ret;
}