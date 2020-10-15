class Enemy extends Sprite {
    color = "red";
    direction = 1;
    hp = 3;
    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.some(x => x instanceof LeftWall)) {
            this.direction = 1;
        }
        if (touchedBorders.some(x => x instanceof RightWall)) {
            this.direction = -1;
        }
        let speed = 1;
        this.dx = this.direction * speed;

        if (this.hp <= 0) {
            this.isActive = false;
            setTimeout(()=>{
                sprites.push(new Enemy(350,0))
            },1000)
        }
    }
}