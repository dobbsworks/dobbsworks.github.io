class Sprite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    dx = 0;
    dy = 0;
    radius = 30;
    Draw() {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    Update() {
        // implemented by subclass
        console.error("HEY! You need to extend this class.")
    }

    UpdatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    ApplyGravity() {
        this.dy += 0.02;
    }
}