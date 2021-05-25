class PauseHandler {
    isPaused = false;

    onPauseButtonPressed() {
        if (!mainMenuHandler.isOnMainMenu) {
            pauseHandler.isPaused = !pauseHandler.isPaused;
            if (pauseHandler.isPaused) {
                pauseHandler.EnterPauseMenu()
                audioHandler.SetLowPass(true);
                audioHandler.PlaySound("pause");
            } else {
                pauseHandler.ExitPauseMenu();
                audioHandler.SetLowPass(false);
                audioHandler.PlaySound("unpause");
            }
        }
    }

    EnterPauseMenu() {
        uiHandler.Shelve();

        let newElements = GetOptionsMenu(false);

        uiHandler.elements.push(...newElements);
    }

    ExitPauseMenu() {
        uiHandler.Restore();
        isMouseDown = false;
    }
}