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
        _this.selectedCloudCode = "";
        _this.levels = [];
        _this.levelPanel = null;
        _this.levelOptionsPanel = null;
        _this.basePanelWidth = 432;
        _this.bigPanelWidth = 900;
        _this.baseX = (960 - _this.basePanelWidth) / 2;
        _this.baseY = 70;
        _this.basePanelHeight = 400;
        _this.baseLeftX = -500;
        _this.baseRightX = 30;
        _this.backgroundColor = "#101";
        return _this;
    }
    RecentLevelsMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        this.backButton = this.CreateBackButton();
        ret.push(this.backButton);
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
        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
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
    RecentLevelsMenu.GetListing = function (levelCode) {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof RecentLevelsMenu; });
        if (menu) {
            return menu.levels.find(function (a) { return a.level.code == levelCode; });
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
    RecentLevelsMenu.prototype.HideLevelDetails = function () {
        if (this.levelOptionsPanel)
            this.levelOptionsPanel.targetX = 1000;
        if (this.levelPanel)
            this.levelPanel.targetX = this.baseX;
        this.backButton.isHidden = false;
    };
    RecentLevelsMenu.prototype.ShowLevelDetails = function () {
        var _this = this;
        var levelListing = this.levels.find(function (a) { return a.level.code == _this.selectedCloudCode; });
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.backButton.isHidden = true;
            this.levelPanel.targetX = this.baseLeftX;
            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];
            var buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;
            this.levelOptionsPanel.AddChild(buttons);
            var backButton = new Button(0, 0, 200, 50);
            backButton.onClickEvents.push(function () {
                _this.selectedCloudCode = "";
                _this.HideLevelDetails();
            });
            var backButtonText = new UIText(0, 0, "Back", 20, "white");
            backButton.AddChild(backButtonText);
            backButtonText.xOffset = backButton.width / 2;
            backButtonText.yOffset = -10;
            buttons.AddChild(backButton);
            var codeText = new UIText(0, 0, levelListing.level.code, 20, "#BBB");
            codeText.textAlign = "left";
            codeText.xOffset = -190;
            codeText.yOffset = -8;
            buttons.AddChild(codeText);
            buttons.AddChild(new Spacer(0, 0, 200, 10));
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
            var playButton = new Button(0, 0, 200, 80);
            playButton.normalBackColor = "#020b";
            playButton.mouseoverBackColor = "#242b";
            playButton.yOffset = -30;
            playButton.onClickEvents.push(function () {
                if (levelListing) {
                    currentMap = LevelMap.FromImportString(levelListing.level.levelData);
                    editorHandler.SwitchToPlayMode();
                    MenuHandler.SubMenu(BlankMenu);
                    DataService.LogLevelPlayStarted(levelListing.level.code);
                    currentLevelCode = levelListing.level.code;
                    levelListing.isStarted = true;
                    _this.PopulateLevelPanel();
                }
            });
            var playButtonText = new UIText(0, 0, "Play", 40, "white");
            playButton.AddChild(playButtonText);
            playButtonText.xOffset = playButton.width / 2;
            playButtonText.yOffset = -20;
            buttons.AddChild(playButton);
            // MID PANEL
            var midPanel = new Panel(0, 0, this.levelOptionsPanel.width, 250);
            midPanel.margin = 0;
            this.levelOptionsPanel.AddChild(midPanel);
            var thumbnail = new Image;
            thumbnail.src = levelListing.level.thumbnail;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
            // make sure scale of this is good
            var imageFromTile = new ImageFromTile(0, 0, 422, 50 * 5, imageTile);
            imageFromTile.zoom = 10;
            midPanel.AddChild(imageFromTile);
            var CreateStatsRow = function (imageTile, stat1, stat2) {
                var ret = new Panel(0, 0, 275, 50);
                var image = new ImageFromTile(0, 0, 48, 48, imageTile);
                image.zoom = 2;
                ret.AddChild(image);
                var text = new UIText(0, 0, stat1, 20, "#DDD");
                text.textAlign = "left";
                ret.AddChild(text);
                text.yOffset = 30;
                //text.font = "arial";
                if (stat2 == "") {
                    ret.AddChild(new Spacer(0, 0, 10, 10));
                }
                else {
                    var text2 = new UIText(0, 0, stat2, 20, "#DDD");
                    text2.textAlign = "left";
                    //text2.font = "arial";
                    ret.AddChild(text2);
                    text.yOffset = 15;
                    text2.yOffset = 45;
                    text2.xOffset = -16;
                }
                return ret;
            };
            var statsPanel = new Panel(0, 0, 125, 180);
            statsPanel.layout = "vertical";
            statsPanel.xOffset = -75;
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][0], levelListing.level.numberOfLikes.toString(), ""));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][1][1], levelListing.level.numberOfUniquePlayers.toString(), ""));
            var clearRate = ((levelListing.level.numberOfClears / levelListing.level.numberOfAttempts) * 100).toFixed(1) + "%";
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][1], levelListing.level.numberOfClears + " / " + levelListing.level.numberOfAttempts, clearRate));
            midPanel.AddChild(statsPanel);
            var rightPanelWidth_1 = 200;
            var rightPanel = new Panel(0, 0, rightPanelWidth_1 + 10, 220);
            rightPanel.margin = 0;
            midPanel.AddChild(rightPanel);
            rightPanel.layout = "vertical";
            var CreateTimePanel = function (labelText, frames, holder) {
                var panel = new Panel(0, 0, rightPanelWidth_1, frames == 0 ? 50 : 100);
                panel.layout = "vertical";
                panel.backColor = "#0008";
                var wrHolderText = new UIText(0, 0, holder ? holder.username : "Me", 20, "white");
                wrHolderText.xOffset = rightPanelWidth_1 / 2;
                wrHolderText.yOffset = -5;
                panel.AddChild(wrHolderText);
                if (frames > 0) {
                    var wrTimeText = new UIText(0, 0, Utility.FramesToTimeText(frames), 28, "white");
                    wrTimeText.xOffset = rightPanelWidth_1 / 2;
                    wrTimeText.yOffset = 6;
                    panel.AddChild(wrTimeText);
                }
                var wrText = new UIText(0, 0, labelText, 14, "white");
                wrText.xOffset = rightPanelWidth_1 / 2;
                wrText.yOffset = 18 + (frames == 0 ? -3 : 0);
                wrText.font = "arial";
                panel.AddChild(wrText);
                return panel;
            };
            //rightPanel.AddChild(new Spacer(0, 0, 10, 5));
            if (levelListing.personalBestFrames > 0) {
                var timePanel = CreateTimePanel("Personal Best", levelListing.personalBestFrames, null);
                rightPanel.AddChild(timePanel);
            }
            if (levelListing.wrHolder) {
                var timePanel = CreateTimePanel("World Record", levelListing.level.recordFrames, levelListing.wrHolder);
                rightPanel.AddChild(timePanel);
            }
            rightPanel.AddChild(new Spacer(0, 0, 10, 5));
            // TOP PANEL
            var topPanel = new Panel(0, 0, this.levelOptionsPanel.width, 30);
            topPanel.margin = 0;
            this.levelOptionsPanel.AddChild(topPanel);
            var titleText = new UIText(0, 0, levelListing.level.name, 30, "white");
            topPanel.AddChild(titleText);
            titleText.textAlign = "left";
            titleText.xOffset = 10;
            titleText.yOffset = 10;
            var authorContainer = new Panel(0, 0, rightPanelWidth_1 + 10, 30);
            authorContainer.margin = 0;
            topPanel.AddChild(authorContainer);
            authorContainer.layout = "vertical";
            var authorPanel = CreateTimePanel("Created by", 0, levelListing.author);
            authorContainer.AddChild(authorPanel);
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
        if (levelListing.isLiked || levelListing.isDisliked) {
            var col = levelListing.isLiked ? 0 : 1;
            var likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][col][0]);
            likeImage.zoom = 2;
            likeImage.xOffset = -25;
            likeImage.yOffset = -39;
            _this.AddChild(likeImage);
        }
        var texts = new Panel(0, 0, 230, 80);
        texts.layout = "vertical";
        var fontSize = 14;
        for (var _i = 0, _a = [
            levelDt.name,
            "by " + levelListing.author.username,
        ].reverse(); _i < _a.length; _i++) {
            var text = _a[_i];
            var textLine = new UIText(0, 0, text, fontSize, "white");
            fontSize = 20;
            textLine.textAlign = "left";
            texts.AddChild(textLine);
        }
        texts.AddChild(new Spacer(0, 0, 0, 0));
        _this.AddChild(texts);
        _this.onClickEvents.push(function () {
            containingMenu.selectedCloudCode = _this.levelListing.level.code;
            _this.isSelected = true;
            containingMenu.ShowLevelDetails();
        });
        _this.Update();
        return _this;
    }
    CloudLevelButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = (this.containingMenu.selectedCloudCode == this.levelListing.level.code);
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
