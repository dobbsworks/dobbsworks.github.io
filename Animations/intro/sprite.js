class Sprite {
    constructor(tileset, x, y) {
        if (tileset.play) {
            this.video = tileset;
        } else if (typeof tileset == "string" || tileset.addColorStop) {
            this.color = tileset;
        } else {
            this.tileset = tileset;
        }

        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.tile = 0;
        this.isActive = true;
    }
    rotation = 0;

    updateRules = [];

    Update(frameNum) {
    }

    get baseY() {
        return this.tileset.height / 2 + this.initialY;
    }

    Draw(ctx, frameNum) {
        if (this.tileset) {
            let image = this.tileset.image;
            let sw = this.tileset.width;
            let sh = this.tileset.height;
            let sx = sw * (this.tile % this.tileset.cols);
            let sy = sh * Math.floor(this.tile / this.tileset.cols);

            // trim edges to reduce bleed
            sx += 0.05;
            sy += 0.05;
            sw -= 0.1;
            sh -= 0.1;

            let dx = this.x;
            let dy = this.y;
            let dw = sw * (this.scale || 1) * (this.xScale || 1);
            let dh = sh * (this.scale || 1) * (this.yScale || 1);

            ctx.save();
            ctx.transform(1, 0, 0, 1, dx, dy);
            ctx.rotate(this.rotation);
            ctx.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();
        } else if (this.color) {
            ctx.save();
            ctx.transform(1, 0, 0, 1, this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            let width = (this.scale || 1) * (this.xScale || 1);
            let height = (this.scale || 1) * (this.yScale || 1);
            ctx.fillRect(-width/2, -height/2, width, height);
            ctx.restore();
        } else if (this.video) {
            ctx.save();
            ctx.transform(1, 0, 0, 1, this.x, this.y);
            ctx.rotate(this.rotation);
            let width = (this.scale || 1) * (this.xScale || 1);
            let height = (this.scale || 1) * (this.yScale || 1);
            ctx.drawImage(this.video, 0, 0, 1920, 1080,
                -width/2, -height/2, width, height)
            ctx.restore();
        }
    }
}


class Keyframe {
    constructor(frameNum, targetValues, type) {
        this.frameNum = frameNum;
        this.x = targetValues.x;
        this.y = targetValues.y;
        this.rotation = targetValues.rotation;
        this.parent = targetValues.parent;
        this.type = type;
    }
}