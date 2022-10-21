class Panel extends UIElement {

    constructor(x: number, y: number, public width: number, public height: number) {
        super(x, y);
        this.targetWidth = width;
        this.targetHeight = height;
        this.initialWidth = width;
        this.initialHeight = height;
    }

    scrollBar: PanelScroll | null = null;
    children: UIElement[] = [];
    scrollableChildrenUp: UIElement[] = [];
    scrollableChildrenDown: UIElement[] = [];
    margin = 5;
    backColor = "#0000";
    borderColor = "#0000";
    borderRadius = 8;
    layout: "horizontal" | "vertical" = "horizontal";
    targetWidth!: number;
    targetHeight!: number;
    initialWidth!: number;
    initialHeight!: number;
    scrollIndex: number = 0;
    xOffset: number = 0;
    yOffset: number = 0;

    IsMouseOver(): boolean {
        if (this.isHidden) return false;
        return mouseHandler.GetCanvasMousePixel().xPixel >= (this.x + this.xOffset) && mouseHandler.GetCanvasMousePixel().xPixel <= this.x + this.xOffset + this.width &&
            mouseHandler.GetCanvasMousePixel().yPixel >= this.y + this.yOffset && mouseHandler.GetCanvasMousePixel().yPixel <= this.y + this.yOffset + this.height;
    }

    GetMouseOverElement(): UIElement | null {
        for (let child of this.children) {
            if (child.IsMouseOver()) {
                let el = child.GetMouseOverElement();
                if (el) return el;
            }
        }
        if (this.IsMouseOver()) return this;
        return null;
    }

    AddChild(newChild: UIElement) {
        newChild.parentElement = this;
        this.children.push(newChild);
    }

    Scroll(direction: -1 | 1): boolean {
        if (direction == 1 && this.scrollableChildrenDown.length != 0) {
            // scroll down
            audioHandler.PlaySound("scroll", true);
            this.scrollIndex++;
            this.scrollableChildrenUp.push(this.children.splice(0, 1)[0]);
            this.children.push(this.scrollableChildrenDown.splice(0, 1)[0]);
            this.children.forEach(a => a.parentElement = this);
            return true;
        } else if (direction == -1 && this.scrollableChildrenUp.length != 0) {
            // scroll up
            audioHandler.PlaySound("scroll", true);
            this.scrollIndex--;
            let el1 = this.children.splice(this.children.length - 1, 1)[0];
            this.scrollableChildrenDown.unshift(el1);
            let el2 = this.scrollableChildrenUp.splice(this.scrollableChildrenUp.length - 1, 1)[0];
            this.children.unshift(el2);
            this.children.forEach(a => a.parentElement = this);
            return true;
        }
        return false;
    }

    Update(): void {
        if (uiHandler.mousedOverElements.indexOf(this) > -1) {
            if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true)) this.Scroll(1);
            if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true)) this.Scroll(-1);
        }
        super.Update();
        let children = this.children.filter(a => !a.isHidden);
        if (children.length) {
            let availableMarginWidth = this.width -
                children.map(a => a.width).reduce(Utility.Sum, 0) -
                this.margin * 2;
            if (this.layout == "vertical") availableMarginWidth = 0;
            let availableMarginHeight = this.height -
                children.map(a => a.height).reduce(Utility.Sum, 0) -
                this.margin * 2;
            if (this.layout == "horizontal") availableMarginHeight = 0;


            let marginWidth = availableMarginWidth / (children.length - 1);
            let marginHeight = availableMarginHeight / (children.length - 1);
            let x = this.x + this.margin;
            let y = this.y + this.margin;
            for (let child of children) {
                if (!child.fixedPosition) {
                    child.targetX = x;
                    child.x = x;
                    if (this.layout == "horizontal") x += Math.max(child.width + marginWidth, 0);
                    child.targetY = y;
                    child.y = y;
                    if (this.layout == "vertical") y += Math.max(child.height + marginHeight, 0);
                    if (child instanceof Panel) {
                        if (this.layout == "vertical") child.targetWidth = this.width - this.margin * 2;
                    }
                }
            }

            this.children.forEach(a => a.Update());
        }
        if (this.scrollableChildrenUp.length + this.scrollableChildrenDown.length > 0 && this.scrollBar == null) {
            this.scrollBar = new PanelScroll(this);
        }
        if (this.scrollBar) this.scrollBar.Update();
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.x == 0 && this.y == 0) return;
        if (this.isHidden) return;
        if (this.scrollBar) this.scrollBar.Draw(ctx);
        let radius = this.borderRadius;
        let x = this.x;
        let y = this.y;
        let width = this.width;
        let height = this.height;

        ctx.fillStyle = this.backColor;
        ctx.strokeStyle = this.borderColor;
        //ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;
        ctx.translate(this.xOffset, this.yOffset);

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        this.children.forEach(a => a.Draw(ctx));

        ctx.translate(-this.xOffset, -this.yOffset);
    }
}