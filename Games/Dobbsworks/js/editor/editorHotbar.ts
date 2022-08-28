class EditorHotbar {

    constructor(public panel: Panel) { }


    hotbarElements: HotbarElement[] = [];


    OnToolSelect(editorButton: HotbarButton): void {
        // check if user is locking this button to a key
        let chosenHotkey = -1;
        for (let hotkey = 1; hotkey <= 9; hotkey++) {
            let keyAction = KeyAction.Hotkey(hotkey);
            if (KeyboardHandler.IsKeyPressed(keyAction, false)) chosenHotkey = hotkey;
        }
        let isValidHotkey = chosenHotkey > 0 && chosenHotkey < 9;
        let isDeleteHeld = KeyboardHandler.IsKeyPressed(KeyAction.EditorDelete, false);

        let existingButton = this.FindToolInHotbar(editorButton);
        if (existingButton) {
            // if assigning to a hotkey, first remove from hotbar
            if (isValidHotkey) {
                this.hotbarElements = this.hotbarElements.filter(a => a.button != existingButton);
            } else if (isDeleteHeld) {
                this.hotbarElements = this.hotbarElements.filter(a => a.button != existingButton);
                this.RefreshHotbar();
            } else {
                if (existingButton instanceof EditorButtonSprite) {
                    editorHandler.currentTool = existingButton.linkedTool;
                }
                if (existingButton instanceof EditorButtonTile) {
                    editorHandler.currentTool = new editorHandler.selectedFillBrush(existingButton.linkedFillType);
                }
            }
        } 
        
        if (!existingButton || isValidHotkey) {
            this.AddHotbarButton(editorButton, chosenHotkey);
        }
    }

    AddHotbarButton(button: HotbarButton, chosenHotkey: number): void {
        // maximum 9 items (8 lockable, 9th reserved for latest item)
        // we call this after a button is clicked, but that button doesn't exist in the hotbar yet

        let copyButton = button.CreateCopy();
        if (!copyButton) return;

        if (chosenHotkey == -1 || chosenHotkey >= 9) {
            this.hotbarElements.push({ button: copyButton, locked: false, hotkey: -1 });
        } else {
            // check if existing hotkey is set
            let existing = this.hotbarElements[chosenHotkey - 1];
            if (existing) existing.locked = false;
            this.hotbarElements.splice(chosenHotkey - 1, 0, { button: copyButton, locked: true, hotkey: chosenHotkey });
        }
        if (this.hotbarElements.length > 9) {
            // need to remove first unlocked element
            let toRemove = this.hotbarElements.findIndex(a => !a.locked);
            this.hotbarElements.splice(toRemove, 1);
        }

        this.RefreshHotbar();
    }

    RefreshHotbar(): void {
        // correct order of elements
        let ordered = [];
        for (let i = 1; i <= 9; i++) {
            let hotkeyElement = this.hotbarElements.find(a => a.hotkey == i);
            let chosenElement = hotkeyElement ?? this.hotbarElements.find(a => a.hotkey == -1);
            if (chosenElement) ordered.push(chosenElement);
            this.hotbarElements = this.hotbarElements.filter(a => a != chosenElement);
        }
        this.hotbarElements = ordered;
        this.panel.children = [];
        for (let a of this.hotbarElements) {
            this.panel.AddChild(a.button);
            if (a.locked) {
                a.button.normalBackColor = "#020b";
                a.button.mouseoverBackColor = "#242b";
            } else {
                a.button.normalBackColor = "#002b";
                a.button.mouseoverBackColor = "#224b";
            }
        }
    }

    KeyboardSelectNum(slotNumber: number): void {
        let button = (<EditorButton>this.panel.children[slotNumber - 1]);
        if (button) button.Click();
    }

    FindToolInHotbar(editorButton: HotbarButton): EditorButton | null {
        if (editorButton instanceof EditorButtonTile) {
            return <EditorButtonTile | null>this.panel.children.find(a => a instanceof EditorButtonTile && a.linkedFillType == editorButton.linkedFillType);
        }
        if (editorButton instanceof EditorButtonSprite) {
            return <EditorButtonSprite | null>this.panel.children.find(a => a instanceof EditorButtonSprite && a.linkedTool == editorButton.linkedTool);
        }
        if (editorButton instanceof EditorButtonSlopePen) {
            return <EditorButtonSlopePen | null>this.panel.children.find(a => a instanceof EditorButtonSlopePen && a.slopeFill == editorButton.slopeFill);
        }
        return null;
    }
}

type HotbarButton = EditorButtonTile | EditorButtonSprite | EditorButtonSlopePen;

type HotbarElement = {
    button: HotbarButton,
    locked: boolean,
    hotkey: number
};