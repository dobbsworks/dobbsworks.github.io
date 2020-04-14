function MeasureLine(x, dx, color, width) {
    SpriteBase.call(this, x, 0);
    this.color = color;

    var overhang = 20;
    this.y1 = lanes[0].y - overhang;
    this.y2 = lanes.last().y + overhang;
    this.dx = dx;
    this.width = width;

    this.executeRules = function () {
        this.x += this.dx;
        this.y1 = lanes[0].y - overhang;
        this.y2 = lanes.last().y + overhang;

        if (this.x < 400) this.active = false;
    }

    this.draw = function () {
        gameViewContext.strokeStyle = this.color.toString();
        gameViewContext.lineWidth = this.width;
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.x, this.y1);
        gameViewContext.lineTo(this.x, this.y2);
        gameViewContext.closePath();
        gameViewContext.stroke();
    }
}
MeasureLine.prototype = new SpriteBase();
MeasureLine.prototype.constructor = MeasureLine;