"use strict";
var UnloadHandler = /** @class */ (function () {
    function UnloadHandler() {
    }
    UnloadHandler.ShouldPrompt = function () {
        if (!StorageService.GetPreferenceBool(Preference.ConfirmOnClose))
            return false;
        return true;
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
