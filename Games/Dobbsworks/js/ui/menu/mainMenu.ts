class MainMenu extends Menu {
    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];
        
        ret.push(OptionsMenu.CreateOptionsButton());

        let logo = new Logo(262, 30);
        ret.push(logo);

        let centerX = camera.canvas.width / 2;
        let playButtonWidth = camera.canvas.width / 4;
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

        let recentLevelsButton = new Button(playButtonX, playButtonY + (playButtonHeight + 10)*2, playButtonWidth, playButtonHeight);
        let recentLevelsText = new UIText(centerX, playButtonY + 40, "Recent Levels", 30, "#000");
        recentLevelsButton.AddChild(recentLevelsText);
        recentLevelsText.xOffset = playButtonWidth / 2 - 5;
        recentLevelsText.yOffset = 40;
        recentLevelsButton.isNoisy = true;
        if (!isDemoMode) ret.push(recentLevelsButton);

        [playButton, myLevelsButton, recentLevelsButton, demoLevelsButton].forEach(b => {
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
        
        demoLevelsButton.onClickEvents.push(() => {
            currentDemoIndex = 0;
            currentMap = LevelMap.FromImportString(allDemoLevels[0]);
            editorHandler.SwitchToPlayMode();
            MenuHandler.SubMenu(BlankMenu);
        });

        return ret;
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