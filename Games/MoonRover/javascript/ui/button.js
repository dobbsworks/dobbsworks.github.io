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

    isMousedOver = false; //flag to watch for mouseover change
    isDisabled = false;
    ignoreGamepad = false; // false to allow gamepad to move to button
    holdTimer = 0; // how long has this button been held (for detecting long holds)

    isMouseOver() {
        if (Math.abs(this.targetX - this.x) > 10 || Math.abs(this.targetY - this.y) > 10) return false;
        return mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height;
    }

    isSteadyOnScreen() {
        if (this.x > canvas.width) return false;
        if (this.targetX > canvas.width) return false;
        if (this.y > canvas.height) return false;
        if (this.targetY > canvas.height) return false;

        if (this.x + this.width < 0) return false;
        if (this.targetX + this.width < 0) return false;
        if (this.y + this.height < 0) return false;
        if (this.targetY + this.height < 0) return false;

        return true;
    }

    onClick() {
    }
    onHold() {
        console.log("TEST")
    }
    onMouseOver() {
    }

    FillBox() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    Draw() {
        if (!this.text) return;
        ctx.fillStyle = this.colorPrimary;
        if (this.isDisabled) ctx.fillStyle = this.colorDisabled;
        this.FillBox();
        if (this.state) {
            ctx.fillStyle = this.colorSecondary;
            this.FillBox();
        }
        if (this.isMouseOver() && !this.isDisabled) {
            if (!this.isMousedOver) {
                // we just now moused over
                audioHandler.PlaySound("beep-01");
                if (this.onMouseOver) this.onMouseOver();
            }
            this.isMousedOver = true;
            if (isMouseDown) {
                ctx.fillStyle = this.colorShade;
            } else {
                ctx.fillStyle = this.colorHighlight;
            }
            this.FillBox();
            ctx.lineWidth = 4;
            ctx.strokeStyle = this.colorSecondary;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            this.isMousedOver = false;
        }
        ctx.fillStyle = this.colorText;
        ctx.font = "700 16px Arial";
        ctx.textAlign = "center"

        let lines = this.text.split("\n");
        if (this.text.length > 1 && this instanceof Toggle) {
            lines.push(this.state ? "(ON)" : "(OFF)")
        }
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