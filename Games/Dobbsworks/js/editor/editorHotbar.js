"use strict";
var EditorHotbar = /** @class */ (function () {
    function EditorHotbar(panel) {
        this.panel = panel;
        this.hotbarElements = [];
    }
    EditorHotbar.prototype.OnToolSelect = function (editorButton) {
        // check if user is locking this button to a key
        var chosenHotkey = -1;
        for (var hotkey = 1; hotkey <= 9; hotkey++) {
            var keyAction = KeyAction.Hotkey(hotkey);
            if (KeyboardHandler.IsKeyPressed(keyAction, false))
                chosenHotkey = hotkey;
        }
        var isValidHotkey = chosenHotkey > 0 && chosenHotkey < 9;
        var isDeleteHeld = KeyboardHandler.IsKeyPressed(KeyAction.EditorDelete, false);
        var existingButton = this.FindToolInHotbar(editorButton);
        if (existingButton) {
            // if assigning to a hotkey, first remove from hotbar
            if (isValidHotkey) {
                this.hotbarElements = this.hotbarElements.filter(function (a) { return a.button != existingButton; });
            }
            else if (isDeleteHeld) {
                this.hotbarElements = this.hotbarElements.filter(function (a) { return a.button != existingButton; });
                this.RefreshHotbar();
            }
            else {
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
            if (!KeyboardHandler.IsKeyPressed(KeyAction.EditorSelectWithoutClosingDrawers, false)) {
                editorHandler.CloseDrawers();
            }
        }
    };
    EditorHotbar.prototype.AddHotbarButton = function (button, chosenHotkey) {
        // maximum 9 items (8 lockable, 9th reserved for latest item)
        // we call this after a button is clicked, but that button doesn't exist in the hotbar yet
        var copyButton = button.CreateCopy();
        if (!copyButton)
            return;
        if (chosenHotkey == -1 || chosenHotkey >= 9) {
            this.hotbarElements.push({ button: copyButton, locked: false, hotkey: -1 });
        }
        else {
            // check if existing hotkey is set
            var existing = this.hotbarElements[chosenHotkey - 1];
            if (existing)
                existing.locked = false;
            this.hotbarElements.splice(chosenHotkey - 1, 0, { button: copyButton, locked: true, hotkey: chosenHotkey });
        }
        if (this.hotbarElements.length > 9) {
            // need to remove first unlocked element
            var toRemove = this.hotbarElements.findIndex(function (a) { return !a.locked; });
            this.hotbarElements.splice(toRemove, 1);
        }
        this.RefreshHotbar();
    };
    EditorHotbar.prototype.RefreshHotbar = function () {
        // correct order of elements
        var ordered = [];
        var _loop_1 = function (i) {
            var hotkeyElement = this_1.hotbarElements.find(function (a) { return a.hotkey == i; });
            var chosenElement = hotkeyElement !== null && hotkeyElement !== void 0 ? hotkeyElement : this_1.hotbarElements.find(function (a) { return a.hotkey == -1; });
            if (chosenElement)
                ordered.push(chosenElement);
            this_1.hotbarElements = this_1.hotbarElements.filter(function (a) { return a != chosenElement; });
        };
        var this_1 = this;
        for (var i = 1; i <= 9; i++) {
            _loop_1(i);
        }
        this.hotbarElements = ordered;
        this.panel.children = [];
        for (var _i = 0, _a = this.hotbarElements; _i < _a.length; _i++) {
            var a = _a[_i];
            this.panel.AddChild(a.button);
            if (a.locked) {
                a.button.normalBackColor = "#020b";
                a.button.mouseoverBackColor = "#242b";
            }
            else {
                a.button.normalBackColor = "#002b";
                a.button.mouseoverBackColor = "#224b";
            }
        }
        if (this.hotbarElements.length === 0) {
            editorHandler.currentTool = editorHandler.selectionTool;
        }
    };
    EditorHotbar.prototype.KeyboardSelectNum = function (slotNumber) {
        var button = this.panel.children[slotNumber - 1];
        if (button)
            button.Click();
    };
    EditorHotbar.prototype.FindToolInHotbar = function (editorButton) {
        if (editorButton instanceof EditorButtonTile) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonTile && a.linkedFillType == editorButton.linkedFillType; });
        }
        if (editorButton instanceof EditorButtonSprite) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonSprite && a.linkedTool == editorButton.linkedTool; });
        }
        if (editorButton instanceof EditorButtonSlopePen) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonSlopePen && a.slopeFill == editorButton.slopeFill; });
        }
        if (editorButton instanceof EditorButtonTrackTool) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonTrackTool; });
        }
        return null;
    };
    return EditorHotbar;
}());
