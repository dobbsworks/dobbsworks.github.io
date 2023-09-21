"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
    KeyAction.EditorRotateHotkey = new KeyAction("EditorRotateHotkey");
    KeyAction.EditorMinimize = new KeyAction("editorMinimize");
    KeyAction.EditorPlayerHotkey = new KeyAction("EditorPlayerHotkey");
    KeyAction.EditorEraseHotkey = new KeyAction("editorEraseHotkey");
    KeyAction.EditorUndo = new KeyAction("EditorUndo");
    KeyAction.EditorRedo = new KeyAction("EditorRedo");
    KeyAction.EditorDelete = new KeyAction("EditorDelete");
    KeyAction.EditorSelectWithoutClosingDrawers = new KeyAction("EditorSelectWithoutClosingDrawers");
    KeyAction.EditorPasteDrag = new KeyAction("EditorPasteDrag");
    KeyAction.Cancel = new KeyAction("Cancel");
    KeyAction.Confirm = new KeyAction("Confirm");
    KeyAction.Pause = new KeyAction("Pause");
    KeyAction.ScrollDown = new KeyAction("ScrollDown");
    KeyAction.ScrollUp = new KeyAction("ScrollUp");
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
        KeyboardHandler.defaultKeyMap = __spreadArrays(KeyboardHandler.keyMap);
        StorageService.LoadKeyboardMappings();
    };
    KeyboardHandler.GetNonDefaultMappings = function () {
        return KeyboardHandler.keyMap.filter(function (a) { return !KeyboardHandler.defaultKeyMap.some(function (b) { return a.k == b.k && a.v == b.v; }); });
    };
    KeyboardHandler.GetRemovedDefaultMappings = function () {
        return KeyboardHandler.defaultKeyMap.filter(function (a) { return !KeyboardHandler.keyMap.some(function (b) { return a.k == b.k && a.v == b.v; }); });
    };
    KeyboardHandler.OnKeyDown = function (e) {
        KeyboardHandler.gamepadIndex = -1;
        var keyCode = e.code;
        KeyboardHandler.lastPressedKeyCode = keyCode;
        var mappedActions = KeyboardHandler.keyMap.filter(function (a) { return a.k === keyCode; });
        if (mappedActions.length) {
            for (var _i = 0, mappedActions_1 = mappedActions; _i < mappedActions_1.length; _i++) {
                var mappedAction = mappedActions_1[_i];
                KeyboardHandler.SetActionState(mappedAction === null || mappedAction === void 0 ? void 0 : mappedAction.v, true);
            }
            if (document.activeElement == document.body)
                e.preventDefault();
        }
        else {
            // console.log(keyCode);
            // e.preventDefault();
        }
        if (KeyboardHandler.connectedInput) {
            if (e.key == "Backspace") {
                KeyboardHandler.connectedInput.value = KeyboardHandler.connectedInput.value.substring(0, KeyboardHandler.connectedInput.value.length - 1);
            }
            if (e.key.toLowerCase() == "v" && e.ctrlKey) {
                // paste event
                navigator.clipboard.readText()
                    .then(function (text) {
                    if (KeyboardHandler.connectedInput)
                        KeyboardHandler.connectedInput.value += text;
                })
                    .catch(function (err) {
                    console.error('Failed to read clipboard contents: ', err);
                });
            }
            else if (e.key.length == 1) {
                KeyboardHandler.connectedInput.value += e.key;
            }
        }
    };
    KeyboardHandler.OnKeyUp = function (e) {
        var keyCode = e.code;
        var mappedActions = KeyboardHandler.keyMap.filter(function (a) { return a.k === keyCode; });
        for (var _i = 0, mappedActions_2 = mappedActions; _i < mappedActions_2.length; _i++) {
            var mappedAction = mappedActions_2[_i];
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
                document.body.style.cursor = "none";
            }
        }
        if (KeyboardHandler.gamepadIndex === -1)
            return;
        var gamepad = navigator.getGamepads()[KeyboardHandler.gamepadIndex];
        if (!gamepad)
            return;
        var pressedGamepadButtons = [];
        var deadZone = 0.3;
        if (gamepad.axes) {
            for (var i = 0; i < gamepad.axes.length; i++) {
                var axisValue = gamepad.axes[i];
                if (Math.abs(axisValue) > deadZone) {
                    if (KeyboardHandler.initializedAxisIndeces.indexOf(i) == -1) {
                        continue;
                    }
                    var posNeg = axisValue > 0 ? "+" : "-";
                    pressedGamepadButtons.push("GpAxis" + i + posNeg);
                }
                else {
                    if (KeyboardHandler.initializedAxisIndeces.indexOf(i) == -1) {
                        KeyboardHandler.initializedAxisIndeces.push(i);
                    }
                }
            }
        }
        if (gamepad.buttons) {
            for (var i = 0; i < gamepad.buttons.length; i++) {
                var button = gamepad.buttons[i];
                if (button.pressed)
                    pressedGamepadButtons.push("GpButton" + i);
            }
        }
        var keyActions = Object.keys(KeyAction).filter(function (a) { return KeyAction[a].keyCode; }).map(function (a) { return KeyAction[a]; });
        var _loop_1 = function (keyAction) {
            var mappedGamepadButtons = KeyboardHandler.keyMap.filter(function (a) { return a.v == keyAction; }).map(function (a) { return a.k; });
            var isPressed = mappedGamepadButtons.some(function (a) { return pressedGamepadButtons.indexOf(a) > -1; });
            KeyboardHandler.SetActionState(keyAction, isPressed);
        };
        for (var _i = 0, keyActions_1 = keyActions; _i < keyActions_1.length; _i++) {
            var keyAction = keyActions_1[_i];
            _loop_1(keyAction);
        }
        if (pressedGamepadButtons.length) {
            KeyboardHandler.lastPressedKeyCode = pressedGamepadButtons[0];
        }
    };
    KeyboardHandler.defaultKeyMap = [];
    KeyboardHandler.keyMap = [
        { k: "KeyW", v: KeyAction.Up },
        { k: "ArrowUp", v: KeyAction.Up },
        { k: "GpAxis1-", v: KeyAction.Up },
        { k: "GpButton12", v: KeyAction.Up },
        { k: "KeyA", v: KeyAction.Left },
        { k: "ArrowLeft", v: KeyAction.Left },
        { k: "GpAxis0-", v: KeyAction.Left },
        { k: "GpButton14", v: KeyAction.Left },
        { k: "KeyD", v: KeyAction.Right },
        { k: "ArrowRight", v: KeyAction.Right },
        { k: "GpAxis0+", v: KeyAction.Right },
        { k: "GpButton15", v: KeyAction.Right },
        { k: "KeyS", v: KeyAction.Down },
        { k: "ArrowDown", v: KeyAction.Down },
        { k: "GpAxis1+", v: KeyAction.Down },
        { k: "GpButton13", v: KeyAction.Down },
        { k: "Space", v: KeyAction.Action1 },
        { k: "GpButton0", v: KeyAction.Action1 },
        { k: "ShiftRight", v: KeyAction.Action2 },
        { k: "ShiftLeft", v: KeyAction.Action2 },
        { k: "GpButton2", v: KeyAction.Action2 },
        { k: "Esc", v: KeyAction.Pause },
        { k: "Escape", v: KeyAction.Pause },
        { k: "KeyP", v: KeyAction.Pause },
        { k: "GpButton9", v: KeyAction.Pause },
        { k: "KeyF", v: KeyAction.EditorPlayerHotkey },
        { k: "Esc", v: KeyAction.Cancel },
        { k: "Escape", v: KeyAction.Cancel },
        { k: "KeyQ", v: KeyAction.Cancel },
        { k: "Backslash", v: KeyAction.Debug1 },
        { k: "Enter", v: KeyAction.Confirm },
        { k: "Enter", v: KeyAction.Debug2 },
        //{k: "Backspace", v: KeyAction.Debug3},
        { k: "F11", v: KeyAction.Fullscreen },
        { k: "Tab", v: KeyAction.EditToggle },
        { k: "GpButton8", v: KeyAction.EditToggle },
        { k: "KeyX", v: KeyAction.EditorMinimize },
        { k: "KeyE", v: KeyAction.EditorEraseHotkey },
        { k: "KeyR", v: KeyAction.EditorRotateHotkey },
        { k: "KeyZ", v: KeyAction.EditorUndo },
        { k: "KeyY", v: KeyAction.EditorRedo },
        { k: "KeyT", v: KeyAction.Reset },
        { k: "GpButton8", v: KeyAction.Reset },
        { k: "Delete", v: KeyAction.EditorDelete },
        { k: "ControlLeft", v: KeyAction.EditorPasteDrag },
        { k: "ControlRight", v: KeyAction.EditorPasteDrag },
        { k: "ShiftRight", v: KeyAction.EditorSelectWithoutClosingDrawers },
        { k: "ShiftLeft", v: KeyAction.EditorSelectWithoutClosingDrawers },
        { k: "Period", v: KeyAction.ScrollDown },
        { k: "Comma", v: KeyAction.ScrollUp },
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
    KeyboardHandler.connectedInput = null;
    KeyboardHandler.lastPressedKeyCode = "";
    KeyboardHandler.gamepadIndex = -1; //current active in-use
    KeyboardHandler.gamepadMap = {
        "GpAxis0-": "LStick Left",
        "GpAxis0+": "LStick Right",
        "GpAxis1-": "LStick Up",
        "GpAxis1+": "LStick Down",
        "GpAxis2-": "RStick Left",
        "GpAxis2+": "RStick Right",
        "GpAxis3-": "RStick Up",
        "GpAxis3+": "RStick Down",
        "GpButton0": "Bottom Face Btn",
        "GpButton1": "Right Face Btn",
        "GpButton2": "Left Face Btn",
        "GpButton3": "Top Face Btn",
        "GpButton4": "Left Bumper",
        "GpButton5": "Right Bumper",
        "GpButton6": "Left Trigger",
        "GpButton7": "Right Trigger",
        "GpButton8": "Select",
        "GpButton9": "Start",
        "GpButton10": "LStick Push",
        "GpButton11": "RStick Push",
        "GpButton12": "DPad Up",
        "GpButton13": "DPad Down",
        "GpButton14": "DPad Left",
        "GpButton15": "DPad Right",
    };
    // which axes have entered their dead (neutral) zone
    // used to deal specifically with Duffy's weird controller
    KeyboardHandler.initializedAxisIndeces = [];
    return KeyboardHandler;
}());
;
