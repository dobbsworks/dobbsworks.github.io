class UiHandler {

    elements: UIElement[] = [];
    mousedOverElements: UIElement[] = [];
    lastClickedButton: Button | null = null; // used to handle closing open drawers
    dragSource: Button | null = null;

    Draw(ctx: CanvasRenderingContext2D): void {
        for (let el of this.elements) {
            el.Draw(ctx);
        }
        if (editorHandler.isInEditMode && editorHandler.mouseOverButton) {
            editorHandler.mouseOverButton.DrawTooltip(ctx);
        }
        if (MenuHandler.Dialog) {
            MenuHandler.Dialog.Draw(camera.ctx);
        }
    }

    initialized = false;
    Initialize() {
        if (this.initialized) return;
        this.initialized = true;
    }

    Update(): void {
        this.Initialize();
        this.mousedOverElements = [];
        for (let el of this.elements) {
            el.CheckAndUpdateMousedOver();
            el.Update();
        }

        if (document.body.style.cursor == "pointer") {
            document.body.style.cursor = "unset";
        }
        for (let el of this.mousedOverElements) {
            if (el instanceof Button) {
                document.body.style.cursor = "pointer";
                if (mouseHandler.isMouseClicked()) {
                    el.Click();
                    break;
                }
            }
        }

        if (MenuHandler.Dialog) MenuHandler.Dialog.Update();
        if (!mouseHandler.isMouseDown) {
            this.dragSource = null;
        }

    }

    GetAllElements(): UIElement[] {
        let list = [...this.elements];
        for (let i = 0; i < list.length; i++) {
            if (list[i] instanceof Panel) {
                list.push(...(<Panel>list[i]).children);
            }
        }
        return list;
    }
}