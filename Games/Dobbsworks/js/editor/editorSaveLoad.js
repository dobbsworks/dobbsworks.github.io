"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EditorSingleServePanel = /** @class */ (function (_super) {
    __extends(EditorSingleServePanel, _super);
    function EditorSingleServePanel(x, y, button) {
        var _this = _super.call(this, x, y, 70, 70) || this;
        _this.button = button;
        _this.AddChild(button);
        return _this;
    }
    return EditorSingleServePanel;
}(Panel));
var EditorSaveToClipboardButton = /** @class */ (function (_super) {
    __extends(EditorSaveToClipboardButton, _super);
    function EditorSaveToClipboardButton() {
        var _this = _super.call(this, tiles["editor"][5][8], "Save to clipboard") || this;
        _this.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][1][8]));
        _this.onClickEvents.push(function () {
            var exportText = currentMap.GetExportString();
            navigator.clipboard.writeText(exportText);
            alert("You level export code has been copied to your clipboard, paste it somewhere safe :D");
        });
        return _this;
    }
    return EditorSaveToClipboardButton;
}(EditorButton));
var EditorSaveToCurrentSlotButton = /** @class */ (function (_super) {
    __extends(EditorSaveToCurrentSlotButton, _super);
    function EditorSaveToCurrentSlotButton() {
        var _this = _super.call(this, tiles["editor"][6][8], "Save to selected slot") || this;
        _this.onClickEvents.push(function () {
            if (editorHandler.currentSaveSlot > 0) {
                EditorSaveSlotButton.Buttons[editorHandler.currentSaveSlot].SaveToSlot();
            }
        });
        return _this;
    }
    return EditorSaveToCurrentSlotButton;
}(EditorButton));
var EditorLoadButton = /** @class */ (function (_super) {
    __extends(EditorLoadButton, _super);
    function EditorLoadButton() {
        var _this = _super.call(this, tiles["editor"][5][8], "Load from export code") || this;
        _this.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        _this.onClickEvents.push(function () {
            var code = prompt("Please enter your level code");
            if (code) {
                currentMap = LevelMap.FromImportString(code);
                editorHandler.history.RecordHistory();
            }
        });
        return _this;
    }
    return EditorLoadButton;
}(EditorButton));
var EditorSaveSlotButton = /** @class */ (function (_super) {
    __extends(EditorSaveSlotButton, _super);
    function EditorSaveSlotButton(slotNumber) {
        var _this = _super.call(this, tiles["empty"][0][0], "Slot " + slotNumber) || this;
        _this.slotNumber = slotNumber;
        var existingSaveLevel = StorageService.GetSavedLevel(slotNumber);
        if (existingSaveLevel.level.length) {
            var thumbnail = new Image;
            thumbnail.src = existingSaveLevel.thumb;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
            _this.children = [];
            var imageFromTile = new ImageFromTile(0, 0, 88, 50, imageTile);
            imageFromTile.zoom = 2;
            _this.AddChild(imageFromTile);
        }
        _this.width = 98;
        _this.targetWidth = 98;
        _this.AddChild(new UIText(0, 0, slotNumber.toString(), 12, "white"));
        _this.onClickEvents.push(function () {
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
            if (_this.slotNumber == editorHandler.currentSaveSlot)
                return;
            var buttonSlotData = StorageService.GetSavedLevel(_this.slotNumber);
            if (buttonSlotData.level.length) {
                // selected slot already has data
                var currentMapData = currentMap.GetExportString();
                var previouslySelectedSlotData = StorageService.GetSavedLevel(editorHandler.currentSaveSlot);
                if (previouslySelectedSlotData.level == currentMapData) {
                    // leaving slot 1, but slot 1 changes are already saved to storage
                    editorHandler.currentSaveSlot = _this.slotNumber;
                    currentMap = LevelMap.FromImportString(buttonSlotData.level);
                    editorHandler.history.RecordHistory();
                }
                else {
                    // There are unsaved changes in the current slot!
                    var confirmed = confirm("You have unsaved changes in the editor. Discard changes and load slot " + _this.slotNumber + "?");
                    if (confirmed) {
                        editorHandler.currentSaveSlot = _this.slotNumber;
                        currentMap = LevelMap.FromImportString(buttonSlotData.level);
                        editorHandler.history.RecordHistory();
                    }
                    else {
                        return;
                    }
                }
            }
            else {
                // selected slot has no data
                _this.SaveToSlot();
                editorHandler.currentSaveSlot = _this.slotNumber;
            }
        });
        EditorSaveSlotButton.Buttons[slotNumber] = _this;
        return _this;
    }
    EditorSaveSlotButton.prototype.SaveToSlot = function () {
        var levelString = currentMap.GetExportString();
        var thumbnail = currentMap.GenerateThumbnail();
        var thumbString = thumbnail.toDataURL();
        StorageService.SetSavedLevel(this.slotNumber, levelString, thumbString);
        this.children = [];
        var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
        var imageFromTile = new ImageFromTile(0, 0, 88, 50, imageTile);
        imageFromTile.zoom = 2;
        this.AddChild(imageFromTile);
        this.AddChild(new UIText(0, 0, this.slotNumber.toString(), 12, "white"));
    };
    EditorSaveSlotButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = (editorHandler.currentSaveSlot == this.slotNumber);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
    };
    EditorSaveSlotButton.Buttons = [];
    return EditorSaveSlotButton;
}(EditorButton));
var EditorSaveDrawer = /** @class */ (function (_super) {
    __extends(EditorSaveDrawer, _super);
    function EditorSaveDrawer(x, y) {
        var _this = _super.call(this, x, y, 70, 70) || this;
        var buttons = [];
        var saveRowCount = 3;
        var savesPerRow = 5;
        for (var row = saveRowCount - 1; row >= 0; row--) {
            for (var i = (row * savesPerRow + 1); i <= (row + 1) * savesPerRow; i++) {
                buttons.push(new EditorSaveSlotButton(i));
            }
        }
        var saveButton = new EditorSaveToCurrentSlotButton();
        buttons.push(new EditorSaveToClipboardButton());
        buttons.push(saveButton);
        buttons.push(new EditorLoadButton());
        var tilesPerRow = savesPerRow;
        var floatingPanel = editorHandler.CreateFloatingButtonPanel(buttons, saveRowCount + 1, tilesPerRow);
        floatingPanel.initialWidth = (70 + 38) * tilesPerRow;
        floatingPanel.children.forEach(function (a) { return a.targetWidth = floatingPanel.targetWidth; });
        var handle = new EditorButtonDrawerHandle(tiles["editor"][1][1], "Save/Load", [floatingPanel]);
        handle.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][5][7]));
        floatingPanel.targetX = 960 - floatingPanel.initialWidth - 10 - 80;
        _this.AddChild(handle);
        return _this;
    }
    return EditorSaveDrawer;
}(Panel));
