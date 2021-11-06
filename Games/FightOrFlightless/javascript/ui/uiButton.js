class UiButton {

    constructor(name, x, y, width, height, onClick) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClick = onClick;
    }

    get xCenter() {
        return this.x + this.width / 2;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    Draw() {
        ctx.fillStyle = "#13142d";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isMouseOver()) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#e5a713";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#FFF1";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.fillStyle = "#FFF";
        let fontSize = 16;
        ctx.font = "800 " + fontSize + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.xCenter, this.y + fontSize + 16, this.width);
    }

    isMouseOver() {
        return mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height;
    }

}