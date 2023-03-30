class FocusHandler {
    Initialize() {
        document.addEventListener("visibilitychange", () => {
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
                } else {
                    audioHandler.Unmute();
                }
            }
        });
    }

}