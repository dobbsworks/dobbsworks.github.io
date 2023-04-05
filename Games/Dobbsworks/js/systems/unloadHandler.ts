class UnloadHandler {

    static ShouldPrompt(): boolean {
        if (!StorageService.GetPreferenceBool(Preference.ConfirmOnClose)) return false;
        return true;
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