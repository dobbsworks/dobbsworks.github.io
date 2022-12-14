class LevelSuccessMenu extends Menu {

    private container: Panel | null = null;
    private minigameContainer: Panel | null = null;
    public collectedGear: GoldGear | null = null;
    public timer: number = 0;

    public deathCount: number = 0;
    private gear: EndOfLevelMinigameGear | null = null;

    private liked: boolean = false;
    private disliked: boolean = false;
    private likeButton: Button | null = null;
    private dislikeButton: Button | null = null;


    protected showLikeButtons = true;

    protected topButtonText = "Continue";
    protected bottomButtonText = "Start Over";



    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        this.container = new Panel(80, 80, camera.canvas.width - 80 * 2, camera.canvas.height - 80 * 2);
        //this.container.backColor = "#4228";
        this.container.layout = "vertical";
        ret.push(this.container);

        this.minigameContainer = new Panel(1, 0, camera.canvas.width, camera.canvas.height);
        ret.push(this.minigameContainer);

        let buttonWidth = 350;
        let continueButton = new Button(camera.canvas.width / 2 - buttonWidth / 2, 430, buttonWidth, 55);
        let restartButton = new Button(continueButton.x, continueButton.y + continueButton.height + 10, buttonWidth, 55);
        let opinionButtonSize = continueButton.height * 2 + 10;
        this.likeButton = new Button(continueButton.x + continueButton.width + 10, continueButton.y, opinionButtonSize, opinionButtonSize);
        this.dislikeButton = new Button(continueButton.x - 10 - this.likeButton.width, continueButton.y, opinionButtonSize, opinionButtonSize);
        let buttons = [continueButton, restartButton, this.likeButton, this.dislikeButton];
        buttons.forEach(a => a.isNoisy = true);
        ret.push(...buttons);
        


        let continueText = new UIText(camera.canvas.width / 2, continueButton.y + 20, this.topButtonText, 20, "#FFF");
        continueButton.AddChild(continueText);
        continueText.xOffset = buttonWidth / 2 - 5;
        continueText.yOffset = 30;
        continueButton.onClickEvents.push(() => {this.OnClickTopButton() })

        if (isDemoMode) {
            this.likeButton.isHidden = true;
            this.dislikeButton.isHidden = true;
            restartButton.isHidden = true;
        }

        let restartText = new UIText(camera.canvas.width / 2, continueButton.y + 20, this.bottomButtonText, 20, "#FFF");
        restartButton.AddChild(restartText);
        restartText.xOffset = buttonWidth / 2 - 5;
        restartText.yOffset = 30;
        restartButton.onClickEvents.push(() => { this.OnClickBottomButton() });


        if (!this.showLikeButtons) {
            this.likeButton.isHidden = true;
            this.dislikeButton.isHidden = true;
        }
        if (this.bottomButtonText == "") {
            restartButton.isHidden = true;
        }

        let likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][0][0]);
        this.likeButton.AddChild(likeImage);
        let dislikeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][1][0]);
        this.dislikeButton.AddChild(dislikeImage);

        this.likeButton.onClickEvents.push(() => {
            if (this.liked || this.disliked) return;
            this.liked = true;
            if (this.likeButton) this.likeButton.normalBackColor = "#0000";
            if (this.likeButton) this.likeButton.mouseoverBackColor = "#0000";
            if (this.dislikeButton) this.dislikeButton.isHidden = true;
            DataService.LikeLevel(currentLevelListing?.level.code || "");
            let listing = LevelBrowseMenu.GetListing(currentLevelListing?.level.code || "");
            if (listing) listing.isLiked = true;
        });

        this.dislikeButton.onClickEvents.push(() => {
            if (this.liked || this.disliked) return;
            this.disliked = true;
            if (this.dislikeButton) this.dislikeButton.normalBackColor = "#0000";
            if (this.dislikeButton) this.dislikeButton.mouseoverBackColor = "#0000";
            if (this.likeButton) this.likeButton.isHidden = true;
            DataService.DislikeLevel(currentLevelListing?.level.code || "");
            let listing = LevelBrowseMenu.GetListing(currentLevelListing?.level.code || "");
            if (listing) listing.isLiked = false;
        });

        return ret;
    }


    protected OnClickTopButton(): void {
        // Continue
        this.gear?.DoneWithLevel();
    }

    protected OnClickBottomButton(): void {
        // Start Over
        this.Dispose();
        editorHandler.SwitchToEditMode();
        editorHandler.SwitchToPlayMode();
    }


    Update(): void {
        this.timer++;
        if (this.timer == 1 && this.minigameContainer) {
            if (!this.collectedGear) this.collectedGear = new GoldGear(0, 0, currentMap.mainLayer, []);
            this.gear = new EndOfLevelMinigameGear((camera.canvas.width - 192) / 2, 0, this.collectedGear);
            this.gear.fixedPosition = true;
            this.gear.deathCount = this.deathCount;
            this.minigameContainer.AddChild(this.gear);
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && this.timer > 60) {
            this.gear?.DoneWithLevel();
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.Reset, false) && this.timer > 60 && !levelGenerator) {
            this.Dispose();
            editorHandler.SwitchToEditMode();
            editorHandler.SwitchToPlayMode();
        }
    }

    SetLevelCompletionTime(frameCount: number): void {
        let deaths = StorageService.PopDeathCounter(currentLevelListing?.level.code || "");
        let progressModel = new LevelProgressModel(currentLevelListing?.level.code || "", frameCount, deaths + 1);
        this.deathCount = deaths;
        if (!isDemoMode) {
            DataService.LogLevelPlayDone(progressModel).then((awardsModel) => { this.PopulateTimes(awardsModel, frameCount) });
            let listing = LevelBrowseMenu.GetListing(currentLevelListing?.level.code || "");
            if (listing) {
                listing.level.numberOfAttempts += deaths + 1;
                listing.level.numberOfClears += 1;
            }
        }
    }

    PopulateTimes(awardsModel: LevelAwardsModel, frameCount: number): void {
        if (this.gear) {
            this.gear.awardsModel = awardsModel;
            this.gear.frameCount = frameCount;
        }
        this.liked = awardsModel.liked;
        this.disliked = awardsModel.disliked;
        if (this.likeButton && this.dislikeButton) {
            if (this.liked) {
                this.likeButton.normalBackColor = "#0000";
                this.likeButton.mouseoverBackColor = "#0000";
                this.dislikeButton.isHidden = true;
            }
            if (this.disliked) {
                this.dislikeButton.normalBackColor = "#0000";
                this.dislikeButton.mouseoverBackColor = "#0000";
                this.likeButton.isHidden = true;
            }
        }
    }

    CreateRow(leftText: string, rightText: string, lowerText: string, lowerColor: string): Panel {
        let block = new Panel(0, 0, 600, 80);
        block.layout = "vertical";

        if (lowerText != "") {
            let lowerRow = new Panel(0, 0, 600, 50);
            lowerRow.AddChild(new Spacer(0, 0, 0, 0));
            let text = new UIText(0, 0, lowerText, 20, "white");
            text.textAlign = "right";
            text.strokeColor = lowerColor;
            lowerRow.AddChild(text);
            block.AddChild(lowerRow);
        }

        let row = new Panel(0, 0, 600, 50);
        let text1 = new UIText(0, 0, leftText, 36, "white");
        text1.textAlign = "left";
        row.AddChild(text1);
        let text2 = new UIText(0, 0, rightText, 36, "white");
        text2.textAlign = "right";
        row.AddChild(text2);
        block.AddChild(row);

        return block;
    }
}


