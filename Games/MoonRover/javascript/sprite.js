class Sprite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    dx = 0;
    dy = 0;
    isActive = true;
    color = "white";
    radius = 30;
    Draw() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    Update() {
        // implemented by subclass
        console.error("HEY! You need to extend this class.")
    }

    IsTouchingSprite(sprite) {
        let deltaX = sprite.x - this.x;
        let deltaY = sprite.y - this.y;
        let distanceSquared = deltaX ** 2 + deltaY ** 2;
        let radiusSquared = (sprite.radius + this.radius) ** 2;
        return distanceSquared <= radiusSquared;
    }

    GetTouchingSprites() {
        return sprites.filter(x => x !== this && this.IsTouchingSprite(x));
    }

    ReactToBorders() {
        let touchedBorders = [];
        for (let border of borders) {
            if (border instanceof Floor) {
                if (this.y > border.y - this.radius) {
                    this.y = border.y - this.radius;
                    this.dy = 0;
                    this.dx *= 0.9;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof Ceiling) {
                if (this.y < border.y + this.radius) {
                    this.y = border.y + this.radius;
                    this.dy = 0;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof LeftWall) {
                if (this.x < border.x + this.radius) {
                    this.x = border.x + this.radius;
                    this.dx = 0;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof RightWall) {
                if (this.x > border.x - this.radius) {
                    this.x = border.x - this.radius;
                    this.dx = 0;
                    touchedBorders.push(border);
                }
            }
        }
        return touchedBorders;
    }

    UpdatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    ApplyDrag() {
        this.dx *= 0.98;
        this.dy *= 0.98;
    }

    ApplyGravity() {
        this.dy += 0.07;
    }
}