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
var MyLevelsMenu = /** @class */ (function (_super) {
    __extends(MyLevelsMenu, _super);
    function MyLevelsMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.cloudSavesTitlePanel = null;
        _this.localSavesTitlePanel = null;
        _this.cloudSavesPanel = null;
        _this.localSavesPanel = null;
        _this.cloudSavesOptionsPanel = null;
        _this.localSavesOptionsPanel = null;
        _this.buttonLocalEdit = null;
        _this.buttonLocalUpload = null;
        _this.buttonLocalDelete = null;
        _this.baseLeftX = 30;
        _this.basePanelWidth = 432;
        _this.baseRightX = 960 - _this.basePanelWidth - 30;
        _this.baseY = 70;
        _this.basePanelHeight = 400;
        _this.backgroundColor = "#022";
        return _this;
    }
    MyLevelsMenu.prototype.ResetLocalSavesPanel = function () {
        var _this = this;
        MyLevelsMenu.selectedLocalSlot = -1;
        uiHandler.elements = uiHandler.elements.filter(function (a) { return a != _this.localSavesPanel; });
        this.elements = this.elements.filter(function (a) { return a != _this.localSavesPanel; });
        this.localSavesPanel = this.CreateLocalSavesPanel();
        this.elements.push(this.localSavesPanel);
        uiHandler.elements.push(this.localSavesPanel);
    };
    MyLevelsMenu.prototype.ResetCloudSavesPanel = function () {
        var _this = this;
        MyLevelsMenu.selectedCloudId = -1;
        uiHandler.elements = uiHandler.elements.filter(function (a) { return a != _this.cloudSavesPanel; });
        this.elements = this.elements.filter(function (a) { return a != _this.cloudSavesPanel; });
        var cloudLevelsPromise = DataService.GetMyLevels();
        cloudLevelsPromise.then(function (levels) {
            _this.CreateCloudSavesPanel(levels);
        }).catch(function (error) {
        });
        this.cloudSavesPanel = this.CreateSavesPanel(30, this.basePanelWidth, []);
        this.elements.push(this.cloudSavesPanel);
        uiHandler.elements.push(this.cloudSavesPanel);
    };
    MyLevelsMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        var backButton = this.CreateBackButton();
        ret.push(backButton);
        this.ResetCloudSavesPanel();
        this.ResetLocalSavesPanel();
        this.cloudSavesOptionsPanel = new Panel(this.baseRightX, this.baseY + 1000, this.basePanelWidth, this.basePanelHeight);
        this.localSavesOptionsPanel = new Panel(this.baseLeftX, this.baseY + 1000, this.basePanelWidth, this.basePanelHeight);
        this.localSavesTitlePanel = new Panel(this.baseRightX, this.baseY - 50, this.basePanelWidth, 40);
        this.cloudSavesTitlePanel = new Panel(this.baseLeftX, this.baseY - 50, this.basePanelWidth, 40);
        var localSavesTitle = new UIText(0, 0, "Local Saves", 16, "white");
        this.localSavesTitlePanel.AddChild(localSavesTitle);
        var cloudSavesTitle = new UIText(0, 0, "Uploaded Levels", 16, "white");
        this.cloudSavesTitlePanel.AddChild(cloudSavesTitle);
        [localSavesTitle, cloudSavesTitle].forEach(function (a) {
            a.xOffset = (_this.basePanelWidth - 10) / 2;
            a.yOffset = -8;
        });
        [this.cloudSavesOptionsPanel, this.localSavesOptionsPanel, this.localSavesTitlePanel, this.cloudSavesTitlePanel].forEach(function (a) {
            a.backColor = "#1138";
            a.layout = "vertical";
        });
        var cloudBackButton = this.CreateActionButton("Back", function () {
            MyLevelsMenu.selectedCloudId = -1;
        });
        this.cloudSavesOptionsPanel.AddChild(cloudBackButton);
        var localBackButton = this.CreateActionButton("Back", function () {
            MyLevelsMenu.selectedLocalSlot = -1;
        });
        this.localSavesOptionsPanel.AddChild(localBackButton);
        this.buttonLocalDelete = this.CreateActionButton("Delete", function () {
            var confirmed = confirm("Are you sure you want to delete this local save file?");
            if (confirmed) {
                StorageService.SetSavedLevel(MyLevelsMenu.selectedLocalSlot, "", "");
                _this.ResetLocalSavesPanel();
            }
        });
        this.buttonLocalDelete.mouseoverBackColor = "#922d";
        this.localSavesOptionsPanel.AddChild(this.buttonLocalDelete);
        this.buttonLocalUpload = this.CreateActionButton("Upload", function () {
            var name = prompt("After uploading this level, you'll still need to beat it from the cloud saves list before other people can play it. What do you want to name this level?");
            if (name) {
                var buttonSlotData = StorageService.GetSavedLevel(MyLevelsMenu.selectedLocalSlot);
                var levelDt = new LevelUploadDT(name, buttonSlotData.level, buttonSlotData.thumb);
                var uploadPromise = DataService.UploadLevel(levelDt);
                uploadPromise.then(function (data) {
                    _this.ResetCloudSavesPanel();
                    _this.ResetLocalSavesPanel();
                    MyLevelsMenu.selectedCloudId = +data;
                });
            }
        });
        this.localSavesOptionsPanel.AddChild(this.buttonLocalUpload);
        this.buttonLocalEdit = this.CreateActionButton("Edit", function () {
            var buttonSlotData = StorageService.GetSavedLevel(MyLevelsMenu.selectedLocalSlot);
            editorHandler.currentSaveSlot = MyLevelsMenu.selectedLocalSlot;
            editorHandler.EditMap(buttonSlotData.level);
            _this.Hide(1);
        });
        this.localSavesOptionsPanel.AddChild(this.buttonLocalEdit);
        ret.push(this.cloudSavesOptionsPanel, this.localSavesOptionsPanel, this.localSavesTitlePanel, this.cloudSavesTitlePanel);
        return ret;
    };
    MyLevelsMenu.prototype.CreateActionButton = function (text, action) {
        var button = new Button(0, 0, this.basePanelWidth - 10, 70);
        button.borderRadius = 10;
        var buttonText = new UIText(0, 0, text, 20, "white");
        buttonText.xOffset = (this.basePanelWidth - 10) / 2;
        buttonText.yOffset = -20;
        button.AddChild(buttonText);
        button.onClickEvents.push(action);
        return button;
    };
    MyLevelsMenu.prototype.CreateCloudSavesPanel = function (levels) {
        var myCloudLevelButtons = [];
        for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
            var level = levels_1[_i];
            myCloudLevelButtons.push(new MyCloudLevelButton(level));
        }
        var newPanel = this.CreateSavesPanel(this.baseLeftX, this.basePanelWidth, myCloudLevelButtons);
        if (this.cloudSavesPanel) {
            this.cloudSavesPanel.children = newPanel.children;
            this.cloudSavesPanel.scrollableChildren = newPanel.scrollableChildren;
        }
    };
    MyLevelsMenu.prototype.CreateLocalSavesPanel = function () {
        var maxSaveSlot = 15;
        var slotButtons = [];
        for (var i = 1; i <= maxSaveSlot; i++) {
            var existingSaveLevel = StorageService.GetSavedLevel(i);
            if (existingSaveLevel.level.length) {
                var button = new MyLocalLevelButton(i);
                slotButtons.push(button);
            }
        }
        return this.CreateSavesPanel(this.baseRightX, this.basePanelWidth, slotButtons);
    };
    MyLevelsMenu.prototype.CreateSavesPanel = function (x, width, buttons) {
        var myLevelsPanel = new Panel(x, this.baseY, this.basePanelWidth, this.basePanelHeight);
        myLevelsPanel.backColor = "#1138";
        myLevelsPanel.layout = "vertical";
        for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
            var button = buttons_1[_i];
            button.SnapToPlace();
        }
        if (buttons.length == 1)
            myLevelsPanel.AddChild(new Spacer(0, 0, 88 * 2 + 10, 50 * 2 + 10));
        if (buttons.length == 2)
            myLevelsPanel.AddChild(new Spacer(0, 0, 88 * 2 + 10, 50 * 2 + 10));
        while (buttons.length > 3) {
            var slotButton = buttons.pop();
            if (slotButton)
                myLevelsPanel.scrollableChildren.push(slotButton);
        }
        while (buttons.length > 0) {
            var slotButton = buttons.pop();
            if (slotButton)
                myLevelsPanel.AddChild(slotButton);
        }
        return myLevelsPanel;
    };
    MyLevelsMenu.prototype.Update = function () {
        if (this.localSavesPanel && this.cloudSavesPanel && this.cloudSavesOptionsPanel && this.localSavesOptionsPanel
            && this.cloudSavesTitlePanel && this.localSavesTitlePanel) {
            if (MyLevelsMenu.selectedCloudId == -1) {
                this.localSavesPanel.targetX = this.baseRightX;
                this.localSavesTitlePanel.targetX = this.baseRightX;
                this.cloudSavesOptionsPanel.targetY = this.baseY + 1000;
            }
            else {
                this.localSavesPanel.targetX = this.baseRightX + 1000;
                this.localSavesTitlePanel.targetX = this.baseRightX + 1000;
                this.cloudSavesOptionsPanel.targetY = this.baseY;
            }
            if (MyLevelsMenu.selectedLocalSlot == -1) {
                this.cloudSavesPanel.targetX = this.baseLeftX;
                this.cloudSavesTitlePanel.targetX = this.baseLeftX;
                this.localSavesOptionsPanel.targetY = this.baseY + 1000;
            }
            else {
                this.cloudSavesPanel.targetX = this.baseLeftX - 1000;
                this.cloudSavesTitlePanel.targetX = this.baseLeftX - 1000;
                this.localSavesOptionsPanel.targetY = this.baseY;
            }
        }
    };
    MyLevelsMenu.selectedLocalSlot = -1;
    MyLevelsMenu.selectedCloudId = -1;
    return MyLevelsMenu;
}(Menu));
var MyCloudLevelButton = /** @class */ (function (_super) {
    __extends(MyCloudLevelButton, _super);
    function MyCloudLevelButton(levelDt) {
        var _this = _super.call(this, 0, 0, 88 * 2 + 10, 50 * 2 + 10) || this;
        _this.levelDt = levelDt;
        _this.isSelected = false;
        var thumbnail = new Image;
        thumbnail.src = levelDt.thumbnail;
        thumbnail.width = camera.canvas.width / 24;
        thumbnail.height = camera.canvas.height / 24;
        var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
        // make sure scale of this is good
        var imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
        imageFromTile.zoom = 4;
        _this.AddChild(imageFromTile);
        var slotText = new UIText(0, 0, levelDt.name, 20, "white");
        slotText.textAlign = "left";
        slotText.xOffset = -230;
        slotText.yOffset = 30;
        _this.AddChild(slotText);
        _this.onClickEvents.push(function () {
            MyLevelsMenu.selectedCloudId = levelDt.id;
            _this.isSelected = true;
        });
        _this.Update();
        return _this;
    }
    MyCloudLevelButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = (MyLevelsMenu.selectedCloudId == this.levelDt.id);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
        this.width = this.targetWidth;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.targetWidth)
                child.width = child.targetWidth;
            child.x = child.targetX;
        }
    };
    return MyCloudLevelButton;
}(Button));
var MyLocalLevelButton = /** @class */ (function (_super) {
    __extends(MyLocalLevelButton, _super);
    function MyLocalLevelButton(slotNumber) {
        var _this = _super.call(this, 0, 0, 88 * 2 + 10, 50 * 2 + 10) || this;
        _this.slotNumber = slotNumber;
        _this.isSelected = false;
        var existingSaveLevel = StorageService.GetSavedLevel(slotNumber);
        if (existingSaveLevel.level.length) {
            var thumbnail = new Image;
            thumbnail.src = existingSaveLevel.thumb;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
            // make sure scale of this is good
            var imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
            imageFromTile.zoom = 4;
            _this.AddChild(imageFromTile);
            var slotText = new UIText(0, 0, "Slot " + slotNumber, 20, "white");
            slotText.textAlign = "left";
            slotText.xOffset = -230;
            slotText.yOffset = 30;
            _this.AddChild(slotText);
        }
        _this.onClickEvents.push(function () {
            MyLevelsMenu.selectedLocalSlot = _this.slotNumber;
            _this.isSelected = true;
        });
        _this.Update();
        return _this;
    }
    MyLocalLevelButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = (MyLevelsMenu.selectedLocalSlot == this.slotNumber);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
        this.width = this.targetWidth;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.targetWidth)
                child.width = child.targetWidth;
            child.x = child.targetX;
        }
    };
    return MyLocalLevelButton;
}(Button));
