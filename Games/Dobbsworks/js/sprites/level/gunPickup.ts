class GunPickup extends Sprite {

    public height: number = 6;
    public width: number = 10;
    respectsSolidTiles = false;
    canBeHeld = false;
    anchor = null;

    isExemptFromSilhoutte = true;
    Update(): void {
        this.ApplyInertia();
        this.MoveByVelocity();
        if (player && player.Overlaps(this)) {
            audioHandler.PlaySound("gun-up", false);
            this.isActive = false;
            player.heldItem = null;
            player.hasGun = true;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 4) % 16;
        if (col >= 8) col = 0;

        return {
            imageTile: tiles["gunPickup"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: Math.sin(frameNum / 40)
        };
    }
}

class GunDropped extends Sprite {
    public height: number = 6;
    public width: number = 10;
    respectsSolidTiles = false;
    canBeHeld = false;

    Update(): void {
        this.ApplyGravity();
        this.MoveByVelocity();
        if (!this.IsOnScreen()) {
            this.isActive = false;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 4) % 2;

        if (frame == 0) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }

        return {
            imageTile: tiles["gunPickup"][0][0],
            xFlip: false,
            yFlip: true,
            xOffset: 0,
            yOffset: 0
        };
    }
}