class EditorButtonDrawer extends Panel {

    constructor(x: number, y: number, width: number, height: number,
        public containerButton: EditorButton,
        public containedButtons: Panel[]
        ) {
        super(x, y, width, height);
        this.spacer = new Spacer(x, y, width - this.margin*2, 2);
        this.drawerElements = [...this.containedButtons, this.spacer];
        this.drawerElements.forEach(a => {
            this.AddChild(a);
            a.isHidden = true;
        });
        this.AddChild(containerButton);
        containerButton.onClickEvents.push(() => {
            if (containerButton.isSelected || this.expandOnFirstClick) {
                if (this.isExpanded) this.Collapse();
                else this.Expand();
            }
        });
        this.layout = "vertical";
        this.expandedHeight = this.children.map(a => a.height).reduce(Utility.Sum) + (this.children.length + 1) * this.margin * 2 - this.height;
        this.initialY = this.y;
    }

    expandOnFirstClick = false;
    spacer!: Spacer;
    drawerElements!: Panel[];
    initialHeight = 0;
    initialY = 0;
    expandedHeight!: number;
    isExpanded = false;
    expandDirection: "up" | "down" = "up";

    Update(): void {
        if (!this.initialHeight) this.initialHeight = this.height;
        if (!this.initialY) {
            this.initialY = this.y;
        }

        super.Update();
        if (!this.containerButton.isSelected && this.isExpanded) {
            this.Collapse();
        }
    }

    Expand(): void {
        this.isExpanded = true;
        this.targetHeight = this.initialHeight + this.expandedHeight;
        this.targetY = this.expandDirection == "up" ? (this.initialY - this.expandedHeight) : this.initialY;
        this.drawerElements.forEach(a => {
            a.x = this.containerButton.x;
            a.y = this.containerButton.y;
            a.targetX = this.containerButton.x;
            a.targetY = this.containerButton.y;
        })
        this.drawerElements.forEach(a => {
            a.isHidden = false;
        });
    }

    Collapse(): void {
        if (this.isExpanded) {
            this.isExpanded = false;
            this.targetHeight = this.initialHeight;
            this.targetY = this.initialY;
            this.drawerElements.forEach(a => {
                a.isHidden = true;
                if (a instanceof EditorButtonDrawer) a.Collapse();
            });
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
        this.containerButton.Draw(ctx);
    }
}