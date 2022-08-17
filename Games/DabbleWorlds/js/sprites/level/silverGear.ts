class IronGear extends GoldGear {
    frameRow = 1;   
    isRequired = false;
    maxAllowed = 3;
    
    Update(): void {
        this.y += Math.sin(this.age / 30) / 20;
        let frameIndeces = [
            0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
            0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5];

        this.frame = frameIndeces[this.age % frameIndeces.length] * 20;
        
        if (!this.isTouched) {
            let player = this.layer.sprites.find(a => a instanceof Player);
            if (player && player.IsGoingToOverlapSprite(this)) {
                this.isTouched = true;
            }
        } else {
            this.frame = (this.age % 6) * 20;
        }
    }
}