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
var UIDialog = /** @class */ (function (_super) {
    __extends(UIDialog, _super);
    function UIDialog() {
        // list of selection
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = [];
        _this.promptText = "";
        return _this;
    }
    UIDialog.prototype.CreateElements = function () {
        var margin = 30;
        var panel = new Panel(margin, margin, 960 - margin * 2, 576 - margin * 2);
        panel.margin = 0;
        var topRow = new Panel(margin, margin, 960 - margin * 2, 300);
        var bottomRow = new Panel(margin, margin, 960 - margin * 2, 200);
        bottomRow.layout = "horizontal";
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var option = _a[_i];
            var button = new Button(margin, margin, 250, 80);
            var buttonText = new UIText(margin, margin, option.text, 30, "#000");
            button.isNoisy = true;
            bottomRow.AddChild(button);
        }
        // need to break apart text into rows
        var text = this.promptText;
        var uiText = new UIText(margin, margin, text, 30, "#000");
        topRow.AddChild(uiText);
        panel.AddChild(topRow);
        panel.AddChild(bottomRow);
        return [panel];
    };
    return UIDialog;
}(Menu));
var UIDialogOption = /** @class */ (function () {
    function UIDialogOption(text, action) {
        this.text = text;
        this.action = action;
    }
    return UIDialogOption;
}());
// class Confirm extends UIPrompt {
// }
// class Prompt extends UIPrompt {
// }
var UIAlert = /** @class */ (function (_super) {
    __extends(UIAlert, _super);
    function UIAlert(messageText, confirmText, onConfirmAction) {
        if (onConfirmAction === void 0) { onConfirmAction = function () { }; }
        var _this = _super.call(this) || this;
        _this.options.push(new UIDialogOption(confirmText, onConfirmAction));
        _this.promptText = messageText;
        return _this;
    }
    return UIAlert;
}(UIDialog));
