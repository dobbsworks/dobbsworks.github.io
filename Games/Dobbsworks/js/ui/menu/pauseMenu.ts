class PauseMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#0007";
    backgroundColor2 = "#000E";

    static UnpauseTime = new Date();
    static IsPaused = false;

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];
        audioHandler.SetLowPass(true);
        PauseMenu.IsPaused = true;

        ret.push(OptionsMenu.CreateOptionsButton());

        let container = new Panel(camera.canvas.width * 0.15, camera.canvas.height / 2 - 150, camera.canvas.width * 0.7, 360);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);

        let resumeButton = this.CreateButton("Resume");
        container.AddChild(resumeButton);
        resumeButton.onClickEvents.push(() => {
            this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
            PauseMenu.IsPaused = false;
        })

        if (editorHandler.isEditorAllowed) {
            // edit button
            let editButton = this.CreateButton("Edit Level");
            container.AddChild(editButton);
            editButton.onClickEvents.push(() => {
                this.Dispose();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                editorHandler.SwitchToEditMode();
                editorHandler.grabbedCheckpointLocation = null;
            });
        }


        // RESTART BUTTONS

        if (levelGenerator) {
            let retryButton = this.CreateButton("Restart Challenge");
            container.AddChild(retryButton);
            retryButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                LevelGenerator.Restart();
            });
        } else if (!editorHandler.grabbedCheckpointLocation) {
            let retryButton = this.CreateButton("Retry");
            container.AddChild(retryButton);
            retryButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead();
            });
        } else {
            let row = new Panel(0, 0, container.width, 60);
            row.margin = 0;
            container.AddChild(row);
            let retryFromFlagButton = this.CreateButton("Retry From Flag", 0.45);
            row.AddChild(retryFromFlagButton);
            retryFromFlagButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead();
            });
            let retryFromStartButton = this.CreateButton("Retry From Start", 0.45);
            row.AddChild(retryFromStartButton);
            retryFromStartButton.onClickEvents.push(() => {
                this.Dispose();
                editorHandler.grabbedCheckpointLocation = null;
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead();
            });
        }

        // EXIT BUTTON
        if (levelGenerator) {
            let exitButton = this.CreateButton("Quit Challenge");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                MenuHandler.GoBack();
                if (levelGenerator) levelGenerator.LogRun();
                levelGenerator = null;
                LevelMap.BlankOutMap();
                editorHandler.exportString = "";
            });
        } else if (!editorHandler.isEditorAllowed) {
            let exitButton = this.CreateButton("Exit Level");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(() => {
                this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                MenuHandler.GoBack();
                currentLevelListing = null;
                audioHandler.SetBackgroundMusic("menuJazz");
                editorHandler.grabbedCheckpointLocation = null;
                DeathLogService.LogDeathCounts();
                currentDemoIndex = -1;
            });
        }

        if (currentLevelListing) {
            let levelTitle = new UIText(20, 20 + 36, currentLevelListing.level.name, 36, "white");
            levelTitle.textAlign = "left";
            levelTitle.strokeColor = "black";
            ret.push(levelTitle);
            let byText = new UIText(20, levelTitle.y + 18 + 10, "Created by " + currentLevelListing.author.username, 18, "white");
            byText.textAlign = "left";
            ret.push(byText);

            let recordText = new UIText(20, byText.y + 18 + 10,
                "WR: " + Utility.FramesToTimeText(currentLevelListing.level.recordFrames) + " by " + currentLevelListing.wrHolder.username,
                18, "white");
            recordText.textAlign = "left";
            ret.push(recordText);


            let opinionContainer = new Panel(0, 0, container.width, 60);

            if (!currentLevelListing.isLiked && !currentLevelListing.isDisliked) {
                let opinionButtonSize = 120;
                let dislikeButton = new Button(container.x, 0, opinionButtonSize, opinionButtonSize);
                opinionContainer.AddChild(dislikeButton);
                let likeButton = new Button(container.x + container.width + 10 - opinionButtonSize, 0, opinionButtonSize, opinionButtonSize);
                opinionContainer.AddChild(likeButton);

                let likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][0][0]);
                likeButton.AddChild(likeImage);
                let dislikeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][1][0]);
                dislikeButton.AddChild(dislikeImage);

                likeButton.onClickEvents.push(() => {
                    if (currentLevelListing) {
                        if (currentLevelListing.isLiked || currentLevelListing.isDisliked) return;
                        currentLevelListing.isLiked = true;
                        likeButton.normalBackColor = "#0000";
                        likeButton.mouseoverBackColor = "#0000";
                        dislikeButton.isHidden = true;
                        DataService.LikeLevel(currentLevelListing.level.code || "");
                        let listing = LevelBrowseMenu.GetListing(currentLevelListing?.level.code || "");
                        if (listing) listing.isLiked = true;
                    }
                });

                dislikeButton.onClickEvents.push(() => {
                    if (currentLevelListing) {
                        if (currentLevelListing.isLiked || currentLevelListing.isDisliked) return;
                        currentLevelListing.isDisliked = true;
                        dislikeButton.normalBackColor = "#0000";
                        dislikeButton.mouseoverBackColor = "#0000";
                        likeButton.isHidden = true;
                        DataService.DislikeLevel(currentLevelListing?.level.code || "");
                        let listing = LevelBrowseMenu.GetListing(currentLevelListing?.level.code || "");
                        if (listing) listing.isLiked = false;
                    }
                });
            }
            container.AddChild(opinionContainer);
        }


        return ret;
    }

    CreateButton(text: string, sizeRatio: number = 1): Button {
        let button = new Button(0, 0, camera.canvas.width * 0.7 * sizeRatio, 60);
        let buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.isNoisy = true;
        button.AddChild(buttonText);
        buttonText.xOffset = button.width / 2;
        buttonText.yOffset = 40;
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
            PauseMenu.IsPaused = false;
        }
    }
}