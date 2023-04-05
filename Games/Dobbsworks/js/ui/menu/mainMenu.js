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
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        ret.push(OptionsMenu.CreateOptionsButton());
        var logo = new Logo(262, 30);
        ret.push(logo);
        var centerX = camera.canvas.width / 2;
        var playButtonWidth = camera.canvas.width / 3;
        var playButtonHeight = 60;
        var playButtonX = centerX - playButtonWidth / 2;
        var playButtonY = logo.y + logo.height + 15;
        var playButton = new Button(playButtonX, playButtonY, playButtonWidth, playButtonHeight);
        var playText = new UIText(centerX, playButtonY + 40, "Start Making", 30, "#000");
        playButton.AddChild(playText);
        playText.xOffset = playButtonWidth / 2 - 5;
        playText.yOffset = 40;
        playButton.isNoisy = true;
        ret.push(playButton);
        var myLevelsButton = new Button(playButtonX, playButtonY + playButtonHeight + 10, playButtonWidth, playButtonHeight);
        var myLevelsText = new UIText(centerX, playButtonY + 40, "My Levels", 30, "#000");
        myLevelsButton.AddChild(myLevelsText);
        myLevelsText.xOffset = playButtonWidth / 2 - 5;
        myLevelsText.yOffset = 40;
        myLevelsButton.isNoisy = true;
        if (!isDemoMode)
            ret.push(myLevelsButton);
        var demoLevelsButton = new Button(playButtonX, playButtonY + playButtonHeight + 10, playButtonWidth, playButtonHeight);
        var demoLevelsText = new UIText(centerX, playButtonY + 40, "Demo Levels", 30, "#000");
        demoLevelsButton.AddChild(demoLevelsText);
        demoLevelsText.xOffset = playButtonWidth / 2 - 5;
        demoLevelsText.yOffset = 40;
        demoLevelsButton.isNoisy = true;
        if (isDemoMode)
            ret.push(demoLevelsButton);
        var recentLevelsButton = new Button(playButtonX, playButtonY + (playButtonHeight + 10) * 2, playButtonWidth, playButtonHeight);
        var recentLevelsText = new UIText(centerX, playButtonY + 40, "Browse Levels", 30, "#000");
        recentLevelsButton.AddChild(recentLevelsText);
        recentLevelsText.xOffset = playButtonWidth / 2 - 5;
        recentLevelsText.yOffset = 40;
        recentLevelsButton.isNoisy = true;
        if (!isDemoMode)
            ret.push(recentLevelsButton);
        var singlePlayerButton = new Button(playButtonX, playButtonY + (playButtonHeight + 10) * 3, playButtonWidth, playButtonHeight);
        var singlePlayerText = new UIText(centerX, playButtonY + 40, "Barker's Carnival", 30, "#000");
        singlePlayerButton.AddChild(singlePlayerText);
        singlePlayerText.xOffset = playButtonWidth / 2 - 5;
        singlePlayerText.yOffset = 40;
        singlePlayerButton.isNoisy = true;
        if (!isDemoMode)
            ret.push(singlePlayerButton);
        var contestButton = new Button(playButtonX + playButtonWidth + 10 + 50, playButtonY + (playButtonHeight + 10) * 2, playButtonWidth - 80, playButtonHeight * 2 + 10);
        var contestButtonText = new UIText(centerX, playButtonY + 40, "Level Contest!", 30, "#000");
        contestButton.AddChild(contestButtonText);
        contestButtonText.xOffset = contestButton.width / 2 - 5;
        contestButtonText.yOffset = 40;
        contestButton.isNoisy = true;
        contestButton.layout = "vertical";
        var trophyRow = new Panel(0, 0, contestButton.width - 10, 70);
        trophyRow.AddChild(new Spacer(0, 0, 10, 10));
        for (var i = 0; i < 3; i++) {
            var contestIcon = new ImageFromTile(0, 0, 48, 48, tiles["trophies"][i][0]);
            trophyRow.AddChild(contestIcon);
        }
        trophyRow.AddChild(new Spacer(0, 0, 10, 10));
        contestButton.AddChild(trophyRow);
        if (!isDemoMode)
            ret.push(contestButton);
        contestButton.x += 300;
        if (!ContestService.currentContest) {
            contestButton.targetX += 300;
        }
        [playButton, myLevelsButton, recentLevelsButton, demoLevelsButton, singlePlayerButton, contestButton].forEach(function (b) {
            b.normalBackColor = "#fff8";
            b.mouseoverBackColor = "#f73738";
            b.borderColor = "#000";
            b.borderRadius = 9;
            b.onClickEvents.push(function () {
                // don't save checkpoints from main menu
                editorHandler.grabbedCheckpointLocation = null;
            });
        });
        playButton.onClickEvents.push(function () {
            editorHandler.isEditorAllowed = true;
            editorHandler.SwitchToEditMode();
            _this.Hide(-1);
        });
        myLevelsButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(MyLevelsMenu);
        });
        recentLevelsButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(LevelBrowseMenu);
            audioHandler.SetBackgroundMusic("menuJazz");
        });
        singlePlayerButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(CarnivalMenu);
            audioHandler.SetBackgroundMusic("carnival");
        });
        contestButton.onClickEvents.push(function () {
            _this.DisplayContestPopUp();
        });
        demoLevelsButton.onClickEvents.push(function () {
            currentDemoIndex = 0;
            currentMap = LevelMap.FromImportString(allDemoLevels[0]);
            editorHandler.SwitchToPlayMode();
            MenuHandler.SubMenu(BlankMenu);
        });
        return ret;
    };
    MainMenu.prototype.DisplayContestPopUp = function () {
        var _this = this;
        var contest = ContestService.currentContest;
        if (contest) {
            if (contest.status == ContestState.results) {
                UIDialog.Alert("The level contest, \"" + contest.title + "\", has completed! You can view the results in the \"Contest\" tab of the level browser. Special thanks to all participants and voters!", "OK");
                if (MenuHandler.Dialog)
                    MenuHandler.Dialog.title = "The resutls are in!";
            }
            else {
                UIDialog.Alert(contest.description, "OK");
                if (MenuHandler.Dialog) {
                    MenuHandler.Dialog.title = contest.title;
                    if (contest.status == ContestState.submissionsOpen) {
                        var countdownText = "Time left to submit";
                        if (contest.submittedLevel)
                            countdownText = "Time until voting opens";
                        UIDialog.SetCountdown(countdownText, contest.votingTime);
                        if (!contest.submittedLevel) {
                            MenuHandler.Dialog.options.unshift(new UIDialogOption("How to submit", function () {
                                UIDialog.Alert("After creating your level, clear check it from the My Levels menu. Instead of clicking \"Publish\", click \"Submit to Contest\". You can only submit one level, so make it count!", "OK");
                                if (MenuHandler.Dialog) {
                                    MenuHandler.Dialog.title = "How to submit contest levels";
                                    MenuHandler.Dialog.options[0].action = function () { _this.DisplayContestPopUp(); };
                                }
                            }));
                        }
                    }
                    if (contest.status == ContestState.votingOpen) {
                        UIDialog.SetCountdown("Time left to vote", contest.resultsTime);
                        MenuHandler.Dialog.options.unshift(new UIDialogOption("How to vote", function () {
                            UIDialog.Alert("Click \"Browse Levels\", then click the \"Contest\" tab. This will show all the submissions for the active contest. After playing a level, a \"Vote\" button will appear next to the \"Open in Editor\" button. You can rate the level on a 1 - 5 scale, with 5 being the best. All votes are final!", "OK");
                            if (MenuHandler.Dialog) {
                                MenuHandler.Dialog.title = "How to vote on contest levels";
                                MenuHandler.Dialog.options[0].action = function () { _this.DisplayContestPopUp(); };
                            }
                        }));
                    }
                }
            }
        }
    };
    return MainMenu;
}(Menu));
var Logo = /** @class */ (function (_super) {
    __extends(Logo, _super);
    function Logo(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.age = 0;
        _this.width = tiles["logo"][0][0].width * 4;
        _this.height = tiles["logo"][0][0].height * 4;
        _this.targetWidth = _this.width;
        _this.targetHeight = _this.height;
        return _this;
    }
    Logo.prototype.IsMouseOver = function () {
        return false;
    };
    Logo.prototype.GetMouseOverElement = function () { return null; };
    Logo.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.age++;
    };
    Logo.prototype.Draw = function (ctx) {
        var frame = Math.floor(this.age / 5) % 3;
        var imageTile = tiles["logo"][frame][0];
        var scale = 4;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x, this.y, imageTile.width * scale, imageTile.height * scale);
    };
    return Logo;
}(UIElement));
