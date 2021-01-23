class Panel extends UIElement {

    constructor(x, y, width, height) {
        super();
        this.targetX = x;
        this.targetY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    border = 0;

    Draw() {
        ctx.fillStyle = this.colorPrimary;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.border) {
            ctx.lineWidth = this.border;
            ctx.strokeStype = this.colorSecondary;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }


}