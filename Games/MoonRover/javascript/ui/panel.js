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

    Draw() {
        ctx.fillStyle = this.colorPrimary;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }


}