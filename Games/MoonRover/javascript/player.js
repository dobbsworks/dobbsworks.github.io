class Player extends Sprite {
    color = "blue";
    Update() {
        if (isMouseClicked()) {
            // weapon fired
            let xDif = this.x - mouseX;
            let yDif = this.y - mouseY;
            let theta = Math.atan2(yDif, xDif);

            let pushbackForce = 4;
            this.dx += pushbackForce * Math.cos(theta);
            this.dy += pushbackForce * Math.sin(theta);

            let bullet = new PlayerBullet(this.x, this.y);
            bullet.dx = -pushbackForce * Math.cos(theta) * 4;
            bullet.dy = -pushbackForce * Math.sin(theta) * 4;
            sprites.push(bullet);
        }
        this.ApplyGravity();
        this.UpdatePosition();
        this.ReactToBorders();
    }

}