

class KeyAction {
    constructor(public keyCode: string) { }

    static Up = new KeyAction("up");
    static Left = new KeyAction("left");
    static Right = new KeyAction("right");
    static Down = new KeyAction("down");
    static Action1 = new KeyAction("action1");
    static Action2 = new KeyAction("action2");

    static Debug1 = new KeyAction("debug1");
    static Debug2 = new KeyAction("debug2");
    static Debug3 = new KeyAction("debug3");

    static Fullscreen = new KeyAction("fullscreen");
    static Reset = new KeyAction("reset");
    static EditToggle = new KeyAction("editToggle");
    static EditorRotateHotkey = new KeyAction("EditorRotateHotkey");
    static EditorMinimize = new KeyAction("editorMinimize");
    static EditorPlayerHotkey = new KeyAction("EditorPlayerHotkey");
    static EditorEraseHotkey = new KeyAction("editorEraseHotkey");
    static EditorUndo = new KeyAction("EditorUndo");
    static EditorRedo = new KeyAction("EditorRedo");
    static EditorDelete = new KeyAction("EditorDelete");
    static EditorSelectWithoutClosingDrawers = new KeyAction("EditorSelectWithoutClosingDrawers");
    static EditorPasteDrag = new KeyAction("EditorPasteDrag");
    static Cancel = new KeyAction("Cancel");
    static Confirm = new KeyAction("Confirm");
    static Pause = new KeyAction("Pause");
    static ScrollDown = new KeyAction("ScrollDown");
    static ScrollUp = new KeyAction("ScrollUp");

    static EditorHotkey1 = new KeyAction("EditorHotkey1");
    static EditorHotkey2 = new KeyAction("EditorHotkey2");
    static EditorHotkey3 = new KeyAction("EditorHotkey3");
    static EditorHotkey4 = new KeyAction("EditorHotkey4");
    static EditorHotkey5 = new KeyAction("EditorHotkey5");
    static EditorHotkey6 = new KeyAction("EditorHotkey6");
    static EditorHotkey7 = new KeyAction("EditorHotkey7");
    static EditorHotkey8 = new KeyAction("EditorHotkey8");
    static EditorHotkey9 = new KeyAction("EditorHotkey9");

    static Hotkey(hotkeyNumber: number): KeyAction {
        if (hotkeyNumber == 1) return KeyAction.EditorHotkey1;
        if (hotkeyNumber == 2) return KeyAction.EditorHotkey2;
        if (hotkeyNumber == 3) return KeyAction.EditorHotkey3;
        if (hotkeyNumber == 4) return KeyAction.EditorHotkey4;
        if (hotkeyNumber == 5) return KeyAction.EditorHotkey5;
        if (hotkeyNumber == 6) return KeyAction.EditorHotkey6;
        if (hotkeyNumber == 7) return KeyAction.EditorHotkey7;
        if (hotkeyNumber == 8) return KeyAction.EditorHotkey8;
        if (hotkeyNumber == 9) return KeyAction.EditorHotkey9;
        return KeyAction.EditorHotkey1;
    }
}

class KeyboardHandler {
    public static InitKeyHandlers() {
        document.addEventListener("keydown", KeyboardHandler.OnKeyDown, false);
        document.addEventListener("keyup", KeyboardHandler.OnKeyUp, false);
        KeyboardHandler.defaultKeyMap = [...KeyboardHandler.keyMap];
        StorageService.LoadKeyboardMappings();
    }

    public static defaultKeyMap: { k: string, v: KeyAction }[] = [];

