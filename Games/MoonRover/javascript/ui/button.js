class Button extends UIElement {

    constructor(x, y, text) {
        super();
        this.targetX = x;
        this.targetY = y;
        this.x = x;
        this.y = y;
        this.text = text;
    }

    width = 150;
    height = 100;

    isDisabled = false;

    isMouseOver() {
        return mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height;
    }

    onClick() {
        console.log(this.x, this.y)
    }

    FillBox() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    Draw() {
        ctx.fillStyle = this.colorPrimary;
        if (this.isDisabled) ctx.fillStyle = this.colorDisabled;
        this.FillBox();
        if (this.isMouseOver()) {
            if (isMouseDown) {
                ctx.fillStyle = this.colorShade;
            } else {
                ctx.fillStyle = this.colorHighlight;
            }
            this.FillBox();
            ctx.lineWidth = 4;
            ctx.strokeStyle = this.colorSecondary;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.fillStyle = this.colorText;
        ctx.font = "20px Arial";
        ctx.textAlign = "center"
        ctx.fillText(this.text, this.x + this.width/2, this.y + 30);
    }


}