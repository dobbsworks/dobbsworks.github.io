class Explosion extends Sprite {
    
    timer = 0;
    duration = 60*0.5;
    flip = false;

    Initialize() {
        this.flip = Math.random() < 0.5;
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
            (this.timer / this.duration) * tileset.explosion.tiles.length
        );
        if (frameNum >= tileset.explosion.tiles.length - 1) {
            frameNum = tileset.explosion.tiles.length - 1;
        }
        return {
            tileset: tileset.explosion,
            frame: frameNum,
            xFlip: this.flip,
        };
    }
}