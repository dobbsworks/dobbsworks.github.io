class FloatingPlatform extends BasePlatform {

    public tilesetRow: number = 5;
    floatsInWater = true;
    floatingPointOffset = 3;

    waterMinDy = 0.3;
    private riderCount: number = 0;
    Update(): void {
        this.ApplyGravity();
        let oldRiderCount = this.riderCount;
        let riders = this.GetFullRiders();
        this.riderCount = riders.length;
        let isRidersChanges = oldRiderCount != this.riderCount;
        if (isRidersChanges) {
            if ((this.layer.map?.waterLevel.currentY || 0) > this.yBottom && (this.layer.map?.purpleWaterLevel.currentY || 0) > this.yBottom) this.dy = 0.3;
        }
        this.dx *= 0.95;
        this.ReactToWater();
        this.MoveByVelocity();
    }
}