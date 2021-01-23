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
        let tileSize = renderer.MapR(32);

        let roomHeight = levelHandler.room.height;
        for (let y = this.y; y < roomHeight; y += 32) {
            let mappedX1 = renderer.MapX(this.x1);
            let mappedX2 = renderer.MapX(this.x2) - tileSize;
            let mappedY = renderer.MapY(y);
            if (mappedY < -tileSize || mappedY > canvas.height) continue;
            if (mappedX1 > -tileSize && mappedX1 < canvas.width) {
                ctx.drawImage(image, 8,8,8,8, mappedX1, mappedY, tileSize, tileSize);
            }
            if (mappedX2 > -tileSize && mappedX2 < canvas.width) {
                ctx.drawImage(image, 8,8,8,8, mappedX2, mappedY, tileSize, tileSize);
            }
        }

        for (let x = this.x1; x < this.x2; x += 32) {
            let mappedX = renderer.MapX(x);
            let mappedY = renderer.MapY(this.y);
            if (mappedX < -tileSize || mappedX > canvas.width) continue;
            if (mappedY < -tileSize || mappedY > canvas.height) continue;
            let isLeftTile = x === this.x1;
            let isRightTile = x === this.x2 - 32;
            let imageSlice = isLeftTile ? 8 : (isRightTile ? 24 : 16);
            ctx.drawImage(image, imageSlice,0,8,8, mappedX, mappedY, tileSize, tileSize);
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