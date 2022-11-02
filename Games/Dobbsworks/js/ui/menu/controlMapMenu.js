"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var ControlMapMenu = /** @class */ (function (_super) {
    __extends(ControlMapMenu, _super);
    function ControlMapMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#0008";
        _this.mappableActions = [
            { name: "Left", action: KeyAction.Left },
            { name: "Right", action: KeyAction.Right },
            { name: "Up", action: KeyAction.Up },
            { name: "Down", action: KeyAction.Down },
            { name: "Jump", action: KeyAction.Action1 },
            { name: "Run/Grab", action: KeyAction.Action2 },
            { name: "Pause", action: KeyAction.Pause },
            { name: "Retry", action: KeyAction.Reset },
        ];
        return _this;
    }
    ControlMapMenu.prototype.CreateElements = function () {
        var ret = [];
        var backButton = this.CreateBackButton();
        ret.push(backButton);
        this.container = this.GetRemapContainer();
        ret.push(this.container);
        return ret;
    };
    ControlMapMenu.prototype.Refresh = function () {
        var _this = this;
        uiHandler.elements = uiHandler.elements.filter(function (a) { return a != _this.container; });
        this.elements = this.elements.filter(function (a) { return a != _this.container; });
        this.container = this.GetRemapContainer();
        this.elements.push(this.container);
        uiHandler.elements.push(this.container);
    };
    ControlMapMenu.prototype.GetRemapContainer = function () {
        var container = new Panel((camera.canvas.width - 800) / 2, camera.canvas.height / 2 - 250, 800, 500);
        container.margin = 0;
        container.layout = "vertical";
        for (var _i = 0, _a = this.mappableActions; _i < _a.length; _i++) {
            var mappableAction = _a[_i];
            container.AddChild(this.CreateControlRemapRow(mappableAction.name, mappableAction.action));
        }
        return container;
    };
    ControlMapMenu.prototype.CreateControlRemapRow = function (name, action) {
        var _this = this;
        var ret = new Panel(0, 0, 800, 60);
        ret.backColor = "#000B";
        var textHolder = new Panel(0, 0, 120, 60);
        var text = new UIText(0, 0, name, 20, "white");
        text.textAlign = "left";
        text.yOffset = 30;
        textHolder.AddChild(text);
        textHolder.AddChild(new Spacer(0, 0, 0, 0));
        ret.AddChild(textHolder);
        var resetButton = new Button(0, 0, 80, 50);
        resetButton.AddChild(new Spacer(0, 0, 0, 0));
        var resetText = new UIText(0, 0, "Reset", 16, "white");
        resetText.yOffset = 30;
        resetButton.AddChild(resetText);
        resetButton.AddChild(new Spacer(0, 0, 0, 0));
        resetButton.onClickEvents.push(function () {
            UIDialog.Confirm("Do you want to reset the action " + name + " back to its default mapping?", "Yes, reset", "Cancel", function () {
                _this.ResetMapping(action);
                StorageService.SaveKeyboardMappings();
                _this.Refresh();
            });
        });
        ret.AddChild(resetButton);
        var addButton = new Button(0, 0, 80, 50);
        addButton.AddChild(new Spacer(0, 0, 0, 0));
        var addText = new UIText(0, 0, "Add key", 16, "white");
        addText.yOffset = 30;
        addButton.AddChild(addText);
        addButton.AddChild(new Spacer(0, 0, 0, 0));
        addButton.onClickEvents.push(function () {
            UIDialog.ReadKey("Press a key on your keyboard to assign to the action \"" + name + "\"", "Assign key", "Cancel", function () {
                var key = KeyboardHandler.lastPressedKeyCode;
                if (key) {
                    if (!KeyboardHandler.keyMap.some(function (a) { return a.k == key && a.v == action; })) {
                        KeyboardHandler.keyMap.push({ k: key, v: action });
                        StorageService.SaveKeyboardMappings();
                        _this.Refresh();
                    }
                }
            });
        });
        ret.AddChild(addButton);
        var currentKeyPanel = new Panel(0, 0, 450, 50);
        ret.AddChild(currentKeyPanel);
        var existingMappings = KeyboardHandler.keyMap.filter(function (a) { return a.v == action; });
        var extraSpaces = 4 - existingMappings.length;
        var buttonWidth = 400 / Math.max(4, existingMappings.length);
        for (var i = 0; i < extraSpaces; i++)
            currentKeyPanel.AddChild(new Spacer(0, 0, buttonWidth, 40));
        for (var _i = 0, existingMappings_1 = existingMappings; _i < existingMappings_1.length; _i++) {
            var mapping = existingMappings_1[_i];
            currentKeyPanel.AddChild(this.CreateMappingPanel(name, action, mapping.k, buttonWidth));
        }
        return ret;
    };
    ControlMapMenu.prototype.ResetMapping = function (action) {
        // completely unmap this action
        KeyboardHandler.keyMap = KeyboardHandler.keyMap.filter(function (a) { return !(a.v == action); });
        // add in all defaults
        for (var _i = 0, _a = KeyboardHandler.defaultKeyMap.filter(function (a) { return (a.v == action); }); _i < _a.length; _i++) {
            var defaultMapping = _a[_i];
            KeyboardHandler.keyMap.push(__assign({}, defaultMapping));
        }
    };
    ControlMapMenu.prototype.CreateMappingPanel = function (actionName, action, keyMap, buttonWidth) {
        var _this = this;
        var ret = new Button(0, 0, buttonWidth, 40);
        ret.normalBackColor = "#455";
        ret.mouseoverBackColor = "#544";
        var conflict = this.mappableActions.some(function (a) { return a.action != action && KeyboardHandler.keyMap.some(function (b) { return b.v == a.action && b.k == keyMap; }); });
        if (conflict)
            ret.normalBackColor = "#664";
        var textDisplay = keyMap;
        if (Object.keys(KeyboardHandler.gamepadMap).indexOf(keyMap) > -1) {
            textDisplay = KeyboardHandler.gamepadMap[keyMap];
        }
        var text = new UIText(0, 0, textDisplay, 14, "white");
        text.font = "arial";
        text.yOffset = 20;
        ret.AddChild(new Spacer(0, 0, 0, 0));
        ret.AddChild(text);
        ret.AddChild(new Spacer(0, 0, 0, 0));
        ret.onClickEvents.push(function () {
            UIDialog.Confirm("Do you want to unbind the key \"" + textDisplay + "\" from the action \"" + actionName + "\"?", "Yes, unmap it", "Cancel", function () {
                KeyboardHandler.keyMap = KeyboardHandler.keyMap.filter(function (a) { return !(a.k == keyMap && a.v == action); });
                StorageService.SaveKeyboardMappings();
                _this.Refresh();
            });
        });
        return ret;
    };
    return ControlMapMenu;
}(Menu));
