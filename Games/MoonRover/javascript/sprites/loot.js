class Loot extends Sprite {
    color = "yellow";
    value = 1;
    radius = 10;

    Initialize() {
        let angle = Math.random() * Math.PI / 2
            + Math.PI / 4;
        let force = 2;
        this.dx = force * Math.cos(angle);
        this.dy = force * -Math.sin(angle);
    }

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        this.ReactToBorders();
    }
}