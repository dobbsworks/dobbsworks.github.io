class BlankMenu extends Menu {
    // just used as placeholder in menu stack
    stopsMapUpdate: boolean = false;
    blocksPause = false;
    CreateElements(): UIElement[] {
        return [];
    }
}