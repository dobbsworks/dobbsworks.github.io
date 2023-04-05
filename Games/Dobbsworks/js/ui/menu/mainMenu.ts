class MainMenu extends Menu {
    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        ret.push(OptionsMenu.CreateOptionsButton());

        let logo = new Logo(262, 30);
        ret.push(logo);

        let centerX = camera.canvas.width / 2;
        let playButtonWidth = camera.canvas.width / 3;
        let playButtonHeight = 60;
        let playButtonX = centerX - playButtonWidth / 2;
        let playButtonY = logo.y + logo.height + 15;
        let playButton = new Button(playButtonX, playButtonY, playButtonWidth, playButtonHeight);
        let playText = new UIText(centerX, playButtonY + 40, "Start Making", 30, "#000");
        playButton.AddChild(playText);
        playText.xOffset = playButtonWidth / 2 - 5;
        playText.yOffset = 40;
        playButton.isNoisy = true;
        ret.push(playButton);

        let myLevelsButton = new Button(playButtonX, playButtonY + playButtonHeight + 10, playButtonWidth, playButtonHeight);
        let myLevelsText = new UIText(centerX, playButtonY + 40, "My Levels", 30, "#000");
        myLevelsButton.AddChild(myLevelsText);
        myLevelsText.xOffset = playButtonWidth / 2 - 5;
        myLevelsText.yOffset = 40;
        myLevelsButton.isNoisy = true;
        if (!isDemoMode) ret.push(myLevelsButton);

        let demoLevelsButton = new Button(playButtonX, playButtonY + playButtonHeight + 10, playButtonWidth, playButtonHeight);
        let demoLevelsText = new UIText(centerX, playButtonY + 40, "Demo Levels", 30, "#000");
        demoLevelsButton.AddChild(demoLevelsText);
        demoLevelsText.xOffset = playButtonWidth / 2 - 5;
        demoLevelsText.yOffset = 40;
        demoLevelsButton.isNoisy = true;
        if (isDemoMode) ret.push(demoLevelsButton);

        let recentLevelsButton = new Button(playButtonX, playButtonY + (playButtonHeight + 10) * 2, playButtonWidth, playButtonHeight);
        let recentLevelsText = new UIText(centerX, playButtonY + 40, "Browse Levels", 30, "#000");
        recentLevelsButton.AddChild(recentLevelsText);
        recentLevelsText.xOffset = playButtonWidth / 2 - 5;
        recentLevelsText.yOffset = 40;
        recentLevelsButton.isNoisy = true;
        if (!isDemoMode) ret.push(recentLevelsButton);

        let singlePlayerButton = new Button(playButtonX, playButtonY + (playButtonHeight + 10) * 3, playButtonWidth, playButtonHeight);
        let singlePlayerText = new UIText(centerX, playButtonY + 40, "Barker's Carnival", 30, "#000");
        singlePlayerButton.AddChild(singlePlayerText);
        singlePlayerText.xOffset = playButtonWidth / 2 - 5;
        singlePlayerText.yOffset = 40;
        singlePlayerButton.isNoisy = true;
        if (!isDemoMode) ret.push(singlePlayerButton);

        let contestButton = new Button(playButtonX + playButtonWidth + 10 + 50, playButtonY + (playButtonHeight + 10) * 2, playButtonWidth - 80, playButtonHeight * 2 + 10);
        let contestButtonText = new UIText(centerX, playButtonY + 40, "Level Contest!", 30, "#000");
        contestButton.AddChild(contestButtonText);
        contestButtonText.xOffset = contestButton.width / 2 - 5;
        contestButtonText.yOffset = 40;
        contestButton.isNoisy = true;
        contestButton.layout = "vertical"
        let trophyRow = new Panel(0, 0, contestButton.width - 10, 70);
        trophyRow.AddChild(new Spacer(0, 0, 10, 10));
        for (let i = 0; i < 3; i++) {
            let contestIcon = new ImageFromTile(0, 0, 48, 48, tiles["trophies"][i][0]);
            trophyRow.AddChild(contestIcon);
        }
        trophyRow.AddChild(new Spacer(0, 0, 10, 10));
        contestButton.AddChild(trophyRow);
        if (!isDemoMode) ret.push(contestButton);
        contestButton.x += 300;
        if (!ContestService.currentContest) {
            contestButton.targetX += 300;
        }

        [playButton, myLevelsButton, recentLevelsButton, demoLevelsButton, singlePlayerButton, contestButton].forEach(b => {
            b.normalBackColor = "#fff8";
            b.mouseoverBackColor = "#f73738";
            b.borderColor = "#000";
            b.borderRadius = 9;
            b.onClickEvents.push(() => {
                // don't save checkpoints from main menu
                editorHandler.grabbedCheckpointLocation = null;
            })
        });

        playButton.onClickEvents.push(() => {
            editorHandler.isEditorAllowed = true;
            editorHandler.SwitchToEditMode();
            this.Hide(-1);
        });

        myLevelsButton.onClickEvents.push(() => {
            MenuHandler.SubMenu(MyLevelsMenu);
        });

        recentLevelsButton.onClickEvents.push(() => {
            MenuHandler.SubMenu(LevelBrowseMenu);
            audioHandler.SetBackgroundMusic("menuJazz");
        });

        singlePlayerButton.onClickEvents.push(() => {
            MenuHandler.SubMenu(CarnivalMenu);
            audioHandler.SetBackgroundMusic("carnival");
        });

        contestButton.onClickEvents.push(() => {
            this.DisplayContestPopUp();
        });

        demoLevelsButton.onClickEvents.push(() => {
            currentDemoIndex = 0;
            currentMap = LevelMap.FromImportString(allDemoLevels[0]);
            editorHandler.SwitchToPlayMode();
            MenuHandler.SubMenu(BlankMenu);
        });

        return ret;
    }

    DisplayContestPopUp(): void {
        let contest = ContestService.currentContest;
        if (contest) {
            if (contest.status == ContestState.results) {
                
                UIDialog.Alert(`The level contest, "${contest.title}", has completed! You can view the results in the "Contest" tab of the level browser. Special thanks to all participants and voters!`, "OK");
                if (MenuHandler.Dialog) MenuHandler.Dialog.title = "The resutls are in!";
                
            } else {

                UIDialog.Alert(contest.description, "OK");
                if (MenuHandler.Dialog) {
                    MenuHandler.Dialog.title = contest.title;
                    if (contest.status == ContestState.submissionsOpen) {
                        let countdownText = "Time left to submit";
                        if (contest.submittedLevel) countdownText = "Time until voting opens";
                        UIDialog.SetCountdown(countdownText, contest.votingTime);
                        if (!contest.submittedLevel) {
                            MenuHandler.Dialog.options.unshift(new UIDialogOption("How to submit", () => {
                                UIDialog.Alert("After creating your level, clear check it from the My Levels menu. Instead of clicking \"Publish\", click \"Submit to Contest\". You can only submit one level, so make it count!", "OK");
                                if (MenuHandler.Dialog) {
                                    MenuHandler.Dialog.title = "How to submit contest levels";
                                    MenuHandler.Dialog.options[0].action = () => { this.DisplayContestPopUp() };
                                }
                            }));
                        }
                    }
                    if (contest.status == ContestState.votingOpen) {
                        UIDialog.SetCountdown("Time left to vote", contest.resultsTime);
                        MenuHandler.Dialog.options.unshift(new UIDialogOption("How to vote", () => {
                            UIDialog.Alert("Click \"Browse Levels\", then click the \"Contest\" tab. This will show all the submissions for the active contest. After playing a level, a \"Vote\" button will appear next to the \"Open in Editor\" button. You can rate the level on a 1 - 5 scale, with 5 being the best. All votes are final!", "OK");
                            if (MenuHandler.Dialog) {
                                MenuHandler.Dialog.title = "How to vote on contest levels";
                                MenuHandler.Dialog.options[0].action = () => { this.DisplayContestPopUp() };
                            }
                        }));
                    }
                }

            }
        }
    }
}


class Logo extends UIElement {

    constructor(x: number, y: number) {
        super(x, y);
        this.width = tiles["logo"][0][0].width * 4;
        this.height = tiles["logo"][0][0].height * 4;
        this.targetWidth = this.width;
        this.targetHeight = this.height;
    }

    IsMouseOver(): boolean {
        return false;
    }

    GetMouseOverElement(): UIElement | null { return null; }

    age = 0;
    Update(): void {
        super.Update();
        this.age++;
    }

    Draw(ctx: CanvasRenderingContext2D): void {

        let frame = Math.floor(this.age / 5) % 3;

        let imageTile = tiles["logo"][frame][0];

        let scale = 4;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x, this.y, imageTile.width * scale, imageTile.height * scale);
    }
}