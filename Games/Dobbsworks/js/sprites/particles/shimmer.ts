class Shimmer extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;

    imageName = "shimmer";

    Update(): void {
        if (this.age > 20) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0];
        let frameIndex = Math.floor(this.age / 2) % frames.length;
        let frame = frames[frameIndex];
        return {
            imageTile: tiles[this.imageName][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}

class ShimmerRipple extends Sprite {
    public height: number = 1;
    public width: number = 1;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;

    initialized = false;
    maxRadiusPixels = 36;
    currentRevealRadius = 0;
    revealSpeed = 0.8;
    queuedShimmers: { tileX: number, tileY: number, distance: number }[] = [];

    Initialize(): void {
        // scan for shimmer tiles in a radius, determine time to trigger particles at each location
        let minTileX = Math.floor((this.x - this.maxRadiusPixels) / this.layer.tileWidth);
        let minTileY = Math.floor((this.y - this.maxRadiusPixels) / this.layer.tileHeight);
        let tileRadius = Math.floor(this.maxRadiusPixels / this.layer.tileWidth);

        for (let x = minTileX; x <= minTileX + tileRadius * 2; x++) {
            for (let y = minTileY; y < minTileY + tileRadius * 2; y++) {
                if (!this.layer.tiles[x]) continue;
                let potentialShimmerTile = this.layer.tiles[x][y];
                if (!potentialShimmerTile) continue;
                if (!potentialShimmerTile.tileType.shimmers) continue;
                let xDist = (potentialShimmerTile.tileX + 0.5) * this.layer.tileWidth - this.x;
                let yDist = (potentialShimmerTile.tileY + 0.5) * this.layer.tileHeight - this.y;
                let distance = Math.sqrt(xDist ** 2 + yDist ** 2);
                if (distance <= this.maxRadiusPixels) {
                    this.queuedShimmers.push({ tileX: potentialShimmerTile.tileX, tileY: potentialShimmerTile.tileY, distance: distance });
                }
            }
        }
    }

    Update(): void {
        if (!this.initialized) {
            this.Initialize();
            this.initialized = true;
        }

        this.currentRevealRadius += this.revealSpeed;
        let toReveal = this.queuedShimmers.filter(a => a.distance <= this.currentRevealRadius);
        // remove revealed blocks from list
        this.queuedShimmers = this.queuedShimmers.filter(a => a.distance > this.currentRevealRadius);
        for (let tile of toReveal) {
            this.layer.sprites.push(new Shimmer(tile.tileX * this.layer.tileWidth, tile.tileY * this.layer.tileHeight, this.layer, []));
        }
        if (this.queuedShimmers.length == 0 && this.currentRevealRadius > this.maxRadiusPixels) this.isActive = false;

        if (this.maxRadiusPixels > 50) {
            // jump shimmers don't count, need lightbulb shimmer
            let ghosts = this.layer.sprites.filter(a => a.isDestroyedByLight);
            for (let ghost of ghosts) {
                let distance = Math.sqrt((this.x - ghost.x) ** 2 + (this.y - ghost.y) ** 2);
                if (Math.abs(distance - this.currentRevealRadius) < 5) {
                    ghost.ReplaceWithSpriteType(Poof);
                }
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["shimmer"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnAfterDraw(camera: Camera): void {
        let ctx = camera.ctx;
        if (this.currentRevealRadius > 3) {
            let x = (this.x - camera.x) * camera.scale + camera.canvas.width / 2;
            let y = (this.y - camera.y) * camera.scale + camera.canvas.height / 2;
            ctx.strokeStyle = "#FFF3";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, this.currentRevealRadius * camera.scale, -Math.PI / 2, 2 * Math.PI - Math.PI / 2, false);
            ctx.stroke();

        }
    }
}