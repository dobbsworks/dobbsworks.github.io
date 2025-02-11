class LevelBrowseMenu extends Menu {
    stopsMapUpdate = true;
    selectedCloudCode: string = "";
    levels: LevelListing[] = [];
    levelPanel: Panel | null = null;
    pagesPanel: Panel | null = null;
    levelOptionsPanel: Panel | null = null;
    userDetailsPanel: Panel | null = null;
    backButton!: Button;
    backButtonUserPanel!: Button;
    searchButtons: LevelBrowseSortButton[] = []
    currentSearchButton!: LevelBrowseSortButton;
    isDataLoadInProgress = false;
    toggles: FilterToggle[] = [];

    backgroundColor = "#2171cc";
    backgroundColor2 = "#677327";
    includeGlitchLevels = false;
    includeClearedLevels = true;

    basePanelWidth = 632;
    bigPanelWidth = 900;
    baseX = 264;
    baseY = 40;
    basePanelHeight = 480;
    baseLeftX = -960;
    baseRightX = 30;

    numberOfPages = 0;
    currentPageIndex = 0;

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        this.backButton = this.CreateBackButton();
        ret.push(this.backButton);
        this.backButtonUserPanel = new Button(0, camera.canvas.height - 40, 70, 40);
        let backButtonText = new UIText(0, 0, "Back", 16, "white");
        backButtonText.xOffset = 25;
        backButtonText.yOffset = 20;
        this.backButtonUserPanel.AddChild(backButtonText);
        this.backButtonUserPanel.onClickEvents.push(() => {
            this.ShowLevelDetails();
        })
        ret.push(this.backButtonUserPanel);

        //this.searchButtons.push(new LevelBrowseSortButton(this, "Oldest", DataService.GetOldestLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Top Rated", DataService.GetBestRatedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Newest", DataService.GetRecentLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Most Liked", DataService.GetMostLikedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Easiest", DataService.GetEasiestLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Hardest", DataService.GetHardestLevels));
        if (ContestService.currentContest) {
            let contestState = ContestService.currentContest.status;
            if (contestState == ContestState.results || contestState == ContestState.votingOpen) {
                this.searchButtons.push(new LevelBrowseSortButton(this, "Contest", DataService.GetContestLevels));
            }
        }
        ret.push(...this.searchButtons);
        this.searchButtons[0].Click();
        //this.currentSearchButton


        this.levelPanel = new Panel(this.baseX, this.baseY - 10, this.basePanelWidth, this.basePanelHeight - 30);
        this.levelPanel.backColor = "#1138";
        this.levelPanel.layout = "vertical";
        ret.push(this.levelPanel);

        this.pagesPanel = new Panel(this.baseX, this.levelPanel.y + this.levelPanel.height, this.basePanelWidth, 40);
        this.pagesPanel.backColor = "#0000";
        ret.push(this.pagesPanel);

        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
        this.levelOptionsPanel.backColor = "#1138";
        this.levelOptionsPanel.layout = "vertical";
        ret.push(this.levelOptionsPanel);

        this.userDetailsPanel = new Panel(this.baseX + 2000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
        this.userDetailsPanel.backColor = "#1138";
        this.userDetailsPanel.layout = "vertical";
        ret.push(this.userDetailsPanel);

        this.toggles.push(new FilterToggle(this, "Glitched levels", tiles["spider"][0][0], tiles["spider"][4][0], (isOn) => {
            this.includeGlitchLevels = isOn;
        }, this.includeGlitchLevels));

        let clearedToggle = new FilterToggle(this, "Cleared levels", tiles["pig"][5][0], tiles["pig"][0][0], (isOn) => {
            this.includeClearedLevels = isOn;
        }, this.includeClearedLevels);
        clearedToggle.targetX -= 300;
        this.toggles.push(clearedToggle);
        this.toggles.forEach(a => a.originalX = a.targetX);

        ret.push(...this.toggles);

        return ret;
    }

    UpdatePagination(): void {
        if (!this.pagesPanel) return;
        this.pagesPanel.children = [];

        let buttonWidth = 50;
        for (let pageIndex = 0; pageIndex < this.numberOfPages; pageIndex++) {
            let button = new Button(0, 0, buttonWidth, 30);
            let text = new UIText(0, 0, (pageIndex + 1).toString(), 16, "white");
            text.xOffset = button.width / 2 - 4;
            text.yOffset = 15;
            button.AddChild(text);
            this.pagesPanel.AddChild(button);
            button.onClickEvents.push(() => {
                this.currentSearchButton.RequestLevels(pageIndex);
            });

            if (pageIndex == this.currentPageIndex) {
                button.normalBackColor = "#020b";
                button.mouseoverBackColor = "#242b";
            }
        }
        let takenSpace = (buttonWidth + this.pagesPanel.margin) * this.numberOfPages;
        this.pagesPanel.AddChild(new Spacer(0, 0, this.pagesPanel.width - takenSpace, 1));
    }

    static Reset(): void {
        let menu = <LevelBrowseMenu>MenuHandler.MenuStack.find(a => a instanceof LevelBrowseMenu);
        if (menu) {
            menu.PopulateLevelPanel();
        }
    }

    static GetListing(levelCode: string): LevelListing | undefined {
        let menu = <LevelBrowseMenu>MenuHandler.MenuStack.find(a => a instanceof LevelBrowseMenu);
        if (menu) {
            return menu.levels.find(a => a.level.code == levelCode);
        }
        return undefined;
    }

    PopulateLevelPanel(): void {
        if (this.levelPanel) {
            this.levelPanel.scrollIndex = 0;
            this.levelPanel.children = [];
            this.levelPanel.scrollableChildrenUp = [];
            this.levelPanel.scrollableChildrenDown = [];

            let buttons = this.levels.
                filter(a => !a.level.isGlitch || this.includeGlitchLevels).
                filter(a => !a.isCleared || this.includeClearedLevels).
                map(a => new LevelBrowseButton(a, this));

            for (let button of buttons) {
                if (this.levelPanel.children.length >= 5) {
                    this.levelPanel.scrollableChildrenDown.push(button);
                    button.parentElement = this.levelPanel;
                } else {
                    this.levelPanel.AddChild(button);
                }
            }

            this.UpdatePagination();
        }
    }

    ShowMainPanel(): void {
        if (this.userDetailsPanel) this.userDetailsPanel.targetX = 2000;
        if (this.levelOptionsPanel) this.levelOptionsPanel.targetX = 1000;
        if (this.levelPanel) this.levelPanel.targetX = this.baseX;
        if (this.pagesPanel) this.pagesPanel.targetX = this.baseX;
        this.toggles.forEach(a => a.targetX = a.originalX);
        this.backButton.isHidden = false;
        this.backButtonUserPanel.isHidden = true;
    }

    ShowLevelDetails(): void {
        this.backButtonUserPanel.isHidden = true;
        let levelListing = this.levels.find(a => a.level.code == this.selectedCloudCode);
        if (this.levelPanel) this.levelPanel.targetX = this.baseLeftX;
        if (this.pagesPanel) this.pagesPanel.targetX = this.baseLeftX;
        if (this.userDetailsPanel) this.userDetailsPanel.targetX = 2000;
        this.toggles.forEach(a => a.targetX = a.originalX - 1000);
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.backButton.isHidden = true;

            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];
            this.toggles.forEach(a => a.targetX -= 1000);


            let buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;

            let backButton = new Button(0, 0, 200, 50);
            backButton.onClickEvents.push(() => {
                this.selectedCloudCode = "";
                this.ShowMainPanel();
            })
            let backButtonText = new UIText(0, 0, "Back", 20, "white");
            backButton.AddChild(backButtonText);
            backButtonText.xOffset = backButton.width / 2;
            backButtonText.yOffset = 30;
            buttons.AddChild(backButton);


            let codeText = new UIText(0, 0, levelListing.level.code, 20, "#BBB");
            codeText.textAlign = "left";
            codeText.xOffset = -190;
            codeText.yOffset = -10;
            buttons.AddChild(codeText);


            if (levelListing.isStarted && levelListing.contestVote == 0 && ContestService.currentContest && ContestService.currentContest.status == ContestState.votingOpen) {
                // contest button
                let voteButton = new Button(0, 0, 200, 50);
                voteButton.onClickEvents.push(() => {
                    UIDialog.Alert("Rate the level from 1 (not great) to 5 (the best)", "Cancel");
                    if (MenuHandler.Dialog) {
                        MenuHandler.Dialog.AddFiveStarButtons((ranking: number) => {
                            // submit vote
                            if (levelListing) {
                                levelListing.contestVote = ranking;
                                voteButton.Disable();
                                DataService.SubmitContestVote(levelListing.level.code, ranking);
                            }
                        });
                    }
                })
                let voteButtonText = new UIText(0, 0, "Submit Vote", 20, "white");
                voteButton.AddChild(voteButtonText);
                voteButtonText.xOffset = voteButton.width / 2;
                voteButtonText.yOffset = 30;
                buttons.AddChild(voteButton);
            } else {
                buttons.AddChild(new Spacer(0, 0, 200, 10));
            }


            let editButton = new Button(0, 0, 200, 50);
            editButton.onClickEvents.push(() => {
                if (levelListing) {
                    currentMap = LevelMap.FromImportString(levelListing.level.levelData);
                    editorHandler.isEditorAllowed = true;
                    editorHandler.exportString = "";
                    editorHandler.SwitchToEditMode();
                    MenuHandler.SubMenu(BlankMenu)
                }
            })
            let editButtonText = new UIText(0, 0, "Open in Editor", 20, "white");
            editButton.AddChild(editButtonText);
            editButtonText.xOffset = editButton.width / 2;
            editButtonText.yOffset = 30;
            buttons.AddChild(editButton);

            let playButton = new Button(0, 0, 200, 80);
            playButton.normalBackColor = "#020b";
            playButton.mouseoverBackColor = "#242b";
            playButton.yOffset = -30;
            playButton.onClickEvents.push(() => {
                if (levelListing) {
                    let map = LevelMap.FromImportString(levelListing.level.levelData);
                    let isLevelVersionNewer = Version.IsLevelVersionNewerThanClient(map.mapVersion);
                    if (isLevelVersionNewer) {
                        UIDialog.Confirm("This level was made on a newer version of the game. To update your version, you just need to refresh this page. " +
                            "Do you want me to do that for you real quick? (Level editor contents will be lost)",
                            "Yeah, refresh now", "Not yet", () => { window.location.reload() });
                    } else {
                        currentMap = map;
                        editorHandler.SwitchToPlayMode();
                        MenuHandler.SubMenu(BlankMenu);
                        DataService.LogLevelPlayStarted(levelListing.level.code);
                        currentLevelListing = levelListing;
                        levelListing.isStarted = true;
                        this.PopulateLevelPanel();
                    }
                }
            })
            let playButtonText = new UIText(0, 0, "Play", 40, "white");
            playButton.AddChild(playButtonText);
            playButtonText.xOffset = playButton.width / 2;
            playButtonText.yOffset = 50;
            buttons.AddChild(playButton);


            // MID PANEL

            let midPanel = new Panel(0, 0, this.levelOptionsPanel.width, 250);
            midPanel.margin = 0;

            var thumbnail = new Image;
            thumbnail.src = levelListing.level.thumbnail;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            let imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);

            // make sure scale of this is good
            let imageFromTile = new ImageFromTile(0, 0, 422, 50 * 5, imageTile);
            imageFromTile.zoom = 10;
            midPanel.AddChild(imageFromTile);

            let CreateStatsRow = (imageTile: ImageTile, stat1: string, stat2: string): Panel => {
                let ret = new Panel(0, 0, 275, 50);
                let image = new ImageFromTile(0, 0, 48, 48, imageTile);
                image.zoom = 2;
                ret.AddChild(image);
                let text = new UIText(0, 0, stat1, 20, "#DDD");
                text.textAlign = "left";
                ret.AddChild(text);
                text.yOffset = 30;
                //text.font = "arial";
                if (stat2 == "") {
                    ret.AddChild(new Spacer(0, 0, 10, 10));
                } else {
                    let text2 = new UIText(0, 0, stat2, 20, "#DDD");
                    text2.textAlign = "left";
                    //text2.font = "arial";
                    ret.AddChild(text2);
                    text.yOffset = 15;
                    text2.yOffset = 45;
                    text2.xOffset = -16;
                }
                return ret;
            }
            let statsPanel = new Panel(0, 0, 125, 180);
            statsPanel.layout = "vertical";
            statsPanel.xOffset = -75;
            let clearRate = ((levelListing.level.numberOfClears / levelListing.level.numberOfAttempts) * 100).toFixed(1) + "%";
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][1], levelListing.level.numberOfClears + " / " + levelListing.level.numberOfAttempts, clearRate));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][1][1], levelListing.level.numberOfUniquePlayers.toString(), ""));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][0], levelListing.level.numberOfLikes.toString(), ""));
            if (levelListing.level.isGlitch) {
                statsPanel.targetHeight += 60;
                statsPanel.AddChild(CreateStatsRow(tiles["spider"][0][0], "Glitch level", ""));
            }
            midPanel.AddChild(statsPanel);

            let rightPanelWidth = 200;
            let rightPanel = new Panel(0, 0, rightPanelWidth + 10, 220);
            rightPanel.margin = 0;
            midPanel.AddChild(rightPanel);
            rightPanel.layout = "vertical";

            let CreateTimePanel = (labelText: string, frames: number, holder: UserDT | null): Button => {
                let panel = new Button(0, 0, rightPanelWidth, frames == 0 ? 50 : 100);
                panel.layout = "vertical";
                panel.backColor = "#0008";
                panel.margin = 0;

                let wrText = new UIText(0, 0, labelText, 14, "white");
                wrText.xOffset = rightPanelWidth / 2;
                wrText.yOffset = 18 + (frames == 0 ? -3 : 0);
                wrText.font = "arial";
                panel.AddChild(wrText);

                if (frames > 0) {
                    let wrTimeText = new UIText(0, 0, Utility.FramesToTimeText(frames), 28, "white");
                    wrTimeText.xOffset = rightPanelWidth / 2;
                    wrTimeText.yOffset = 22;
                    panel.AddChild(wrTimeText);
                }

                let bottomLine = new Panel(0, 0, rightPanelWidth, 40);

                let wrHolderText = new UIText(0, 0, holder ? holder.username : "Me", 20, "white");
                if (!holder) wrHolderText.xOffset = rightPanelWidth / 2;
                wrHolderText.yOffset = 28;
                if (holder) bottomLine.AddChild(new AvatarPanel(holder.avatar));
                bottomLine.AddChild(wrHolderText);
                bottomLine.margin = 0;
                if (holder) bottomLine.AddChild(new Spacer(0, 0, 40, 40));
                panel.AddChild(bottomLine);

                panel.onClickEvents.push(() => {
                    this.LoadUserDetailsPanel(holder ? holder.id : -1)
                });

                return panel;
            }

            //rightPanel.AddChild(new Spacer(0, 0, 10, 5));

            rightPanel.AddChild(new Spacer(0, 0, 10, 5));

            if (levelListing.wrHolder) {
                let timePanel = CreateTimePanel("World Record", levelListing.level.recordFrames, levelListing.wrHolder);
                rightPanel.AddChild(timePanel);
            }
            if (levelListing.personalBestFrames > 0) {
                let timePanel = CreateTimePanel("Personal Best", levelListing.personalBestFrames, null);
                rightPanel.AddChild(timePanel);
            }



            // TOP PANEL

            let topPanel = new Panel(0, 0, this.levelOptionsPanel.width, 30);
            topPanel.margin = 0;

            let titleText = new UIText(0, 0, levelListing.level.name, 30, "white");
            topPanel.AddChild(titleText);
            titleText.textAlign = "left";
            titleText.xOffset = 10;
            titleText.yOffset = 40;

            let authorContainer = new Panel(0, 0, rightPanelWidth + 10, 30);
            authorContainer.margin = 0;
            topPanel.AddChild(authorContainer);
            authorContainer.layout = "vertical";

            let authorPanel = CreateTimePanel("Created by", 0, levelListing.author || { username: "[REDACTED]" });
            authorContainer.AddChild(authorPanel);
            this.levelOptionsPanel.AddChild(topPanel);
            this.levelOptionsPanel.AddChild(midPanel);
            this.levelOptionsPanel.AddChild(buttons);
        }
    }

    LoadUserDetailsPanel(userId: number): void {
        if (this.userDetailsPanel) {
            this.userDetailsPanel.children = [];
            DataService.GetUserStatsByUserId(userId).then((userStats: UserWithStatsDT) => {
                this.PopulateUserPanel(userStats);
            });
            this.ShowUserPanel();
        }
    }

    PopulateUserPanel(userStats: UserWithStatsDT): void {
        if (this.userDetailsPanel) {
            this.userDetailsPanel.layout = "vertical";
            this.userDetailsPanel.margin = 0;

            let headerRow = new Panel(0, 0, 900, 100);
            headerRow.AddChild(new AvatarPanel(userStats.avatar, 4));
            let username = new UIText(0, 0, userStats.username, 50, "white");
            username.textAlign = "left";
            username.yOffset = 60;
            username.xOffset = -780;
            headerRow.AddChild(username);
            this.userDetailsPanel.AddChild(headerRow);

            let lowerRow = new Panel(0, 0, 900, 350)
            this.userDetailsPanel.AddChild(lowerRow);
            let leftPanel = new Panel(0, 0, 400, 350);
            leftPanel.layout = "vertical";
            leftPanel.margin = 0;
            let rightPanel = new Panel(0, 0, 400, 350);
            rightPanel.layout = "vertical";
            rightPanel.margin = 0;
            lowerRow.AddChild(new Spacer(0, 0, 0, 0));
            lowerRow.AddChild(leftPanel);
            lowerRow.AddChild(new Spacer(0, 0, 0, 0));
            lowerRow.AddChild(rightPanel);
            lowerRow.AddChild(new Spacer(0, 0, 0, 0));

            let stats = [
                ["Stats", ""],
                ["     World records", userStats.wRs.toString()],
                ["     Unique clears", userStats.clears.toString()],
                ["     Uploads", userStats.levels.toString()],
                ["     Likes earned", userStats.likes.toString()],
                ["3-Ring Bests", ""],
                ["     Easy", userStats.bestMarathonEasy.toString()],
                ["     Normal", userStats.bestMarathonNormal.toString()],
                ["     Hard", userStats.bestMarathonHard.toString()],
                ["     Kaizo", userStats.bestMarathonKaizo.toString()],
                ["", ""],
            ];
            for (let statRowContent of stats) {
                let statRow = new Panel(0, 0, 400, 30);
                statRow.margin = 0;
                let leftText = new UIText(0, 0, statRowContent[0], 25, "white");
                leftText.yOffset = 25;
                leftText.textAlign = "left";
                let rightText = new UIText(0, 0, statRowContent[1], 25, "white");
                rightText.yOffset = 25;
                rightText.textAlign = "right";
                statRow.AddChild(leftText);
                statRow.AddChild(rightText);
                leftPanel.AddChild(statRow);
            }

            let trophyPanel = new Panel(0, 0, 400, 230);
            trophyPanel.layout = "vertical";
            rightPanel.AddChild(trophyPanel);


            // for (let trophy of userStats.trophies) {
            //     let trophyElement = new TrophyImage(trophy.name, trophy.displayFrame);
            //     trophyPanel.AddChild(trophyElement);
            // }

            let trophyElements = userStats.trophies.map(a => new TrophyImage(a.name, a.displayFrame));
            let tilesPerRow = 3;
            let maxDisplayedRows = 2;
            while (trophyElements.length > 0) {
                let rowButtons = trophyElements.splice(0, tilesPerRow);
                let rowPanel = new Panel(0, 0, trophyPanel.width, 100);
                rowButtons.forEach(a => rowPanel.AddChild(a));
                let remainingSpaces = tilesPerRow - rowButtons.length;
                for (let i = 0; i < remainingSpaces; i++) {
                    rowPanel.AddChild(new Spacer(0, 0, 100, 100))
                }
                if (trophyPanel.children.length < maxDisplayedRows) {
                    trophyPanel.AddChild(rowPanel);
                } else {
                    trophyPanel.scrollableChildrenDown.push(rowPanel);
                }
            }
        }
    }

    ShowUserPanel(): void {
        if (this.userDetailsPanel) this.userDetailsPanel.targetX = this.baseX - 214;
        if (this.levelOptionsPanel) this.levelOptionsPanel.targetX = -1000;
        if (this.levelPanel) this.levelPanel.targetX = -2000;
        if (this.pagesPanel) this.pagesPanel.targetX = -2000;
        this.toggles.forEach(a => a.targetX = a.originalX - 2000);
        this.backButton.isHidden = true;
        this.backButtonUserPanel.isHidden = false;
    }


    Update(): void {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Debug1, true) && myUserData?.id == 1) {
            if (this.selectedCloudCode) {
                let modMenu = MenuHandler.SubMenu(ModerationMenu) as ModerationMenu;
                modMenu.level = this.levels.find(a => a.level.code == this.selectedCloudCode)?.level || null;
            }
        }
    }
}


