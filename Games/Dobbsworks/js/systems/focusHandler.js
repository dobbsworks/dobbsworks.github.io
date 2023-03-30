"use strict";
var FocusHandler = /** @class */ (function () {
    function FocusHandler() {
    }
    FocusHandler.prototype.Initialize = function () {
        document.addEventListener("visibilitychange", function () {
            if (StorageService.GetPreferenceBool("pause-on-lose-focus", true)) {
                if (document.hidden) {
                    if (CanGamePause()) {
                        PauseGame();
                    }
                }
            }
            if (StorageService.GetPreferenceBool("mute-on-lose-focus", true)) {
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
