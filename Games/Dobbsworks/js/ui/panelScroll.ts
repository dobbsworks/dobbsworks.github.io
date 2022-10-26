class PanelScroll extends Panel {

    constructor(public parentPanel: Panel) {
        super(parentPanel.x + parentPanel.width + 2, parentPanel.y, 16, parentPanel.height);
    }

    handleTopY: number = -1;
    handleBottomY: number = -1;
    mouseInitialClickY: number = -1;
    mouseScrollAnchorY: number = -1;
    mouseScrollThresholdDistance = -1;
    uncommitedScrollDelta = 0;
    isOutOfScrollColumn = false;


    Update(): void {
        super.Update();
        this.backColor = this.parentPanel.backColor;
        this.isHidden = this.parentPanel.isHidden;
        this.targetX = this.parentPanel.targetX + this.parentPanel.targetWidth + 2;
        this.targetY = this.parentPanel.targetY;
        if (this.isHidden) return;

        let mousePixel = mouseHandler.GetCanvasMousePixel();
        let mouseX = mousePixel.xPixel;
        let mouseY = mousePixel.yPixel;

        if (mouseX > this.x &&
            mouseX < this.x + this.width) {
            // within horizontal column

            if (mouseY >= this.y &&
                mouseY <= this.y + this.height) {
                // within bounding box

                if (this.mouseInitialClickY == -1 &&
                    mouseHandler.isMouseDown) {
                    if (mouseY >= this.handleTopY &&
                        mouseY <= this.handleBottomY &&
                        mouseHandler.isMouseClicked()) {
                        // initial click on scroll handle
                        this.mouseInitialClickY = mouseY;
                        this.mouseScrollAnchorY = mouseY;
                    } else if (mouseY < this.handleTopY) {
                        this.parentPanel.Scroll(-1);
                    } else if (mouseY > this.handleBottomY) {
                        this.parentPanel.Scroll(1);
                    }
                } else {
                    if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true)) this.parentPanel.Scroll(1);
                    if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true)) this.parentPanel.Scroll(-1);
                }
            }
        }

        if (!mouseHandler.isMouseDown) {
            this.mouseInitialClickY = -1;
            this.mouseScrollAnchorY = -1
            this.uncommitedScrollDelta = 0;
            this.isOutOfScrollColumn = false
        }

        if (mouseHandler.isMouseDown &&
            this.mouseInitialClickY !== -1) {

            if (mouseX > this.x - 100 &&
                mouseX < this.x + this.width + 100) {
                if (this.isOutOfScrollColumn) {
                    this.isOutOfScrollColumn = false;
                    for (let i = 0; i < this.uncommitedScrollDelta; i++) this.parentPanel.Scroll(1);
                    for (let i = 0; i < -this.uncommitedScrollDelta; i++) this.parentPanel.Scroll(-1);
                }

                // dragging within horizontal column
                if (mouseY - this.mouseScrollAnchorY > this.mouseScrollThresholdDistance) {
                    let scrollSuccessful = this.parentPanel.Scroll(1);
                    if (scrollSuccessful) {
                        this.mouseScrollAnchorY += this.mouseScrollThresholdDistance;
                        this.uncommitedScrollDelta += 1;
                    }
                }
                if (mouseY - this.mouseScrollAnchorY < -this.mouseScrollThresholdDistance) {
                    let scrollSuccessful = this.parentPanel.Scroll(-1);
                    if (scrollSuccessful) {
                        this.mouseScrollAnchorY -= this.mouseScrollThresholdDistance;
                        this.uncommitedScrollDelta -= 1;
                    }
                }
            } else {
                for (let i = 0; i < this.uncommitedScrollDelta; i++) this.parentPanel.Scroll(-1);
                for (let i = 0; i < -this.uncommitedScrollDelta; i++) this.parentPanel.Scroll(1);
                this.isOutOfScrollColumn = true;
            }
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHidden) return;
        super.Draw(ctx);

        let panel = this.parentPanel;
        let numberOfScrollableElements = panel.scrollableChildrenDown.length + panel.scrollableChildrenUp.length;
        let totalElements = panel.children.length + numberOfScrollableElements;
        let displayedRatio = panel.children.length / totalElements;
        let scrollOffset = panel.scrollIndex % totalElements;
        let scrollOffsetRatio = scrollOffset / numberOfScrollableElements;

        ctx.fillStyle = (this.mouseInitialClickY == -1 ? "#FFF8" : "#FFFF");
        let availableScrollSpace = this.height - 8;
        let scrollHandleSize = availableScrollSpace * displayedRatio;
        let availableMovementDistance = availableScrollSpace - scrollHandleSize;

        this.mouseScrollThresholdDistance = availableMovementDistance / numberOfScrollableElements;
        this.handleTopY = this.y + 4 + scrollOffsetRatio * availableMovementDistance;
        this.handleBottomY = this.handleTopY + scrollHandleSize;
        ctx.fillRect(this.x + 4, this.handleTopY, 8, scrollHandleSize);
    }
}