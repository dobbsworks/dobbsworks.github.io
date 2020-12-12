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

    Initialize() {
        let radPerChild = Math.PI*2 / this.children.length;
        for (let i=0; i < this.children.length; i++) {
            let child = this.children[i];
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
        let radPerChild = Math.PI*2 / this.children.length;
        let radOffset = this.timer / 10000 * this.orbitSpeed + this.orbitOffset;
        for (let i=0; i < this.children.length; i++) {
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
    children = [
        new BossCore2(0, 0),
        new BossCore2(0, 0),
        new BossCore2(0, 0),
        new BossCore2(0, 0),
        new BossCore2(0, 0)
    ];
}


class BossCore2 extends BossCoreBase {
    orbitRadius = 80;
    orbitSpeed = 100;
    orbitOffset = Math.PI/2;
    children = [
        new BossPlating(0, 0),
        new BossPlating(0, 0),
        new BossShield(0, 0),
    ];
}

class BossPlating extends BossPartBase {
    color = "#600";
    maxHp = 3;
    Update() {
        this.BossPartUpdate();
    }
}

class BossShield extends BossPartBase {
    color = "#060";
    maxHp = 3;
    shieldTimer = 0;
    projection = null;

    Update() {
        this.shieldTimer++;
        this.BossPartUpdate();
        if (this.projection) {
            this.projection.x = this.x;
            this.projection.y = this.y;
        }
        if (this.shieldTimer > 300) {
            this.shieldTimer = 0;
            this.CreateProjection();
        }
    }

    CreateProjection() {
        this.projection = new BossShieldProjection(this.x, this.y);
        sprites.push(this.projection);
    }

    OnDeath() {
        if (this.projection) this.projection.isActive = false;
    }
}

class BossShieldProjection extends Enemy {
    color = "#0604";
    maxHp = Infinity;
    timer = 0;

    Update() {
        this.timer++;
        if (this.timer < 20) {
            this.radius *= 1.05;
        }
        if (this.timer > 200) {
            this.radius /= 1.05;
        }
        if (this.radius < 30) {
            this.isActive = false;
        }
    }
}

