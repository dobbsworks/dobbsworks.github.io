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