class MyLevelsMenu extends Menu {
    stopsMapUpdate = true;
    static selectedLocalSlot: number = -1;
    static selectedCloudCode: string = "";

    myLevelsData: MyLevelsModel | null = null;

    cloudSavesTitlePanel: Panel | null = null;
    localSavesTitlePanel: Panel | null = null;
    cloudSavesPanel: Panel | null = null;
    localSavesPanel: Panel | null = null;

    saveSlotChart: SaveSlotChart | null = null;
    publishButton: Button | null = null;

    cloudSavesOptionsPanel: Panel | null = null;
    localSavesOptionsPanel: Panel | null = null;

    buttonLocalEdit: Button | null = null;
    buttonLocalUpload: Button | null = null;
    buttonLocalDelete: Button | null = null;

    baseLeftX = 30;
    basePanelWidth = 432;
    baseRightX = 960 - this.basePanelWidth - 30;
    baseY = 70;
    basePanelHeight = 400;

    backgroundColor = "#022";

    ResetLocalSavesPanel(): void {
        MyLevelsMenu.selectedLocalSlot = -1;
        uiHandler.elements = uiHandler.elements.filter(a => a != this.localSavesPanel);
        this.elements = this.elements.filter(a => a != this.localSavesPanel);
        this.localSavesPanel = this.CreateLocalSavesPanel();
        this.elements.push(this.localSavesPanel);
        uiHandler.elements.push(this.localSavesPanel);
    }


    ResetCloudSavesPanel(): void {
        MyLevelsMenu.selectedCloudCode = "";
        uiHandler.elements = uiHandler.elements.filter(a => a != this.cloudSavesPanel);
        uiHandler.elements = uiHandler.elements.filter(a => a != this.saveSlotChart);
        this.elements = this.elements.filter(a => a != this.cloudSavesPanel);
        this.elements = this.elements.filter(a => a != this.saveSlotChart);
        this.saveSlotChart = new SaveSlotChart(150, 490, 660, 44);

        let cloudLevelsPromise = DataService.GetMyLevels();
        cloudLevelsPromise.then(myLevelsModel => {
            this.myLevelsData = myLevelsModel;
            if (this.saveSlotChart) {
                this.saveSlotChart.numSlotsTotal = myLevelsModel.maxUploads;
                this.saveSlotChart.numSlotsCleared = myLevelsModel.myLevels.filter(a => a.levelState == LevelState.cleared).length;
                this.saveSlotChart.numSlotsLive = myLevelsModel.myLevels.filter(a => a.levelState == LevelState.live).length;
                this.saveSlotChart.numSlotsPending = myLevelsModel.myLevels.filter(a => a.levelState == LevelState.pending).length;
            }
            this.CreateCloudSavesPanel(myLevelsModel.myLevels);
        }).catch((error) => {

        });
        this.cloudSavesPanel = this.CreateSavesPanel(30, this.basePanelWidth, []);

        this.elements.push(this.cloudSavesPanel, this.saveSlotChart);
        uiHandler.elements.push(this.cloudSavesPanel, this.saveSlotChart);
    }

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        let backButton = this.CreateBackButton();
        ret.push(backButton);

        this.ResetCloudSavesPanel();
        this.ResetLocalSavesPanel();

        this.cloudSavesOptionsPanel = new Panel(this.baseRightX, this.baseY + 2000, this.basePanelWidth, this.basePanelHeight);
        this.localSavesOptionsPanel = new Panel(this.baseLeftX, this.baseY + 2000, this.basePanelWidth, this.basePanelHeight);

        this.localSavesTitlePanel = new Panel(this.baseRightX, this.baseY - 50, this.basePanelWidth, 40);
        this.cloudSavesTitlePanel = new Panel(this.baseLeftX, this.baseY - 50, this.basePanelWidth, 40);
        let localSavesTitle = new UIText(0, 0, "Local Saves", 16, "white");
        this.localSavesTitlePanel.AddChild(localSavesTitle);
        let cloudSavesTitle = new UIText(0, 0, "Uploaded Levels", 16, "white");
        this.cloudSavesTitlePanel.AddChild(cloudSavesTitle);
        [localSavesTitle, cloudSavesTitle].forEach(a => {
            a.xOffset = (this.basePanelWidth - 10) / 2;
            a.yOffset = 20;
        });

