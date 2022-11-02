class ControlMapMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#0008";
    container!: Panel;

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        let backButton = this.CreateBackButton();
        ret.push(backButton);

        this.container = this.GetRemapContainer();
        ret.push(this.container);

        return ret;
    }

    Refresh(): void {
        uiHandler.elements = uiHandler.elements.filter(a => a != this.container);
        this.elements = this.elements.filter(a => a != this.container);
        this.container = this.GetRemapContainer();
        this.elements.push(this.container);
        uiHandler.elements.push(this.container);
    }

    mappableActions = [
        {name: "Left", action: KeyAction.Left},
        {name: "Right", action: KeyAction.Right},
        {name: "Up", action: KeyAction.Up},
        {name: "Down", action: KeyAction.Down},
        {name: "Jump", action: KeyAction.Action1},
        {name: "Run/Grab", action: KeyAction.Action2},
        {name: "Pause", action: KeyAction.Pause},
        {name: "Retry", action: KeyAction.Reset},
    ]

    GetRemapContainer(): Panel {
        let container = new Panel((camera.canvas.width - 800) /2 , camera.canvas.height / 2 - 250, 800, 500);
        container.margin = 0;
        container.layout = "vertical";

        for (let mappableAction of this.mappableActions) {
            container.AddChild(this.CreateControlRemapRow(mappableAction.name, mappableAction.action));
        }
        
        return container;
    }


    CreateControlRemapRow(name: string, action: KeyAction): Panel {
        let ret = new Panel(0, 0, 800, 60);
        ret.backColor = "#000B";

        let textHolder = new Panel(0, 0, 120, 60);
        let text = new UIText(0, 0, name, 20, "white");
        text.textAlign = "left";
        text.yOffset = 30;
        textHolder.AddChild(text);
        textHolder.AddChild(new Spacer(0,0,0,0));
        ret.AddChild(textHolder);

        let resetButton = new Button(0, 0, 80, 50);
        resetButton.AddChild(new Spacer(0,0,0,0));
        let resetText = new UIText(0, 0, "Reset", 16, "white");
        resetText.yOffset = 30;
        resetButton.AddChild(resetText);
        resetButton.AddChild(new Spacer(0,0,0,0));
        resetButton.onClickEvents.push(() => {
            UIDialog.Confirm(`Do you want to reset the action ${name} back to its default mapping?`, "Yes, reset", "Cancel", () => {
                this.ResetMapping(action);
                StorageService.SaveKeyboardMappings();
                this.Refresh();
            })
        })
        ret.AddChild(resetButton);

        let addButton = new Button(0, 0, 80, 50);
        addButton.AddChild(new Spacer(0,0,0,0));
        let addText = new UIText(0, 0, "Add key", 16, "white");
        addText.yOffset = 30;
        addButton.AddChild(addText);
        addButton.AddChild(new Spacer(0,0,0,0));
        addButton.onClickEvents.push(() => {
            UIDialog.ReadKey(`Press a key on your keyboard to assign to the action "${name}"`, "Assign key", "Cancel", () => {
                let key = KeyboardHandler.lastPressedKeyCode;
                if (key) {
                    if (!KeyboardHandler.keyMap.some(a => a.k == key && a.v == action)) {
                        KeyboardHandler.keyMap.push({k: key, v: action});
                        StorageService.SaveKeyboardMappings();
                        this.Refresh();
                    }
                }
            })
        })
        ret.AddChild(addButton);

        let currentKeyPanel = new Panel(0, 0, 450, 50);
        ret.AddChild(currentKeyPanel);

        let existingMappings = KeyboardHandler.keyMap.filter(a => a.v == action);
        let extraSpaces = 4 - existingMappings.length;
        let buttonWidth = 400 / Math.max(4, existingMappings.length);
        for (let i=0; i<extraSpaces; i++) currentKeyPanel.AddChild(new Spacer(0, 0, buttonWidth, 40));

        for (let mapping of existingMappings) {
            currentKeyPanel.AddChild(this.CreateMappingPanel(name, action, mapping.k, buttonWidth));
        }

        return ret;
    }

    ResetMapping(action: KeyAction): void {
        // completely unmap this action
        KeyboardHandler.keyMap = KeyboardHandler.keyMap.filter(a => !(a.v == action));

        // add in all defaults
        for (let defaultMapping of KeyboardHandler.defaultKeyMap.filter(a => (a.v == action))) {
            KeyboardHandler.keyMap.push({...defaultMapping});
        }
    }

    CreateMappingPanel(actionName: string, action: KeyAction, keyMap: string, buttonWidth: number): Panel {
        let ret = new Button(0, 0, buttonWidth, 40);
        ret.normalBackColor = "#455";
        ret.mouseoverBackColor = "#544";

        let conflict = this.mappableActions.some(a => a.action != action && KeyboardHandler.keyMap.some(b => b.v == a.action && b.k == keyMap));
        if (conflict) ret.normalBackColor = "#664";

        let textDisplay = keyMap;
        if (Object.keys(KeyboardHandler.gamepadMap).indexOf(keyMap) > -1) {
            textDisplay = (<any>KeyboardHandler).gamepadMap[keyMap];
        }

        let text = new UIText(0, 0, textDisplay, 14, "white");
        text.font = "arial";
        text.yOffset = 20;
        ret.AddChild(new Spacer(0,0,0,0));
        ret.AddChild(text);
        ret.AddChild(new Spacer(0,0,0,0));

        ret.onClickEvents.push(() => {
            UIDialog.Confirm(`Do you want to unbind the key "${textDisplay}" from the action "${actionName}"?`, "Yes, unmap it", "Cancel", () => {
                KeyboardHandler.keyMap = KeyboardHandler.keyMap.filter(a => !(a.k == keyMap && a.v == action));
                StorageService.SaveKeyboardMappings();
                this.Refresh();
            })
        });

        return ret;
    }
    
}