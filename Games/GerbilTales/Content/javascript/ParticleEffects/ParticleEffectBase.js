var particleEffects = [];

function ParticleEffectBase(x, y) {
    this.camera = camera;
    this.active = true;

    this.x = x;
    this.y = y;

    this.dx = 0;
    this.dy = 0;

    this.executeRules = function () { };
    
    this.draw = function () {
        if (!this.active) return;
    }

    this.kill = function () {
        if (this.onKill) this.onKill();
        this.active = false;
    }

    this.delete = function () {
        particleEffects.splice(particleEffects.indexOf(this), 1);
    }

    this.getTop = function () { return this.y - this.height / 2; }
    this.getBottom = function () { return this.y + this.height / 2; }
    this.getLeft = function () { return this.x - this.width / 2; }
    this.getRight = function () { return this.x + this.width / 2; }
}