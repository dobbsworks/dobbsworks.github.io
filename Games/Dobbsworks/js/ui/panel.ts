class Panel extends UIElement {

    constructor(x: number, y: number, public width: number, public height: number) {
        super(x, y);
        this.targetWidth = width;
        this.targetHeight = height;
        this.initialWidth = width;
        this.initialHeight = height;
    }

    children: UIElement[] = [];
    scrollableChildren: UIElement[] = [];
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

    Scroll(direction: -1 | 1): void {
        if (this.scrollableChildren.length == 0) return;
        audioHandler.PlaySound("scroll", true);
        if (direction == 1) {
            this.scrollIndex--;
            this.scrollableChildren.push(this.children.splice(0, 1)[0]);
            this.children.push(this.scrollableChildren.splice(0, 1)[0]);
        } else {
            this.scrollIndex++;
            let el1 = this.children.splice(this.children.length - 1, 1)[0];
            this.scrollableChildren.unshift(el1);
            let el2 = this.scrollableChildren.splice(this.scrollableChildren.length - 1, 1)[0];
            this.children.unshift(el2);
        }
        this.children.forEach(a => a.parentElement = this);
    }

    Update(): void {
        if (uiHandler.mousedOverElements.indexOf(this) > -1) {
            if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true)) this.Scroll(-1);
            if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true)) this.Scroll(1);
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
            let y = this.y + this.height - this.margin - children[0].height;
            for (let child of children) {
                if (!child.fixedPosition) {
                    child.targetX = x;
                    child.x = x;
                    if (this.layout == "horizontal") x += Math.max(child.width + marginWidth, 0);
                    if (this.layout == "vertical" && children.filter(a => !a.isHidden)[0] !== child) y -= Math.max(child.height + marginHeight, 0);
                    child.targetY = y;
                    child.y = y;
                    if (child instanceof Panel) {
                        if (this.layout == "vertical") child.targetWidth = this.width - this.margin * 2;
                    }
                }
            }

            this.children.forEach(a => a.Update());
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHidden) return;
        let radius = this.borderRadius;
        let x = this.x;
        let y = this.y;
        let width = this.width;
        let height = this.height;

        ctx.fillStyle = this.backColor;
        ctx.strokeStyle = this.borderColor;
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

        if (this.scrollableChildren.length > 0) {
            let x1 = x + width + 2;

            var DrawScroll = function (x: number, y: number, width: number, height: number, radius: number, inset: number): void {
                ctx.beginPath();
                ctx.moveTo(x + inset, y + height - radius);
                ctx.lineTo(x + inset, y + radius);
                ctx.lineTo(x + radius, y + inset);
                ctx.lineTo(x + radius * 2 - inset, y + radius);
                ctx.lineTo(x + radius * 2 - inset, y + height - radius);
                ctx.lineTo(x + radius, y + height - inset);
                ctx.lineTo(x + inset, y + height - radius);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            DrawScroll(x1, y, width, height, radius, 0);
            ctx.fillStyle = "#FFF8";
            let totalElements = (this.children.length + this.scrollableChildren.length);
            let displayedRatio = this.children.length / totalElements;
            let scrollOffset = (this.scrollIndex % totalElements);
            if (scrollOffset < 0) scrollOffset += totalElements;
            let scrollOffsetRatio = scrollOffset / totalElements;
            y += (height - 2 * radius - 4) * scrollOffsetRatio;

            let innerHeight = height * displayedRatio;
            if (y + innerHeight > this.y + this.height) {
                innerHeight = this.y + this.height - y;
                let leftover = height * displayedRatio - innerHeight;
                DrawScroll(x1, this.y, width, leftover, radius, 4);
            }
            DrawScroll(x1, y, width, innerHeight, radius, 4);
        }

        this.children.forEach(a => a.Draw(ctx));

        ctx.translate(-this.xOffset, -this.yOffset);
    }
}