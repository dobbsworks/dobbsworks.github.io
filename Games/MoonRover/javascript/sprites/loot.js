class Loot extends Sprite {
    color = "yellow";
    value = 1;
    radius = 20;

    Initialize() {
        let angle = Math.random() * Math.PI / 2
            + Math.PI / 4;
        let force = 2;
        this.dx = force * Math.cos(angle);
        this.dy = force * -Math.sin(angle);
        this.frame = Math.floor(Math.random()*4 * tileset.coin.tiles.length);
    }

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        this.ReactToBorders();
    }

    GetFrameData() {
        return {
            tileset: tileset.coin,
            frame: Math.floor(this.frame/4) % tileset.coin.tiles.length,
            xFlip: false,
        };
    }
}