        [this.cloudSavesOptionsPanel, this.localSavesOptionsPanel, this.localSavesTitlePanel, this.cloudSavesTitlePanel].forEach(a => {
            a.backColor = "#1138";
            a.layout = "vertical";
        })


        let cloudBackButton = this.CreateActionButton("Back", () => {
            MyLevelsMenu.selectedCloudCode = "";
        });
        this.cloudSavesOptionsPanel.AddChild(cloudBackButton);

        let cloudDeleteButton = this.CreateActionButton("Delete", () => {
            UIDialog.Confirm("Are you sure you want to delete this level? This cannot be undone.", "Delete it", "Cancel", () => {

                let deletePromise = DataService.RemoveLevel(MyLevelsMenu.selectedCloudCode);
                deletePromise.then(() => {
                    this.ResetCloudSavesPanel();

                }).catch(() => {

                })
                MyLevelsMenu.selectedCloudCode = "";
            })
        });
        this.cloudSavesOptionsPanel.AddChild(cloudDeleteButton);

        let cloudEditButton = this.CreateActionButton("Open in Editor", () => {
            if (MyLevelsMenu.selectedCloudCode !== "") {
                let level = this.myLevelsData?.myLevels.find(a => a.code === MyLevelsMenu.selectedCloudCode);
                if (level) {
                    currentMap = LevelMap.FromImportString(level.levelData);
                    editorHandler.isEditorAllowed = true;
                    editorHandler.exportString = "";
                    editorHandler.SwitchToEditMode();
                    MenuHandler.SubMenu(BlankMenu);
                }
            }
        });
        this.cloudSavesOptionsPanel.AddChild(cloudEditButton);

        let cloudPublishButton = this.CreateActionButton("Publish level", () => {
            if (MyLevelsMenu.selectedCloudCode !== "") {
                let level = this.myLevelsData?.myLevels.find(a => a.code === MyLevelsMenu.selectedCloudCode);
                if (level) {
                    let publishPromise = DataService.PublishLevel(MyLevelsMenu.selectedCloudCode);
                    publishPromise.then(() => {
                        this.ResetCloudSavesPanel();
                        UIDialog.Alert("Your level is now live!", "Nice!");
                    }).catch(() => {
    
                    });
                    //TODO!!
                    // loading circle?
                }
            }
        });
        this.publishButton = cloudPublishButton;  
        this.cloudSavesOptionsPanel.AddChild(cloudPublishButton);

        let cloudPlayButton = this.CreateActionButton("Play", () => {
            let level = this.myLevelsData?.myLevels.find(a => a.code === MyLevelsMenu.selectedCloudCode);
            if (level) {
                currentMap = LevelMap.FromImportString(level.levelData);
                editorHandler.SwitchToPlayMode();
                MenuHandler.SubMenu(BlankMenu);
                DataService.LogLevelPlayStarted(level.code);
                currentLevelCode = level.code;
            }
        });
        this.cloudSavesOptionsPanel.AddChild(cloudPlayButton);




        let localBackButton = this.CreateActionButton("Back", () => {
            MyLevelsMenu.selectedLocalSlot = -1;
        });
        this.localSavesOptionsPanel.AddChild(localBackButton);


        this.buttonLocalDelete = this.CreateActionButton("Delete", () => {
            UIDialog.Confirm("Are you sure you want to delete this local save file? This cannot be undone.", "Delete it", "Cancel", () => {
                StorageService.SetSavedLevel(MyLevelsMenu.selectedLocalSlot, "", "");
                EditorSaveSlotButton.Buttons[MyLevelsMenu.selectedLocalSlot].ClearThumbnail();
                this.ResetLocalSavesPanel();
            });
        });
        this.buttonLocalDelete.mouseoverBackColor = "#922d";
        this.localSavesOptionsPanel.AddChild(this.buttonLocalDelete);


