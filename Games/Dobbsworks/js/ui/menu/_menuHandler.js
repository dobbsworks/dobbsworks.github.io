"use strict";
var MenuHandler = /** @class */ (function () {
    function MenuHandler() {
    }
    MenuHandler.CreateMenu = function (menuType) {
        var menu = new menuType();
        menu.InitialDisplay();
        MenuHandler.CurrentMenu = menu;
        return menu;
    };
    MenuHandler.SubMenu = function (menuType) {
        if (MenuHandler.CurrentMenu) {
            MenuHandler.MenuStack.push(MenuHandler.CurrentMenu);
            MenuHandler.CurrentMenu.Hide(-1);
        }
        else {
            MenuHandler.MenuStack.push(new BlankMenu());
        }
        return MenuHandler.CreateMenu(menuType);
    };
    MenuHandler.SubMenuInstance = function (menu) {
        if (MenuHandler.CurrentMenu) {
            MenuHandler.MenuStack.push(MenuHandler.CurrentMenu);
            MenuHandler.CurrentMenu.Hide(-1);
        }
        menu.InitialDisplay();
        MenuHandler.CurrentMenu = menu;
        return menu;
    };
    MenuHandler.GoBack = function () {
        var menu = MenuHandler.MenuStack.pop();
        if (MenuHandler.CurrentMenu) {
            var current_1 = MenuHandler.CurrentMenu;
            current_1.Hide(1);
            setTimeout(function () {
                current_1.Dispose();
            }, 200);
        }
        if (menu) {
            menu.Show();
            //if (menu instanceof BlankMenu) MenuHandler.GoBack();
        }
    };
    MenuHandler.Update = function () {
        var _a;
        if (MenuHandler.Dialog) {
            MenuHandler.Dialog.Update();
        }
        else {
            (_a = MenuHandler.CurrentMenu) === null || _a === void 0 ? void 0 : _a.Update();
        }
    };
    MenuHandler.Draw = function (camera) {
        if (MenuHandler.CurrentMenu) {
            if (MenuHandler.CurrentMenu.backgroundColor2) {
                var grd = camera.ctx.createLinearGradient(0, 0, 0, camera.canvas.height);
                grd.addColorStop(0, MenuHandler.CurrentMenu.backgroundColor);
                grd.addColorStop(1, MenuHandler.CurrentMenu.backgroundColor2);
                camera.ctx.fillStyle = grd;
                camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            }
            else {
                camera.ctx.fillStyle = MenuHandler.CurrentMenu.backgroundColor;
                camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            }
        }
    };
    MenuHandler.MenuStack = [];
    MenuHandler.Dialog = null;
    MenuHandler.CurrentMenu = null;
    return MenuHandler;
}());
