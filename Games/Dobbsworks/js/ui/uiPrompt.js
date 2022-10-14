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
var UIPrompt = /** @class */ (function () {
    function UIPrompt() {
    }
    // list of selection
    UIPrompt.prototype.Draw = function (ctx) {
        ctx.fillStyle = "#0004";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    return UIPrompt;
}());
var Confirm = /** @class */ (function (_super) {
    __extends(Confirm, _super);
    function Confirm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Confirm;
}(UIPrompt));
var Prompt = /** @class */ (function (_super) {
    __extends(Prompt, _super);
    function Prompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Prompt;
}(UIPrompt));
var Alert = /** @class */ (function (_super) {
    __extends(Alert, _super);
    function Alert() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Alert;
}(UIPrompt));
