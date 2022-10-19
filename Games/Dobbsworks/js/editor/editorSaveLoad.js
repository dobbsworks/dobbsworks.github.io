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
            UIDialog.Alert("Your level export code has been successfully copied to your clipboard.", "Cool!");
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
var EditorLoadCurrentSlotButton = /** @class */ (function (_super) {
    __extends(EditorLoadCurrentSlotButton, _super);
    function EditorLoadCurrentSlotButton() {
        var _this = _super.call(this, tiles["editor"][6][6], "Load from selected slot") || this;
        _this.onClickEvents.push(function () {
            if (editorHandler.currentSaveSlot > 0) {
                var buttonSlotData = StorageService.GetSavedLevel(editorHandler.currentSaveSlot);
                currentMap = LevelMap.FromImportString(buttonSlotData.level);
                editorHandler.history.RecordHistory();
            }
        });
        return _this;
    }
    return EditorLoadCurrentSlotButton;
}(EditorButton));
var EditorDeleteCurrentSlotButton = /** @class */ (function (_super) {
    __extends(EditorDeleteCurrentSlotButton, _super);
    function EditorDeleteCurrentSlotButton() {
        var _this = _super.call(this, tiles["editor"][0][0], "Delete selected slot") || this;
        _this.onClickEvents.push(function () {
            if (editorHandler.currentSaveSlot > 0) {
                UIDialog.Confirm("Are you sure you want to delete this local save file? This cannot be undone.", "Delete it", "Cancel", function () {
                    StorageService.SetSavedLevel(MyLevelsMenu.selectedLocalSlot, "", "");
                    EditorSaveSlotButton.Buttons[MyLevelsMenu.selectedLocalSlot].ClearThumbnail();
                });
            }
        });
        return _this;
    }
    return EditorDeleteCurrentSlotButton;
}(EditorButton));
var EditorLoadButton = /** @class */ (function (_super) {
    __extends(EditorLoadButton, _super);
    function EditorLoadButton() {
        var _this = _super.call(this, tiles["editor"][5][8], "Load from export code") || this;
        _this.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        _this.onClickEvents.push(function () {
            UIDialog.SmallPrompt("Please enter your level code", "OK", 0, function (code) {
                if (code) {
                    currentMap = LevelMap.FromImportString(code);
                    editorHandler.history.RecordHistory();
                }
            });
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
            if (_this.slotNumber == editorHandler.currentSaveSlot)
                return;
            editorHandler.currentSaveSlot = _this.slotNumber;
        });
        EditorSaveSlotButton.Buttons[slotNumber] = _this;
        return _this;
    }
    EditorSaveSlotButton.prototype.ClearThumbnail = function () {
        this.children.filter(function (a) { return a instanceof ImageFromTile; }).forEach(function (a) {
            var image = a;
            image.imageTile = tiles["empty"][0][0];
        });
    };
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
        _this.saveButtons = [];
        var buttons = [];
        var saveButton = new EditorSaveToCurrentSlotButton();
        var loadButton = new EditorLoadCurrentSlotButton();
        var deleteButton = new EditorDeleteCurrentSlotButton();
        buttons.push(saveButton);
        buttons.push(loadButton);
        buttons.push(deleteButton);
        buttons.push(new EditorSaveToClipboardButton());
        buttons.push(new EditorLoadButton());
        var saveRowCount = 3;
        var savesPerRow = 5;
        for (var row = 0; row < saveRowCount; row++) {
            for (var i = (row * savesPerRow + 1); i <= (row + 1) * savesPerRow; i++) {
                var saveButton_1 = new EditorSaveSlotButton(i);
                buttons.push(saveButton_1);
                _this.saveButtons.push(saveButton_1);
            }
        }
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
