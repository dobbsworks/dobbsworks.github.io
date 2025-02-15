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
var OptionsMenu = /** @class */ (function (_super) {
    __extends(OptionsMenu, _super);
    function OptionsMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#0005";
        _this.backgroundColor2 = "#000D";
        return _this;
    }
    OptionsMenu.prototype.CreateElements = function () {
        var ret = [];
        var container = new Panel(camera.canvas.width / 4, camera.canvas.height / 2 - 250, camera.canvas.width / 2, 500);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);
        var profileButton = this.CreateButton("Edit Profile");
        container.AddChild(profileButton);
        profileButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(AvatarCustomizationMenu);
        });
        var controlsButton = this.CreateButton("Edit Controls");
        container.AddChild(controlsButton);
        controlsButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(ControlMapMenu);
        });
        var musicVol = this.CreateSlider("Music Volume", StorageService.GetMusicVolume(), function (newVal) {
            audioHandler.SetMusicVolume(newVal);
        });
        container.AddChild(musicVol);
        var sfxVol = this.CreateSlider("SFX Volume", StorageService.GetSfxVolume(), function (newVal) {
            audioHandler.SetSfxVolume(newVal);
        });
        container.AddChild(sfxVol);
        var fullscreenButton = this.CreateButton("Toggle Fullscreen");
        container.AddChild(fullscreenButton);
        fullscreenButton.onClickEvents.push(function () {
            var _a;
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                (_a = document.getElementById("canvas")) === null || _a === void 0 ? void 0 : _a.requestFullscreen();
            }
        });
        var preferencesButton = this.CreateButton("Additional Preferences");
        container.AddChild(preferencesButton);
        preferencesButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(PreferencesMenu);
        });
        var backButton = this.CreateButton("Back");
        container.AddChild(backButton);
        backButton.onClickEvents.push(function () {
            if (editorHandler.isInEditMode && editorHandler.isMinimizedMode) {
                editorHandler.ToggleMinimizeMode();
            }
            MenuHandler.GoBack(false);
        });
        if (editorHandler.isInEditMode && !editorHandler.isMinimizedMode) {
            editorHandler.ToggleMinimizeMode();
        }
        return ret;
    };
    OptionsMenu.prototype.CreateSlider = function (header, initialValue, onChange) {
        var panel = new Panel(0, 0, camera.canvas.width / 2, 110);
        panel.margin = 15;
        panel.AddChild(new Spacer(0, 0, 0, 0));
        var buttonText = new UIText(0, 0, header, 24, "#000");
        panel.layout = "vertical";
        panel.AddChild(buttonText);
        buttonText.xOffset = camera.canvas.width / 4;
        buttonText.yOffset = 15;
        buttonText.textAlign = "center";
        panel.backColor = "#fff8";
        panel.borderColor = "#000";
        panel.borderRadius = 9;
        panel.AddChild(new Spacer(0, 0, 0, 0));
        var slider = new Slider(0, 0, camera.canvas.width / 2 - 30, 40, onChange);
        slider.value = initialValue;
        panel.AddChild(slider);
        return panel;
    };
    OptionsMenu.prototype.CreateButton = function (text) {
        var button = new Button(0, 0, camera.canvas.width / 2, 50);
        var buttonText = new UIText(0, 0, text, 24, "#000");
        button.margin = 0;
        button.AddChild(buttonText);
        buttonText.xOffset = camera.canvas.width / 4;
        buttonText.yOffset = 34;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    };
    OptionsMenu.prototype.Update = function () {
    };
    OptionsMenu.CreateOptionsButton = function () {
        var panel = new Panel(camera.canvas.width - 80, 10, 70, 70);
        panel.backColor = "#1138";
        var button = new Button(0, 0, 60, 60);
        button.isNoisy = true;
        panel.AddChild(button);
        var imageTile = tiles["editor"][6][7];
        button.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        button.onClickEvents.push(function () {
            MenuHandler.SubMenu(OptionsMenu);
        });
        return panel;
    };
    return OptionsMenu;
}(Menu));
var PreferencesMenu = /** @class */ (function (_super) {
    __extends(PreferencesMenu, _super);
    function PreferencesMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#0005";
        _this.backgroundColor2 = "#000D";
        return _this;
    }
    PreferencesMenu.prototype.CreateElements = function () {
        var ret = [];
        var container = new Panel(camera.canvas.width / 4, camera.canvas.height / 2 - 250, camera.canvas.width / 2, 500);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);
        container.AddChild(this.CreateToggle(Preference.ConfirmOnClose));
        container.AddChild(this.CreateToggle(Preference.PauseOnLoseFocus));
        container.AddChild(this.CreateToggle(Preference.MuteOnLoseFocus));
        container.AddChild(this.CreateToggle(Preference.OnScreenInputs));
        container.AddChild(this.CreateToggle(Preference.AnimateTiles));
        var backButton = this.CreateButton("Back");
        container.AddChild(backButton);
        backButton.onClickEvents.push(function () {
            MenuHandler.GoBack(false);
        });
        return ret;
    };
    PreferencesMenu.prototype.CreateToggle = function (pref) {
        var button = this.CreateButton(pref.optionText);
        var currentValue = StorageService.GetPreferenceBool(pref);
        button.borderColor = currentValue ? "#2F2E" : "#F2FE";
        button.onClickEvents.push(function () {
            var newValue = button.borderColor == "#F2FE";
            StorageService.SetPreferenceBool(pref, newValue);
            button.borderColor = newValue ? "#2F2E" : "#F2FE";
        });
        return button;
    };
    PreferencesMenu.prototype.CreateButton = function (text) {
        var button = new Button(0, 0, camera.canvas.width / 2, 50);
        var buttonText = new UIText(0, 0, text, 24, "#000");
        button.margin = 0;
        button.AddChild(buttonText);
        buttonText.xOffset = camera.canvas.width / 4;
        buttonText.yOffset = 34;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    };
    PreferencesMenu.prototype.Update = function () {
    };
    return PreferencesMenu;
}(Menu));