class MarathonThreeClearsMenu extends LevelSuccessMenu {
    showLikeButtons = false;
    protected topButtonText = "Claim Winnings";
    protected bottomButtonText = "Double Multiplier (costs " + levelGenerator?.earnedPoints + ")";

    protected OnClickTopButton(): void {
        MenuHandler.GoBack();
        LevelMap.BlankOutMap();
        editorHandler.exportString = "";
        audioHandler.SetBackgroundMusic("carnival");
        if (levelGenerator) {
            levelGenerator.LogRun();
            moneyService.fundsToAnimate += levelGenerator.earnedPoints;
        }
        levelGenerator = null;
        MenuHandler.SubMenu(BankMenu);
    }

    protected OnClickBottomButton(): void {
        levelGenerator?.ActivateDoubleOrNothing();
        MenuHandler.GoBack();
        MenuHandler.SubMenu(BlankMenu);
        levelGenerator?.NextLevel();
    }
}


class MarathonDeathMenu extends LevelSuccessMenu {
    showLikeButtons = false;
    protected topButtonText = levelGenerator?.earnedPoints == 0 ? "Return to Menu" : "Claim Winnings";
    protected bottomButtonText = levelGenerator?.earnedPoints == 0 ? "Try Again" : "";

    protected OnClickTopButton(): void {
        MenuHandler.GoBack();
        LevelMap.BlankOutMap();
        audioHandler.SetBackgroundMusic("carnival");
        if (levelGenerator && levelGenerator.earnedPoints > 0) {
            DataService.LogMarathonRun(levelGenerator.difficulty.difficultyNumber, levelGenerator.levelsCleared, levelGenerator.bankedClearTime, levelGenerator.earnedPoints);
            moneyService.fundsToAnimate += levelGenerator.earnedPoints;
            MenuHandler.SubMenu(BankMenu);
        }
        levelGenerator = null;
    }

