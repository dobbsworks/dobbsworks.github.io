class Renderer {
    constructor(target) {
        this.target = target;
    }

    targetZoom = 0.5;
    zoom = 1;

    Update() {
        this.zoom += (this.targetZoom - this.zoom) * 0.05;
    }

    Text(x, y, fontSize, text) {
        ctx.lineWidth = 10 * this.zoom;
        ctx.font = fontSize + "px Courier New";
        ctx.textAlign = "center";
        ctx.strokeText(text, this.MapX(x), this.MapY(y));
        ctx.fillText(text, this.MapX(x), this.MapY(y));
    }

    Circle(x, y, r) {
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

    Tile(tile, x, y, flip) {
        if (!tile) return;

        if (currentCharacter && currentCharacter.isBlind) {
            return;
        }
        let scale = 4;

        ctx.translate(this.MapX(x), 0);
        if (flip) ctx.scale(-1, 1);
        tile.Draw(ctx,
            this.MapR(- tile.width / 2 * scale),
            this.MapY(y - tile.height / 2 * scale),
            scale * renderer.zoom
        );
        if (flip) ctx.scale(-1, 1);
        ctx.translate(-this.MapX(x), 0);

    }

    Line(x1, y1, x2, y2, extraThickness) {
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
        if (player.y > y) y -= 32;
        else {
            ctx.fillStyle = "#5d6a6d";
            let mappedY = renderer.MapY(y + 32);
            ctx.fillRect(0, mappedY, canvas.width, canvas.height);
        }
        let image = document.getElementById("tileset-01");
        let tileSize = +(renderer.MapR(32).toFixed(0));
        for (let x = -32; x < levelHandler.room.width; x += 32) {
            let mappedX = renderer.MapX(x);
            let mappedY = renderer.MapY(y);
            if (mappedX < -tileSize || mappedX > canvas.width) continue;
            if (mappedY < -tileSize || mappedY > canvas.height) continue;
            ctx.drawImage(image, 16, 8, 9, 8, mappedX, mappedY, tileSize + 2, tileSize);
        }
    }

    VerticalLine(x) {
        if (player.x > x) x -= 32;
        let image = document.getElementById("tileset-01");
        let tileSize = +(renderer.MapR(32).toFixed(0));
        for (let y = 0; y < levelHandler.room.height; y += 32) {
            let mappedX = renderer.MapX(x);
            let mappedY = renderer.MapY(y);
            if (mappedX < -tileSize || mappedX > canvas.width) continue;
            if (mappedY < -tileSize || mappedY > canvas.height) continue;
            ctx.drawImage(image, 16, 8, 8, 9, mappedX, mappedY, tileSize, tileSize + 2);
        }
    }

    MapX(x) {
        let center = canvas.width / 2;
        center += 100; // sidebar
        return center + (x - this.target.x) * this.zoom;
    }

    MapY(y) {
        let center = canvas.height / 2;
        return center + (y - this.target.y) * this.zoom;
    }

    MapR(r) {
        return r * this.zoom;
    }

    UnmapX(x) {
        let center = canvas.width / 2;
        center += 100; // sidebar
        return (x - center) / this.zoom + this.target.x;
    }

    UnmapY(y) {
        let center = canvas.height / 2;
        return (y - center) / this.zoom + this.target.y;
    }


}