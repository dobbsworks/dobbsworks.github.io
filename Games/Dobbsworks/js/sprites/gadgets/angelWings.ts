class ReviveWings extends Sprite {
    public height: number = 10;
    public width: number  = 10;
    public respectsSolidTiles: boolean = false;
    

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        let isPlayerDead = this.layer.sprites.some(a => a instanceof DeadPlayer && a.canRespawn);
        if (isPlayerDead || editorHandler.isInEditMode) {
            let col = [0,1,2,3,2,1][Math.floor(frameNum / 8) % 6]
            return {
                imageTile: tiles["angelWings"][col][0],
                xFlip: false,
                yFlip: false,
                xOffset: 3,
                yOffset: 4 + Math.sin(frameNum / 40)
            };
        } else {
            return {
                imageTile: tiles["angelWings"][4][0],
                xFlip: false,
                yFlip: false,
                xOffset: 3,
                yOffset: 4
            };
        }
    }
    
}