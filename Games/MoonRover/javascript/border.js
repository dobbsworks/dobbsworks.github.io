class Border {
    Draw() {
        if (this.x !== undefined) {
            ctx.beginPath();
            ctx.moveTo(this.x, 0);
            ctx.lineTo(this.x, canvas.height);
            ctx.stroke();
        }
        if (this.y !== undefined) {
            ctx.beginPath();
            ctx.moveTo(0, this.y);
            ctx.lineTo(canvas.width, this.y);
            ctx.stroke();
        }
    }
}

class Platform extends Border {
    constructor(x1,x2,y) {
        super();
        this.x1 = Math.min(x1, x2);
        this.x2 = Math.max(x1, x2);
        this.y = y;
    }
    Draw() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y);
        ctx.lineTo(this.x2, this.y);
        ctx.stroke();
    }
}

class Floor extends Border {
    constructor(y) {
        super();
        this.y = y;
    }
}

class Ceiling extends Border {
    constructor(y) {
        super();
        this.y = y;
    }
}

class LeftWall extends Border {
    constructor(x) {
        super();
        this.x = x;
    }
}

class RightWall extends Border {
    constructor(x) {
        super();
        this.x = x;
    }
}