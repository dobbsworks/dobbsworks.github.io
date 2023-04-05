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
var UIDialog = /** @class */ (function () {
    function UIDialog() {
        // list of selection
        this.options = [];
        this.promptText = "";
        this.promptLines = [];
        this.suppressKeyNavigation = false;
        this.title = "";
        this.targetTime = null;
        this.targetTimeText = "";
    }
    UIDialog.prototype.Draw = function (ctx) {
        ctx.fillStyle = "#0009";
        ctx.strokeStyle = "#BBB";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#226";
        ctx.fillRect(200, 150, ctx.canvas.width - 400, ctx.canvas.height - 300);
        ctx.strokeRect(200, 150, ctx.canvas.width - 400, ctx.canvas.height - 300);
        ctx.fillStyle = "white";
        ctx.font = 16 + "px " + "arial";
        ctx.textAlign = "center";
        if (this.promptLines.length == 0) {
            this.promptLines = UISplitLines(ctx, this.promptText, 450);
        }
        var yIter = 200;
        if (this.title) {
            ctx.font = 24 + "px " + "grobold";
            ctx.fillText(this.title, ctx.canvas.width / 2, yIter);
            ctx.font = 16 + "px " + "arial";
            yIter += 36;
        }
        for (var _i = 0, _a = this.promptLines; _i < _a.length; _i++) {
            var line = _a[_i];
            ctx.fillText(line, ctx.canvas.width / 2, yIter);
            yIter += 18;
        }
        var xIter = 230;
        if (this.targetTime) {
            var remainingTime = +this.targetTime - +new Date();
            if (remainingTime < 0)
                remainingTime = 0;
            var remainingTimeText = Utility.MsToTimeText(remainingTime);
            var text = this.targetTimeText + ": " + remainingTimeText;
            ctx.fillStyle = "#BBB";
            ctx.textAlign = "left";
            ctx.fillText(text, xIter, 370 - 15);
            ctx.textAlign = "center";
        }
        if (this.options.length == 1)
            xIter += 175 * 2;
        for (var _b = 0, _c = this.options; _b < _c.length; _b++) {
            var option = _c[_b];
            if (option.x == -1) {
                option.x = xIter;
                option.y = 370;
                option.xRight = option.x + 150;
                option.yBottom = option.y + 40;
                xIter += 175;
                if (this.options.length == 2)
                    xIter += 175;
            }
            option.Draw(ctx);
        }
    };
    UIDialog.prototype.AddFiveStarButtons = function (onClick) {
        var xIter = 230;
        var _loop_1 = function (i) {
            var newOption = new UIDialogStarVote(i, function () {
                onClick(i);
            });
            newOption.x = xIter;
            newOption.xRight = xIter + 76;
            newOption.y = 320 - 76;
            newOption.yBottom = 320;
            this_1.options.push(newOption);
            xIter += 106;
        };
        var this_1 = this;
        for (var i = 1; i <= 5; i++) {
            _loop_1(i);
        }
    };
    UIDialog.prototype.Update = function () {
        this.options.forEach(function (a) { return a.Update(); });
        if (this.options.some(function (a) { return a.isMouseOver; })) {
            document.body.style.cursor = "pointer";
            if (mouseHandler.isMouseClicked()) {
                var option = this.options.find(function (a) { return a.isMouseOver; });
                if (option) {
                    MenuHandler.Dialog = null;
                    option.action.apply(option, this.GetButtonActionParameters());
                    this.OnAnyAction();
                    mouseHandler.isMouseDown = false;
                }
            }
        }
        else {
            document.body.style.cursor = "unset";
        }
        if (MenuHandler.Dialog == this) {
            // no options clicked
            if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, true) && !this.suppressKeyNavigation) {
                this.OnKeyboardCancel();
                this.OnAnyAction();
                MenuHandler.Dialog = null;
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Confirm, true) && !this.suppressKeyNavigation) {
                this.OnKeyboardConfirm();
                this.OnAnyAction();
                MenuHandler.Dialog = null;
            }
        }
    };
    UIDialog.prototype.GetButtonActionParameters = function () {
        return [];
    };
    UIDialog.prototype.OnAnyAction = function () { };
    UIDialog.prototype.OnKeyboardConfirm = function () { };
    UIDialog.prototype.OnKeyboardCancel = function () { };
    UIDialog.SetCountdown = function (title, targetTime) {
        if (MenuHandler.Dialog) {
            MenuHandler.Dialog.targetTime = targetTime;
            MenuHandler.Dialog.targetTimeText = title;
        }
    };
    UIDialog.Alert = function (info, confirmButtonText) {
        MenuHandler.Dialog = new UIAlert(info, confirmButtonText);
    };
    UIDialog.Confirm = function (info, confirmButtonText, rejectButtonText, confirmAction) {
        MenuHandler.Dialog = new UIConfirm(info, confirmButtonText, rejectButtonText, confirmAction);
    };
    UIDialog.SmallPrompt = function (info, confirmButtonText, maxLength, confirmAction, allowedCharacters) {
        if (allowedCharacters === void 0) { allowedCharacters = ""; }
        MenuHandler.Dialog = new UISmallPrompt(info, confirmButtonText, maxLength, confirmAction, allowedCharacters);
    };
    UIDialog.ReadKey = function (info, confirmButtonText, rejectButtonText, confirmAction) {
        MenuHandler.Dialog = new UIReadKey(info, confirmButtonText, rejectButtonText, confirmAction);
    };
    return UIDialog;
}());
function UISplitLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        }
        else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
