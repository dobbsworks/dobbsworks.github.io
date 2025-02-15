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
var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#0007";
        _this.backgroundColor2 = "#000E";
        return _this;
    }
    PauseMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        audioHandler.SetLowPass(true);
        PauseMenu.IsPaused = true;
        ret.push(OptionsMenu.CreateOptionsButton());
        var container = new Panel(camera.canvas.width * 0.15, camera.canvas.height / 2 - 150, camera.canvas.width * 0.7, 360);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);
        var resumeButton = this.CreateButton("Resume");
        container.AddChild(resumeButton);
        resumeButton.onClickEvents.push(function () {
            _this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
            PauseMenu.IsPaused = false;
        });
        if (editorHandler.isEditorAllowed) {
            // edit button
            var editButton = this.CreateButton("Edit Level");
            container.AddChild(editButton);
            editButton.onClickEvents.push(function () {
                _this.Dispose();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                editorHandler.SwitchToEditMode();
                editorHandler.grabbedCheckpointLocation = null;
            });
        }
        // RESTART BUTTONS
        if (levelGenerator) {
            var retryButton = this.CreateButton("Restart Challenge");
            container.AddChild(retryButton);
            retryButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                LevelGenerator.Restart();
            });
        }
        else if (!editorHandler.grabbedCheckpointLocation) {
            var retryButton = this.CreateButton("Retry");
            container.AddChild(retryButton);
            retryButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead(false);
            });
        }
        else {
            var row = new Panel(0, 0, container.width, 60);
            row.margin = 0;
            container.AddChild(row);
            var retryFromFlagButton = this.CreateButton("Retry From Flag", 0.45);
            row.AddChild(retryFromFlagButton);
            retryFromFlagButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead(false);
            });
            var retryFromStartButton = this.CreateButton("Retry From Start", 0.45);
            row.AddChild(retryFromStartButton);
            retryFromStartButton.onClickEvents.push(function () {
                _this.Dispose();
                editorHandler.grabbedCheckpointLocation = null;
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead(false);
            });
        }
        // EXIT BUTTON
        if (levelGenerator) {
            var exitButton = this.CreateButton("Quit Challenge");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                MenuHandler.GoBack();
                if (levelGenerator)
                    levelGenerator.LogRun();
                levelGenerator = null;
                LevelMap.BlankOutMap();
                editorHandler.exportString = "";
            });
        }
        else if (!editorHandler.isEditorAllowed) {
            var exitButton = this.CreateButton("Exit Level");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                MenuHandler.GoBack();
                currentLevelListing = null;
                audioHandler.SetBackgroundMusic("menuJazz");
                editorHandler.grabbedCheckpointLocation = null;
                DeathLogService.LogDeathCounts();
                currentDemoIndex = -1;
            });
        }
        if (currentLevelListing) {
            var levelTitle = new UIText(20, 20 + 36, currentLevelListing.level.name, 36, "white");
            levelTitle.textAlign = "left";
            levelTitle.strokeColor = "black";
            ret.push(levelTitle);
            if (currentLevelListing.author) {
                var byText = new UIText(20, levelTitle.y + 18 + 10, "Created by " + currentLevelListing.author.username, 18, "white");
                byText.textAlign = "left";
                ret.push(byText);
                var recordText = new UIText(20, byText.y + 18 + 10, "WR: " + Utility.FramesToTimeText(currentLevelListing.level.recordFrames) + " by " + currentLevelListing.wrHolder.username, 18, "white");
                recordText.textAlign = "left";
                ret.push(recordText);
            }
            var opinionContainer = new Panel(0, 0, container.width, 60);
            if (!currentLevelListing.isLiked && !currentLevelListing.isDisliked) {
                var opinionButtonSize = 120;
                var dislikeButton_1 = new Button(container.x, 0, opinionButtonSize, opinionButtonSize);
                opinionContainer.AddChild(dislikeButton_1);
                var likeButton_1 = new Button(container.x + container.width + 10 - opinionButtonSize, 0, opinionButtonSize, opinionButtonSize);
                opinionContainer.AddChild(likeButton_1);
                var likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][0][0]);
                likeButton_1.AddChild(likeImage);
                var dislikeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][1][0]);
                dislikeButton_1.AddChild(dislikeImage);
                likeButton_1.onClickEvents.push(function () {
                    if (currentLevelListing) {
                        if (currentLevelListing.isLiked || currentLevelListing.isDisliked)
                            return;
                        currentLevelListing.isLiked = true;
                        likeButton_1.normalBackColor = "#0000";
                        likeButton_1.mouseoverBackColor = "#0000";
                        dislikeButton_1.isHidden = true;
                        DataService.LikeLevel(currentLevelListing.level.code || "");
                        var listing = LevelBrowseMenu.GetListing((currentLevelListing === null || currentLevelListing === void 0 ? void 0 : currentLevelListing.level.code) || "");
                        if (listing)
                            listing.isLiked = true;
                    }
                });
                dislikeButton_1.onClickEvents.push(function () {
                    if (currentLevelListing) {
                        if (currentLevelListing.isLiked || currentLevelListing.isDisliked)
                            return;
                        currentLevelListing.isDisliked = true;
                        dislikeButton_1.normalBackColor = "#0000";
                        dislikeButton_1.mouseoverBackColor = "#0000";
                        likeButton_1.isHidden = true;
                        DataService.DislikeLevel((currentLevelListing === null || currentLevelListing === void 0 ? void 0 : currentLevelListing.level.code) || "");
                        var listing = LevelBrowseMenu.GetListing((currentLevelListing === null || currentLevelListing === void 0 ? void 0 : currentLevelListing.level.code) || "");
                        if (listing)
                            listing.isLiked = false;
                    }
                });
            }
            container.AddChild(opinionContainer);
        }
        return ret;
    };
    PauseMenu.prototype.CreateButton = function (text, sizeRatio) {
        if (sizeRatio === void 0) { sizeRatio = 1; }
        var button = new Button(0, 0, camera.canvas.width * 0.7 * sizeRatio, 60);
        var buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.isNoisy = true;
        button.AddChild(buttonText);
        buttonText.xOffset = button.width / 2;
        buttonText.yOffset = 40;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    };
    PauseMenu.prototype.Update = function () {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Pause, true)) {
            this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
            PauseMenu.IsPaused = false;
        }
    };
    PauseMenu.UnpauseTime = new Date();
    PauseMenu.IsPaused = false;
    return PauseMenu;
}(Menu));
