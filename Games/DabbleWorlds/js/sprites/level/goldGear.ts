class GoldGear extends Sprite {
    public height = 24;
    public width = 24;
    public respectsSolidTiles = false;

    isRequired = true;
    maxAllowed = 1;
    isTouched = false;
    collectTimer = 0;
    frameRow = 0;

    playerAge = 0;
    hasProcessedLevelComplete = false;

    spinMode = false;
    spinigameTimer = 0;
    pushTimer = 0;
    frame = 0;

    disappearMode = false;


    Update(): void {
        if (!this.isTouched) {
            this.y += Math.sin(this.age / 30) / 20;
            let frameIndeces = [
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5];

            this.frame = frameIndeces[this.age % frameIndeces.length] * 20;

            let player = <Player>(this.layer.sprites.find(a => a instanceof Player));
            if (player && player.IsGoingToOverlapSprite(this)) {
                this.isTouched = true;
                this.playerAge = player.age + editorHandler.bankedCheckpointTime;
                //console.log(player.replayHandler.ExportToBase64());
            }
        }

        if (this.spinMode) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.pushTimer += 15;
            }
            if (this.pushTimer > 0) this.pushTimer *= 0.98;
            this.frame += this.pushTimer;
            this.spinigameTimer++;
            currentMap.bgDarknessRatio = this.spinigameTimer / 200;
            if (this.spinigameTimer >= 200) {
                this.spinMode = false;
                currentMap.bgDarknessRatio = 1;
                camera.target = null;
                this.dy = 3;
                this.disappearMode = true;
            }
        }

        if (this.disappearMode) {
            this.dy -= 0.2;
            this.MoveByVelocity();
            currentMap.fullDarknessRatio += 0.02;
            if (currentMap.fullDarknessRatio > 1) {
                this.isActive = false;
                MenuHandler.GoBack();
                let successMenu = <LevelSuccessMenu>MenuHandler.SubMenu(LevelSuccessMenu);
                successMenu.collectedGear = this;
                successMenu.SetLevelCompletionTime(this.playerAge);
            }
        }

        if (this.isTouched) {
            editorHandler.grabbedCheckpointLocation = null;
            if (MenuHandler.CurrentMenu instanceof MainMenu) {
                MenuHandler.CurrentMenu.Hide(1);
                editorHandler.isEditorAllowed = true;
                editorHandler.SwitchToEditMode();
            }
            else if (editorHandler.isEditorAllowed) {
                this.collectTimer++;
                if (this.collectTimer > 30) {
                    editorHandler.SwitchToEditMode();
                }
            } else {
                // level done
                if (!this.hasProcessedLevelComplete) {
                    this.hasProcessedLevelComplete = true;
                    currentMap.GetLayerList().forEach(a => a.sprites.forEach(b => b.locked = true));
                    this.locked = false;
                    //this.spinMode = true;
                    this.disappearMode = true;
                    camera.target = this;
                    camera.targetScale = 8;
                    audioHandler.SetBackgroundMusic("levelEnd");
                }
            }
        }


    }

    GetFrameData(frameNum: number): FrameData {
        if (this.spinMode && (frameNum % 6 < 3)) {
            camera.ctx.textAlign = "center";
            camera.ctx.fillStyle = "white";
            camera.ctx.strokeStyle = "black";
            camera.ctx.lineWidth = 10;
            camera.ctx.font = `70px grobold`;
            camera.ctx.strokeText("Mash JUMP", camera.canvas.width/2, 450);
            camera.ctx.fillText("Mash JUMP", camera.canvas.width/2, 450);
        }

        return {
            imageTile: tiles["gears"][Math.floor(this.frame / 20) % 6][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }

}