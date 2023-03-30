class InputDisplay {
    Draw(ctx: CanvasRenderingContext2D): void {
        if (!StorageService.GetPreferenceBool("on-screen-input", false)) return;
        if (editorHandler.isInEditMode) return;

        let actions = [
            {a: KeyAction.Left, x: 20, y: 540},
            {a: KeyAction.Right, x: 60, y: 540},
            {a: KeyAction.Up, x: 40, y: 520},
            {a: KeyAction.Down, x: 40, y: 560},
            {a: KeyAction.Action2, x: 115, y: 550},
            {a: KeyAction.Action1, x: 140, y: 560},
        ];
        actions.forEach(a => a.x -= 4);
        
        for (let action of actions) {

            ctx.fillStyle = "#0005";
            ctx.beginPath();
            ctx.arc(action.x, action.y, 13, -Math.PI / 2, 2 * Math.PI, false);
            ctx.fill();

            let state = KeyboardHandler.GetKeyState(action.a);
            if (state == undefined) continue;

            if (!state.isPressed) continue;
            
            let opacitySuffix = "5";
            if (state.pressedDuration < 10) {
                opacitySuffix = "FEDCBA987654321"[state.pressedDuration];
            }
            ctx.fillStyle = "#FFF" + opacitySuffix;
            ctx.beginPath();
            ctx.arc(action.x, action.y, 11, -Math.PI / 2, 2 * Math.PI, false);
            ctx.fill();
        }
    }
}