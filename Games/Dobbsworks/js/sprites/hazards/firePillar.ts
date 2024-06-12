class FirePillar extends Hazard {
    public height = 24;
    public width = 16;
    public respectsSolidTiles = false;
    warningTime = 45;
    anchor = null;

    Update(): void {
        super.Update();
        if (this.age > this.warningTime + 60) this.isActive = false;
        if (this.age == 1) {
            audioHandler.PlaySound("fire-charge-up", false);
        } 
        if (this.age == this.warningTime) {
            audioHandler.PlaySound("long-fire", false);
        }
    }

    IsHazardActive(): boolean {
        return this.age > this.warningTime;
    }

    protected DoesPlayerOverlap(player: Player): boolean {
        // special override for infinite height hitbox
        let myX = this.x;
        let spriteX = player.x;
        let isXOverlap = myX < spriteX + player.width && myX + this.width > spriteX;
        return isXOverlap;
    }
    

    GetFrameData(frameNum: number): FrameData[] {
        if (this.age < this.warningTime) {
            if (this.age % 6 >= 3) return []
        }

        var frame = Math.floor(frameNum / 6) % 4;
        var yOffset = (frameNum * 1) % 24;
        var mirror = Math.floor(frameNum / 3) % 2 == 0;

        var topOfScreen = camera.y - camera.canvas.height / 2 / camera.scale;
        var bottomOfScreen = camera.y + camera.canvas.height / 2 / camera.scale;

        var targetY = topOfScreen - topOfScreen % 24;
        let ret: FrameData[] = [];
        while (targetY < bottomOfScreen + 24) {
            ret.push({
                imageTile: tiles["flamepillar"][this.age < this.warningTime ? 1 : 0][frame],
                xFlip: mirror,
                yFlip: false,
                xOffset: 7,
                yOffset: -(targetY - this.y) + yOffset
            });
            targetY += 24;
        }
        return ret;
    }
}