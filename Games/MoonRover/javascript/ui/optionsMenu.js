
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

    let speedrunToggle = new Toggle(bgPanel.x + margin, sfxPanel.y, "Toggle Run Timer");
    speedrunToggle.onClick = () => { timerHandler.displayed = !timerHandler.displayed };
    speedrunToggle.IsOn = () => { return timerHandler.displayed }
    speedrunToggle.width = buttonX - speedrunToggle.x - margin;
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
        deleteSaveButton.width = deleteSaveButton.width;
        deleteSaveButton.height = buttonHeight;

        newElements.push(deleteSaveButton);

    } else {
        let debugButton = new Toggle(bgPanel.x + margin, resumeButton.y, "Toggle Debug Mode");
        debugButton.onClick = () => { uiHandler.debugMode = !uiHandler.debugMode };
        debugButton.IsOn = () => { return uiHandler.debugMode }
        debugButton.width = buttonX - debugButton.x - margin;
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
        quitButton.width = debugButton.width;
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