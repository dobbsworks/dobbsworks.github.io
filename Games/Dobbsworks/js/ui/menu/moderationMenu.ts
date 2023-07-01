class ModerationMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#335";
    backgroundColor2 = "#03ddde";
    level: LevelDT | null = null;

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        let backButton = this.CreateBackButton();
        ret.push(backButton);

        let container = new Panel(camera.canvas.width * 0.15, camera.canvas.height / 2 - 150, camera.canvas.width * 0.7, 360);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);

        let isGlitchButton = this.CreateButton("Mark As Glitch");
        container.AddChild(isGlitchButton);
        isGlitchButton.onClickEvents.push(() => {
            DataService.MarkLevelAsGlitch(this.level?.code || "");
        });

        let isNotGlitchButton = this.CreateButton("Mark As Not Glitch");
        container.AddChild(isNotGlitchButton);
        isNotGlitchButton.onClickEvents.push(() => {
            DataService.MarkLevelAsNotGlitch(this.level?.code || "");
        });


        return ret;
    }

    CreateButton(text: string, sizeRatio: number = 1): Button {
        let button = new Button(0, 0, camera.canvas.width * 0.7 * sizeRatio, 60);
        let buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.isNoisy = true;
        button.AddChild(buttonText);
        buttonText.xOffset = button.width / 2;
        buttonText.yOffset = 40;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    }
}