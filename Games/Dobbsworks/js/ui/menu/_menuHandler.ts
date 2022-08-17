class MenuHandler {

    static MenuStack: Menu[] = [];

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
        MenuHandler.CurrentMenu?.Update();
    }
    
    static Draw(camera: Camera): void {
        if (MenuHandler.CurrentMenu) {
            camera.ctx.fillStyle = MenuHandler.CurrentMenu.backgroundColor;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }
    }
}