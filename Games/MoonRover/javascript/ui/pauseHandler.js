class PauseHandler {
    isPaused = false;

    onPauseButtonPressed() {
        if (!shopHandler.isInShop) {
            pauseHandler.isPaused = !pauseHandler.isPaused;
            if (pauseHandler.isPaused) {
                pauseHandler.EnterPauseMenu()
                audioHandler.SetLowPass(true);
                audioHandler.PlaySound("pause");
            } else {
                pauseHandler.ExitPauseMenu();
                audioHandler.SetLowPass(false);
                audioHandler.PlaySound("unpause");
            }
        }
    }

    EnterPauseMenu() {
        uiHandler.Shelve();

        let bgPanel = new Panel(25, 25, canvas.width - 50, canvas.height - 50);
        bgPanel.colorPrimary = "#020a2eCC";
        bgPanel.border = 4;

        let title = new Text(canvas.width / 2, 100, "PAWSED");
        title.fontSize = 48;
        title.isBold = true;

        let buttonModels = [
            { text: "Toggle Debug Mode", action: () => { uiHandler.debugMode = !uiHandler.debugMode } },
            { text: "Music Volume" },
            { text: "SFX Volume" },
            { text: "Resume Game", action: pauseHandler.onPauseButtonPressed },
        ];
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

        let resumeButton = new Button(buttonX, yMin + 2 * (buttonHeight + margin), "Resume Game");
        resumeButton.onClick = pauseHandler.onPauseButtonPressed;
        resumeButton.width = 400;
        resumeButton.height = buttonHeight;

        let debugButton = new Toggle(bgPanel.x+margin, resumeButton.y, "Toggle Debug Mode");
        debugButton.onClick = () => { uiHandler.debugMode = !uiHandler.debugMode };
        debugButton.IsOn = () => { return uiHandler.debugMode }
        debugButton.width = buttonX - debugButton.x - margin;
        debugButton.height = buttonHeight;


        let newElements = [bgPanel, title, musicPanel, ...musicControl, sfxPanel, ...sfxControl, resumeButton, debugButton];
        newElements.forEach(x => x.y -= canvas.height);

        uiHandler.elements.push(...newElements);
    }

    CreateVolumeControl(container, text, volumeGetter, volumeSetter) {
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

    ExitPauseMenu() {
        uiHandler.Restore();
    }
}