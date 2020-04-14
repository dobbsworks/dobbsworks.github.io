function Laser(x1, y1, x2, y2) {
    SpriteBase.call(this, (x1 + x2)/2, (y1 + y2)/2);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.width = x2 - x1;
    this.height = y2 - y1;

    this.deadly = true;
    this.solid = true;

    this.color = new Color(255, 0, 0, 0.8);
    this.borderColor = new Color(255, 255, 255, 1.0);

    this.executeRules = function () {
    };

    this.draw = function () {
        gameViewContext.strokeStyle = this.color.toString();
        gameViewContext.lineWidth = 3;

        gameViewContext.shadowColor = this.borderColor.toString();
        gameViewContext.shadowBlur = this.camera.scale * 2;

        this.camera.drawLine(this.x1, this.y1, this.x2, this.y2);
        gameViewContext.shadowBlur = 0;

    }
}
Laser.prototype = new SpriteBase();
Laser.prototype.constructor = Laser;