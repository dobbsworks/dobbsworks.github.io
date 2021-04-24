class RadarPing extends Sprite {
    color = "#FFFFFF01";
    radius = 0;
    source = null;
    maxRadius = 0;
    followsSource = false;
    touched = [];
    speed = 5;

    constructor(source, maxRadius, followsSource) {
        super(source.x, source.y);
        this.source = source;
        this.radius = source.radius + 30;
        this.maxRadius = maxRadius;
        this.followsSource = followsSource;
    }

    Initialize() {
        if (currentCharacter && !currentCharacter.isBlind) {
            this.isActive = false;
            this.color = "#FFFFFF00";
        }
    }

    Update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.speed;
        } else {
            if (!this.followsSource) {
                this.isActive = false;
                return;
            }
        }
        if (this.followsSource) {
            if (!this.source.isActive) {
                this.isActive = false;
                return;
            }
            this.x = this.source.x;
            this.y = this.source.y;
        }
        for (let sprite of sprites) {
            let distance = Math.sqrt( (sprite.x - this.x) ** 2 + (sprite.y - this.y) ** 2);
            if (distance < this.radius && distance > this.radius - 100) {
                // in target ring!
                if (this.touched.indexOf(sprite) === -1) {
                    this.touched.push(sprite);
                    sprite.radarTimer = 120;
                }
            }
        }
    }
}