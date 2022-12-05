class LevelBrowseMenu extends Menu {
    stopsMapUpdate = true;
    selectedCloudCode: string = "";
    levels: LevelListing[] = [];
    levelPanel: Panel | null = null;
    levelOptionsPanel: Panel | null = null;
    backButton!: Button;
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

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        this.backButton = this.CreateBackButton();
        ret.push(this.backButton);

        let getLevelsPromise = DataService.GetRecentLevels();
        getLevelsPromise.then(levels => {
            this.levels = levels;
            this.PopulateLevelPanel();
        }).catch((error) => {
        });

        this.searchButtons.push(new LevelBrowseSortButton(this, "Newest", DataService.GetRecentLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Top Rated", DataService.GetBestRatedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Most Liked", DataService.GetMostLikedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Easiest", DataService.GetEasiestLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Hardest", DataService.GetHardestLevels));
        ret.push(...this.searchButtons);
        this.searchButtons[0].Click();
        //this.currentSearchButton


        this.levelPanel = new Panel(this.baseX, this.baseY, this.basePanelWidth, this.basePanelHeight);
        this.levelPanel.backColor = "#1138";
        this.levelPanel.layout = "vertical";
        ret.push(this.levelPanel);

        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
        this.levelOptionsPanel.backColor = "#1138";
        this.levelOptionsPanel.layout = "vertical";
        ret.push(this.levelOptionsPanel);

        this.toggles.push(new FilterToggle(this, tiles["spider"][0][0], tiles["spider"][0][1], (isOn) => {
            this.includeGlitchLevels = isOn;
        }, this.includeGlitchLevels));

        let clearedToggle = new FilterToggle(this, tiles["pig"][5][0], tiles["pig"][0][0], (isOn) => {
            this.includeClearedLevels = isOn;
        }, this.includeClearedLevels);
        clearedToggle.targetX -= 200;
        this.toggles.push(clearedToggle);

        ret.push(...this.toggles);

        return ret;
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
            let scrollIndex = this.levelPanel.scrollIndex;
            this.levelPanel.scrollIndex = 0;
            this.levelPanel.children = [];
            this.levelPanel.scrollableChildrenUp = [];
            this.levelPanel.scrollableChildrenDown = [];

            let buttons = this.levels.
                filter(a => !a.level.isGlitch || this.includeGlitchLevels).
                filter(a => !a.isCleared || this.includeClearedLevels).
                map(a => new LevelBrowseButton(a, this));

            for (let button of buttons) {
                if (this.levelPanel.children.length >= 4) {
                    this.levelPanel.scrollableChildrenDown.push(button);
                    button.parentElement = this.levelPanel;
                } else {
                    this.levelPanel.AddChild(button);
                }
            }

            for (let i = 0; i < Math.abs(scrollIndex); i++) {
                this.levelPanel.Scroll(scrollIndex < 0 ? -1 : 1);
            }
        }
    }

    HideLevelDetails(): void {
        if (this.levelOptionsPanel) this.levelOptionsPanel.targetX = 1000;
        if (this.levelPanel) this.levelPanel.targetX = this.baseX;
        this.toggles.forEach(a => a.targetX += 1000);
        this.backButton.isHidden = false;
    }

    ShowLevelDetails(): void {
        let levelListing = this.levels.find(a => a.level.code == this.selectedCloudCode);
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.backButton.isHidden = true;

            this.levelPanel.targetX = this.baseLeftX;
            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];
            this.toggles.forEach(a => a.targetX -= 1000);


            let buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;

            let backButton = new Button(0, 0, 200, 50);
            backButton.onClickEvents.push(() => {
                this.selectedCloudCode = "";
                this.HideLevelDetails();
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
            buttons.AddChild(new Spacer(0, 0, 200, 10));

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

            let CreateTimePanel = (labelText: string, frames: number, holder: UserDT | null): Panel => {
                let panel = new Panel(0, 0, rightPanelWidth, frames == 0 ? 50 : 100);
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

            let authorPanel = CreateTimePanel("Created by", 0, levelListing.author);
            authorContainer.AddChild(authorPanel);
            this.levelOptionsPanel.AddChild(topPanel);
            this.levelOptionsPanel.AddChild(midPanel);
            this.levelOptionsPanel.AddChild(buttons);
        }
    }
}


