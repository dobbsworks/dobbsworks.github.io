class ExtraHitHeart extends Sprite {

    public height: number = 9;
    public width: number = 9;
    respectsSolidTiles = true;
    canBeHeld = true;
    slowFall = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (player && player.Overlaps(this)) {
            audioHandler.PlaySound("heart", false);
            player.heldItem = null;
            this.isActive = false;
            player.extraHits += 1;
            this.layer.sprites.push(new ExtraHitHeartAnimation(this.x, this.y, this.layer, []));
            let floatingHeart = new ExtraHitHeartSmall(this.x, this.y, this.layer, []);
            let latestFloatingHeart = <ExtraHitHeartSmall[]>this.layer.sprites.filter(a => a instanceof ExtraHitHeartSmall);
            if (latestFloatingHeart.length > 0) {
                floatingHeart.parent = latestFloatingHeart[latestFloatingHeart.length - 1];
            } else {
                floatingHeart.parent = player;
            }
            this.layer.sprites.push(floatingHeart);
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["heart"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}
class ExtraHitHeartAnimation extends Sprite {
    public height: number = 9;
    public width: number = 9;
    respectsSolidTiles = false;
    canBeHeld = false;

    Update(): void {
        if (player) {
            this.x = player.xMid - this.width / 2;
            this.y = player.y - this.height - Math.max(this.age / 10, 6);
        }
        if (this.age > 60) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(this.age / 3) % 3;
        return {
            imageTile: tiles["heart"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}


class ExtraHitHeartSmall extends Sprite {
    // floats around player
    public height: number = 4;
    public width: number = 5;
    respectsSolidTiles = false;
    canBeHeld = false;
    parent!: ExtraHitHeartSmall | Player;
    direction: -1 | 1 = 1;
    index = 0;

    Update(): void {
        if (this.parent instanceof Player) {
            this.index = 1;
        } else {
            this.index = this.parent.index + 1;
        }
        this.direction = this.parent.direction;
        if (player) {
            let targetX = this.parent.x - this.direction * this.parent.width;
            let targetY = this.parent.y - Math.sin((player.age / 120) + this.index / 4) * 1;
            this.x += (targetX - this.x) * 0.06;
            this.y += (targetY - this.y) * 0.06;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["heartSmall"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}
class ExtraHitHeartSmallLoss extends Sprite {
    public height: number = 4;
    public width: number = 5;
    respectsSolidTiles = false;
    canBeHeld = false;

    Update(): void {
        this.y -= 0.1;
        if (this.age > 60) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(this.age / 3) % 3;
        return {
            imageTile: tiles["heartSmall"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}