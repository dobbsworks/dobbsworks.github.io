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
        ret.push(OptionsMenu.CreateOptionsButton());
        var container = new Panel(camera.canvas.width / 4, camera.canvas.height / 2 - 150, camera.canvas.width / 2, 300);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);
        if (editorHandler.isEditorAllowed) {
            container.AddChild(new Spacer(0, 0, 0, 60));
        }
        else {
            // exit button
            var exitButton = this.CreateButton("Exit Level");
            container.AddChild(exitButton);
            exitButton.onClickEvents.push(function () {
                _this.Dispose();
                PauseMenu.UnpauseTime = new Date();
                audioHandler.SetLowPass(false);
                MenuHandler.GoBack();
                currentLevelId = -1;
            });
        }
        var retryButton = this.CreateButton("Retry");
        container.AddChild(retryButton);
        retryButton.onClickEvents.push(function () {
            _this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
            player.OnPlayerHurt();
        });
        var resumeButton = this.CreateButton("Resume");
        container.AddChild(resumeButton);
        resumeButton.onClickEvents.push(function () {
            _this.Dispose();
            PauseMenu.UnpauseTime = new Date();
            audioHandler.SetLowPass(false);
        });
        return ret;
    };
    PauseMenu.prototype.CreateButton = function (text) {
        var button = new Button(0, 0, camera.canvas.width / 2, 60);
        var buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.isNoisy = true;
        button.AddChild(buttonText);
        buttonText.xOffset = camera.canvas.width / 4;
        buttonText.yOffset = -15;
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
        }
    };
    PauseMenu.UnpauseTime = new Date();
    return PauseMenu;
}(Menu));