    protected OnClickBottomButton(): void {
        LevelGenerator.Restart();
    }
}


class EndOfLevelMinigameGear extends UIElement {
    frameRow!: number;
    targetScore!: number;
    displayedScore = 0;
    constructor(x: number, y: number, collectedGear: GoldGear) {
        super(x, y);
        this.targetScore = collectedGear.frame;
        this.frameRow = collectedGear.frameRow;
        this.width = tiles["logo"][0][0].width * 8;
        this.height = tiles["logo"][0][0].height * 8;
        this.targetWidth = this.width;
        this.targetHeight = this.height;

        currentMap.fullDarknessRatio = 0;
        currentMap.bgDarknessRatio = 0;
        currentMap.mainLayer.sprites = currentMap.mainLayer.sprites.filter(a => !(a instanceof Player));
    }

    awardsModel: LevelAwardsModel | null = null
    frameCount = 0;
    deathCount = 0;

    age = 600;
    frame = 0;
    spinSpeed = 2;
    dScore = 0;
    h = 180;
    s = 100;
    l = 0;
    a = 1;
    tickXOffset = 0;

    Update(): void {
        super.Update();
        if (this.age == 0) {
            currentMap.fullDarknessRatio = 0;
            currentMap.bgDarknessRatio = 0;
            currentMap.mainLayer.sprites = currentMap.mainLayer.sprites.filter(a => !(a instanceof Player));
        }
        this.age++;
        this.frame += this.spinSpeed;
        this.y = camera.canvas.height - this.age * 2;
        if (this.y < 30) this.y = 30;

        if (this.age < 300) {
            this.dScore = this.targetScore / 600;
        } else if (this.age < 600) {
            this.dScore *= 0.95;
            this.spinSpeed *= 0.95;
        } else {
            this.dScore = 0;
        }
        this.displayedScore += this.dScore;


        if (this.age < 50) {
            this.l = this.age;
        }
        if (this.age >= 50 && this.age < 600) {
            // lightness closer to 0 as score approaches 10k
            this.l = 50 - (50) * Math.min(1, (this.displayedScore / 10000));
        }

        if (this.age > 600 && this.age <= 650) {
            this.a = 1 - ((this.age - 600) / 50) / 2;
            this.l *= 0.99;
            this.tickXOffset += 1;
        } else if (this.age >= 650) {
            this.a = 0.5;
            this.l *= 0.9;
        }
        this.h = (240 - 180) * Math.min(1, (this.displayedScore / 10000)) + 180;

        if (this.age > 650) {
            let frameIndeces = [
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5];
            this.frame = frameIndeces[Math.floor(this.age * 0.5) % frameIndeces.length] * 20;
        }

        // if (this.age > 800 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
        //     this.DoneWithLevel();
        // }
    }

    DoneWithLevel(): void {
        camera.targetScale = 4;
        camera.scale = 4;

        if (isDemoMode) {
            currentDemoIndex++;
            if (currentDemoIndex < allDemoLevels.length) {
                currentMap = LevelMap.FromImportString(allDemoLevels[currentDemoIndex]);
                editorHandler.SwitchToPlayMode();
                MenuHandler.GoBack();
                MenuHandler.SubMenu(BlankMenu);
            } else {
                // done with demo
                MenuHandler.GoBack();
            }
        } else {
            let listing = LevelBrowseMenu.GetListing(currentLevelListing?.level.code || "");
            if (listing) {
                listing.isCleared = true;
            }
            let listing2 = MyLevelsMenu.GetListing(currentLevelListing?.level.code || "");
            if (listing2) {
                listing2.levelState = LevelState.cleared;
                MyLevelsMenu.Reset();
            }
            LevelBrowseMenu.Reset();
            MenuHandler.GoBack();
            currentLevelListing = null;
            // menu music
            audioHandler.SetBackgroundMusic("menuJazz");
        }
    }

