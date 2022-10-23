class Yoyo extends Sprite {

    public height: number = 5;
    public width: number = 6;
    respectsSolidTiles = true;
    canBeHeld = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    OnThrow(thrower: Sprite, direction: -1|1) { if (thrower instanceof Player) this.YoyoThrow(direction); }
    OnUpThrow(thrower: Sprite, direction: -1|1) { if (thrower instanceof Player) this.YoyoThrow(direction); }
    OnDownThrow(thrower: Sprite, direction: -1|1) { if (thrower instanceof Player) this.YoyoThrow(direction); }

    YoyoThrow(facing: -1|1): void {
        let horizontalDir = KeyboardHandler.IsKeyPressed(KeyAction.Left, false) ? -1 :
            KeyboardHandler.IsKeyPressed(KeyAction.Right, false) ? 1 : 0;
        let verticalDir = KeyboardHandler.IsKeyPressed(KeyAction.Up, false) ? -1 :
                KeyboardHandler.IsKeyPressed(KeyAction.Down, false) ? 1 : 0;
        if (horizontalDir == 0 && verticalDir == 0) horizontalDir = facing;

        let newSprite = this.ReplaceWithSpriteType(SpinningYoyo);
        audioHandler.PlaySound("yoyo", false);
        let isDiagonal = horizontalDir != 0 && verticalDir != 0;
        let baseSpeed = 3;
        if (isDiagonal) baseSpeed /= Math.sqrt(2);
        newSprite.dx = horizontalDir * baseSpeed;
        newSprite.dy = verticalDir * baseSpeed;
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["yoyo"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: -1,
            yOffset: -1
        };
    }
}

class SpinningYoyo extends Sprite {

    public height: number = 4;
    public width: number = 4;
    respectsSolidTiles = false;
    canBeHeld = false;

    Update(): void {
        if (this.age <= 12) {
            if (player) player.yoyoTarget = this;
            this.MoveByVelocity();
        } else if (this.age == 32) {
            this.ReplaceWithSpriteType(Poof);
            if (player) {
                let theta = Math.atan2(this.yBottom - player.yMid, this.xMid - player.xMid);
                let speed = 3;
                player.dx = speed * Math.cos(theta);
                player.dy = speed * Math.sin(theta);
                player.yoyoTarget = null;
                player.yoyoTimer = 10;
            }
        }
    }

    OnBeforeDraw(camera: Camera): void {
        if (!player) return
        let theta = Math.atan2(this.yBottom - player.y, this.xMid - player.xMid);
        let distance = Math.sqrt((this.xMid - player.xMid)**2 + (this.yBottom - player.y)**2 );
        camera.ctx.fillStyle = "#000";
        for (let r = 3; r < distance; r += 3) {

            let gameX = r * Math.cos(theta) + player.xMid;
            let gameY = r * Math.sin(theta) + player.y;

            let destX = (gameX - camera.x) * camera.scale + camera.canvas.width / 2;
            let destY = (gameY - camera.y) * camera.scale + camera.canvas.height / 2;

            camera.ctx.fillRect(destX, destY, 1 * camera.scale, 1 * camera.scale)
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(this.age / 3) % 4;
        return {
            imageTile: tiles["yoyo"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: -1,
            yOffset: -1
        };
    }
}