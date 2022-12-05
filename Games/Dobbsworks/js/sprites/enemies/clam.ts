type ClamState = "idle" | "shaking" | "closing" | "closed" | "opening";
class Clammy extends Enemy {

    public height: number = 6;
    public width: number = 16;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;
    damagesPlayer: boolean = false;
    canSpinBounceOn = true;

    stateTimer = 0;
    state: ClamState = "idle";
    timerMap: { state: ClamState, frames: number, next: ClamState }[] = [
        { state: "shaking", frames: 20, next: "closing" },
        { state: "closing", frames: 6, next: "closed" },
        { state: "closed", frames: 50, next: "opening" },
        { state: "opening", frames: 20, next: "idle" },
    ]


    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        let playerStandingOn = player && player.parentSprite == this;
        this.damagesPlayer = this.state == "closed";
        this.isPlatform = this.state != "closed";
        if (playerStandingOn && !this.isPlatform) player.parentSprite = null;

        if (this.state == "idle") {
            if (this.isInWater || playerStandingOn) {
                this.state = "shaking";
                this.stateTimer = 0;
            }
        } else {
            let stateMachine = this.timerMap.find(a => a.state == this.state);
            if (stateMachine) {
                this.stateTimer += this.isInWater ? 0.3 : 1;
                if (this.stateTimer >= stateMachine.frames) {
                    this.state = stateMachine.next;
                    this.stateTimer = 0;
                }
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 0;

        if (this.state == "closing") {
            let totalFrames = this.timerMap.find(a => a.state == this.state)?.frames || 1;
            let frameInSequence = Math.floor(this.stateTimer / totalFrames * 3);
            col = [0, 1, 2, 3][frameInSequence];
        }
        if (this.state == "closed") col = 3;
        if (this.state == "opening") {
            let totalFrames = this.timerMap.find(a => a.state == this.state)?.frames || 1;
            let frameInSequence = Math.floor(this.stateTimer / totalFrames * 3);
            col = [2, 1, 0, 0][frameInSequence];
        }

        let xOffset = this.state == "shaking" ? Math.sin(this.age) : 0;
        return {
            imageTile: tiles["clam"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: xOffset,
            yOffset: 10
        };
    }
}