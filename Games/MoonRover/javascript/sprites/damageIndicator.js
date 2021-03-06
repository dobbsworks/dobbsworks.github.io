class DamageIndicator extends Sprite {

    damageAmount = 0;
    timer = 0;

    constructor(enemySprite, damageAmount) {
        super(enemySprite.x, enemySprite.y);
        this.damageAmount = damageAmount;
    }

    Initialize() {
        this.dy = -5;
        this.dx = 10 * Math.random() - 5;
    }

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        this.timer++;
    }

    
    Draw() {
        if (this.IsOffScreen()) {
            this.isActive = false;
            return;
        }

        let opacity = 1;
        let fadeOutStartTime = 60;
        let fadeOutEndTime = 60 * 2;
        if (this.timer > fadeOutEndTime) {
            opacity = 0;
            this.isActive = false;
        } else if (this.timer > fadeOutStartTime) {
            let totalFadeTime = fadeOutEndTime - fadeOutStartTime;
            let completedFadeTime = this.timer - fadeOutStartTime;
            opacity = 1 - completedFadeTime / totalFadeTime;
        }

        ctx.strokeStyle = "rgba(0,0,0," + opacity.toFixed(2) + ")";
        ctx.fillStyle = "rgba(255,255,255," + opacity.toFixed(2) + ")";
        let text = Math.floor(this.damageAmount).toString();

        renderer.Text(this.x, this.y, 32, text);
    }
}