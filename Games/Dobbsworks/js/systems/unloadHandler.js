"use strict";
var UnloadHandler = /** @class */ (function () {
    function UnloadHandler() {
    }
    UnloadHandler.ShouldPrompt = function () {
        if (window.location.href.startsWith("https://localhost:7121/"))
            return false;
        var unsavedChangesExist = true;
        var currentSaveValue = currentMap.GetExportString();
        if (currentSaveValue == startLevel)
            return false;
        if (editorHandler.isEditorAllowed && editorHandler.isInEditMode) {
            // we're in the editor, not looking at the title screen map
            // check current map code against all saved levels
            var saveKeys = Object.keys(localStorage).filter(function (a) { return a.startsWith("save_"); });
            for (var _i = 0, saveKeys_1 = saveKeys; _i < saveKeys_1.length; _i++) {
                var saveKey = saveKeys_1[_i];
                var saveValue = localStorage[saveKey];
                if (saveValue.substring(saveValue.indexOf(";") + 1) == currentSaveValue.substring(currentSaveValue.indexOf(";") + 1)) {
                    // the current editor contents are in a save file
                    unsavedChangesExist = false;
                }
            }
        }
        return unsavedChangesExist;
    };
    UnloadHandler.RegisterUnloadHandler = function () {
        addEventListener('beforeunload', function (event) {
            if (event && UnloadHandler.ShouldPrompt()) {
                event.preventDefault();
                event.returnValue = 'Are you sure you want to leave? Changes will not be saved.';
            }
        });
    };
    return UnloadHandler;
}());
