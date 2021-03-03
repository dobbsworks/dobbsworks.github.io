class LevelExit extends Sprite {

    Initialize() {
    }

    Update() {
        this.y += Math.cos(this.frame / 30) * 2;

        let targetY = levelHandler.room.height - Math.min(levelHandler.room.width / 2, levelHandler.room.height / 2);
        let yDelta = targetY - this.y;
        this.y += yDelta * 0.01;
    }

    GetFrameData() {
        return {
            tileset: tileset.star,
            frame: Math.floor(this.frame/2) % tileset.star.tiles.length,
            xFlip: false,
        };
    }
}