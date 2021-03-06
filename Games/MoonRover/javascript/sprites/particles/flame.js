class Flame extends Sprite {
    
    timer = 0;
    duration = 60*2;

    Initialize() {
        this.dy = -5;
        this.dx = (Math.random() * 4) - 2;
    }

    Update() {
        this.timer++;
        this.UpdatePosition();

        if (this.timer > this.duration) {
            this.isActive = false;
        }
    }

    GetFrameData() {
        let frameNum = Math.floor(
            (this.timer / this.duration) * tileset.flame.tiles.length
        );
        if (frameNum >= tileset.flame.tiles.length - 1) {
            frameNum = tileset.flame.tiles.length - 1;
        }
        return {
            tileset: tileset.flame,
            frame: frameNum,
            xFlip: Math.random() > 0.5,
        };
    }
}