class PauseMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#0005";

    static UnpauseTime = new Date();

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];
        audioHandler.SetLowPass(true);

        ret.push(OptionsMenu.CreateOptionsButton());

        let container = new Panel(camera.canvas.width * 0.15, camera.canvas.height / 2 - 150, camera.canvas.width * 0.7, 300);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);

        if (editorHandler.isEditorAllowed) {
            container.AddChild(new Spacer(0, 0, 0, 60));
        } else {
            // exit button
            let exitButton = this.CreateButton("Exit Level");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                MenuHandler.GoBack();
                currentLevelCode = "";
                audioHandler.SetBackgroundMusic("menuJazz");
                editorHandler.grabbedCheckpointLocation = null;
            });
        }

        if (!editorHandler.grabbedCheckpointLocation) {
            let retryButton = this.CreateButton("Retry");
            container.AddChild(retryButton);
            retryButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                player.OnPlayerHurt();
            });
        } else {
            let row = new Panel(0,0, container.width, 60);
            row.margin = 0;
            container.AddChild(row);
            let retryFromFlagButton = this.CreateButton("Retry From Flag", 0.45);
            row.AddChild(retryFromFlagButton);
            retryFromFlagButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                player.OnPlayerHurt();
            });
            let retryFromStartButton = this.CreateButton("Retry From Start", 0.45);
            row.AddChild(retryFromStartButton);
            retryFromStartButton.onClickEvents.push(() => {
                this.Dispose();
                editorHandler.grabbedCheckpointLocation = null;
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                player.OnPlayerHurt();
            });
        }

        // editorHandler.grabbedCheckpointLocation = null;

        let resumeButton = this.CreateButton("Resume");
        container.AddChild(resumeButton);
        resumeButton.onClickEvents.push(() => {
            this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
        })

        return ret;
    }

    CreateButton(text: string, sizeRatio: number = 1): Button {
        let button = new Button(0, 0, camera.canvas.width * 0.7 * sizeRatio, 60);
        let buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.isNoisy = true;
        button.AddChild(buttonText);
        buttonText.xOffset = button.width / 2;
        buttonText.yOffset = -15;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    }

    Update(): void {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Pause, true)) {
            this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
        }
    }
}