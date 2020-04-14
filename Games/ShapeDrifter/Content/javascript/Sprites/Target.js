function Target(x, lane, dx, color, shape) {
    SpriteBase.call(this, x, lane.y);
    this.color = color;
    this.shape = shape;
    this.dx = dx;
    this.radius = 15;
    this.lineWidth = 3
    this.lane = lane;
    this.isPowerup = false;
    this.isPowerdown = false;

    this.activatePower = function () { }

    this.executeRules = function () {
        if (!(this.isPowerdown || this.isPowerup)) {
            if (effects.colorBlind) {
                this.color = new Color(30, 30, 30, 1.0);
            }
            if (effects.unity) {
                this.shape = shapes.circle;
                this.color = this.shape.color;
            }
        }
        this.x += this.dx;
        this.y = this.lane.y;

        if (this.x < 400) {
            var me = this;
            var catcher = sprites.filter(function (spr) { return spr instanceof Catcher && Math.abs(spr.y - me.y) < 5 })[0];
            var isHit = (this.y == catcher.y && this.shape == catcher.shape);

            if (this.isPowerup) {
                if (isHit) {
                    this.activatePower();
                }
            } else if (this.isPowerdown) {
                if (isHit) {
                    this.activatePower();
                }
            } else {
                if (isHit) {
                    scorer.score += (10 + (scorer.combo > 20 ? 20 : scorer.combo));
                    scorer.successes++;
                } else {
                    scorer.misses++;
                }
                sprites.push(new TargetHit(this.x, this.y, -4, this.shape, this.radius, isHit));
            }
            this.active = false;
        }
    }

    this.draw = function () {
        this.shape.draw(this.x, this.y, this.radius, this.lineWidth, this.color, null, null);
    }
}
Target.prototype = new SpriteBase();
Target.prototype.constructor = Target;