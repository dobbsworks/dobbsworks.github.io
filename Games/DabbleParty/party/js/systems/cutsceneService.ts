class CutsceneService {

    public cutscenes: BoardCutScene[] = [];

    public get isCutsceneActive(): boolean {
        if (this.cutscenes.length > 0) {
            return this.cutscenes[0].hidesUI;
        }
        return false;
    }

    public Update(): void {
        while(true) {
            if (!this.cutscenes[0]) break;
            this.cutscenes[0].Update();
            if (this.cutscenes[0].isDone) {
                let followups = this.cutscenes[0].GetFollowUpCutscenes();
                this.cutscenes.shift();
                this.cutscenes.unshift(...followups);
                if (this.cutscenes.length == 0) break;
            } else {
                break;
            }
        }
    }

    public AddScene(...scenes: BoardCutScene[]): void {
        this.cutscenes.push(...scenes);
    }

    public Draw(camera: Camera): void {
        let scene = this.cutscenes[0];
        if (!scene) return;
        let cam = new Camera(camera.canvas);
        if (BoardCutScene.backdrop) {
            BoardCutScene.backdrop.Draw(cam, 0, 0, 1, 1, false, false, 0);
        }
        for (let sprite of BoardCutScene.sprites) {
            sprite.Draw(cam);
        }
        scene.Draw(camera);
    }
}