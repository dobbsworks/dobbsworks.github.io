class PlayerBullet extends Sprite {
    color = "cyan";
    radius = 3;
    damage = 1;

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }
        
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy) {
                touchingSprite.hp -= this.damage;
                this.isActive = false;
            }
        }
    }
}