var UIDialogOption = /** @class */ (function () {
    function UIDialogOption(text, action) {
        this.text = text;
        this.action = action;
        this.x = -1;
        this.xRight = -1;
        this.y = -1;
        this.yBottom = -1;
        this.color = "#000A";
        this.isMouseOver = false;
    }
    UIDialogOption.prototype.Update = function () {
        var mouseX = mouseHandler.GetCanvasMousePixel().xPixel;
        var mouseY = mouseHandler.GetCanvasMousePixel().yPixel;
        this.isMouseOver = (mouseX >= this.x &&
            mouseX <= this.xRight &&
            mouseY >= this.y &&
            mouseY <= this.yBottom);
    };
    UIDialogOption.prototype.Draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.xRight - this.x, this.yBottom - this.y);
        ctx.strokeStyle = this.isMouseOver ? "#BBB" : "#BBB8";
        ctx.strokeRect(this.x, this.y, this.xRight - this.x, this.yBottom - this.y);
        ctx.fillStyle = "#BBB";
        ctx.fillText(this.text, (this.x + this.xRight) / 2, this.yBottom - 15);
    };
    return UIDialogOption;
}());
var UIDialogStarVote = /** @class */ (function (_super) {
    __extends(UIDialogStarVote, _super);
    function UIDialogStarVote(rank, action) {
        var _this = _super.call(this, "", action) || this;
        _this.rank = rank;
        return _this;
    }
    UIDialogStarVote.prototype.Draw = function (ctx) {
        var imageCol = this.isMouseOver ? 2 : 0;
        if (MenuHandler.Dialog) {
            var mouseOverStar = MenuHandler.Dialog.options.find(function (a) { return a instanceof UIDialogStarVote && a.isMouseOver; });
            if (mouseOverStar && mouseOverStar.rank > this.rank) {
                imageCol = 1;
            }
        }
        var image = tiles["voteStars"][imageCol][0];
        ctx.drawImage(image.src, image.xSrc, image.ySrc, image.width, image.height, this.x, this.y, this.xRight - this.x, this.yBottom - this.y);
    };
    return UIDialogStarVote;
}(UIDialogOption));
var UISmallPrompt = /** @class */ (function (_super) {
    __extends(UISmallPrompt, _super);
    function UISmallPrompt(messageText, confirmText, maxLength, onConfirmAction, allowedCharacters // blank to allow all
    ) {
        var _this = _super.call(this) || this;
        _this.maxLength = maxLength;
        _this.onConfirmAction = onConfirmAction;
        _this.allowedCharacters = allowedCharacters;
        var cancelOption = new UIDialogOption("Cancel", function () { });
        cancelOption.color = "#115B";
        _this.options.push(cancelOption, new UIDialogOption(confirmText, onConfirmAction));
        _this.promptText = messageText;
        return _this;
    }
    UISmallPrompt.prototype.GetButtonActionParameters = function () {
        return [this.inputForm.value];
    };
    UISmallPrompt.prototype.OnAnyAction = function () {
        try {
            document.body.removeChild(this.inputForm);
        }
        catch (e) { }
    };
    UISmallPrompt.prototype.Draw = function (ctx) {
        var _a;
        _super.prototype.Draw.call(this, ctx);
        ctx.fillStyle = "#EEE";
        ctx.strokeStyle = "#BBB8";
        ctx.fillRect(230, 300, 500, 40);
        ctx.strokeRect(230, 300, 500, 40);
        ctx.fillStyle = "#333";
        var textToDraw = this.inputForm.value;
        var caretPosition = (_a = this.inputForm.selectionStart) !== null && _a !== void 0 ? _a : textToDraw.length;
        textToDraw = [textToDraw.slice(0, caretPosition), "|", textToDraw.slice(caretPosition)].join('');
        ctx.fillText(textToDraw, ctx.canvas.width / 2, 340 - 15);
    };
    UISmallPrompt.prototype.Update = function () {
        var _this = this;
        _super.prototype.Update.call(this);
        if (!this.inputForm) {
            this.inputForm = document.createElement('input');
            this.inputForm.onkeydown = function (e) {
                if (e.code === "Enter" || e.code === "NumpadEnter") {
                    _this.onConfirmAction(_this.inputForm.value);
                    document.body.removeChild(_this.inputForm);
                    MenuHandler.Dialog = null;
                }
                if (e.code === "Escape") {
                    _this.onConfirmAction(_this.inputForm.value);
                    document.body.removeChild(_this.inputForm);
                    MenuHandler.Dialog = null;
                }
            };
            document.body.prepend(this.inputForm);
            this.inputForm.focus();
            if (this.maxLength)
                this.inputForm.maxLength = this.maxLength;
            this.inputForm.style.opacity = "0";
            this.inputForm.style.position = "fixed";
            this.inputForm.style.top = "0";
        }
        else {
            this.inputForm.focus();
        }
        if (document.activeElement != this.inputForm) {
            KeyboardHandler.connectedInput = this.inputForm;
        }
        else {
            KeyboardHandler.connectedInput = null;
        }
        if (this.allowedCharacters.length) {
            this.inputForm.value = this.inputForm.value.split("").filter(function (a) { return _this.allowedCharacters.indexOf(a) > -1; }).join("");
            ;
        }
    };
    UISmallPrompt.SimpleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-/=%`#@&(),.;'?! ";
    UISmallPrompt.LevelCodeCharacters = "ABCDEFabcdef0123456789";
    return UISmallPrompt;
}(UIDialog));
var UIAlert = /** @class */ (function (_super) {
    __extends(UIAlert, _super);
    function UIAlert(messageText, confirmText, onConfirmAction) {
        if (onConfirmAction === void 0) { onConfirmAction = function () { }; }
        var _this = _super.call(this) || this;
        _this.onConfirmAction = onConfirmAction;
        _this.options.push(new UIDialogOption(confirmText, onConfirmAction));
        _this.promptText = messageText;
        return _this;
    }
    UIAlert.prototype.OnKeyboardConfirm = function () { this.onConfirmAction(); };
    UIAlert.prototype.OnKeyboardCancel = function () { this.onConfirmAction(); };
    return UIAlert;
}(UIDialog));
var UIConfirm = /** @class */ (function (_super) {
    __extends(UIConfirm, _super);
    function UIConfirm(messageText, confirmText, rejectText, onConfirmAction) {
        var _this = _super.call(this) || this;
        _this.onConfirmAction = onConfirmAction;
        var opt1 = new UIDialogOption(rejectText, function () { });
        opt1.color = "#115B";
        var opt2 = new UIDialogOption(confirmText, onConfirmAction);
        _this.options.push(opt1, opt2);
        _this.promptText = messageText;
        return _this;
    }
    UIConfirm.prototype.OnKeyboardConfirm = function () { this.onConfirmAction(); };
    return UIConfirm;
}(UIDialog));
var UIReadKey = /** @class */ (function (_super) {
    __extends(UIReadKey, _super);
    function UIReadKey(messageText, confirmText, rejectText, onConfirmAction) {
        if (onConfirmAction === void 0) { onConfirmAction = function () { }; }
        var _this = _super.call(this, messageText, confirmText, rejectText, onConfirmAction) || this;
        _this.isLastLineAdded = false;
        _this.suppressKeyNavigation = true;
        KeyboardHandler.lastPressedKeyCode = "";
        return _this;
    }
    UIReadKey.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (!this.isLastLineAdded && this.promptLines.length) {
            this.promptLines.push("", "");
            this.isLastLineAdded = true;
        }
        var keyCode = KeyboardHandler.lastPressedKeyCode || "no key";
        if (Object.keys(KeyboardHandler.gamepadMap).indexOf(keyCode) > -1) {
            keyCode = KeyboardHandler.gamepadMap[keyCode];
        }
        this.promptLines[this.promptLines.length - 1] = "<" + keyCode + ">";
    };
    UIReadKey.prototype.OnKeyboardConfirm = function () { };
    ;
    UIReadKey.prototype.OnKeyboardCancel = function () { };
    ;
    return UIReadKey;
}(UIConfirm));
