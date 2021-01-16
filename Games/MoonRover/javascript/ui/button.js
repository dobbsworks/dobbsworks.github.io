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

    Draw() {
        ctx.fillStyle = this.colorPrimary;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.isMouseOver()) {
            if (isMouseDown) {
                ctx.fillStyle = this.colorShade;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.colorHighlight;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
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