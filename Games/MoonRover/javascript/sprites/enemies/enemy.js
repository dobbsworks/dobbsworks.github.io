class Enemy extends Sprite {
    color = "red";
    loot = 0;

    Initialize() {
        this.loot = 2 + Math.ceil(Math.random() * 3)
    }

    SharedEnemyUpdate() {
        if (this.hp <= 0) {
            killCount++;
            this.isActive = false;
            this.Explode();
            
            for (let i=0; i<this.loot; i++) {
                sprites.push(new Loot(this.x, this.y));
            }

            if (this.OnDeath) {
                this.OnDeath();
            }

            audioHandler.PlaySound("ow-02");
        }
    }


}