        this.buttonLocalUpload = this.CreateActionButton("Upload", () => {
            UIDialog.SmallPrompt("After uploading this level, you'll still need to beat it from the cloud saves list before other people can play it. What do you want to name this level?", "OK", 42, (name) => {
                if (name) {
                    let buttonSlotData = StorageService.GetSavedLevel(MyLevelsMenu.selectedLocalSlot);
                    let levelDt = new LevelUploadDT(name, buttonSlotData.level, buttonSlotData.thumb);
                    let uploadPromise = DataService.UploadLevel(levelDt);
                    uploadPromise.then((data) => {
                        this.ResetCloudSavesPanel();
                        this.ResetLocalSavesPanel();
                        MyLevelsMenu.selectedCloudCode = data;
                    })
                }
            });
        });
        this.localSavesOptionsPanel.AddChild(this.buttonLocalUpload);


        this.buttonLocalEdit = this.CreateActionButton("Edit", () => {
            let buttonSlotData = StorageService.GetSavedLevel(MyLevelsMenu.selectedLocalSlot);
            editorHandler.currentSaveSlot = MyLevelsMenu.selectedLocalSlot;
            editorHandler.EditMap(buttonSlotData.level);
            this.Hide(1);
        });
        this.localSavesOptionsPanel.AddChild(this.buttonLocalEdit);


        ret.push(this.cloudSavesOptionsPanel, this.localSavesOptionsPanel, this.localSavesTitlePanel, this.cloudSavesTitlePanel);
        return ret;
    }

    static GetListing(levelCode: string): LevelDT | undefined {
        let menu = <MyLevelsMenu>MenuHandler.MenuStack.find(a => a instanceof MyLevelsMenu);
        if (menu) {
            return menu.myLevelsData?.myLevels.find(a => a.code == levelCode);
        }
        return undefined;
    }
    static Reset(): void {
        let menu = <MyLevelsMenu>MenuHandler.MenuStack.find(a => a instanceof MyLevelsMenu);
        if (menu) {
            setTimeout(() => {
                menu.ResetCloudSavesPanel();
                menu.ResetLocalSavesPanel();
            }, 500)
        }
        return undefined;
    }

    CreateActionButton(text: string, action: () => void): Button {
        let button = new Button(0, 0, this.basePanelWidth - 10, 70);
        button.borderRadius = 10;

        let buttonText = new UIText(0, 0, text, 20, "white");
        buttonText.xOffset = (this.basePanelWidth - 10) / 2;
        buttonText.yOffset = 40;
        button.AddChild(buttonText);
        button.onClickEvents.push(action);
        return button;
    }

    CreateCloudSavesPanel(levels: LevelDT[]): void {
        let myCloudLevelButtons: MyCloudLevelButton[] = [];

        for (let level of levels) {
            myCloudLevelButtons.push(new MyCloudLevelButton(level));
        }

        let newPanel = this.CreateSavesPanel(this.baseLeftX, this.basePanelWidth, myCloudLevelButtons);
        if (this.cloudSavesPanel) {
            this.cloudSavesPanel.children = newPanel.children;
            this.cloudSavesPanel.scrollableChildrenDown = newPanel.scrollableChildrenDown;
            this.cloudSavesPanel.scrollableChildrenUp = newPanel.scrollableChildrenUp;
        }
    }

    CreateLocalSavesPanel(): Panel {
        let maxSaveSlot = 15;
        let slotButtons: MyLocalLevelButton[] = [];
        for (let i = 1; i <= maxSaveSlot; i++) {
            let existingSaveLevel = StorageService.GetSavedLevel(i);
            if (existingSaveLevel.level.length) {
                let button = new MyLocalLevelButton(i);
                slotButtons.push(button);
            }
        }
        return this.CreateSavesPanel(this.baseRightX, this.basePanelWidth, slotButtons);
    }

    CreateSavesPanel(x: number, width: number, buttons: (MyLocalLevelButton | MyCloudLevelButton)[]): Panel {
        let myLevelsPanel = new Panel(x, this.baseY, this.basePanelWidth, this.basePanelHeight);
        myLevelsPanel.backColor = "#1138";
        myLevelsPanel.layout = "vertical";

        for (let button of buttons) {
            button.SnapToPlace();
        }

        for (let button of buttons) {
            if (myLevelsPanel.children.length < 3) {
                myLevelsPanel.AddChild(button);
            } else {
                myLevelsPanel.scrollableChildrenDown.push(button);
            }
        }

        return myLevelsPanel;
    }

    Update(): void {
        if (this.localSavesPanel && this.cloudSavesPanel && this.cloudSavesOptionsPanel && this.localSavesOptionsPanel
            && this.cloudSavesTitlePanel && this.localSavesTitlePanel) {


            if (MyLevelsMenu.selectedCloudCode == "") {
                this.localSavesPanel.targetX = this.baseRightX;
                this.localSavesTitlePanel.targetX = this.baseRightX;
                this.cloudSavesOptionsPanel.targetY = this.baseY + 2000;
            } else {
                this.localSavesPanel.targetX = this.baseRightX + 2000;
                this.localSavesTitlePanel.targetX = this.baseRightX + 2000;
                this.cloudSavesOptionsPanel.targetY = this.baseY;
                if (this.publishButton) {
                    let levelDt = this.myLevelsData?.myLevels.find(a => a.code == MyLevelsMenu.selectedCloudCode);
                    if (levelDt) {
                        this.publishButton.isHidden = (levelDt.levelState != LevelState.cleared);
                    } else {
                        this.publishButton.isHidden = true;
                    }
                }
            }

            if (MyLevelsMenu.selectedLocalSlot == -1) {
                this.cloudSavesPanel.targetX = this.baseLeftX;
                this.cloudSavesTitlePanel.targetX = this.baseLeftX;
                this.localSavesOptionsPanel.targetY = this.baseY + 2000;
            } else {
                this.cloudSavesPanel.targetX = this.baseLeftX - 2000;
                this.cloudSavesTitlePanel.targetX = this.baseLeftX - 2000;
                this.localSavesOptionsPanel.targetY = this.baseY;
            }

        }
    }
}


