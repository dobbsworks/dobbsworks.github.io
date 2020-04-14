function Lane(y, targetY) {
    SpriteBase.call(this, 0, y);
    this.color = new Color(255, 255, 255, 1.0);
    this.x1 = 400;
    this.x2 = 1440;
    this.targetY = targetY;
    if (!targetY) this.targetY = this.y;
    this.catcher = new Catcher(this.x1, this);

    sprites.push(this.catcher);

    this.executeRules = function () {
        if (this.targetY) {
            if (Math.abs(this.targetY - this.y) < 1) {
                this.y = this.targetY;
            } else {
                this.y += (this.targetY - this.y) / 50;
            }
        }
    }

    this.draw = function () {
        gameViewContext.strokeStyle = this.color.toString();
        gameViewContext.lineWidth = 3;
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.x1, this.y);
        gameViewContext.lineTo(this.x2, this.y);
        gameViewContext.closePath();
        gameViewContext.stroke();
    }
}
Lane.prototype = new SpriteBase();
Lane.prototype.constructor = Lane;