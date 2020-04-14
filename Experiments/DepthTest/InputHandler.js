var InputKey = (function () {
    function InputKey(name, keyCode) {
        this.name = name;
        this.keyCode = keyCode;
        this.pressed = false;
        this.changed = false;
    }
    return InputKey;
}());
var InputHandler = (function () {
    function InputHandler(parentElement) {
        var _this = this;
        this.parentElement = parentElement;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseOver = false;
        this.Jump = new InputKey("Spacebar", 32);
        this.Up = new InputKey("Q", 81);
        this.Down = new InputKey("Z", 90);
        this.Left = new InputKey("A", 65);
        this.Right = new InputKey("D", 68);
        this.Forwards = new InputKey("W", 87);
        this.Backwards = new InputKey("S", 83);
        this.DebugOption = new InputKey("P", 80);
        this.LeftMouse = new InputKey("Left Mouse", 0);
        this.MiddleMouse = new InputKey("Middle Mouse", 1);
        this.RightMouse = new InputKey("Right Mouse", 2);
        this.WheelUp = new InputKey("Wheel Up", 1);
        this.WheelDown = new InputKey("Wheel Down", -1);
        this.keys = [this.Jump, this.Left, this.Right, this.Forwards, this.Backwards, this.Up, this.Down, this.DebugOption];
        this.mouseButtons = [this.LeftMouse, this.RightMouse, this.MiddleMouse];
        this.mouseWheels = [this.WheelUp, this.WheelDown];
        document.onkeydown = function (e) {
            _this.handleKeyDown(e.keyCode);
        };
        document.onkeyup = function (e) {
            _this.handleKeyUp(e.keyCode);
        };
        parentElement.oncontextmenu = function (e) { e.preventDefault(); };
        parentElement.onmouseover = function (e) {
            _this.mouseOver = true;
        };
        parentElement.onmouseout = function (e) {
            _this.mouseOver = false;
        };
        parentElement.onmousemove = function (e) {
            var location = _this.canvasXYFromEvent(e);
            _this.mouseX = location.x;
            _this.mouseY = location.y;
        };
        parentElement.onmousedown = function (e) {
            for (var _i = 0, _a = _this.mouseButtons; _i < _a.length; _i++) {
                var mouseButton = _a[_i];
                if (mouseButton.keyCode === e.button) {
                    mouseButton.changed = !mouseButton.pressed;
                    mouseButton.pressed = true;
                }
            }
        };
        parentElement.onmouseup = function (e) {
            for (var _i = 0, _a = _this.mouseButtons; _i < _a.length; _i++) {
                var mouseButton = _a[_i];
                if (mouseButton.keyCode === e.button) {
                    mouseButton.changed = mouseButton.pressed;
                    mouseButton.pressed = false;
                }
            }
        };
        parentElement.onmousewheel = function (e) {
            for (var _i = 0, _a = _this.mouseWheels; _i < _a.length; _i++) {
                var mouseWheel = _a[_i];
                var delta = e.wheelDelta > 0 ? 1 : (e.wheelDelta < 0 ? -1 : 0);
                if (delta == mouseWheel.keyCode) {
                    mouseWheel.changed = mouseWheel.pressed;
                    mouseWheel.pressed = true;
                }
            }
        };
    }
    InputHandler.prototype.canvasXYFromEvent = function (e) {
        var x = e.pageX;
        var y = e.pageY;
        for (var node = this.parentElement; node != null; node = node.offsetParent) {
            if (node.offsetLeft)
                x -= node.offsetLeft;
            if (node.offsetTop)
                y -= node.offsetTop;
        }
        return { x: x, y: y };
    };
    InputHandler.prototype.handleKeyDown = function (keyCode) {
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.keyCode === keyCode) {
                key.changed = !key.pressed;
                key.pressed = true;
            }
        }
        if (!this.keys.some(function (x) { return x.keyCode == keyCode; }))
            console.log(keyCode);
    };
    InputHandler.prototype.handleKeyUp = function (keyCode) {
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.keyCode === keyCode)
                key.pressed = false;
        }
    };
    InputHandler.prototype.update = function () {
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            key.changed = false;
        }
        for (var _b = 0, _c = this.mouseButtons; _b < _c.length; _b++) {
            var key = _c[_b];
            key.changed = false;
        }
        for (var _d = 0, _e = this.mouseWheels; _d < _e.length; _d++) {
            var key = _e[_d];
            key.changed = false;
        }
        for (var _f = 0, _g = this.mouseWheels; _f < _g.length; _f++) {
            var key = _g[_f];
            key.pressed = false;
        }
    };
    return InputHandler;
}());
//# sourceMappingURL=InputHandler.js.map