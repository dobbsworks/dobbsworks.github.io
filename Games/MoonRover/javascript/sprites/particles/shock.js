class Shock extends Sprite {
    
    timer = 0;
    parent = null;
    constructor(parent, duration) {
        super();
        this.duration = duration;
        this.parent = parent;
        this.SetPosition();
    }

    SetPosition() {
        this.x = this.parent.x + (Math.random()-0.5) * this.parent.radius;
        this.y = this.parent.y + (Math.random()-0.5) * this.parent.radius;
    }

    Update() {
        this.timer++;

        this.SetPosition();

        if (!this.parent.isActive) {
            this.isActive = false;
        }
        if (this.timer > this.duration) {
            this.isActive = false;
        }
    }

    GetFrameData() {
        return {
            tileset: tileset.shock,
            frame: this.AnimateByFrame(tileset.shock),
            xFlip: Math.random() > 0.5,
        };
    }
}