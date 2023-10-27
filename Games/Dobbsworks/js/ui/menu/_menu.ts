abstract class Menu {
    offset: number = 0;
    elements: UIElement[] = [];
    isShown: boolean = false;
    stopsMapUpdate: boolean = false;
    blocksPause: boolean = true;
    backgroundColor: string = "#0000";
    backgroundColor2: string = ""; //if set, use a gradient


    InitialDisplay(): void {
        //if (this.elements.length == 0) {
        let createdElements = this.CreateElements();
        this.elements.push(...createdElements);

        let elementsToAdd = this.elements.filter(a => uiHandler.elements.indexOf(a) == -1);
        uiHandler.elements.push(...elementsToAdd);
        //}
        this.elements.forEach(a => a.y += 600);
        this.Show();
    }

    Update(): void { }

    protected CreateBackButton(): Button {
        let backButton = new Button(0, camera.canvas.height - 40, 70, 40);
        let backButtonText = new UIText(0, 0, "Back", 16, "white");
        backButtonText.xOffset = 25;
        backButtonText.yOffset = 20;
        backButton.AddChild(backButtonText);
        backButton.onClickEvents.push(() => {
            MenuHandler.GoBack(false);
        })
        return backButton;
    }

    public Hide(direction: -1|1): void {
        if (this.isShown) {
            this.isShown = false;
            this.MoveElements(600 * direction);
            if (MenuHandler.CurrentMenu == this) {
                MenuHandler.CurrentMenu = null;
            }
        }
    }

    public Show(): void {
        if (!this.isShown) {
            this.isShown = true;
            this.MoveElements(-this.offset);
            MenuHandler.CurrentMenu = this;
        }
    }

    private MoveElements(distance: number): void {
        this.elements.forEach(a => a.targetY += distance);
        this.offset += distance;
    }

    public Dispose(): void {
        uiHandler.elements = uiHandler.elements.filter(a => this.elements.indexOf(a) == -1);
        if (MenuHandler.CurrentMenu == this) {
            MenuHandler.CurrentMenu = null;
        }
    }

    public OnAfterDraw(camera: Camera): void {}

    abstract CreateElements(): UIElement[];
}