class TrophyImage extends ImageFromTile {
    constructor(public name: string, public displayFrame: number) {
        super(0, 0, 100, 100, tiles["trophies"][displayFrame % 5][Math.floor(displayFrame / 5)]);
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.IsMouseOver() ? "#0009" : "#0003";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.Draw(ctx);

        if (this.IsMouseOver()) {
            ctx.fillStyle = "white";
            ctx.font = `${30}px ${"grobold"}`;
            ctx.textAlign = "left";
            ctx.fillText(this.name, 530, 160);
        }
    }
}


class LevelBrowseButton extends Button {
    isSelected: boolean = false;

    constructor(private levelListing: LevelListing, private containingMenu: LevelBrowseMenu) {
        super(0, 0, 88 * 2 + 10, 50 * 2 + 10 - 24);

        if (levelListing.isStarted && !levelListing.isCleared) {
            this.normalBackColor = "#200b";
            this.mouseoverBackColor = "#422b";
        }
        if (levelListing.isCleared) {
            this.normalBackColor = "#020b";
            this.mouseoverBackColor = "#242b";
        }

        let levelDt = levelListing.level;
        var thumbnail = new Image;
        thumbnail.src = levelDt.thumbnail;
        thumbnail.width = camera.canvas.width / 24;
        thumbnail.height = camera.canvas.height / 24;
        let imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);

