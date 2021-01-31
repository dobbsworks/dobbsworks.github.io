class PlayerBullet extends Sprite {
    color = "cyan";
    radius = 5;
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
            if (touchingSprite instanceof Enemy && !(touchingSprite instanceof EnemyBullet)) {
                touchingSprite.hp -= this.damage;
                if (touchingSprite.hp >= 0) {
                    audioHandler.PlaySound("ow-01");
                }
                this.isActive = false;
            }
        }
    }
}