class UnloadHandler {

    static ShouldPrompt(): boolean {
        if (window.location.href.startsWith("https://localhost:7121/")) return false;

        let unsavedChangesExist = true;
        let currentSaveValue = currentMap.GetExportString();

        if (currentSaveValue == startLevel) return false;

        if (editorHandler.isEditorAllowed && editorHandler.isInEditMode) {
            // we're in the editor, not looking at the title screen map
            // check current map code against all saved levels

            let saveKeys = Object.keys(localStorage).filter(a => a.startsWith("save_"));
            for (let saveKey of saveKeys) {
                let saveValue = <string>localStorage[saveKey];
                if (saveValue.substring(saveValue.indexOf(";") + 1) == currentSaveValue.substring(currentSaveValue.indexOf(";") + 1)) {
                    // the current editor contents are in a save file
                    unsavedChangesExist = false;
                }
            }
        }

        return unsavedChangesExist;
    }

    static RegisterUnloadHandler(): void {
        addEventListener('beforeunload', (event) => {
            if (event && UnloadHandler.ShouldPrompt()) {
                (<any>event).preventDefault();
                (<any>event).returnValue = 'Are you sure you want to leave? Changes will not be saved.';
            }
        });
    }

}