        // make sure scale of this is good
        let imageFromTile = new ImageFromTile(0, 0, 88 * 2 - 30, 50 * 2, imageTile);
        imageFromTile.zoom = 3;
        imageFromTile.xOffset = -13;
        imageFromTile.yOffset = -12;
        this.AddChild(imageFromTile);

        let texts = new Panel(0, 0, 480, 65);
        texts.layout = "vertical";


        let titleLine = new Panel(0, 0, 290, 25);
        titleLine.margin = 0;

        let titleLineText = new UIText(0, 0, levelDt.name, 20, "white");
        titleLineText.textAlign = "left";
        titleLineText.yOffset = 20;
        titleLine.AddChild(titleLineText);

        let byLine = new Panel(0, 0, 290, 20);
        if (levelListing.author) {
            byLine.margin = 0;
            byLine.AddChild(new AvatarPanel(levelListing.author.avatar));
            let byLineText = new UIText(0, 0, "by " + levelListing.author.username, 14, "white");
            byLineText.textAlign = "left";
            byLineText.yOffset = 20;
            byLineText.xOffset = -80;
            let byLineTextContainer = new Panel(0, 0, 340, 20);
            byLineTextContainer.AddChild(byLineText);
            byLine.AddChild(byLineTextContainer);
        }

        texts.AddChild(titleLine);
        texts.AddChild(byLine);

