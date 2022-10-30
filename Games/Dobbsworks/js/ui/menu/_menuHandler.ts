class MenuHandler {

    static MenuStack: Menu[] = [];
    static Dialog: UIDialog | null = null;

    static CreateMenu(menuType: MenuType): Menu {
        let menu = new menuType();
        menu.InitialDisplay();
        MenuHandler.CurrentMenu = menu;
        return menu;
    }

    static SubMenu(menuType: MenuType): Menu {
        if (MenuHandler.CurrentMenu) {
            MenuHandler.MenuStack.push(MenuHandler.CurrentMenu);
            MenuHandler.CurrentMenu.Hide(-1);
        }
        return MenuHandler.CreateMenu(menuType);
    }

    static SubMenuInstance(menu: Menu): Menu {
        if (MenuHandler.CurrentMenu) {
            MenuHandler.MenuStack.push(MenuHandler.CurrentMenu);
            MenuHandler.CurrentMenu.Hide(-1);
        }
        menu.InitialDisplay();
        MenuHandler.CurrentMenu = menu;
        return menu;
    }
    
    static CurrentMenu: Menu | null = null;

    static GoBack(): void {
        let menu = MenuHandler.MenuStack.pop();

        if (MenuHandler.CurrentMenu) {
            let menu = MenuHandler.CurrentMenu;
            menu.Hide(1);
            setTimeout(() => {
                menu.Dispose();
            }, 200)
        }

        if (menu) {
            menu.Show();
            if (menu instanceof BlankMenu) MenuHandler.GoBack();
        }
    }

    

    static Update(): void {
        if (MenuHandler.Dialog) {
            MenuHandler.Dialog.Update();
        } else {
            MenuHandler.CurrentMenu?.Update();
        }
    }
    
    static Draw(camera: Camera): void {
        if (MenuHandler.CurrentMenu) {
            if (MenuHandler.CurrentMenu.backgroundColor2) {
                var grd = camera.ctx.createLinearGradient(0, 0, 0, camera.canvas.height);
                grd.addColorStop(0, MenuHandler.CurrentMenu.backgroundColor);
                grd.addColorStop(1, MenuHandler.CurrentMenu.backgroundColor2);
                camera.ctx.fillStyle = grd;
                camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            } else {
                camera.ctx.fillStyle = MenuHandler.CurrentMenu.backgroundColor;
                camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            }
        }
    }
}