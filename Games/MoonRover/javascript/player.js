class Player extends Sprite {
    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        if (this.y > 350) {
            this.y = 350;
            this.dy = 0;
        }
        if (isMouseDown && isMouseChanged) {
            this.dy -= 1;
        }
    }

}