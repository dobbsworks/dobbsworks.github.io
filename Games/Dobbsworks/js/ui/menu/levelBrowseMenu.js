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
var LevelBrowseMenu = /** @class */ (function (_super) {
    __extends(LevelBrowseMenu, _super);
    function LevelBrowseMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.selectedCloudCode = "";
        _this.levels = [];
        _this.levelPanel = null;
        _this.levelOptionsPanel = null;
        _this.searchButtons = [];
        _this.isDataLoadInProgress = false;
        _this.backgroundColor = "#2171cc";
        _this.backgroundColor2 = "#677327";
        _this.includeGlitchLevels = false;
        _this.includeClearedLevels = true;
        _this.basePanelWidth = 632;
        _this.bigPanelWidth = 900;
        _this.baseX = 264;
        _this.baseY = 40;
        _this.basePanelHeight = 480;
        _this.baseLeftX = -960;
        _this.baseRightX = 30;
        return _this;
    }
    LevelBrowseMenu.prototype.CreateElements = function () {
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
        this.searchButtons.push(new LevelBrowseSortButton(this, "Newest", DataService.GetRecentLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Top Rated", DataService.GetBestRatedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Most Liked", DataService.GetMostLikedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Easiest", DataService.GetEasiestLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Hardest", DataService.GetHardestLevels));
        ret.push.apply(ret, this.searchButtons);
        this.searchButtons[0].Click();
        //this.currentSearchButton
        this.levelPanel = new Panel(this.baseX, this.baseY, this.basePanelWidth, this.basePanelHeight);
        this.levelPanel.backColor = "#1138";
        this.levelPanel.layout = "vertical";
        ret.push(this.levelPanel);
        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
        this.levelOptionsPanel.backColor = "#1138";
        this.levelOptionsPanel.layout = "vertical";
        ret.push(this.levelOptionsPanel);
        ret.push(new FilterToggle(this, tiles["spider"][0][0], tiles["spider"][0][1], function (isOn) {
            _this.includeGlitchLevels = isOn;
        }, this.includeGlitchLevels));
        var clearedToggle = new FilterToggle(this, tiles["pig"][5][0], tiles["pig"][0][0], function (isOn) {
            _this.includeClearedLevels = isOn;
        }, this.includeClearedLevels);
        clearedToggle.targetX -= 200;
        ret.push(clearedToggle);
        return ret;
    };
    LevelBrowseMenu.Reset = function () {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof LevelBrowseMenu; });
        if (menu) {
            menu.PopulateLevelPanel();
        }
    };
    LevelBrowseMenu.GetListing = function (levelCode) {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof LevelBrowseMenu; });
        if (menu) {
            return menu.levels.find(function (a) { return a.level.code == levelCode; });
        }
        return undefined;
    };
    LevelBrowseMenu.prototype.PopulateLevelPanel = function () {
        var _this = this;
        if (this.levelPanel) {
            var scrollIndex = this.levelPanel.scrollIndex;
            this.levelPanel.scrollIndex = 0;
            this.levelPanel.children = [];
            this.levelPanel.scrollableChildrenUp = [];
            this.levelPanel.scrollableChildrenDown = [];
            var buttons = this.levels.
                filter(function (a) { return !a.level.isGlitch || _this.includeGlitchLevels; }).
                filter(function (a) { return !a.isCleared || _this.includeClearedLevels; }).
                map(function (a) { return new LevelBrowseButton(a, _this); });
            for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
                var button = buttons_1[_i];
                if (this.levelPanel.children.length >= 4) {
                    this.levelPanel.scrollableChildrenDown.push(button);
                    button.parentElement = this.levelPanel;
                }
                else {
                    this.levelPanel.AddChild(button);
                }
            }
            for (var i = 0; i < Math.abs(scrollIndex); i++) {
                this.levelPanel.Scroll(scrollIndex < 0 ? -1 : 1);
            }
        }
    };
    LevelBrowseMenu.prototype.HideLevelDetails = function () {
        if (this.levelOptionsPanel)
            this.levelOptionsPanel.targetX = 1000;
        if (this.levelPanel)
            this.levelPanel.targetX = this.baseX;
        this.backButton.isHidden = false;
    };
    LevelBrowseMenu.prototype.ShowLevelDetails = function () {
        var _this = this;
        var levelListing = this.levels.find(function (a) { return a.level.code == _this.selectedCloudCode; });
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.backButton.isHidden = true;
            this.levelPanel.targetX = this.baseLeftX;
            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];
            var buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;
            var backButton = new Button(0, 0, 200, 50);
            backButton.onClickEvents.push(function () {
                _this.selectedCloudCode = "";
                _this.HideLevelDetails();
            });
            var backButtonText = new UIText(0, 0, "Back", 20, "white");
            backButton.AddChild(backButtonText);
            backButtonText.xOffset = backButton.width / 2;
            backButtonText.yOffset = 30;
            buttons.AddChild(backButton);
            var codeText = new UIText(0, 0, levelListing.level.code, 20, "#BBB");
            codeText.textAlign = "left";
            codeText.xOffset = -190;
            codeText.yOffset = -10;
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
            editButtonText.yOffset = 30;
            buttons.AddChild(editButton);
            var playButton = new Button(0, 0, 200, 80);
            playButton.normalBackColor = "#020b";
            playButton.mouseoverBackColor = "#242b";
            playButton.yOffset = -30;
            playButton.onClickEvents.push(function () {
                if (levelListing) {
                    var map = LevelMap.FromImportString(levelListing.level.levelData);
                    var isLevelVersionNewer = Version.IsLevelVersionNewerThanClient(map.mapVersion);
                    if (isLevelVersionNewer) {
                        UIDialog.Confirm("This level was made on a newer version of the game. To update your version, you just need to refresh this page. " +
                            "Do you want me to do that for you real quick? (Level editor contents will be lost)", "Yeah, refresh now", "Not yet", function () { window.location.reload(); });
                    }
                    else {
                        currentMap = map;
                        editorHandler.SwitchToPlayMode();
                        MenuHandler.SubMenu(BlankMenu);
                        DataService.LogLevelPlayStarted(levelListing.level.code);
                        currentLevelCode = levelListing.level.code;
                        levelListing.isStarted = true;
                        _this.PopulateLevelPanel();
                    }
                }
            });
            var playButtonText = new UIText(0, 0, "Play", 40, "white");
            playButton.AddChild(playButtonText);
            playButtonText.xOffset = playButton.width / 2;
            playButtonText.yOffset = 50;
            buttons.AddChild(playButton);
            // MID PANEL
            var midPanel = new Panel(0, 0, this.levelOptionsPanel.width, 250);
            midPanel.margin = 0;
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
            var clearRate = ((levelListing.level.numberOfClears / levelListing.level.numberOfAttempts) * 100).toFixed(1) + "%";
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][1], levelListing.level.numberOfClears + " / " + levelListing.level.numberOfAttempts, clearRate));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][1][1], levelListing.level.numberOfUniquePlayers.toString(), ""));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][0], levelListing.level.numberOfLikes.toString(), ""));
            if (levelListing.level.isGlitch) {
                statsPanel.targetHeight += 60;
                statsPanel.AddChild(CreateStatsRow(tiles["spider"][0][0], "Glitch level", ""));
            }
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
                panel.margin = 0;
                var wrText = new UIText(0, 0, labelText, 14, "white");
                wrText.xOffset = rightPanelWidth_1 / 2;
                wrText.yOffset = 18 + (frames == 0 ? -3 : 0);
                wrText.font = "arial";
                panel.AddChild(wrText);
                if (frames > 0) {
                    var wrTimeText = new UIText(0, 0, Utility.FramesToTimeText(frames), 28, "white");
                    wrTimeText.xOffset = rightPanelWidth_1 / 2;
                    wrTimeText.yOffset = 22;
                    panel.AddChild(wrTimeText);
                }
                var bottomLine = new Panel(0, 0, rightPanelWidth_1, 40);
                var wrHolderText = new UIText(0, 0, holder ? holder.username : "Me", 20, "white");
                if (!holder)
                    wrHolderText.xOffset = rightPanelWidth_1 / 2;
                wrHolderText.yOffset = 28;
                if (holder)
                    bottomLine.AddChild(new AvatarPanel(holder.avatar));
                bottomLine.AddChild(wrHolderText);
                bottomLine.margin = 0;
                if (holder)
                    bottomLine.AddChild(new Spacer(0, 0, 40, 40));
                panel.AddChild(bottomLine);
                return panel;
            };
            //rightPanel.AddChild(new Spacer(0, 0, 10, 5));
            rightPanel.AddChild(new Spacer(0, 0, 10, 5));
            if (levelListing.wrHolder) {
                var timePanel = CreateTimePanel("World Record", levelListing.level.recordFrames, levelListing.wrHolder);
                rightPanel.AddChild(timePanel);
            }
            if (levelListing.personalBestFrames > 0) {
                var timePanel = CreateTimePanel("Personal Best", levelListing.personalBestFrames, null);
                rightPanel.AddChild(timePanel);
            }
            // TOP PANEL
            var topPanel = new Panel(0, 0, this.levelOptionsPanel.width, 30);
            topPanel.margin = 0;
            var titleText = new UIText(0, 0, levelListing.level.name, 30, "white");
            topPanel.AddChild(titleText);
            titleText.textAlign = "left";
            titleText.xOffset = 10;
            titleText.yOffset = 40;
            var authorContainer = new Panel(0, 0, rightPanelWidth_1 + 10, 30);
            authorContainer.margin = 0;
            topPanel.AddChild(authorContainer);
            authorContainer.layout = "vertical";
            var authorPanel = CreateTimePanel("Created by", 0, levelListing.author);
            authorContainer.AddChild(authorPanel);
            this.levelOptionsPanel.AddChild(topPanel);
            this.levelOptionsPanel.AddChild(midPanel);
            this.levelOptionsPanel.AddChild(buttons);
        }
    };
    return LevelBrowseMenu;
}(Menu));
var LevelBrowseButton = /** @class */ (function (_super) {
    __extends(LevelBrowseButton, _super);
    function LevelBrowseButton(levelListing, containingMenu) {
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
        var texts = new Panel(0, 0, 370, 80);
        texts.layout = "vertical";
        var titleLine = new Panel(0, 0, 290, 25);
        titleLine.margin = 0;
        var titleLineText = new UIText(0, 0, levelDt.name, 20, "white");
        titleLineText.textAlign = "left";
        titleLineText.yOffset = 20;
        titleLine.AddChild(titleLineText);
        var byLine = new Panel(0, 0, 290, 20);
        byLine.margin = 0;
        byLine.AddChild(new AvatarPanel(levelListing.author.avatar));
        var byLineText = new UIText(0, 0, "by " + levelListing.author.username, 14, "white");
        byLineText.textAlign = "left";
        byLineText.yOffset = 20;
        var byLineTextContainer = new Panel(0, 0, 320, 20);
        byLineTextContainer.AddChild(byLineText);
        byLine.AddChild(byLineTextContainer);
        texts.AddChild(titleLine);
        texts.AddChild(byLine);
        texts.AddChild(new Spacer(0, 0, 0, 0));
        _this.AddChild(texts);
        var iconPanel = new Panel(0, 0, 50, 90);
        iconPanel.layout = "vertical";
        if (levelListing.isLiked || levelListing.isDisliked) {
            var col = levelListing.isLiked ? 0 : 1;
            var likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][col][0]);
            likeImage.zoom = 1;
            likeImage.xOffset = -25;
            likeImage.yOffset = -30;
            iconPanel.AddChild(likeImage);
        }
        _this.AddChild(iconPanel);
        _this.onClickEvents.push(function () {
            containingMenu.selectedCloudCode = _this.levelListing.level.code;
            _this.isSelected = true;
            containingMenu.ShowLevelDetails();
        });
        _this.Update();
        return _this;
    }
    LevelBrowseButton.prototype.Update = function () {
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
    return LevelBrowseButton;
}(Button));
var LevelBrowseSortButton = /** @class */ (function (_super) {
    __extends(LevelBrowseSortButton, _super);
    function LevelBrowseSortButton(parent, name, searchFunc) {
        var _this = _super.call(this, 0, parent.searchButtons.length * 60 + 50, 210, 50) || this;
        _this.parent = parent;
        _this.cachedListings = [];
        _this.searchTime = null;
        _this.onClickEvents.push(function () {
            if (_this.parent.isDataLoadInProgress) {
                audioHandler.PlaySound("error", false);
            }
            else {
                var secondsSinceLastSearch = 60;
                if (_this.searchTime)
                    secondsSinceLastSearch = (+(new Date()) - +(_this.searchTime || 0)) / 1000;
                if ((_this.parent.currentSearchButton != _this || secondsSinceLastSearch < 10) && _this.cachedListings.length > 0) {
                    // pull from cache
                    _this.parent.levels = _this.cachedListings;
                    _this.parent.PopulateLevelPanel();
                }
                else {
                    // run this search function
                    _this.parent.isDataLoadInProgress = true;
                    _this.parent.levels = [];
                    _this.parent.PopulateLevelPanel();
                    _this.searchTime = new Date();
                    var getLevelsPromise = searchFunc();
                    getLevelsPromise.then(function (levels) {
                        _this.parent.isDataLoadInProgress = false;
                        _this.cachedListings = levels;
                        _this.parent.levels = levels;
                        _this.parent.PopulateLevelPanel();
                    }).catch(function (error) {
                        console.error(error);
                    });
                }
            }
            _this.parent.currentSearchButton = _this;
        });
        _this.margin = 15;
        var label = new UIText(0, 0, name, 24, "white");
        label.textAlign = "right";
        label.yOffset = 22;
        _this.AddChild(new Spacer(0, 0, 0, 0));
        _this.AddChild(label);
        return _this;
    }
    LevelBrowseSortButton.prototype.Update = function () {
        var _a, _b;
        _super.prototype.Update.call(this);
        this.isSelected = this.parent.currentSearchButton == this;
        var baseX = ((_b = (_a = this.parent.levelPanel) === null || _a === void 0 ? void 0 : _a.targetX) !== null && _b !== void 0 ? _b : 0) - this.parent.baseX;
        if (this.isSelected) {
            this.normalBackColor = "#f73738";
            this.mouseoverBackColor = "#fa6162";
            this.targetX = baseX;
        }
        else {
            this.normalBackColor = "#05001e";
            this.mouseoverBackColor = "#18123a";
            this.targetX = baseX - 50;
        }
    };
    return LevelBrowseSortButton;
}(Button));
var FilterToggle = /** @class */ (function (_super) {
    __extends(FilterToggle, _super);
    function FilterToggle(parentMenu, selectedImage, unselectedImage, onToggle, initialState) {
        var _this = _super.call(this, 700, 530, 150, 50) || this;
        _this.parentMenu = parentMenu;
        _this.image = new ImageFromTile(0, 0, 48, 48, unselectedImage);
        _this.image.zoom = 2;
        _this.AddChild(_this.image);
        _this.text = new UIText(0, 0, "Filtered", 18, "white");
        _this.text.yOffset = 25;
        _this.text.xOffset = -5;
        _this.text.textAlign = "right";
        _this.AddChild(_this.text);
        _this.onClickEvents.push(function () {
            _this.isSelected = !_this.isSelected;
            _this.text.text = _this.isSelected ? "Included" : "Filtered";
            _this.image.imageTile = _this.isSelected ? selectedImage : unselectedImage;
            onToggle(_this.isSelected);
            parentMenu.PopulateLevelPanel();
        });
        if (initialState) {
            _this.onClickEvents.forEach(function (a) { return a(); });
        }
        return _this;
    }
    FilterToggle.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.borderColor = this.isSelected ? "#F26E" : "#0000";
    };
    return FilterToggle;
}(Button));
