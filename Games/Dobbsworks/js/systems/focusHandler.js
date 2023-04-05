"use strict";
var FocusHandler = /** @class */ (function () {
    function FocusHandler() {
    }
    FocusHandler.prototype.Initialize = function () {
        document.addEventListener("visibilitychange", function () {
            if (StorageService.GetPreferenceBool(Preference.PauseOnLoseFocus)) {
                if (document.hidden) {
                    if (CanGamePause()) {
                        PauseGame();
                    }
                }
            }
            if (StorageService.GetPreferenceBool(Preference.MuteOnLoseFocus)) {
                if (document.hidden) {
                    audioHandler.Mute();
                }
                else {
                    audioHandler.Unmute();
                }
            }
        });
    };
    return FocusHandler;
}());
