class PlayerInertCapsule extends Sprite {
    maxHp = 999999999;

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
    }

    GetFrameData() {
        return {
            tileset: tileset.player,
            frame: currentCharacter.shipIndex || 0,
            xFlip: this.direction > 0,
        };
    }

}