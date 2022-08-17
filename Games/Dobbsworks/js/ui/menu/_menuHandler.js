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
        return MenuHandler.CreateMenu(menuType);
    };
    MenuHandler.GoBack = function () {
        var menu = MenuHandler.MenuStack.pop();
        if (MenuHandler.CurrentMenu) {
            var menu_1 = MenuHandler.CurrentMenu;
            menu_1.Hide(1);
            setTimeout(function () {
                menu_1.Dispose();
            }, 200);
        }
        if (menu) {
            menu.Show();
            if (menu instanceof BlankMenu)
                MenuHandler.GoBack();
        }
    };
    MenuHandler.Update = function () {
        var _a;
        (_a = MenuHandler.CurrentMenu) === null || _a === void 0 ? void 0 : _a.Update();
    };
    MenuHandler.Draw = function (camera) {
        if (MenuHandler.CurrentMenu) {
            camera.ctx.fillStyle = MenuHandler.CurrentMenu.backgroundColor;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }
    };
    MenuHandler.MenuStack = [];
    MenuHandler.CurrentMenu = null;
    return MenuHandler;
}());
