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
        _this.backgroundColor = "#0005";
        return _this;
    }
    PauseMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        audioHandler.SetLowPass(true);
        PauseMenu.IsPaused = true;
        ret.push(OptionsMenu.CreateOptionsButton());
        var container = new Panel(camera.canvas.width * 0.15, camera.canvas.height / 2 - 150, camera.canvas.width * 0.7, 300);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);
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
        else {
            // exit button
            var exitButton = this.CreateButton("Exit Level");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                MenuHandler.GoBack();
                currentLevelCode = "";
                audioHandler.SetBackgroundMusic("menuJazz");
                editorHandler.grabbedCheckpointLocation = null;
                DeathLogService.LogDeathCounts();
            });
        }
        if (!editorHandler.grabbedCheckpointLocation) {
            var retryButton = this.CreateButton("Retry");
            container.AddChild(retryButton);
            retryButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerDead();
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
                player.OnPlayerHurt();
            });
            var retryFromStartButton = this.CreateButton("Retry From Start", 0.45);
            row.AddChild(retryFromStartButton);
            retryFromStartButton.onClickEvents.push(function () {
                _this.Dispose();
                editorHandler.grabbedCheckpointLocation = null;
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                PauseMenu.IsPaused = false;
                player.OnPlayerHurt();
            });
        }
        // editorHandler.grabbedCheckpointLocation = null;
        var resumeButton = this.CreateButton("Resume");
        container.AddChild(resumeButton);
        resumeButton.onClickEvents.push(function () {
            _this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
            PauseMenu.IsPaused = false;
        });
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
