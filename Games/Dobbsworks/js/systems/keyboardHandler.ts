

class KeyAction {
    constructor(public keyCode: string) {}

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
    static EditorMinimize = new KeyAction("editorMinimize");
    static EditorPlayerHotkey = new KeyAction("EditorPlayerHotkey");
    static EditorEraseHotkey = new KeyAction("editorEraseHotkey");
    static EditorUndo = new KeyAction("EditorUndo");
    static EditorRedo = new KeyAction("EditorRedo");
    static EditorDelete = new KeyAction("EditorDelete");
    static EditorSelectWithoutClosingDrawers = new KeyAction("EditorSelectWithoutClosingDrawers");
    static EditorPasteDrag = new KeyAction("EditorPasteDrag");
    static Cancel = new KeyAction("Cancel");
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
    }

    private static keyMap = [
        {k: "KeyW", v: KeyAction.Up},
        {k: "ArrowUp", v: KeyAction.Up},
        {k: "KeyA", v: KeyAction.Left},
        {k: "ArrowLeft", v: KeyAction.Left},
        {k: "KeyD", v: KeyAction.Right},
        {k: "ArrowRight", v: KeyAction.Right},
        {k: "KeyS", v: KeyAction.Down},
        {k: "ArrowDown", v: KeyAction.Down},
        {k: "Space", v: KeyAction.Action1},
        {k: "ShiftRight", v: KeyAction.Action2},
        {k: "ShiftLeft", v: KeyAction.Action2},

        {k: "Esc", v: KeyAction.Pause},
        {k: "Escape", v: KeyAction.Pause},
        {k: "KeyP", v: KeyAction.Pause},
        {k: "KeyF", v: KeyAction.EditorPlayerHotkey},

        {k: "Esc", v: KeyAction.Cancel},
        {k: "Escape", v: KeyAction.Cancel},
        {k: "KeyQ", v: KeyAction.Cancel},
        {k: "Backslash", v: KeyAction.Debug1},
        {k: "Enter", v: KeyAction.Debug2},
        //{k: "Backspace", v: KeyAction.Debug3},
        
        {k: "F11", v: KeyAction.Fullscreen},
        {k: "Tab", v: KeyAction.EditToggle},
        {k: "KeyX", v: KeyAction.EditorMinimize},
        {k: "KeyE", v: KeyAction.EditorEraseHotkey},
        {k: "KeyZ", v: KeyAction.EditorUndo},
        {k: "KeyY", v: KeyAction.EditorRedo},
        {k: "KeyT", v: KeyAction.Reset},
        {k: "Delete", v: KeyAction.EditorDelete},
        {k: "ControlLeft", v: KeyAction.EditorPasteDrag},
        {k: "ControlRight", v: KeyAction.EditorPasteDrag},
        {k: "ShiftRight", v: KeyAction.EditorSelectWithoutClosingDrawers},
        {k: "ShiftLeft", v: KeyAction.EditorSelectWithoutClosingDrawers},

        {k: "Period", v: KeyAction.ScrollDown},
        {k: "Comma", v: KeyAction.ScrollUp},

        {k: "Digit1", v: KeyAction.EditorHotkey1},
        {k: "Numpad1", v: KeyAction.EditorHotkey1},
        {k: "Digit2", v: KeyAction.EditorHotkey2},
        {k: "Numpad2", v: KeyAction.EditorHotkey2},
        {k: "Digit3", v: KeyAction.EditorHotkey3},
        {k: "Numpad3", v: KeyAction.EditorHotkey3},
        {k: "Digit4", v: KeyAction.EditorHotkey4},
        {k: "Numpad4", v: KeyAction.EditorHotkey4},
        {k: "Digit5", v: KeyAction.EditorHotkey5},
        {k: "Numpad5", v: KeyAction.EditorHotkey5},
        {k: "Digit6", v: KeyAction.EditorHotkey6},
        {k: "Numpad6", v: KeyAction.EditorHotkey6},
        {k: "Digit7", v: KeyAction.EditorHotkey7},
        {k: "Numpad7", v: KeyAction.EditorHotkey7},
        {k: "Digit8", v: KeyAction.EditorHotkey8},
        {k: "Numpad8", v: KeyAction.EditorHotkey8},
        {k: "Digit9", v: KeyAction.EditorHotkey9},
        {k: "Numpad9", v: KeyAction.EditorHotkey9},
    ];

    private static keyState: KeyState[] = [];
    private static recentlyReleasedKeys: KeyAction[] = [];

    public static OnKeyDown(e: KeyboardEvent) {
        KeyboardHandler.gamepadIndex = -1;
        let keyCode = e.code;
        let mappedActions = KeyboardHandler.keyMap.filter(a => a.k === keyCode);
        if (mappedActions.length) {
            for (let mappedAction of mappedActions) {
                KeyboardHandler.SetActionState(mappedAction?.v, true);
            }
            if (document.activeElement == document.body) e.preventDefault();
        } else {
            // console.log(keyCode);
            // e.preventDefault();
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

    private static GetKeyState(keyAction: KeyAction) {
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

        let dx = 0;
        let dy = 0;
        let gamepad = navigator.getGamepads()[KeyboardHandler.gamepadIndex];
        if (!gamepad) return;
        if (gamepad && gamepad.axes) {
            if (gamepad.axes) {
                if (gamepad.axes[0]) dx += gamepad.axes[0];
                if (gamepad.axes[1]) dy += gamepad.axes[1];
                if (gamepad.axes[2]) dx += gamepad.axes[2];
                if (gamepad.axes[3]) dy += gamepad.axes[3];
            }
            if (gamepad.buttons) {
                KeyboardHandler.SetActionState(KeyAction.Action1, gamepad.buttons[0].pressed);
                KeyboardHandler.SetActionState(KeyAction.Action2, gamepad.buttons[2].pressed);
                if (editorHandler.isEditorAllowed) {
                    KeyboardHandler.SetActionState(KeyAction.EditToggle, gamepad.buttons[8].pressed);
                } else {
                    KeyboardHandler.SetActionState(KeyAction.Reset, gamepad.buttons[8].pressed);
                }
                KeyboardHandler.SetActionState(KeyAction.Pause, gamepad.buttons[9].pressed);
                
                if (gamepad.buttons[12].pressed) dy = -1;
                if (gamepad.buttons[13].pressed) dy = 1;
                if (gamepad.buttons[14].pressed) dx = -1;
                if (gamepad.buttons[15].pressed) dx = 1;
            }
        }

        // dead zone
        if (Math.abs(dx) < 0.30) dx = 0;
        if (Math.abs(dy) < 0.30) dy = 0;

        if (dx < 0) KeyboardHandler.SetActionState(KeyAction.Left, true);
        if (dx > 0) KeyboardHandler.SetActionState(KeyAction.Right, true);
        if (dx <= 0) KeyboardHandler.SetActionState(KeyAction.Right, false);
        if (dx >= 0) KeyboardHandler.SetActionState(KeyAction.Left, false);

        if (dy < 0) KeyboardHandler.SetActionState(KeyAction.Up, true);
        if (dy > 0) KeyboardHandler.SetActionState(KeyAction.Down, true);
        if (dy <= 0) KeyboardHandler.SetActionState(KeyAction.Down, false);
        if (dy >= 0) KeyboardHandler.SetActionState(KeyAction.Up, false);
    }
}

interface KeyState {
    keyAction: KeyAction,
    isPressed: boolean,
    pressedDuration: number
};