        texts.AddChild(new Spacer(0, 0, 0, 0));

        this.AddChild(texts);


        let iconPanel = new Panel(0, 0, 24, 24);
        iconPanel.yOffset = 48;
        iconPanel.margin = 0;
        let imageOffset = 0;

        if (levelListing.contestRank == 1) {
            let awardImage = new ImageFromTile(0, 0, 24, 24, tiles["trophies"][0][1]);
            awardImage.zoom = 2;
            awardImage.xOffset -= imageOffset;
            imageOffset += 24;
            iconPanel.AddChild(awardImage);
        }
        if (levelListing.contestRank == 2) {
            let awardImage = new ImageFromTile(0, 0, 24, 24, tiles["trophies"][1][1]);
            awardImage.zoom = 2;
            awardImage.xOffset -= imageOffset;
            imageOffset += 24;
            iconPanel.AddChild(awardImage);
        }
        if (levelListing.contestRank == 3) {
            let awardImage = new ImageFromTile(0, 0, 24, 24, tiles["trophies"][2][1]);
            awardImage.zoom = 2;
            awardImage.xOffset -= imageOffset;
            imageOffset += 24;
            iconPanel.AddChild(awardImage);
        }
        if (levelListing.isLiked || levelListing.isDisliked) {
            let col = levelListing.isLiked ? 0 : 1;
            let likeImage = new ImageFromTile(0, 0, 24, 24, tiles["menuButtons"][col][0]);
            likeImage.zoom = 1;
            likeImage.xOffset -= imageOffset;
            imageOffset += 24;
            iconPanel.AddChild(likeImage);
        }
        if (levelListing.contestVote > 0) {
            let voteImage = new ImageFromTile(0, 0, 24, 24, tiles["voteStars"][1][0]);
            voteImage.zoom = 1;
            voteImage.xOffset -= imageOffset;
            imageOffset += 24;
            iconPanel.AddChild(voteImage);
        }
        if (levelListing.level.isGlitch) {
            let glitchImage = new ImageFromTile(0, 0, 24, 24, tiles["spider"][0][0]);
            glitchImage.zoom = 2;
            glitchImage.xOffset -= imageOffset;
            imageOffset += 24;
            iconPanel.AddChild(glitchImage);
        }
        this.AddChild(iconPanel);

