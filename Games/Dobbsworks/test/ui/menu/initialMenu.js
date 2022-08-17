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
var InitialMenu = /** @class */ (function (_super) {
    __extends(InitialMenu, _super);
    function InitialMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.blocksPause = true;
        _this.backgroundColor = "#000";
        return _this;
    }
    InitialMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        var playWithAudioButton = new Button(50, 50, camera.canvas.width - 100, camera.canvas.height / 2 - 100);
        var withSoundText = new UIText(0, 0, "Play with sound", 40, "white");
        playWithAudioButton.AddChild(withSoundText);
        withSoundText.xOffset = playWithAudioButton.width / 2 - 5;
        withSoundText.yOffset = -75;
        var playMutedButton = new Button(50, camera.canvas.height / 2 + 50, camera.canvas.width - 100, camera.canvas.height / 2 - 100);
        var mutedText = new UIText(0, 0, "Play muted", 40, "white");
        playMutedButton.AddChild(mutedText);
        mutedText.xOffset = playMutedButton.width / 2 - 5;
        mutedText.yOffset = -75;
        ret.push(playWithAudioButton, playMutedButton);
        playWithAudioButton.onClickEvents.push(function () {
            _this.GoToMainMenu();
        });
        playMutedButton.onClickEvents.push(function () {
            audioHandler.startMuted = true;
            audioHandler.Mute();
            _this.GoToMainMenu();
        });
        return ret;
    };
    InitialMenu.prototype.GoToMainMenu = function () {
        var _this = this;
        this.Hide(1);
        setTimeout(function () {
            _this.Dispose();
            audioHandler.SetBackgroundMusic("intro");
        }, 200);
        MenuHandler.CreateMenu(MainMenu);
    };
    return InitialMenu;
}(Menu));
