class FocusHandler {
    Initialize() {
        document.addEventListener("visibilitychange", () => {
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
                } else {
                    audioHandler.Unmute();
                }
            }
        });
    }

}