        this.onClickEvents.push(() => {
            containingMenu.selectedCloudCode = this.levelListing.level.code;
            this.isSelected = true;
            containingMenu.ShowLevelDetails();
        })

        this.Update();
    }

    Update(): void {
        super.Update();
        this.isSelected = (this.containingMenu.selectedCloudCode == this.levelListing.level.code);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";

        this.width = this.targetWidth;
        for (let child of this.children) {
            if (child.targetWidth) child.width = child.targetWidth;
            child.x = child.targetX;
        }
    }
}

class LevelBrowseSortButton extends Button {

    cachedPages: { pageIndex: number, levels: LevelListing[] }[] = [];
    searchTime: Date | null = null;

    constructor(private parent: LevelBrowseMenu, name: string, private searchFunc: (pageIndex: number) => Promise<LevelBrowseResults>) {
        super(0, parent.searchButtons.length * 60 + 50, 210, 50);

        this.onClickEvents.push(() => { this.RequestLevels(0); })
        this.margin = 15;
        let label = new UIText(0, 0, name, 24, "white");
        label.textAlign = "right";
        label.yOffset = 22;
        this.AddChild(new Spacer(0, 0, 0, 0));
        this.AddChild(label);
    }

    RequestLevels(pageIndex: number): void {
        if (this.parent.isDataLoadInProgress) {
            audioHandler.PlaySound("error", false);
        } else {
            let secondsSinceLastSearch = 60;
            if (this.searchTime) secondsSinceLastSearch = (+(new Date()) - +(this.searchTime || 0)) / 1000;
            let cache = this.cachedPages.find(a => a.pageIndex == pageIndex);
            if (false) {
            //if ((this.parent.currentSearchButton != this || secondsSinceLastSearch < 60) && cache && cache.levels.length > 0) {
                // pull from cache
                // this.parent.levels = cache.levels;
                // this.parent.currentPageIndex = pageIndex;
                // this.parent.PopulateLevelPanel();
            } else {
                // run this search function
                this.parent.isDataLoadInProgress = true;
                this.parent.levels = [];
                this.parent.PopulateLevelPanel();
                this.searchTime = new Date();

                let getLevelsPromise = this.searchFunc(pageIndex);
                getLevelsPromise.then(results => {
                    this.parent.isDataLoadInProgress = false;
                    this.cachedPages = this.cachedPages.filter(a => a.pageIndex != pageIndex); // delete existing cache for this page
                    this.cachedPages.push({ pageIndex: pageIndex, levels: results.levels });
                    this.parent.levels = results.levels;
                    this.parent.numberOfPages = results.pageCount;
                    this.parent.currentPageIndex = pageIndex;
                    this.parent.PopulateLevelPanel();
                }).catch((error) => {
                    console.error(error);
                });
            }
        }

        this.parent.currentSearchButton = this;
    }

