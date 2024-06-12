class FirePillarTrigger extends Sprite {
    public height: number = 24;
    public width: number = 24;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;
    
    GetThumbnail(): ImageTile {
        return tiles["flametrigger"][0][0];
    }

    Update(): void {
        if (this.IsOnScreen()) {
            // how far is this, top to bottom?
            var bottomOfScreen = camera.y + camera.canvas.height / 2 / camera.scale;
            var topOfScreen = camera.y - camera.canvas.height / 2 / camera.scale;
            var leftOfScreen = camera.x + camera.canvas.width / 2 / camera.scale;
            var rightOfScreen = camera.x - camera.canvas.width / 2 / camera.scale;
            var vertMargin = (this.y - bottomOfScreen) + (topOfScreen - this.yBottom);
            var horizontalMargin = (this.x - leftOfScreen) + (rightOfScreen - this.xRight);
            var vertRatio = (this.y - bottomOfScreen) / vertMargin; // [0.0, 1.0] = [top, bottom]
            var horizRatio = 1 - (this.x - leftOfScreen) / horizontalMargin; // [0.0, 1.0] = [left, right]
            if (Math.abs(vertRatio - horizRatio) < 0.1) {
                // LAUNCH
                let newSprite = this.ReplaceWithSpriteType(FirePillar);
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["flametrigger"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        } else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    }
}