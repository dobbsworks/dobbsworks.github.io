class JumboJelly extends LittleJelly {
    public height: number = 60;
    public width: number = 72;
    public respectsSolidTiles: boolean = true;
    public canBeBouncedOn: boolean = false;
    killedByProjectiles: boolean = false;
    immuneToSlideKill: boolean = true;
    damagesPlayer: boolean = false;

    Update(): void {
        super.Update();
    }
    OnBounce(): void {}
    OnGroundLanding(): void {
        audioHandler.PlaySound("stuck-jump", true);
        //this.CreateSlimeGround(this.landingCoating);
    }

    GetFrameData(frameNum: number): FrameData {
        var frame = Math.floor(frameNum / 5) % 5;
        return {
            imageTile: tiles["bigSlime"][0][frame],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        }
    }

    OnAfterAllSpritesDraw(camera: Camera, frameNum: number): void {
        var frame = Math.floor(frameNum / 5) % 5;
        let fd: FrameData = {
            imageTile: tiles["bigSlime"][1][frame],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        }
        this.layer.DrawFrame(fd, camera.scale, this);
    }

}