    Update(): void {
        super.Update();
        this.isSelected = this.parent.currentSearchButton == this;
        let baseX = (this.parent.levelPanel?.targetX ?? 0) - this.parent.baseX;
        if (this.isSelected) {
            this.normalBackColor = "#f73738";
            this.mouseoverBackColor = "#fa6162";
            this.targetX = baseX;
        } else {
            this.normalBackColor = "#05001e";
            this.mouseoverBackColor = "#18123a";
            this.targetX = baseX - 50;
        }
    }

}

class FilterToggle extends Button {
    text!: UIText;
    image!: ImageFromTile;
    originalX: number = 0;

    constructor(public parentMenu: LevelBrowseMenu, private prefix: string, selectedImage: ImageTile, unselectedImage: ImageTile, onToggle: (isOn: boolean) => void, initialState: boolean) {
        super(675, 530, 275, 50);

        this.image = new ImageFromTile(0, 0, 48, 48, unselectedImage);
        this.image.zoom = 2;
        this.AddChild(this.image);

        this.text = new UIText(0, 0, this.prefix + " " + "Filtered", 18, "white");
        this.text.yOffset = 25;
        this.text.xOffset = -5;
        this.text.textAlign = "right";
        this.AddChild(this.text);

        this.onClickEvents.push(() => {
            this.isSelected = !this.isSelected;
            this.text.text = this.prefix + " " + (this.isSelected ? "Included" : "Filtered");
            this.image.imageTile = this.isSelected ? selectedImage : unselectedImage;
            onToggle(this.isSelected);
            parentMenu.PopulateLevelPanel();
        });

        if (initialState) {
            this.onClickEvents.forEach(a => a());
        }
    }

    Update(): void {
        super.Update();
        this.borderColor = this.isSelected ? "#F26E" : "#0000";
    }

}