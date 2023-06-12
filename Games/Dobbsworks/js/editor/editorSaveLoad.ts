class EditorSingleServePanel extends Panel {
    constructor(x: number, y: number,
        public button: EditorButton) {
        super(x, y, 70, 70);
        this.AddChild(button);
    }
}


class EditorSaveToClipboardButton extends EditorButton {
    constructor() {
        super(tiles["editor"][5][8], "Save to clipboard");
        this.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][1][8]));
        this.onClickEvents.push(
            () => {
                let exportText = currentMap.GetExportString();
                navigator.clipboard.writeText(exportText);
                UIDialog.Alert("Your level export code has been successfully copied to your clipboard.", "Cool!");
            }
        );
    }
}


class EditorSaveToCurrentSlotButton extends EditorButton {
    constructor() {
        super(tiles["editor"][6][8], "Save to selected slot");
        this.onClickEvents.push(
            () => {
                if (editorHandler.currentSaveSlot > 0) {
                    EditorSaveSlotButton.Buttons[editorHandler.currentSaveSlot].SaveToSlot();
                }
            }
        );
    }
}

class EditorLoadCurrentSlotButton extends EditorButton {
    constructor() {
        super(tiles["editor"][6][6], "Load from selected slot");
        this.onClickEvents.push(
            () => {
                if (editorHandler.currentSaveSlot > 0) {
                    let buttonSlotData = StorageService.GetSavedLevel(editorHandler.currentSaveSlot);
                    currentMap = LevelMap.FromImportString(buttonSlotData.level);
                    editorHandler.history.RecordHistory();
                }
            }
        );
    }
}

class EditorDeleteCurrentSlotButton extends EditorButton {
    constructor() {
        super(tiles["editor"][0][0], "Delete selected slot");
        this.onClickEvents.push(
            () => {
                if (editorHandler.currentSaveSlot > 0) {
                    UIDialog.Confirm("Are you sure you want to delete this local save file? This cannot be undone.", "Delete it", "Cancel", () => {
                        EditorSaveSlotButton.Buttons[editorHandler.currentSaveSlot].ClearThumbnail();
                        StorageService.SetSavedLevel(editorHandler.currentSaveSlot, "", "");
                    });
                }
            }
        );
    }
}


class EditorLoadButton extends EditorButton {
    constructor() {
        super(tiles["editor"][5][8], "Load from export code");
        this.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        this.onClickEvents.push(
            () => {
                UIDialog.SmallPrompt("Please enter your level code", "OK", 0, (code) => {
                    if (code) {
                        let newMap = LevelMap.FromImportString(code);
                        currentMap = newMap;
                        editorHandler.history.RecordHistory();
                    }
                });
            }
        );
    }
}

class EditorSaveSlotButton extends EditorButton {
    static Buttons: EditorSaveSlotButton[] = [];

    constructor(public slotNumber: number) {
        super(tiles["empty"][0][0], "Slot " + slotNumber);

        let existingSaveLevel = StorageService.GetSavedLevel(slotNumber);
        if (existingSaveLevel.level.length) {
            var thumbnail = new Image;
            thumbnail.src = existingSaveLevel.thumb;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            let imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
            this.children = [];
            let imageFromTile = new ImageFromTile(0, 0, 88, 50, imageTile);
            imageFromTile.zoom = 2;
            this.AddChild(imageFromTile);
        }

        this.width = 98;
        this.targetWidth = 98;

        this.AddChild(new UIText(0, 0, slotNumber.toString(), 12, "white"));
        this.onClickEvents.push(
            () => {
                if (this.slotNumber == editorHandler.currentSaveSlot) return;                
                editorHandler.currentSaveSlot = this.slotNumber;
            }
        );
        EditorSaveSlotButton.Buttons[slotNumber] = this;
    }

    ClearThumbnail(): void {
        this.children.filter(a => a instanceof ImageFromTile).forEach(a => {
            let image = <ImageFromTile>a;
            image.imageTile = tiles["empty"][0][0];
        })
    }

    SaveToSlot(): void {
        let levelString = currentMap.GetExportString();
        let thumbnail = currentMap.GenerateThumbnail();
        let thumbString = thumbnail.toDataURL();
        StorageService.SetSavedLevel(this.slotNumber, levelString, thumbString);

        if (myUserData && myUserData.id == 13) {
            DataService.UploadLevelAuditLog(levelString);
        }

        this.children = [];
        let imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
        let imageFromTile = new ImageFromTile(0, 0, 88, 50, imageTile);
        imageFromTile.zoom = 2;
        this.AddChild(imageFromTile);
        this.AddChild(new UIText(0, 0, this.slotNumber.toString(), 12, "white"));
    }

    Update(): void {
        super.Update();
        this.isSelected = (editorHandler.currentSaveSlot == this.slotNumber);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
    }
}

class EditorSaveDrawer extends Panel {

    saveButtons: EditorSaveSlotButton[] = [];

    constructor(x: number, y: number) {
        super(x, y, 70, 70);

        let buttons: EditorButton[] = [];


        let saveButton = new EditorSaveToCurrentSlotButton();
        let loadButton = new EditorLoadCurrentSlotButton();
        let deleteButton = new EditorDeleteCurrentSlotButton();
        buttons.push(saveButton);
        buttons.push(loadButton);
        buttons.push(deleteButton);
        
        buttons.push(new EditorSaveToClipboardButton());
        buttons.push(new EditorLoadButton());

        let saveRowCount = 3;
        let savesPerRow = 5;

        for (let row = 0; row < saveRowCount; row++) {
            for (let i = (row * savesPerRow + 1); i <= (row + 1) * savesPerRow; i++) {
                let saveButton = new EditorSaveSlotButton(i);
                buttons.push(saveButton);
                this.saveButtons.push(saveButton)
            }
        }

        let tilesPerRow = savesPerRow;
        let floatingPanel = editorHandler.CreateFloatingButtonPanel(buttons, saveRowCount + 1, tilesPerRow);
        floatingPanel.initialWidth = (70 + 38) * tilesPerRow;
        floatingPanel.children.forEach(a => a.targetWidth = floatingPanel.targetWidth);
        let handle = new EditorButtonDrawerHandle(tiles["editor"][1][1], "Save/Load", [floatingPanel]);
        handle.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][5][7]));
        floatingPanel.targetX = 960 - floatingPanel.initialWidth - 10 - 80;

        this.AddChild(handle);
    }

}