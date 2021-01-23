class PauseHandler {
    isPaused = false;
    
    onPauseButtonPressed() {
        if (!shopHandler.isInShop) {
            pauseHandler.isPaused = !pauseHandler.isPaused;
            if (pauseHandler.isPaused) {
                pauseHandler.EnterPauseMenu()
            } else {
                pauseHandler.ExitPauseMenu();
            }
        }
    }

    EnterPauseMenu() {
        uiHandler.Shelve();

        let bgPanel = new Panel(25, 25, canvas.width - 50, canvas.height - 50);
        bgPanel.colorPrimary = "#020a2eCC";
        bgPanel.border = 4;

        let title = new Text(canvas.width/2, 100, "PAUSED");
        title.fontSize = 48;
        title.isBold = true;

        let buttonModels = [
            {text: "Toggle Debug Mode", action: () => {uiHandler.debugMode = !uiHandler.debugMode}},
            {text: "Resume Game", action: () => {
                setTimeout(pauseHandler.onPauseButtonPressed, 100)
            }}
        ]
        let buttons = [];
        let yMin = 200;
        let yMax = canvas.height - 100;
        let margin = 25;
        let totalSpace = yMax - yMin;
        let buttonHeight = (totalSpace + margin) / buttonModels.length;
        for (let i=0; i<buttonModels.length;i++) {
            let newButton = new Button(canvas.width/2 - 200, yMin + i * (buttonHeight + margin), buttonModels[i].text);
            newButton.width = 400;
            newButton.height = buttonHeight;
            newButton.onClick = buttonModels[i].action;
            buttons.push(newButton);
        }


        let newElements = [bgPanel, title, ...buttons];
        newElements.forEach(x => x.y -= canvas.height);
        
        uiHandler.elements.push(...newElements);
    }

    ExitPauseMenu() {
        uiHandler.Restore();
    }
}