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
class BossCore extends Enemy {

    color = "#A00";
    maxHp = 10;
    orbitRadius = 100;
    timer = 0;
    children = [
        new BossCore2(0, 0),
        new BossCore2(0, 0),
        new BossCore2(0, 0),
        new BossCore2(0, 0)
    ];

    Initialize() {
        let radPerChild = Math.PI*2 / this.children.length;
        for (let i=0; i < this.children.length; i++) {
            sprites.push(this.children[i]);
            this.children[i].x = this.x + this.orbitRadius * Math.cos(radPerChild * i);
            this.children[i].y = this.y + this.orbitRadius * Math.sin(radPerChild * i);
        }
    }

    Update() {
        this.timer++;
        this.UpdatePosition();
        let radPerChild = Math.PI*2 / this.children.length;
        let radOffset = this.timer / 100;
        for (let i=0; i < this.children.length; i++) {
            this.children[i].x = this.x + this.orbitRadius * Math.cos(radPerChild * i + radOffset);
            this.children[i].y = this.y + this.orbitRadius * Math.sin(radPerChild * i + radOffset);
        }
    }
}

class BossCore2 extends Enemy {

    color = "#A00";
    maxHp = 10;
    orbitRadius = 50;
    timer = 0;
    children = [
        new BossCore3(0, 0),
        new BossCore3(0, 0),
    ];

    Initialize() {
        let radPerChild = Math.PI*2 / this.children.length;
        for (let i=0; i < this.children.length; i++) {
            sprites.push(this.children[i]);
            this.children[i].x = this.x + this.orbitRadius * Math.cos(radPerChild * i);
            this.children[i].y = this.y + this.orbitRadius * Math.sin(radPerChild * i);
        }
    }

    Update() {
        this.timer++;
        this.UpdatePosition();
        let radPerChild = Math.PI*2 / this.children.length;
        let radOffset = -this.timer / 30;
        for (let i=0; i < this.children.length; i++) {
            this.children[i].x = this.x + this.orbitRadius * Math.cos(radPerChild * i + radOffset);
            this.children[i].y = this.y + this.orbitRadius * Math.sin(radPerChild * i + radOffset);
        }
    }
}

class BossCore3 extends Enemy {

    color = "#A00";
    maxHp = 10;
    orbitRadius = 50;
    timer = 0;
    children = [
        new BossPlating(0, 0),
        new BossPlating(0, 0),
        new BossPlating(0, 0),
        new BossPlating(0, 0)
    ];

    Initialize() {
        let radPerChild = Math.PI*2 / this.children.length;
        for (let i=0; i < this.children.length; i++) {
            sprites.push(this.children[i]);
            this.children[i].x = this.x + this.orbitRadius * Math.cos(radPerChild * i);
            this.children[i].y = this.y + this.orbitRadius * Math.sin(radPerChild * i);
        }
    }

    Update() {
        this.timer++;
        this.UpdatePosition();
        let radPerChild = Math.PI*2 / this.children.length;
        let radOffset = this.timer / 20;
        for (let i=0; i < this.children.length; i++) {
            this.children[i].x = this.x + this.orbitRadius * Math.cos(radPerChild * i + radOffset);
            this.children[i].y = this.y + this.orbitRadius * Math.sin(radPerChild * i + radOffset);
        }
    }
}

class BossPlating extends Enemy {
    color = "#600";
    maxHp = 2;
    Update() {
        this.UpdatePosition();
    }
}