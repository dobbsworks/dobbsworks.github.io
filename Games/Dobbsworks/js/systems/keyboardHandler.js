"use strict";
var KeyAction = /** @class */ (function () {
    function KeyAction(keyCode) {
        this.keyCode = keyCode;
    }
    KeyAction.Hotkey = function (hotkeyNumber) {
        if (hotkeyNumber == 1)
            return KeyAction.EditorHotkey1;
        if (hotkeyNumber == 2)
            return KeyAction.EditorHotkey2;
        if (hotkeyNumber == 3)
            return KeyAction.EditorHotkey3;
        if (hotkeyNumber == 4)
            return KeyAction.EditorHotkey4;
        if (hotkeyNumber == 5)
            return KeyAction.EditorHotkey5;
        if (hotkeyNumber == 6)
            return KeyAction.EditorHotkey6;
        if (hotkeyNumber == 7)
            return KeyAction.EditorHotkey7;
        if (hotkeyNumber == 8)
            return KeyAction.EditorHotkey8;
        if (hotkeyNumber == 9)
            return KeyAction.EditorHotkey9;
        return KeyAction.EditorHotkey1;
    };
    KeyAction.Up = new KeyAction("up");
    KeyAction.Left = new KeyAction("left");
    KeyAction.Right = new KeyAction("right");
    KeyAction.Down = new KeyAction("down");
    KeyAction.Action1 = new KeyAction("action1");
    KeyAction.Action2 = new KeyAction("action2");
    KeyAction.Debug1 = new KeyAction("debug1");
    KeyAction.Debug2 = new KeyAction("debug2");
    KeyAction.Debug3 = new KeyAction("debug3");
    KeyAction.Fullscreen = new KeyAction("fullscreen");
    KeyAction.Reset = new KeyAction("reset");
    KeyAction.EditToggle = new KeyAction("editToggle");
    KeyAction.EditorMinimize = new KeyAction("editorMinimize");
    KeyAction.EditorPlayerHotkey = new KeyAction("EditorPlayerHotkey");
    KeyAction.EditorEraseHotkey = new KeyAction("editorEraseHotkey");
    KeyAction.EditorUndo = new KeyAction("EditorUndo");
    KeyAction.EditorRedo = new KeyAction("EditorRedo");
    KeyAction.EditorDelete = new KeyAction("EditorDelete");
    KeyAction.EditorPasteDrag = new KeyAction("EditorPasteDrag");
    KeyAction.Cancel = new KeyAction("Cancel");
    KeyAction.Pause = new KeyAction("Pause");
    KeyAction.EditorHotkey1 = new KeyAction("EditorHotkey1");
    KeyAction.EditorHotkey2 = new KeyAction("EditorHotkey2");
    KeyAction.EditorHotkey3 = new KeyAction("EditorHotkey3");
    KeyAction.EditorHotkey4 = new KeyAction("EditorHotkey4");
    KeyAction.EditorHotkey5 = new KeyAction("EditorHotkey5");
    KeyAction.EditorHotkey6 = new KeyAction("EditorHotkey6");
    KeyAction.EditorHotkey7 = new KeyAction("EditorHotkey7");
    KeyAction.EditorHotkey8 = new KeyAction("EditorHotkey8");
    KeyAction.EditorHotkey9 = new KeyAction("EditorHotkey9");
    return KeyAction;
}());
var KeyboardHandler = /** @class */ (function () {
    function KeyboardHandler() {
    }
    KeyboardHandler.InitKeyHandlers = function () {
        document.addEventListener("keydown", KeyboardHandler.OnKeyDown, false);
        document.addEventListener("keyup", KeyboardHandler.OnKeyUp, false);
    };
    KeyboardHandler.OnKeyDown = function (e) {
        KeyboardHandler.gamepadIndex = -1;
        var keyCode = e.code;
        var mappedAction = KeyboardHandler.keyMap.find(function (a) { return a.k === keyCode; });
        if (mappedAction) {
            KeyboardHandler.SetActionState(mappedAction === null || mappedAction === void 0 ? void 0 : mappedAction.v, true);
            e.preventDefault();
        }
        else {
            // console.log(keyCode);
            // e.preventDefault();
        }
    };
    KeyboardHandler.OnKeyUp = function (e) {
        var keyCode = e.code;
        var mappedAction = KeyboardHandler.keyMap.find(function (a) { return a.k === keyCode; });
        if (mappedAction) {
            KeyboardHandler.SetActionState(mappedAction === null || mappedAction === void 0 ? void 0 : mappedAction.v, false);
            KeyboardHandler.recentlyReleasedKeys.push(mappedAction === null || mappedAction === void 0 ? void 0 : mappedAction.v);
        }
    };
    KeyboardHandler.GetStateAsByte = function () {
        var byte = 0;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
            byte += 1;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
            byte += 2;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false))
            byte += 4;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
            byte += 8;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, false))
            byte += 16;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, false))
            byte += 32;
        return byte;
    };
    KeyboardHandler.SetStateFromByte = function (byte) {
        KeyboardHandler.SetActionState(KeyAction.Left, !!(byte & 1));
        KeyboardHandler.SetActionState(KeyAction.Right, !!(byte & 2));
        KeyboardHandler.SetActionState(KeyAction.Up, !!(byte & 4));
        KeyboardHandler.SetActionState(KeyAction.Down, !!(byte & 8));
        KeyboardHandler.SetActionState(KeyAction.Action1, !!(byte & 16));
        KeyboardHandler.SetActionState(KeyAction.Action2, !!(byte & 32));
    };
    KeyboardHandler.SetActionState = function (action, isPressed) {
        var state = KeyboardHandler.keyState.find(function (a) { return a.keyAction === action; });
        if (state) {
            if (isPressed && !state.isPressed)
                state.pressedDuration = 0;
            state.isPressed = isPressed;
        }
        else {
            KeyboardHandler.keyState.push({
                keyAction: action,
                isPressed: isPressed,
                pressedDuration: 0
            });
        }
    };
    KeyboardHandler.Update = function () {
        this.UpdateGamepad();
        for (var _i = 0, _a = KeyboardHandler.keyState; _i < _a.length; _i++) {
            var keystate = _a[_i];
            if (keystate.isPressed) {
                keystate.pressedDuration += 1;
            }
        }
    };
    KeyboardHandler.AfterUpdate = function () {
        KeyboardHandler.recentlyReleasedKeys = [];
    };
    KeyboardHandler.GetKeyState = function (keyAction) {
        var keyState = KeyboardHandler.keyState.find(function (a) { return a.keyAction === keyAction; });
        return keyState;
    };
    KeyboardHandler.IsKeyPressed = function (keyAction, initialOnly) {
        var state = KeyboardHandler.GetKeyState(keyAction);
        if (state) {
            if (state.isPressed) {
                if (initialOnly)
                    return state.pressedDuration <= 1;
                else
                    return true;
            }
        }
        return false;
    };
    KeyboardHandler.IsKeyReleased = function (keyAction) {
        return KeyboardHandler.recentlyReleasedKeys.indexOf(keyAction) > -1;
    };
    KeyboardHandler.UpdateGamepad = function () {
        for (var i = 0; i < navigator.getGamepads().length; i++) {
            var gp = navigator.getGamepads()[i];
            if (!gp)
                continue;
            if (gp.axes.some(function (a) { return Math.abs(a) > 0.1; }) || gp.buttons.some(function (a) { return a.pressed; })) {
                KeyboardHandler.gamepadIndex = i;
            }
        }
        if (KeyboardHandler.gamepadIndex === -1)
            return;
        var dx = 0;
        var dy = 0;
        var gamepad = navigator.getGamepads()[KeyboardHandler.gamepadIndex];
        if (!gamepad)
            return;
        if (gamepad && gamepad.axes) {
            if (gamepad.axes) {
                if (gamepad.axes[0])
                    dx += gamepad.axes[0];
                if (gamepad.axes[1])
                    dy += gamepad.axes[1];
                if (gamepad.axes[2])
                    dx += gamepad.axes[2];
                if (gamepad.axes[3])
                    dy += gamepad.axes[3];
            }
            if (gamepad.buttons) {
                KeyboardHandler.SetActionState(KeyAction.Action1, gamepad.buttons[0].pressed);
                KeyboardHandler.SetActionState(KeyAction.Action2, gamepad.buttons[2].pressed);
                if (editorHandler.isEditorAllowed) {
                    KeyboardHandler.SetActionState(KeyAction.EditToggle, gamepad.buttons[8].pressed);
                }
                else {
                    KeyboardHandler.SetActionState(KeyAction.Reset, gamepad.buttons[8].pressed);
                }
                KeyboardHandler.SetActionState(KeyAction.Pause, gamepad.buttons[9].pressed);
            }
        }
        // dead zone
        if (Math.abs(dx) < 0.05)
            dx = 0;
        if (Math.abs(dy) < 0.05)
            dy = 0;
        if (dx < 0)
            KeyboardHandler.SetActionState(KeyAction.Left, true);
        if (dx > 0)
            KeyboardHandler.SetActionState(KeyAction.Right, true);
        if (dx <= 0)
            KeyboardHandler.SetActionState(KeyAction.Right, false);
        if (dx >= 0)
            KeyboardHandler.SetActionState(KeyAction.Left, false);
        if (dy < 0)
            KeyboardHandler.SetActionState(KeyAction.Up, true);
        if (dy > 0)
            KeyboardHandler.SetActionState(KeyAction.Down, true);
        if (dy <= 0)
            KeyboardHandler.SetActionState(KeyAction.Down, false);
        if (dy >= 0)
            KeyboardHandler.SetActionState(KeyAction.Up, false);
    };
    KeyboardHandler.keyMap = [
        { k: "KeyW", v: KeyAction.Up },
        { k: "ArrowUp", v: KeyAction.Up },
        { k: "KeyA", v: KeyAction.Left },
        { k: "ArrowLeft", v: KeyAction.Left },
        { k: "KeyD", v: KeyAction.Right },
        { k: "ArrowRight", v: KeyAction.Right },
        { k: "KeyS", v: KeyAction.Down },
        { k: "ArrowDown", v: KeyAction.Down },
        { k: "Space", v: KeyAction.Action1 },
        { k: "ShiftRight", v: KeyAction.Action2 },
        { k: "ShiftLeft", v: KeyAction.Action2 },
        { k: "Esc", v: KeyAction.Pause },
        { k: "Escape", v: KeyAction.Pause },
        { k: "KeyP", v: KeyAction.Pause },
        { k: "KeyR", v: KeyAction.EditorPlayerHotkey },
        { k: "Esc", v: KeyAction.Cancel },
        { k: "Escape", v: KeyAction.Cancel },
        { k: "KeyQ", v: KeyAction.Cancel },
        { k: "Backslash", v: KeyAction.Debug1 },
        { k: "Enter", v: KeyAction.Debug2 },
        { k: "Backspace", v: KeyAction.Debug3 },
        { k: "F11", v: KeyAction.Fullscreen },
        { k: "Tab", v: KeyAction.EditToggle },
        { k: "KeyX", v: KeyAction.EditorMinimize },
        { k: "KeyE", v: KeyAction.EditorEraseHotkey },
        { k: "KeyZ", v: KeyAction.EditorUndo },
        { k: "KeyY", v: KeyAction.EditorRedo },
        { k: "Delete", v: KeyAction.EditorDelete },
        { k: "ControlLeft", v: KeyAction.EditorPasteDrag },
        { k: "ControlRight", v: KeyAction.EditorPasteDrag },
        { k: "Digit1", v: KeyAction.EditorHotkey1 },
        { k: "Numpad1", v: KeyAction.EditorHotkey1 },
        { k: "Digit2", v: KeyAction.EditorHotkey2 },
        { k: "Numpad2", v: KeyAction.EditorHotkey2 },
        { k: "Digit3", v: KeyAction.EditorHotkey3 },
        { k: "Numpad3", v: KeyAction.EditorHotkey3 },
        { k: "Digit4", v: KeyAction.EditorHotkey4 },
        { k: "Numpad4", v: KeyAction.EditorHotkey4 },
        { k: "Digit5", v: KeyAction.EditorHotkey5 },
        { k: "Numpad5", v: KeyAction.EditorHotkey5 },
        { k: "Digit6", v: KeyAction.EditorHotkey6 },
        { k: "Numpad6", v: KeyAction.EditorHotkey6 },
        { k: "Digit7", v: KeyAction.EditorHotkey7 },
        { k: "Numpad7", v: KeyAction.EditorHotkey7 },
        { k: "Digit8", v: KeyAction.EditorHotkey8 },
        { k: "Numpad8", v: KeyAction.EditorHotkey8 },
        { k: "Digit9", v: KeyAction.EditorHotkey9 },
        { k: "Numpad9", v: KeyAction.EditorHotkey9 },
    ];
    KeyboardHandler.keyState = [];
    KeyboardHandler.recentlyReleasedKeys = [];
    KeyboardHandler.gamepadIndex = -1; //current active in-use
    return KeyboardHandler;
}());
;