    public static keyMap = [
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

    private static keyState: KeyState[] = [];
    private static recentlyReleasedKeys: KeyAction[] = [];
    public static connectedInput: HTMLInputElement | null = null;
    public static lastPressedKeyCode: string = "";

    public static GetNonDefaultMappings(): { k: string, v: KeyAction }[] {
        return KeyboardHandler.keyMap.filter(a => !KeyboardHandler.defaultKeyMap.some(b => a.k == b.k && a.v == b.v))
    }
    public static GetRemovedDefaultMappings(): { k: string, v: KeyAction }[] {
        return KeyboardHandler.defaultKeyMap.filter(a => !KeyboardHandler.keyMap.some(b => a.k == b.k && a.v == b.v))
    }

    public static OnKeyDown(e: KeyboardEvent) {
        KeyboardHandler.gamepadIndex = -1;
        let keyCode = e.code;
        KeyboardHandler.lastPressedKeyCode = keyCode;
        let mappedActions = KeyboardHandler.keyMap.filter(a => a.k === keyCode);
        if (mappedActions.length) {
            for (let mappedAction of mappedActions) {
                KeyboardHandler.SetActionState(mappedAction?.v, true);
            }
            if (document.activeElement == document.body) e.preventDefault();
        } else {
            // e.preventDefault();
        }

        if (KeyboardHandler.connectedInput) {
            if (e.key == "Backspace") {
                KeyboardHandler.connectedInput.value = KeyboardHandler.connectedInput.value.substring(0, KeyboardHandler.connectedInput.value.length - 1);
            }

            if (e.key.toLowerCase() == "v" && e.ctrlKey) {
                // paste event
                navigator.clipboard.readText()
                    .then(text => {
                        if (KeyboardHandler.connectedInput) KeyboardHandler.connectedInput.value += text;
                    })
                    .catch(err => {
                        console.error('Failed to read clipboard contents: ', err);
                    });
            } else if (e.key.length == 1) {
                KeyboardHandler.connectedInput.value += e.key;
            }
        }
    }

    public static OnKeyUp(e: KeyboardEvent) {
        let keyCode = e.code;
        let mappedActions = KeyboardHandler.keyMap.filter(a => a.k === keyCode);
        for (let mappedAction of mappedActions) {
            KeyboardHandler.SetActionState(mappedAction?.v, false);
            KeyboardHandler.recentlyReleasedKeys.push(mappedAction?.v);
        }
    }

    public static GetStateAsByte(): number {
        let byte = 0;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) byte += 1;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) byte += 2;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) byte += 4;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) byte += 8;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, false)) byte += 16;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) byte += 32;
        return byte;
    }

    public static SetStateFromByte(byte: number) {
        KeyboardHandler.SetActionState(KeyAction.Left, !!(byte & 1));
        KeyboardHandler.SetActionState(KeyAction.Right, !!(byte & 2));
        KeyboardHandler.SetActionState(KeyAction.Up, !!(byte & 4));
        KeyboardHandler.SetActionState(KeyAction.Down, !!(byte & 8));
        KeyboardHandler.SetActionState(KeyAction.Action1, !!(byte & 16));
        KeyboardHandler.SetActionState(KeyAction.Action2, !!(byte & 32));
    }

    private static SetActionState(action: KeyAction, isPressed: boolean): void {
        let state = KeyboardHandler.keyState.find(a => a.keyAction === action);
        if (state) {
            if (isPressed && !state.isPressed) state.pressedDuration = 0;
            state.isPressed = isPressed;
        } else {
            KeyboardHandler.keyState.push({
                keyAction: action,
                isPressed: isPressed,
                pressedDuration: 0
            });
        }
    }

    public static Update() {
        this.UpdateGamepad();
        for (let keystate of KeyboardHandler.keyState) {
            if (keystate.isPressed) {
                keystate.pressedDuration += 1;
            }
        }
    }

    public static AfterUpdate() {
        KeyboardHandler.recentlyReleasedKeys = [];
    }

    public static GetKeyState(keyAction: KeyAction) {
        let keyState = KeyboardHandler.keyState.find(a => a.keyAction === keyAction);
        return keyState;
    }

    public static IsKeyPressed(keyAction: KeyAction, initialOnly: boolean) {
        let state = KeyboardHandler.GetKeyState(keyAction);
        if (state) {
            if (state.isPressed) {
                if (initialOnly) return state.pressedDuration <= 1;
                else return true;
            }
        }
        return false;
    }

    public static IsKeyReleased(keyAction: KeyAction) {
        return KeyboardHandler.recentlyReleasedKeys.indexOf(keyAction) > -1;
    }

    static gamepadIndex: number = -1; //current active in-use

    static gamepadMap = {
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
    static initializedAxisIndeces: number[] = []; 

    private static UpdateGamepad() {
        for (let i = 0; i < navigator.getGamepads().length; i++) {
            let gp = navigator.getGamepads()[i];
            if (!gp) continue;
            if (gp.axes.some(a => Math.abs(a) > 0.1) || gp.buttons.some(a => a.pressed)) {
                KeyboardHandler.gamepadIndex = i;
                document.body.style.cursor = "none";
            }
        }
        if (KeyboardHandler.gamepadIndex === -1) return;

        let gamepad = navigator.getGamepads()[KeyboardHandler.gamepadIndex];
        if (!gamepad) return;

        let pressedGamepadButtons: string[] = [];
        let deadZone = 0.3;
        if (gamepad.axes) {
            for (let i = 0; i < gamepad.axes.length; i++) {
                let axisValue = gamepad.axes[i];
                if (Math.abs(axisValue) > deadZone) {
                    if (KeyboardHandler.initializedAxisIndeces.indexOf(i) == -1) {
                        continue;
                    }
                    let posNeg = axisValue > 0 ? "+" : "-";
                    pressedGamepadButtons.push("GpAxis" + i + posNeg);
                } else {
                    if (KeyboardHandler.initializedAxisIndeces.indexOf(i) == -1) {
                        KeyboardHandler.initializedAxisIndeces.push(i);
                    }
                }
            }
        }
        if (gamepad.buttons) {
            for (let i = 0; i < gamepad.buttons.length; i++) {
                let button = gamepad.buttons[i];
                if (button.pressed) pressedGamepadButtons.push("GpButton" + i);
            }
        }

        let keyActions: KeyAction[] = Object.keys(KeyAction).filter(a => (<any>KeyAction)[a].keyCode).map(a => (<any>KeyAction)[a]);

        for (let keyAction of keyActions) {
            let mappedGamepadButtons = KeyboardHandler.keyMap.filter(a => a.v == keyAction).map(a => a.k);
            let isPressed = mappedGamepadButtons.some(a => pressedGamepadButtons.indexOf(a) > -1);
            KeyboardHandler.SetActionState(keyAction, isPressed);
        }

        if (pressedGamepadButtons.length) {
            KeyboardHandler.lastPressedKeyCode = pressedGamepadButtons[0];
        }
    }
}

interface KeyState {
    keyAction: KeyAction,
    isPressed: boolean,
    pressedDuration: number
};