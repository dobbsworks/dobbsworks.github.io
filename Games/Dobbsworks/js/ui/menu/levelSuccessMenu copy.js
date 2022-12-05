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
var BankEarningsMenu = /** @class */ (function (_super) {
    __extends(BankEarningsMenu, _super);
    function BankEarningsMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        return _this;
    }
    BankEarningsMenu.prototype.CreateElements = function () {
        var ret = [];
        var buttonWidth = 200;
        var buttonHeight = 40;
        var continueButton = new Button(camera.canvas.width - buttonWidth - 20, camera.canvas.height - buttonHeight - 20, buttonWidth, buttonHeight);
        var continueText = new UIText(camera.canvas.width / 2, continueButton.y + 20, "CONTINUE", 20, "#FFF");
        continueButton.AddChild(continueText);
        continueText.xOffset = continueButton.width / 2 - 5;
        continueText.yOffset = 30;
        continueButton.onClickEvents.push(function () {
        });
        ret.push(continueButton);
        return ret;
    };
    BankEarningsMenu.prototype.Update = function () {
    };
    return BankEarningsMenu;
}(Menu));
