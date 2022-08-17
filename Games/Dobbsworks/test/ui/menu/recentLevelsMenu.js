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
var RecentLevelsMenu = /** @class */ (function (_super) {
    __extends(RecentLevelsMenu, _super);
    function RecentLevelsMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.selectedCloudId = -1;
        _this.levels = [];
        _this.levelPanel = null;
        _this.levelOptionsPanel = null;
        _this.basePanelWidth = 432;
        _this.baseX = (960 - _this.basePanelWidth) / 2;
        _this.baseY = 70;
        _this.basePanelHeight = 400;
        _this.baseLeftX = 30;
        _this.baseRightX = 960 - _this.basePanelWidth - 30;
        _this.backgroundColor = "#101";
        return _this;
    }
    RecentLevelsMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        var backButton = this.CreateBackButton();
        ret.push(backButton);
        var getLevelsPromise = DataService.GetRecentLevels();
        getLevelsPromise.then(function (levels) {
            _this.levels = levels;
            _this.PopulateLevelPanel();
        }).catch(function (error) {
        });
        this.levelPanel = new Panel(this.baseX, this.baseY, this.basePanelWidth, this.basePanelHeight);
        this.levelPanel.backColor = "#1138";
        this.levelPanel.layout = "vertical";
        ret.push(this.levelPanel);
        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.basePanelWidth, this.basePanelHeight);
        this.levelOptionsPanel.backColor = "#1138";
        this.levelOptionsPanel.layout = "vertical";
        ret.push(this.levelOptionsPanel);
        return ret;
    };
    RecentLevelsMenu.Reset = function () {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof RecentLevelsMenu; });
        if (menu) {
            menu.PopulateLevelPanel();
        }
    };
    RecentLevelsMenu.GetListing = function (levelId) {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof RecentLevelsMenu; });
        if (menu) {
            return menu.levels.find(function (a) { return a.level.id == levelId; });
        }
        return undefined;
    };
    RecentLevelsMenu.prototype.PopulateLevelPanel = function () {
        var _this = this;
        if (this.levelPanel) {
            var scrollIndex = this.levelPanel.scrollIndex;
            this.levelPanel.children = [];
            this.levelPanel.scrollableChildren = [];
            var buttons = this.levels.map(function (a) { return new CloudLevelButton(a, _this); });
            if (buttons.length == 1)
                this.levelPanel.AddChild(new Spacer(0, 0, 88 * 2 + 10, 50 * 2 + 10));
            if (buttons.length == 2)
                this.levelPanel.AddChild(new Spacer(0, 0, 88 * 2 + 10, 50 * 2 + 10));
            while (buttons.length > 3) {
                var button = buttons.pop();
                if (button)
                    this.levelPanel.scrollableChildren.push(button);
            }
            while (buttons.length > 0) {
                var button = buttons.pop();
                if (button)
                    this.levelPanel.AddChild(button);
            }
            for (var i = 0; i < Math.abs(scrollIndex); i++) {
                this.levelPanel.Scroll(scrollIndex > 0 ? -1 : 1);
            }
        }
    };
    RecentLevelsMenu.prototype.ShowLevelDetails = function () {
        var _this = this;
        var levelListing = this.levels.find(function (a) { return a.level.id == _this.selectedCloudId; });
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.levelPanel.targetX = this.baseLeftX;
            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];
            var buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;
            this.levelOptionsPanel.AddChild(buttons);
            var playButton = new Button(0, 0, 200, 50);
            playButton.onClickEvents.push(function () {
                if (levelListing) {
                    currentMap = LevelMap.FromImportString(levelListing.level.levelData);
                    editorHandler.SwitchToPlayMode();
                    MenuHandler.SubMenu(BlankMenu);
                    DataService.LogLevelPlayStarted(levelListing.level.id);
                    currentLevelId = levelListing.level.id;
                    levelListing.isStarted = true;
                    _this.PopulateLevelPanel();
                }
            });
            var playButtonText = new UIText(0, 0, "Play", 20, "white");
            playButton.AddChild(playButtonText);
            playButtonText.xOffset = playButton.width / 2;
            playButtonText.yOffset = -10;
            buttons.AddChild(playButton);
            var editButton = new Button(0, 0, 200, 50);
            editButton.onClickEvents.push(function () {
                if (levelListing) {
                    currentMap = LevelMap.FromImportString(levelListing.level.levelData);
                    editorHandler.isEditorAllowed = true;
                    editorHandler.exportString = "";
                    editorHandler.SwitchToEditMode();
                    MenuHandler.SubMenu(BlankMenu);
                }
            });
            var editButtonText = new UIText(0, 0, "Open in Editor", 20, "white");
            editButton.AddChild(editButtonText);
            editButtonText.xOffset = editButton.width / 2;
            editButtonText.yOffset = -10;
            buttons.AddChild(editButton);
            if (levelListing.wrHolder) {
                var wrText = new UIText(0, 0, "World record: " + Utility.FramesToTimeText(levelListing.level.recordFrames) + " - " + levelListing.wrHolder.username, 20, "white");
                this.levelOptionsPanel.AddChild(wrText);
                wrText.textAlign = "left";
                wrText.xOffset = 10;
                wrText.yOffset = -15;
            }
            var titleText = new UIText(0, 0, levelListing.level.name, 20, "white");
            this.levelOptionsPanel.AddChild(titleText);
            titleText.textAlign = "left";
            titleText.xOffset = 10;
            titleText.yOffset = -15;
            var thumbnail = new Image;
            thumbnail.src = levelListing.level.thumbnail;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
            // make sure scale of this is good
            var imageFromTile = new ImageFromTile(0, 0, 422, 50 * 5, imageTile);
            imageFromTile.zoom = 10;
            this.levelOptionsPanel.AddChild(imageFromTile);
        }
    };
    return RecentLevelsMenu;
}(Menu));
var CloudLevelButton = /** @class */ (function (_super) {
    __extends(CloudLevelButton, _super);
    function CloudLevelButton(levelListing, containingMenu) {
        var _this = _super.call(this, 0, 0, 88 * 2 + 10, 50 * 2 + 10) || this;
        _this.levelListing = levelListing;
        _this.containingMenu = containingMenu;
        _this.isSelected = false;
        if (levelListing.isStarted && !levelListing.isCleared) {
            _this.normalBackColor = "#200b";
            _this.mouseoverBackColor = "#422b";
        }
        if (levelListing.isCleared) {
            _this.normalBackColor = "#020b";
            _this.mouseoverBackColor = "#242b";
        }
        var levelDt = levelListing.level;
        var thumbnail = new Image;
        thumbnail.src = levelDt.thumbnail;
        thumbnail.width = camera.canvas.width / 24;
        thumbnail.height = camera.canvas.height / 24;
        var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
        // make sure scale of this is good
        var imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
        imageFromTile.zoom = 4;
        _this.AddChild(imageFromTile);
        var texts = new Panel(0, 0, 230, 80);
        texts.layout = "vertical";
        for (var _i = 0, _a = [
            levelDt.name,
            "by " + levelListing.author.username,
            new Date(Date.parse((levelDt.timestamp + "+00:00"))).toLocaleString()
        ].reverse(); _i < _a.length; _i++) {
            var text = _a[_i];
            var textLine = new UIText(0, 0, text, 20, "white");
            textLine.textAlign = "left";
            texts.AddChild(textLine);
        }
        texts.AddChild(new Spacer(0, 0, 0, 0));
        _this.AddChild(texts);
        _this.onClickEvents.push(function () {
            containingMenu.selectedCloudId = _this.levelListing.level.id;
            _this.isSelected = true;
            containingMenu.ShowLevelDetails();
        });
        _this.Update();
        return _this;
    }
    CloudLevelButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = (this.containingMenu.selectedCloudId == this.levelListing.level.id);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
        this.width = this.targetWidth;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.targetWidth)
                child.width = child.targetWidth;
            child.x = child.targetX;
        }
    };
    return CloudLevelButton;
}(Button));
