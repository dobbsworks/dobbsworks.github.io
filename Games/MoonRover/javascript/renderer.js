class Renderer { 
    constructor(target) {
        this.target = target;
    }

    targetZoom = 0.5;
    zoom = 1;

    Update() {
        this.zoom += (this.targetZoom - this.zoom) * 0.05;
    }

    Circle(x,y,r) {
        ctx.lineWidth = 2 * this.zoom;
        ctx.beginPath();
        ctx.arc(
            this.MapX(x), 
            this.MapY(y),
            this.MapR(r), 
            0, 2 * Math.PI);
        ctx.fill();
        if (ctx.fillStyle !== "transparent") {
            ctx.stroke();
        }
    }

    Line(x1,y1, x2,y2, extraThickness) {
        ctx.lineWidth = 4 * this.zoom;
        if (extraThickness) {
            ctx.lineWidth = 4 * this.zoom * extraThickness;
        }
        ctx.beginPath();
        ctx.moveTo(this.MapX(x1), this.MapY(y1));
        ctx.lineTo(this.MapX(x2), this.MapY(y2));
        ctx.stroke();
    }

    HorizontalLine(y) {
        this.Line(-99999,y,99999,y);
    }

    VerticalLine(x) {
        this.Line(x,-99999,x,99999);
    }

    MapX(x) {
        let center = canvas.width / 2;
        return center + (x - this.target.x)*this.zoom;
    }

    MapY(y) {
        let center = canvas.height / 2;
        return center + (y - this.target.y)*this.zoom;
    }

    MapR(r) {
        return r*this.zoom;
    }
    
    UnmapX(x) {
        let center = canvas.width / 2;
        return (x - center) / this.zoom + this.target.x;
    }
    
    UnmapY(y) {
        let center = canvas.height / 2;
        return (y - center) / this.zoom + this.target.y;
    }

    
}