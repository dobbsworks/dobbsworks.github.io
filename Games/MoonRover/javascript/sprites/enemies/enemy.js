class Enemy extends Sprite {
    color = "#FF0000";
    loot = 0;
    bashInvulnTimer = 0;

    SharedEnemyUpdate() {
        if (!this.loot && !(this instanceof BossPartBase) && !(this instanceof BossMissile)) {
            this.loot = 2 + Math.ceil(seedRandom.random() * 4);
        }

        if (this.bashInvulnTimer > 0) this.bashInvulnTimer--;

        if (this.hp <= 0) {
            if (currentCharacter && currentCharacter.mustKeepAttacking) {
                if (player.hp % 1 !== 0) {
                    player.hp = Math.ceil(player.hp);
                    if (player.hp < player.maxHp) {
                        player.hp += 1;
                    }
                }
            }

            killCount++;
            this.isActive = false;
            this.Explode();
            if (!(this instanceof EnemyBullet)) {
                achievementHandler.lifetimeKills += 1;
                achievementHandler.kills += 1;
            }

            let lootScale = levelHandler.GetCurrentLootMultiplier();
            let lootDamage = (currentCharacter && currentCharacter.damagedOnLoot);
            let isBossPart = (this instanceof BossPartBase);
            let canDropLoot = !(lootDamage && isBossPart);
            if (this instanceof BossMissile || this instanceof EnemyBullet) canDropLoot = false;
            if (canDropLoot) {
                console.log(this)
                for (let i = 0; i < this.loot * lootScale + 1; i++) {
                    sprites.push(new Loot(this.x, this.y));
                }
            }

            if (this.OnDeath) {
                this.OnDeath();
            }

            audioHandler.PlaySound("ow-02");
        }
    }


}