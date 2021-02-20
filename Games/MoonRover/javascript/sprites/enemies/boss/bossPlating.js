
class BossPlating extends BossPartBase {
    color = "#600";
    maxHp = 3;
    Update() {
        this.BossPartUpdate();
    }

    GetFrameData() {
        return {
            tileset: tileset.orangecore,
            frame: 0,
            xFlip: this.direction > 0,
        };
    }
}
