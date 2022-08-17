class OptionsMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#0005";

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        let container = new Panel(camera.canvas.width / 4, camera.canvas.height / 2 - 250, camera.canvas.width / 2, 500);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);

        let backButton = this.CreateButton("Back");
        container.AddChild(backButton);
        backButton.onClickEvents.push(() => {
            MenuHandler.GoBack();
        })

        let sfxVol = this.CreateSlider("SFX Volume", StorageService.GetSfxVolume(), (newVal) => {
            audioHandler.SetSfxVolume(newVal);
        });
        container.AddChild(sfxVol);

        let musicVol = this.CreateSlider("Music Volume",  StorageService.GetMusicVolume(), (newVal) => {
            audioHandler.SetMusicVolume(newVal);
        });
        container.AddChild(musicVol);

        return ret;
    }

    CreateSlider(header: string, initialValue: number, onChange: (newValue: number) => void): Panel {
        let panel = new Panel(0, 0, camera.canvas.width / 2, 150);
        panel.margin = 15;

        panel.AddChild(new Spacer(0,0,0,0));

        let slider = new Slider(0, 0, camera.canvas.width / 2 - 30, 40, onChange);
        slider.value = initialValue;
        panel.AddChild(slider);

        panel.AddChild(new Spacer(0,0,0,0));

        let buttonText = new UIText(0, 0, header, 30, "#000");
        panel.layout = "vertical";
        panel.AddChild(buttonText);
        buttonText.xOffset = camera.canvas.width / 4;
        buttonText.yOffset = 15;
        buttonText.textAlign = "center";
        panel.backColor = "#fff8";
        panel.borderColor = "#000";
        panel.borderRadius = 9;

        panel.AddChild(new Spacer(0,0,0,0));
        return panel;
    }

    CreateButton(text: string): Button {
        let button = new Button(0, 0, camera.canvas.width / 2, 60);
        let buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.AddChild(buttonText);
        buttonText.xOffset = camera.canvas.width / 4;
        buttonText.yOffset = -15;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    }

    Update(): void {
    }

    static CreateOptionsButton(): Panel {
        let panel = new Panel(camera.canvas.width - 80, 10, 70, 70);
        panel.backColor = "#1138"
        let button = new Button(0,0,60,60);
        button.isNoisy = true;
        panel.AddChild(button);
        let imageTile = tiles["editor"][6][7];
        button.AddChild(new ImageFromTile(0,0,50,50, imageTile));
        button.onClickEvents.push(() => {
            MenuHandler.SubMenu(OptionsMenu);
        })
        return panel;
    }
}