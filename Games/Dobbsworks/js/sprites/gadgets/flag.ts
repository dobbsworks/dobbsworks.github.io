class Checkpoint extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;

    private flagWaveTimer = 0;
    public isCollected = false;
    private waveSpeed = 0;

    private waveSpeedInitial = 2.1;

    Update(): void {
        this.flagWaveTimer += this.waveSpeed;
        this.waveSpeed *= 0.95;
        if (!this.isCollected && player) {
            if (player.IsGoingToOverlapSprite(this)) {
                // uncollect all flags
                let flags = <Checkpoint[]>this.layer.sprites.filter(a => a instanceof Checkpoint && a.isCollected);
                flags.forEach(a => {
                    a.isCollected = false;
                    a.waveSpeed = -this.waveSpeedInitial;
                    a.flagWaveTimer = 42;
                });

                this.isCollected = true;
                audioHandler.PlaySound("checkpoint", false);
                let originalPlace = editorHandler.sprites.find(a => a.spriteInstance == this);
                if (originalPlace) {
                    // don't use flag's current location since could be changed by motors, etc
                    editorHandler.grabbedCheckpointLocation = {...originalPlace.tileCoord};
                }
                this.waveSpeed = this.waveSpeedInitial;
                this.flagWaveTimer = 0;
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.abs(Math.floor(this.flagWaveTimer / 5)) % 5;
        return {
            imageTile: tiles["flag"][col][this.isCollected ? 1 : 0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

}