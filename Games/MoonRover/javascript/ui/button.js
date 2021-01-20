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
    }

    FillBox() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    Draw() {
        if (!this.text) return;
        ctx.fillStyle = this.colorPrimary;
        if (this.isDisabled) ctx.fillStyle = this.colorDisabled;
        this.FillBox();
        if (this.isMouseOver() && !this.isDisabled) {
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
        ctx.font = "700 16px Arial";
        ctx.textAlign = "center"

        let lines = this.text.split("\n");
        let y = this.y + 30;
        for (let line of lines) {
            if (line.startsWith("$")) {
                y += 10;
                ctx.font = "800 20px Arial";
                if (this.tooExpensive) {
                    ctx.fillStyle = "#C33";
                }
            }
            ctx.fillText(line, this.x + this.width/2, y);
            y += 20;
            ctx.font = "16px Arial";
        }
    }


}