class LevelBrowseButton extends Button {
    isSelected: boolean = false;

    constructor(private levelListing: LevelListing, private containingMenu: LevelBrowseMenu) {
        super(0, 0, 88 * 2 + 10, 50 * 2 + 10);

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
        let imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
        imageFromTile.zoom = 4;
        this.AddChild(imageFromTile);

        let texts = new Panel(0, 0, 370, 80);
        texts.layout = "vertical";


        let titleLine = new Panel(0, 0, 290, 25);
        titleLine.margin = 0;

        let titleLineText = new UIText(0, 0, levelDt.name, 20, "white");
        titleLineText.textAlign = "left";
        titleLineText.yOffset = 20;
        titleLine.AddChild(titleLineText);

        let byLine = new Panel(0, 0, 290, 20);
        byLine.margin = 0;

        byLine.AddChild(new AvatarPanel(levelListing.author.avatar));

        let byLineText = new UIText(0, 0, "by " + levelListing.author.username, 14, "white");
        byLineText.textAlign = "left";
        byLineText.yOffset = 20;

        let byLineTextContainer = new Panel(0, 0, 320, 20);
        byLineTextContainer.AddChild(byLineText);
        byLine.AddChild(byLineTextContainer);

        texts.AddChild(titleLine);
        texts.AddChild(byLine);

        texts.AddChild(new Spacer(0, 0, 0, 0));

        this.AddChild(texts);


        let iconPanel = new Panel(0, 0, 50, 90);
        iconPanel.layout = "vertical";

        if (levelListing.isLiked || levelListing.isDisliked) {
            let col = levelListing.isLiked ? 0 : 1;
            let likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][col][0]);
            likeImage.zoom = 1;
            likeImage.xOffset = -25;
            likeImage.yOffset = -30;
            iconPanel.AddChild(likeImage);
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

    cachedListings: LevelListing[] = [];
    searchTime: Date | null = null;

    constructor(private parent: LevelBrowseMenu, name: string, searchFunc: () => Promise<LevelListing[]>) {
        super(0, parent.searchButtons.length * 60 + 50, 210, 50);

        this.onClickEvents.push(() => {

            if (this.parent.isDataLoadInProgress) {
                audioHandler.PlaySound("error", false);
            } else {
                let secondsSinceLastSearch = 60;
                if (this.searchTime) secondsSinceLastSearch = (+(new Date()) - +(this.searchTime || 0)) / 1000;
                if ((this.parent.currentSearchButton != this || secondsSinceLastSearch < 10) && this.cachedListings.length > 0) {
                    // pull from cache
                    this.parent.levels = this.cachedListings;
                    this.parent.PopulateLevelPanel();
                } else {
                    // run this search function
                    this.parent.isDataLoadInProgress = true;
                    this.parent.levels = [];
                    this.parent.PopulateLevelPanel();
                    this.searchTime = new Date();

                    let getLevelsPromise = searchFunc();
                    getLevelsPromise.then(levels => {
                        this.parent.isDataLoadInProgress = false;
                        this.cachedListings = levels;
                        this.parent.levels = levels;
                        this.parent.PopulateLevelPanel();
                    }).catch((error) => {
                        console.error(error);
                    });
                }

            }


            this.parent.currentSearchButton = this;
        })
        this.margin = 15;

        let label = new UIText(0, 0, name, 24, "white");
        label.textAlign = "right";
        label.yOffset = 22;
        this.AddChild(new Spacer(0, 0, 0, 0));
        this.AddChild(label);
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

    constructor(public parentMenu: LevelBrowseMenu, selectedImage: ImageTile, unselectedImage: ImageTile, onToggle: (isOn: boolean) => void, initialState: boolean) {
        super(700, 530, 150, 50);

        this.image = new ImageFromTile(0, 0, 48, 48, unselectedImage);
        this.image.zoom = 2;
        this.AddChild(this.image);

        this.text = new UIText(0, 0, "Filtered", 18, "white");
        this.text.yOffset = 25;
        this.text.xOffset = -5;
        this.text.textAlign = "right";
        this.AddChild(this.text);

        this.onClickEvents.push(() => {
            this.isSelected = !this.isSelected;
            this.text.text = this.isSelected ? "Included" : "Filtered";
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