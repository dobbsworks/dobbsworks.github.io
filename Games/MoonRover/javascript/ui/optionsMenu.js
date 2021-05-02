
function GetOptionsMenu(isMainMenu) {
    let bgPanel = new Panel(25, 25, canvas.width - 50, canvas.height - 50);
    bgPanel.colorPrimary = "#020a2eCC";
    bgPanel.border = 4;

    let title = new Text(canvas.width / 2, 100, (isMainMenu ? "OPTIONS" : "PAWSED"));
    title.fontSize = 48;
    title.isBold = true;

    let margin = 25;
    let yMin = 120;
    let yMax = canvas.height - 100 - margin;
    let totalSpace = yMax - yMin;
    let numberOfButtons = 3;
    let buttonHeight = (totalSpace + margin) / numberOfButtons;
    let buttonX = canvas.width / 2 - 200;
    let smallWidth = buttonX - bgPanel.x - 2 * margin;
    let leftX = bgPanel.x + margin;

    let musicPanel = new Panel(buttonX, yMin + 0 * (buttonHeight + margin));
    musicPanel.width = 400;
    musicPanel.height = buttonHeight;
    musicPanel.colorPrimary = musicPanel.colorPrimaryVariant;
    let musicControl = this.CreateVolumeControl(musicPanel, "Music Volume",
        audioHandler.GetMusicVolume, audioHandler.SetMusicVolume);

    let sfxPanel = new Panel(buttonX, yMin + 1 * (buttonHeight + margin));
    sfxPanel.width = 400;
    sfxPanel.height = buttonHeight;
    sfxPanel.colorPrimary = sfxPanel.colorPrimaryVariant;
    let sfxControl = this.CreateVolumeControl(sfxPanel, "SFX Volume",
        audioHandler.GetSfxVolume, audioHandler.SetSfxVolume);


    let backText = isMainMenu ? "Back to main menu" : "Resume Game"
    let resumeButton = new Button(buttonX, yMin + 2 * (buttonHeight + margin), backText);
    if (isMainMenu) {
        resumeButton.onClick = () => { uiHandler.Restore() };
    } else {
        resumeButton.onClick = pauseHandler.onPauseButtonPressed;
    }
    resumeButton.width = 400;
    resumeButton.height = buttonHeight;

    let speedrunToggle = new Toggle(leftX, sfxPanel.y, "Toggle Run Timer");
    speedrunToggle.onClick = () => { timerHandler.displayed = !timerHandler.displayed };
    speedrunToggle.IsOn = () => { return timerHandler.displayed }
    speedrunToggle.width = smallWidth;
    speedrunToggle.height = buttonHeight;



    let newElements = [bgPanel, title, musicPanel, ...musicControl, sfxPanel, ...sfxControl, resumeButton, speedrunToggle];

    if (isMainMenu) {
        let deleteSaveButton = new Button(resumeButton.x + resumeButton.width + margin, sfxPanel.y, "Delete Save");
        deleteSaveButton.onClick = () => {
            ConfirmAction("Yes, Delete Save\n(Can't be undone!)", () => {
                saveHandler.DeleteSave();
                audioHandler.PlaySound("mog-sad");
                mainMenuHandler.ReturnToMainMenu();
            });
        };
        deleteSaveButton.width = smallWidth;
        deleteSaveButton.height = buttonHeight;

        newElements.push(deleteSaveButton);

    } else {
        let debugButton = new Toggle(leftX, resumeButton.y, "Toggle Debug Mode");
        debugButton.onClick = () => { uiHandler.debugMode = !uiHandler.debugMode };
        debugButton.IsOn = () => { return uiHandler.debugMode }
        debugButton.width = smallWidth;
        debugButton.height = buttonHeight;

        let quitButton = new Button(resumeButton.x + resumeButton.width + margin, resumeButton.y, "Quit Game");
        quitButton.onClick = () => {
            ConfirmAction("Yes, Quit Game", () => {
                pauseHandler.isPaused = false;
                pauseHandler.ExitPauseMenu();
                audioHandler.SetLowPass(false);
                mainMenuHandler.ReturnToMainMenu();
            });
        };
        quitButton.width = smallWidth;
        quitButton.height = buttonHeight;

        newElements.push(debugButton, quitButton);
    }


    newElements.forEach(x => x.y -= canvas.height);
    return newElements;
}

