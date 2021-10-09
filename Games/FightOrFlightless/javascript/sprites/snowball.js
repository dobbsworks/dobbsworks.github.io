class Snowball extends Sprite {

    constructor(x, y, target) {
        super(x, y, images.art);
        this.tile = 7;
        this.target = target;
        this.targetX = target.x;
        this.targetY = target.y;
    }

    drawOrder = 150;

    Update() {
        if (this.target.isActive) {
            this.targetX = this.target.x;
            this.targetY = this.target.y;
        }

        let speed = 3;

        let theta = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.x += speed * Math.cos(theta);
        this.y += speed * Math.sin(theta);

        let distanceToTarget = (this.x - this.targetX) ** 2 + (this.y - this.targetY) ** 2;
        if (distanceToTarget < speed ** 2) {
            this.isActive = false;
            if (this.target.isActive) {
                this.target.hp -= 1;
            }
        }
    }
}