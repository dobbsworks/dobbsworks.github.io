class SpinRing extends Sprite {

    public height: number = 10;
    public width: number = 22;
    respectsSolidTiles = false;

    protected col = 0;
    protected overlayType: SpriteType = ColorRingOverlay;
    private overlay: ColorRingOverlay | null = null;

    spinTimer = 0;
    animationOffset = 0;
    isReusable = true;

    rowOffset = 0;

    Update(): void {
        if (!this.overlay) {
            this.overlay = <ColorRingOverlay>(new this.overlayType(this.x, this.y, this.layer, []));
            this.layer.sprites.push(this.overlay);
        }

        if (this.spinTimer > 0) {
            this.spinTimer--;
            this.animationOffset += this.spinTimer / 2;
        }

        this.overlay.x = this.x;
        this.overlay.y = this.y;
        this.overlay.animationOffset = this.animationOffset;
    }

    OnPlayerUseSpinRing(): void {
        this.spinTimer = 30;
        if (!this.isReusable) {
            this.ReplaceWithSpriteType(Poof);
            if (this.overlay) this.overlay.isActive = false;
        }
    }

    GetFrameData(frameNum: number): FrameData[] {
        if (editorHandler.isInEditMode) {
            return [{
                imageTile: tiles["colorRing"][0][0 + this.rowOffset],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 1
            },{
                imageTile: tiles["colorRing"][1][0 + this.rowOffset],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 1
            }];
        }

        let row = Math.floor((frameNum + this.animationOffset) / 5) % 3;
        return [{
            imageTile: tiles["colorRing"][this.col][row + this.rowOffset],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 1
        }];
    }

    GetThumbnail(): ImageTile {
        return tiles["colorRingThumb"][0][0 + this.rowOffset/3];
    }
}

class ColorRingOverlay extends SpinRing {
    protected col = 1;
    zIndex = 1;
    Update() { }
}

class FragileSpinRing extends SpinRing {
    overlayType = FragileSpinRingOverlay;
    rowOffset = 3;
    isReusable = false;
}

class FragileSpinRingOverlay extends FragileSpinRing {
    protected col = 1;
    zIndex = 1;
    Update() { }
}