function CreateVolumeControl(container, text, volumeGetter, volumeSetter) {
    let margin = 25;
    let elements = [];
    let panelText = new Text(canvas.width / 2, container.y + margin, text);
    elements.push(panelText);
    let volButtonWidth = (container.width - margin * 2) / 11 - 5;
    for (let a = 0; a < 11; a++) {
        let x = (canvas.width / 2 - container.width / 2 + margin) + volButtonWidth * a + 5 * a;
        let volButton = new Toggle(x, container.y + margin * 1.5, " ");
        volButton.width = volButtonWidth;
        volButton.height = container.height - margin * 2;
        volButton.IsOn = () => { return volumeGetter() >= a }
        volButton.onClick = () => { volumeSetter(a) }
        elements.push(volButton);
    }
    return elements;
}

function ConfirmAction(confirmText, onConfirm) {
    uiHandler.Shelve();
    let bgPanel = new Panel(25, 25, canvas.width - 50, canvas.height - 50);
    bgPanel.colorPrimary = "#020a2eCC";
    bgPanel.border = 4;

    let title = new Text(canvas.width / 2, 100, "PAWSITIVE?");
    title.fontSize = 48;
    title.isBold = true;

    let confirmButton = new Button(canvas.width / 2 + 25, 200, confirmText);
    confirmButton.onClick = onConfirm;
    let cancelButton = new Button(confirmButton.x - confirmButton.width - 50, 200, "Cancel");
    cancelButton.onClick = () => { uiHandler.Restore(); }

    uiHandler.elements.push(bgPanel, title, confirmButton, cancelButton);
}

function EndOfRunStats(isVictory) {
    let margin = 25;
    let yMin = 120;
    let yMax = canvas.height - 100 - margin;
    let totalSpace = yMax - yMin;
    let numberOfButtons = 5;
    let buttonHeight = 56;
    let buttonX = canvas.width / 2 - 200;

    let bgPanel = new Panel(25, 25, canvas.width - 50, canvas.height - 50);
    bgPanel.colorPrimary = "#020a2eCC";
    bgPanel.border = 4;

    let smallWidth = buttonX - bgPanel.x - 2 * margin;
    let leftX = bgPanel.x + margin;

    let title = new Text(canvas.width / 2, 100, (isVictory ? "VICTORY!" : "GAME OVER"));
    title.fontSize = 48;
    title.isBold = true;


    let doneButton = new Button(buttonX + 400 + margin, bgPanel.y + bgPanel.height - buttonHeight - margin, "Done");
    doneButton.onClick = () => {
        mainMenuHandler.ReturnToMainMenu(isVictory);
        if (isVictory) mainMenuHandler.OnClickCredits();
    };
    doneButton.width = smallWidth;
    doneButton.height = buttonHeight;

    let stats = [
        { key: "Total Run Time", value: timerHandler.GetTimerText(3) },
        { key: "Zone Achieved", value: levelHandler.GetLevelName() },
        { key: "Mooney Collected", value: achievementHandler.lootCollected.toString() },
        { key: "Remaining Mooney", value: loot.toString() },
        { key: "Robots Destroyed", value: achievementHandler.kills.toString() },
    ];
    let y = yMin + 40;
    let texts = [];
    for (let stat of stats) {
        let text1 = new Text(buttonX, y, stat.key);
        text1.textAlign = "left";
        text1.width = smallWidth + margin + 400;
        let text2 = new Text(doneButton.x - margin, y, stat.value);
        text2.textAlign = "right";
        text2.width = text1.width;

        y += 20;
        texts.push(text1, text2);
    }


    let charImage = document.getElementById(currentCharacter.imageIdLit);
    let charImageEl = new UiImage(charImage, leftX - 15, 100);
    charImageEl.scale = 2;

    let charMessages = isVictory ? currentCharacter.victory : currentCharacter.failure;
    let charMessage = charMessages ? charMessages[Math.floor(Math.random() * charMessages.length)] : "";
    let charText = new Text(leftX, 275, charMessage);
    charText.textAlign = "left";
    charText.maxWidth = smallWidth;


    let starImage = new UiImage(tileset.star.tiles[0], doneButton.x + 15, charImageEl.y + 10);
    starImage.scale = 6;
    
    let starMessage = [];
    let stars = (levelHandler.currentLevel - 1) * 5 + levelHandler.currentZone - 1 + (isVictory ? 1 : 0);
    starMessage.push("New Stars Collected: " + stars);
    if (isVictory) {
        stars += 5;
        starMessage.push("Completion Bonus: " + "+5");
    }
    achievementHandler.currentStars += stars;
    starMessage.push("==================");
    starMessage.push("Total Stars: " + achievementHandler.currentStars);
    let starText = new Text(bgPanel.x + bgPanel.width - margin, 275, starMessage.join('\n'));
    starText.textAlign = "right";
    starText.maxWidth = smallWidth;

    // separate page for splits
    let splitsButton = new Button(leftX, bgPanel.y + bgPanel.height - buttonHeight - margin, "Time breakdown");
    splitsButton.onClick = () => {
        uiHandler.elements.forEach(x => x.y += canvas.height);
        uiHandler.Shelve();
        EndOfRunSplits();
    };
    splitsButton.width = smallWidth;
    splitsButton.height = buttonHeight;



    let newElements = [bgPanel, title, doneButton, ...texts, charImageEl, charText, splitsButton, starImage, starText];
    newElements.forEach(x => x.y -= canvas.height);
    uiHandler.elements = newElements;

    // save collected stars
    saveHandler.SaveGame();
}