class MyCloudLevelButton extends Button {
    isSelected: boolean = false;

    constructor(private levelDt: LevelDT) {
        super(0, 0, 88 * 2 + 10, 50 * 2 + 10);

        var thumbnail = new Image;
        thumbnail.src = levelDt.thumbnail;
        thumbnail.width = camera.canvas.width / 24;
        thumbnail.height = camera.canvas.height / 24;
        let imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);

        // make sure scale of this is good
        let imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
        imageFromTile.zoom = 4;
        this.AddChild(imageFromTile);
        let slotText = new UIText(0, 0, levelDt.name, 20, "white");
        slotText.textAlign = "left";
        slotText.xOffset = -230;
        slotText.yOffset = 30;
        this.AddChild(slotText);

        this.onClickEvents.push(() => {
            MyLevelsMenu.selectedCloudCode = levelDt.code;
            this.isSelected = true;
        })

        this.Update();
    }

    Update(): void {
        super.Update();
        this.isSelected = (MyLevelsMenu.selectedCloudCode == this.levelDt.code);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";

        this.width = this.targetWidth;
        for (let child of this.children) {
            if (child.targetWidth) child.width = child.targetWidth;
            child.x = child.targetX;
        }
    }
}

class MyLocalLevelButton extends Button {
    isSelected: boolean = false;

    constructor(private slotNumber: number) {
        super(0, 0, 88 * 2 + 10, 50 * 2 + 10);

        let existingSaveLevel = StorageService.GetSavedLevel(slotNumber);
        if (existingSaveLevel.level.length) {
            var thumbnail = new Image;
            thumbnail.src = existingSaveLevel.thumb;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            let imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);

            // make sure scale of this is good
            let imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
            imageFromTile.zoom = 4;
            this.AddChild(imageFromTile);
            let slotText = new UIText(0, 0, "Slot " + slotNumber, 20, "white");
            slotText.textAlign = "left";
            slotText.xOffset = -230;
            slotText.yOffset = 30;
            this.AddChild(slotText);
        }

        this.onClickEvents.push(() => {
            MyLevelsMenu.selectedLocalSlot = this.slotNumber;
            this.isSelected = true;
        })

        this.Update();
    }

    Update(): void {
        super.Update();
        this.isSelected = (MyLevelsMenu.selectedLocalSlot == this.slotNumber);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";

        this.width = this.targetWidth;
        for (let child of this.children) {
            if (child.targetWidth) child.width = child.targetWidth;
            child.x = child.targetX;
        }
    }
}