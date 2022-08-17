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
                alert("You level export code has been copied to your clipboard, paste it somewhere safe :D");
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


class EditorLoadButton extends EditorButton {
    constructor() {
        super(tiles["editor"][5][8], "Load from export code");
        this.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        this.onClickEvents.push(
            () => {
                let code = prompt("Please enter your level code");
                if (code) {
                    currentMap = LevelMap.FromImportString(code);
                }
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
                //possible paths: 
                //  slot 1 active, click slot 1     - Nothing
                //  slot 1 active, click slot 2
                //      slot 2 has data             
                //          Current data matches slot 1 - Load slot 2, set selected slot to 2
                //          Current data mismatch   - Prompt: you have unsaved changes. Discard changes and load slot 2?
                //      slot 2 has no data          - Save to slot 2, set selected slot to 2
                //  no slot active, click slot 1
                //      slot 1 has data             - Prompt: you have unsaved changes. Discard changes and load slot 1?
                //      slot 1 has no data          - Save to slot 1, set selected slot to 1

                if (this.slotNumber == editorHandler.currentSaveSlot) return;

                let buttonSlotData = StorageService.GetSavedLevel(this.slotNumber);
                if (buttonSlotData.level.length) {
                    // selected slot already has data
                    let currentMapData = currentMap.GetExportString();
                    let previouslySelectedSlotData = StorageService.GetSavedLevel(editorHandler.currentSaveSlot);
                    if (previouslySelectedSlotData.level == currentMapData) {
                        // leaving slot 1, but slot 1 changes are already saved to storage
                        editorHandler.currentSaveSlot = this.slotNumber;
                        currentMap = LevelMap.FromImportString(buttonSlotData.level);
                    } else {
                        // There are unsaved changes in the current slot!
                        let confirmed = confirm("You have unsaved changes in the editor. Discard changes and load slot " + this.slotNumber + "?");
                        if (confirmed) {
                            editorHandler.currentSaveSlot = this.slotNumber;
                            currentMap = LevelMap.FromImportString(buttonSlotData.level);
                        } else {
                            return;
                        }
                    }
                } else {
                    // selected slot has no data
                    this.SaveToSlot();
                    editorHandler.currentSaveSlot = this.slotNumber;
                }
            }
        );
        EditorSaveSlotButton.Buttons[slotNumber] = this;
    }

    SaveToSlot(): void {
        let levelString = currentMap.GetExportString();
        let thumbnail = currentMap.GenerateThumbnail();
        let thumbString = thumbnail.toDataURL();
        StorageService.SetSavedLevel(this.slotNumber, levelString, thumbString);
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
    constructor(x: number, y: number) {
        super(x, y, 70, 70);

        let buttons: EditorButton[] = [];

        let saveRowCount = 3;
        let savesPerRow = 5;

        for (let row = saveRowCount - 1; row >= 0; row--) {
            for (let i = (row * savesPerRow + 1); i <= (row + 1) * savesPerRow; i++) {
                buttons.push(new EditorSaveSlotButton(i));
            }
        }

        let saveButton = new EditorSaveToCurrentSlotButton();
        buttons.push(new EditorSaveToClipboardButton())
        buttons.push(saveButton)
        buttons.push(new EditorLoadButton());

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