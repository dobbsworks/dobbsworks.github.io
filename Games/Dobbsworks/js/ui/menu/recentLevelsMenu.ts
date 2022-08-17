class RecentLevelsMenu extends Menu {
    stopsMapUpdate = true;
    selectedCloudCode: string = "";
    levels: LevelListing[] = [];
    levelPanel: Panel | null = null;
    levelOptionsPanel: Panel | null = null;
    backButton!: Button;

    basePanelWidth = 432;
    bigPanelWidth = 900;
    baseX = (960 - this.basePanelWidth) / 2;
    baseY = 70;
    basePanelHeight = 400;
    baseLeftX = -500;
    baseRightX = 30;

    backgroundColor = "#101";

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

        this.levelPanel = new Panel(this.baseX, this.baseY, this.basePanelWidth, this.basePanelHeight);
        this.levelPanel.backColor = "#1138";
        this.levelPanel.layout = "vertical";
        ret.push(this.levelPanel);

        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
        this.levelOptionsPanel.backColor = "#1138";
        this.levelOptionsPanel.layout = "vertical";
        ret.push(this.levelOptionsPanel);

        return ret;
    }

    static Reset(): void {
        let menu = <RecentLevelsMenu>MenuHandler.MenuStack.find(a => a instanceof RecentLevelsMenu);
        if (menu) {
            menu.PopulateLevelPanel();
        }
    }

    static GetListing(levelCode: string): LevelListing | undefined {
        let menu = <RecentLevelsMenu>MenuHandler.MenuStack.find(a => a instanceof RecentLevelsMenu);
        if (menu) {
            return menu.levels.find(a => a.level.code == levelCode);
        }
        return undefined;
    }

    PopulateLevelPanel(): void {
        if (this.levelPanel) {
            let scrollIndex = this.levelPanel.scrollIndex;
            this.levelPanel.children = [];
            this.levelPanel.scrollableChildren = [];

            let buttons = this.levels.map(a => new CloudLevelButton(a, this));
            if (buttons.length == 1) this.levelPanel.AddChild(new Spacer(0, 0, 88 * 2 + 10, 50 * 2 + 10));
            if (buttons.length == 2) this.levelPanel.AddChild(new Spacer(0, 0, 88 * 2 + 10, 50 * 2 + 10));
            while (buttons.length > 3) {
                let button = buttons.pop();
                if (button) this.levelPanel.scrollableChildren.push(button);
            }
            while (buttons.length > 0) {
                let button = buttons.pop();
                if (button) this.levelPanel.AddChild(button);
            }

            for (let i = 0; i < Math.abs(scrollIndex); i++) {
                this.levelPanel.Scroll(scrollIndex > 0 ? -1 : 1);
            }
        }
    }

    HideLevelDetails(): void {
        if (this.levelOptionsPanel) this.levelOptionsPanel.targetX = 1000;
        if (this.levelPanel) this.levelPanel.targetX = this.baseX;
        this.backButton.isHidden = false;
    }

    ShowLevelDetails(): void {
        let levelListing = this.levels.find(a => a.level.code == this.selectedCloudCode);
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.backButton.isHidden = true;

            this.levelPanel.targetX = this.baseLeftX;
            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];


            let buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;
            this.levelOptionsPanel.AddChild(buttons);

            let backButton = new Button(0, 0, 200, 50);
            backButton.onClickEvents.push(() => {
                this.selectedCloudCode = "";
                this.HideLevelDetails();
            })
            let backButtonText = new UIText(0, 0, "Back", 20, "white");
            backButton.AddChild(backButtonText);
            backButtonText.xOffset = backButton.width / 2;
            backButtonText.yOffset = -10;
            buttons.AddChild(backButton);

            let codeText = new UIText(0, 0, levelListing.level.code, 20, "#BBB");
            codeText.textAlign = "left";
            codeText.xOffset = -190;
            codeText.yOffset = -8;
            buttons.AddChild(codeText);
            buttons.AddChild(new Spacer(0,0, 200, 10));

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
            editButtonText.yOffset = -10;
            buttons.AddChild(editButton);

            let playButton = new Button(0, 0, 200, 80);
            playButton.normalBackColor = "#020b";
            playButton.mouseoverBackColor = "#242b";
            playButton.yOffset = -30;
            playButton.onClickEvents.push(() => {
                if (levelListing) {
                    currentMap = LevelMap.FromImportString(levelListing.level.levelData);
                    editorHandler.SwitchToPlayMode();
                    MenuHandler.SubMenu(BlankMenu);
                    DataService.LogLevelPlayStarted(levelListing.level.code);
                    currentLevelCode = levelListing.level.code;
                    levelListing.isStarted = true;
                    this.PopulateLevelPanel();
                }
            })
            let playButtonText = new UIText(0, 0, "Play", 40, "white");
            playButton.AddChild(playButtonText);
            playButtonText.xOffset = playButton.width / 2;
            playButtonText.yOffset = -20;
            buttons.AddChild(playButton);


            // MID PANEL

            let midPanel = new Panel(0, 0, this.levelOptionsPanel.width, 250);
            midPanel.margin = 0;
            this.levelOptionsPanel.AddChild(midPanel);

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
                    ret.AddChild(new Spacer(0,0, 10, 10));
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
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][0], levelListing.level.numberOfLikes.toString(), ""));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][1][1], levelListing.level.numberOfUniquePlayers.toString(), ""));
            let clearRate = ((levelListing.level.numberOfClears / levelListing.level.numberOfAttempts) * 100).toFixed(1) + "%";
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][1], levelListing.level.numberOfClears + " / " + levelListing.level.numberOfAttempts, clearRate));
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
                let wrHolderText = new UIText(0, 0, holder ? holder.username : "Me", 20, "white");
                wrHolderText.xOffset = rightPanelWidth / 2;
                wrHolderText.yOffset = -5;
                panel.AddChild(wrHolderText);

                if (frames > 0) {
                    let wrTimeText = new UIText(0, 0, Utility.FramesToTimeText(frames), 28, "white");
                    wrTimeText.xOffset = rightPanelWidth / 2;
                    wrTimeText.yOffset = 6;
                    panel.AddChild(wrTimeText);
                }

                let wrText = new UIText(0, 0, labelText, 14, "white");
                wrText.xOffset = rightPanelWidth / 2;
                wrText.yOffset = 18 + (frames == 0 ? -3 : 0);
                wrText.font = "arial";
                panel.AddChild(wrText);

                return panel;
            }

            //rightPanel.AddChild(new Spacer(0, 0, 10, 5));

            if (levelListing.personalBestFrames > 0) {
                let timePanel = CreateTimePanel("Personal Best", levelListing.personalBestFrames, null);
                rightPanel.AddChild(timePanel);
            }

            if (levelListing.wrHolder) {
                let timePanel = CreateTimePanel("World Record", levelListing.level.recordFrames, levelListing.wrHolder);
                rightPanel.AddChild(timePanel);
            }

            rightPanel.AddChild(new Spacer(0, 0, 10, 5));


            // TOP PANEL

            let topPanel = new Panel(0, 0, this.levelOptionsPanel.width, 30);
            topPanel.margin = 0;
            this.levelOptionsPanel.AddChild(topPanel);

            let titleText = new UIText(0, 0, levelListing.level.name, 30, "white");
            topPanel.AddChild(titleText);
            titleText.textAlign = "left";
            titleText.xOffset = 10;
            titleText.yOffset = 10;

            let authorContainer = new Panel(0, 0, rightPanelWidth + 10, 30);
            authorContainer.margin = 0;
            topPanel.AddChild(authorContainer);
            authorContainer.layout = "vertical";

            let authorPanel = CreateTimePanel("Created by", 0, levelListing.author);
            authorContainer.AddChild(authorPanel);
        }
    }
}


class CloudLevelButton extends Button {
    isSelected: boolean = false;

    constructor(private levelListing: LevelListing, private containingMenu: RecentLevelsMenu) {
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

        if (levelListing.isLiked || levelListing.isDisliked) {
            let col = levelListing.isLiked ? 0 : 1;
            let likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][col][0]);
            likeImage.zoom = 2;
            likeImage.xOffset = -25;
            likeImage.yOffset = -39;
            this.AddChild(likeImage);
        }

        let texts = new Panel(0, 0, 230, 80);
        texts.layout = "vertical";

        let fontSize = 14;
        for (let text of [
            levelDt.name,
            "by " + levelListing.author.username,
            //new Date(Date.parse((levelDt.timestamp + "+00:00"))).toLocaleString()
        ].reverse()) {
            let textLine = new UIText(0, 0, text, fontSize, "white");
            fontSize = 20;
            textLine.textAlign = "left";
            texts.AddChild(textLine);
        }
        texts.AddChild(new Spacer(0, 0, 0, 0));

        this.AddChild(texts);

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