function EndOfRunSplits() {
    let margin = 25;
    let yMin = 120;
    let yMax = canvas.height - 100 - margin;
    let totalSpace = yMax - yMin;
    let numberOfButtons = 5;
    let buttonHeight = 56;
    let buttonX = canvas.width / 2 - 200;

    let bgPanel = new Panel(25, 25, canvas.width - 50, canvas.height - 50);
    bgPanel.colorPrimary = "#020a2eCC";
    bgPanel.border = 4;

    let smallWidth = buttonX - bgPanel.x - 2 * margin;
    let leftX = bgPanel.x + margin;

    let title = new Text(canvas.width / 2, 100, "TIME BREAKDOWN");
    title.fontSize = 48;
    title.isBold = true;
    title.maxWidth = bgPanel.width;


    let backButton = new Button(leftX, bgPanel.y + bgPanel.height - buttonHeight - margin, "Done");
    backButton.onClick = () => {
        uiHandler.Restore();
    };
    backButton.width = smallWidth;
    backButton.height = buttonHeight;

    let splitTable = [];
    let columnCount = Math.max(...timerHandler.splits.map(a => a.zone)) + 1;
    let columnWidth = (bgPanel.width - margin * 2) / columnCount;
    let rowCount = Math.max(...timerHandler.splits.map(a => a.level));

    for (let i = 1; i < columnCount; i++) {
        let text = "Zone " + i;
        let x = leftX + columnWidth * i;
        let colHeader = new Text(x, yMin + 40, text);
        colHeader.textAlign = "left";
        splitTable.push(colHeader);
    }

    for (let i = 0; i < rowCount; i++) {
        let name = levelHandler.levels[i].name;
        let y = yMin + 40 + 20 * (i + 1);
        let rowHeader = new Text(leftX, y, name);
        rowHeader.textAlign = "left";
        splitTable.push(rowHeader);
    }

    for (let split of timerHandler.splits) {
        let x = leftX + columnWidth * split.zone;
        let y = yMin + 40 + 20 * split.level;
        let splitText = new Text(x, y, timerHandler.FramesToText(split.segment, 3));
        splitText.textAlign = "left";
        splitTable.push(splitText);
    }

    let newElements = [bgPanel, title, backButton, ...splitTable];
    newElements.forEach(x => x.y -= canvas.height);
    uiHandler.elements = newElements;
}