class Border {
    Draw() {
        if (this.x !== undefined) {
            ctx.strokeStyle = "black";
            renderer.VerticalLine(this.x-2);
            ctx.strokeStyle = "white";
            renderer.VerticalLine(this.x);
        }
        if (this.y !== undefined) {
            ctx.strokeStyle = "black";
            renderer.HorizontalLine(this.y+2);
            ctx.strokeStyle = "white";
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
        let image = document.getElementById("tileset-01");

        ctx.drawImage(image, 8,8,8,8, 
            renderer.MapX(this.x1),
            renderer.MapY(this.y), 
            renderer.MapR(32), 
            1000);

        ctx.drawImage(image, 8,8,8,8, 
            renderer.MapX(this.x2 - 32),
            renderer.MapY(this.y), 
            renderer.MapR(32), 
            1000);

        ctx.drawImage(image, 16,0,8,8, 
            renderer.MapX(this.x1),
            renderer.MapY(this.y), 
            renderer.MapR(this.x2-this.x1), 
            renderer.MapR(32));
        // ctx.strokeStyle = "black";
        // renderer.Line(this.x1-2,this.y+2,this.x2-2,this.y+2);
        // ctx.strokeStyle = "white";
        // renderer.Line(this.x1,this.y,this.x2,this.y);
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