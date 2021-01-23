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
    frame = 0;
    maxHp = 3;

    Draw() {
        if (this.OnBeforeDraw) this.OnBeforeDraw();
        ctx.strokeStyle = "black";
        if (this.children) {
            for (let child of this.children) {
                if (child.isActive) {
                    renderer.Line(this.x, this.y, child.x, child.y);
                }
            }
        }

        if (this.IsOffScreen()) return;

        if (this.GetFrame) {
            let frame = this.GetFrame();
            renderer.Tile(tileset.orangeBot.tiles[frame], this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            if (this.hurtTimer) {
                ctx.fillStyle = "magenta";
            }
            renderer.Circle(this.x, this.y, this.radius);
        }

        if (this.OnAfterDraw) this.OnAfterDraw();
        if (uiHandler.debugMode) {
            ctx.strokeStyle = "white";
            renderer.Line(this.x, this.y, this.x + this.dx * 20, this.y + this.dy * 20);
            ctx.fillStyle = "#FFF0";
            renderer.Circle(this.x, this.y, this.radius);
        }
    }

    AnimateByFrame(frameset) {
        return this.frame % frameset.tiles.length;
    }

    IsOffScreen() {
        let buffer = renderer.MapR(this.r + 10);
        let centerX = renderer.MapX(this.x);
        let centerY = renderer.MapY(this.y);
        if (centerX + buffer < 0) return true;
        if (centerX - buffer > canvas.width) return true;
        if (centerY + buffer < 0) return true;
        if (centerY - buffer > canvas.height) return true;
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
            if (border instanceof Platform) {
                let isOldSpriteOverPlatform = this.oldY + this.radius <= border.y;
                let isNewSpriteUnderPlatform = this.y + this.radius > border.y;
                if (isOldSpriteOverPlatform && isNewSpriteUnderPlatform) {
                    // let dy = this.y - this.oldY;
                    // let dx = this.x - this.oldX;
                    let isOldXInBounds = this.oldX >= border.x1 && this.oldX <= border.x2;
                    let isNewXInBounds = this.x >= border.x1 && this.x <= border.x2;
                    if (isOldXInBounds && isNewXInBounds) {
                        this.y = border.y - this.radius;
                        this.dy = 0;
                        this.dx *= 0.9;
                        touchedBorders.push(border);
                    }
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