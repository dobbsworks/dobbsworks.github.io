"use strict";
var Menu = /** @class */ (function () {
    function Menu() {
        this.offset = 0;
        this.elements = [];
        this.isShown = false;
        this.stopsMapUpdate = false;
        this.blocksPause = true;
        this.backgroundColor = "#0000";
        this.backgroundColor2 = ""; //if set, use a gradient
    }
    Menu.prototype.InitialDisplay = function () {
        var _a, _b;
        //if (this.elements.length == 0) {
        var createdElements = this.CreateElements();
        (_a = this.elements).push.apply(_a, createdElements);
        var elementsToAdd = this.elements.filter(function (a) { return uiHandler.elements.indexOf(a) == -1; });
        (_b = uiHandler.elements).push.apply(_b, elementsToAdd);
        //}
        this.elements.forEach(function (a) { return a.y += 600; });
        this.Show();
    };
    Menu.prototype.Update = function () { };
    Menu.prototype.CreateBackButton = function () {
        var backButton = new Button(0, camera.canvas.height - 40, 70, 40);
        var backButtonText = new UIText(0, 0, "Back", 16, "white");
        backButtonText.xOffset = 25;
        backButtonText.yOffset = 20;
        backButton.AddChild(backButtonText);
        backButton.onClickEvents.push(function () {
            MenuHandler.GoBack(false);
        });
        return backButton;
    };
    Menu.prototype.Hide = function (direction) {
        if (this.isShown) {
            this.isShown = false;
            this.MoveElements(600 * direction);
            if (MenuHandler.CurrentMenu == this) {
                MenuHandler.CurrentMenu = null;
            }
        }
    };
    Menu.prototype.Show = function () {
        if (!this.isShown) {
            this.isShown = true;
            this.MoveElements(-this.offset);
            MenuHandler.CurrentMenu = this;
        }
    };
    Menu.prototype.MoveElements = function (distance) {
        this.elements.forEach(function (a) { return a.targetY += distance; });
        this.offset += distance;
    };
    Menu.prototype.Dispose = function () {
        var _this = this;
        uiHandler.elements = uiHandler.elements.filter(function (a) { return _this.elements.indexOf(a) == -1; });
        if (MenuHandler.CurrentMenu == this) {
            MenuHandler.CurrentMenu = null;
        }
    };
    Menu.prototype.OnAfterDraw = function (camera) { };
    return Menu;
}());
