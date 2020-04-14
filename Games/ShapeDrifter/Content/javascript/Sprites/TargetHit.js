function TargetHit(x, y, dx, shape, radius, isSuccess) {
    SpriteBase.call(this, x, y);
    this.isSuccess = isSuccess;
    this.color = isSuccess ? new Color(255, 255, 255, 1.0) : new Color(92, 0, 92, 1.0);

    var theta = Math.atan2(this.y - scorer.y, this.x - scorer.x);
    this.dx = dx;
    this.dy = dx * Math.tan(theta);

    this.shape = shape;
    this.radius = radius;
    this.radiusRatio = 1.2;

    this.executeRules = function () {
        this.x += this.dx;
        this.y += this.dy;

        this.radius *= this.radiusRatio;
        this.radiusRatio = this.radiusRatio - 0.01;
        this.color.a -= 0.02;

        if (this.x + this.radius < 0) {
            this.active = false;
        }
    }

    this.draw = function () {
        this.shape.draw(this.x, this.y, this.radius, null, null, this.color, null);
    }
}
TargetHit.prototype = new SpriteBase();
TargetHit.prototype.constructor = TargetHit;