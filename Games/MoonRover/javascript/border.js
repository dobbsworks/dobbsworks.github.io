class Border {
    Draw() {
        if (this.x !== undefined) {
            renderer.VerticalLine(this.x);
        }
        if (this.y !== undefined) {
            renderer.HorizontalLine(this.y);
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
        renderer.Line(this.x1,this.y,this.x2,this.y);
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