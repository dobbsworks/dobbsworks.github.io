class PanelScroll extends Panel {

    constructor(public parentPanel: Panel) {
        super(parentPanel.x + parentPanel.width + 2, parentPanel.y, 16, parentPanel.height);
    }

    handleTopY: number = -1;
    handleBottomY: number = -1;


    Update(): void {
        super.Update();
        this.backColor = this.parentPanel.backColor;
        this.isHidden = this.parentPanel.isHidden;
        this.targetX = this.parentPanel.targetX + this.parentPanel.targetWidth + 2;
        this.targetY = this.parentPanel.targetY;
        if (this.isHidden) return;

        if (mouseHandler.mouseX > this.x &&
            mouseHandler.mouseX < this.x + this.width &&
            mouseHandler.mouseY > this.y && mouseHandler.mouseY < this.y + this.height) {
            if (mouseHandler.isMouseDown) {
                if (mouseHandler.mouseY < this.handleTopY) this.parentPanel.Scroll(-1);
                if (mouseHandler.mouseY > this.handleBottomY) this.parentPanel.Scroll(1);
            }
            if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true)) this.parentPanel.Scroll(1);
            if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true)) this.parentPanel.Scroll(-1);
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHidden) return;
        super.Draw(ctx);

        let panel = this.parentPanel;
        let totalElements = (panel.children.length + panel.scrollableChildrenDown.length + panel.scrollableChildrenUp.length);
        let displayedRatio = panel.children.length / totalElements;
        let scrollOffset = (panel.scrollIndex % totalElements);
        let scrollOffsetRatio = scrollOffset / (panel.scrollableChildrenDown.length + panel.scrollableChildrenUp.length);

        ctx.fillStyle = "#FFF8";
        let availableScrollSpace = this.height - 8;
        let scrollHandleSize = availableScrollSpace * displayedRatio;
        let availableMovementDistance = availableScrollSpace - scrollHandleSize;

        this.handleTopY = this.y + 4 + scrollOffsetRatio * availableMovementDistance;
        this.handleBottomY = this.handleTopY + scrollHandleSize;
        ctx.fillRect(this.x + 4, this.handleTopY, 8, scrollHandleSize);
    }
}