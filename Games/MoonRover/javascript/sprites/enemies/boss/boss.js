/*
    TODO for BOSSES

    Different types of parts:
        CORE - manages location of child elements
        PLATING - no effect, just a damage sponge
        ENGINE - when destroyed, lowers orbital speed for parent core
        SHIELD - periodically blocks damage to self and sibling part
        PILOTING? - move entire boss around?
        WEAPONS - seeking missiles, bullets, flamethrowers, lasers
        POWER? - required for all parts to function, destroy to interrupt


*/

class BossPartBase extends Enemy {
    isCoreActive = true;
    BossPartUpdate() {
        if (!this.isCoreActive) this.ApplyGravity();
        this.UpdatePosition();
        if (!this.isCoreActive) this.ReactToBorders();
    }
}

class BossCoreBase extends BossPartBase {
    color = "#A00";
    maxHp = 5;
    orbitRadius = 200;
    orbitSpeed = 100;
    orbitOffset = 0;
    timer = 0;
    children = [];

    Initialize() {
        let radPerChild = Math.PI * 2 / this.childNodes.length;
        for (let i = 0; i < this.childNodes.length; i++) {
            let childClass = this.childNodes[i];
            let child = new childClass(0,0);
            if (child instanceof BossShield) {
                child.shieldTimer = -(this.orbitOffset / (2 * Math.PI) * 300) % 300
            }
            this.children.push(child);
            if (child instanceof BossCoreBase) {
                child.orbitSpeed += this.orbitSpeed;
                child.orbitOffset += this.orbitOffset + radPerChild * i;
            }
            sprites.push(child);
            child.x = this.x + this.orbitRadius * Math.cos(radPerChild * i);
            child.y = this.y + this.orbitRadius * Math.sin(radPerChild * i);
        }
    }
    Update() {
        this.timer++;
        this.BossPartUpdate();
        let radPerChild = Math.PI * 2 / this.children.length;
        let radOffset = this.timer / 10000 * this.orbitSpeed + this.orbitOffset;
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            let targetX = this.x + this.orbitRadius * Math.cos(radPerChild * i + radOffset);
            let targetY = this.y + this.orbitRadius * Math.sin(radPerChild * i + radOffset);
            child.dx = targetX - child.x;
            child.dy = targetY - child.y;
        }
    }
    OnDeath() {
        for (let child of this.children) {
            child.isCoreActive = false;
        }
    }
}


class BossCore extends BossCoreBase {
    orbitRadius = 150;
    orbitSpeed = 100;
    childNodes = [
        BossCore2,
        BossCore2,
        BossCore2, 
        BossCore2, 
        BossCore2, 
        BossCore2, 
        BossCore2, 
        BossCore2
    ];
}


class BossCore2 extends BossCoreBase {
    orbitRadius = 80;
    orbitSpeed = 100;
    orbitOffset = Math.PI / 2;
    childNodes = [
        BossPlating,
        BossPlating,
        BossShield,
        //BossLaserCannon,
        BossMissileLauncher
    ];
}

