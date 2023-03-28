"use strict";
var InputDisplay = /** @class */ (function () {
    function InputDisplay() {
    }
    InputDisplay.prototype.Draw = function (ctx) {
        if (!StorageService.GetPreferenceBool("on-screen-input", false))
            return;
        if (editorHandler.isInEditMode)
            return;
        var actions = [
            { a: KeyAction.Left, x: 20, y: 540 },
            { a: KeyAction.Right, x: 60, y: 540 },
            { a: KeyAction.Up, x: 40, y: 520 },
            { a: KeyAction.Down, x: 40, y: 560 },
            { a: KeyAction.Action2, x: 115, y: 550 },
            { a: KeyAction.Action1, x: 140, y: 560 },
        ];
        actions.forEach(function (a) { return a.x -= 4; });
        for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var action = actions_1[_i];
            ctx.fillStyle = "#0005";
            ctx.beginPath();
            ctx.arc(action.x, action.y, 13, -Math.PI / 2, 2 * Math.PI, false);
            ctx.fill();
            var state = KeyboardHandler.GetKeyState(action.a);
            if (state == undefined)
                continue;
            if (!state.isPressed)
                continue;
            var opacitySuffix = "5";
            if (state.pressedDuration < 10) {
                opacitySuffix = "FEDCBA987654321"[state.pressedDuration];
            }
            ctx.fillStyle = "#FFF" + opacitySuffix;
            ctx.beginPath();
            ctx.arc(action.x, action.y, 11, -Math.PI / 2, 2 * Math.PI, false);
            ctx.fill();
        }
    };
    return InputDisplay;
}());
