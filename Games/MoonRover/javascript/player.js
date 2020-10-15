class Player extends Sprite {
    Update() {
        if (isMouseClicked()) {
            // weapon fired
            let xDif = this.x - mouseX;
            let yDif = this.y - mouseY;
            let theta = Math.atan2(yDif, xDif);

            let pushbackForce = 4;
            this.dx += pushbackForce * Math.cos(theta);
            this.dy += pushbackForce * Math.sin(theta);
        }
        this.ApplyGravity();
        this.UpdatePosition();
        this.ReactToBorders();
    }

}