    IsMouseOver(): boolean { return false; }
    GetMouseOverElement(): UIElement | null { return null; }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = `hsla(${this.h.toFixed(0)},${this.s.toFixed(0)}%,${this.l.toFixed(0)}%,${this.a.toFixed(2)})`;
        ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);

        let frameCol = Math.floor(this.frame) % 6;
        let imageTile = tiles["gears"][frameCol][this.frameRow];
        let scale = 8;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x, this.y, imageTile.width * scale, imageTile.height * scale);

        let playerCol = this.age < 650 ? 3 : 0;
        let imageTilePlayer = tiles["dobbs"][playerCol][0];
        let playerY = (this.age - 650) * 10 + 150;
        if (playerY > 150) playerY = 150;
        ctx.drawImage(imageTilePlayer.src, imageTilePlayer.xSrc, imageTilePlayer.ySrc, imageTilePlayer.width, imageTilePlayer.height, 300, playerY, imageTilePlayer.width * scale, imageTilePlayer.height * scale);

        let strokeFillText = (text: string, x: number, y: number): void => {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }

        if (this.age > 650) {
            ctx.textAlign = "center";
            ctx.fillStyle = "#f8f8c8";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "#f6c729";
            ctx.lineWidth = 10;
            ctx.font = `70px grobold`;
            let x = camera.canvas.width / 2 + (this.age < 700 ? (700 - this.age) * 20 : 0);
            let textString = "LEVEL CLEAR!";
            if (levelGenerator) {
                if (levelGenerator.earnedPoints) {
                    textString = "COMPLETE!";
                } else {
                    textString = "GOOD TRY!";
                }
            }
            strokeFillText(textString, x, this.y + 220);
        }

        let yIter = this.y + 280;
        var makeTextLine = (age: number, textLeft: string, textRight: string, extraText: string, extraTextColor: string): void => {
            if (this.age > age) {
                ctx.textAlign = "left";
                ctx.fillStyle = "white";
                ctx.font = `36px grobold`;
                ctx.strokeStyle = "black";
                ctx.lineWidth = 8;
                let x = ((this.age < age + 50) ? (age + 50 - this.age) * 20 : 0);
                strokeFillText(textLeft, 200 + x, yIter);
                ctx.textAlign = "right";
                strokeFillText(textRight, camera.canvas.width - 200 + x, yIter);
                ctx.fillStyle = extraTextColor;
                ctx.font = `20px grobold`;
                ctx.lineWidth = 4;
                if (extraText) strokeFillText(extraText, camera.canvas.width - 200 + x, yIter - 40);
            }
            yIter += 50;
        }

        if (levelGenerator) {
            makeTextLine(675, "Total Time", Utility.FramesToTimeText(levelGenerator.bankedClearTime), "", "cyan");
            makeTextLine(700, "Total Clears", (levelGenerator.levelsCleared).toString(), "", "cyan");
            let extraText = "";
            if (levelGenerator.difficulty.difficultyNumber != 1) {
                extraText = "Difficulty Multiplier x" + levelGenerator.difficulty.difficultyNumber;
            }
            makeTextLine(725, "Winnings", (levelGenerator.earnedPoints).toString(), extraText, "cyan");
        } else {
            if (this.awardsModel) {
                let extraText = "";
                let extraColor = "red";
                if (this.awardsModel.isFC) {
                    extraText = "First Clear!";
                    extraColor = "yellow";
                } else if (this.awardsModel.isWR) {
                    extraText = "World Record!";
                } else if (this.awardsModel.isPB) {
                    extraText = "Personal best!";
                    extraColor = "cyan";
                }
                makeTextLine(675, "Clear Time", Utility.FramesToTimeText(this.frameCount), extraText, extraColor);
            }
            makeTextLine(700, "Attempts", (this.deathCount + 1).toString(), "", "cyan");
        }

    }
}