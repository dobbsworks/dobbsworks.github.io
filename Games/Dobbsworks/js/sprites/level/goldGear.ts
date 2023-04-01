class GoldGear extends Sprite {
    public height = 22;
    public width = 22;
    public respectsSolidTiles = false;

    isExemptFromSilhoutte = true;
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

            let players = <Player[]>(this.layer.sprites.filter(a => a instanceof Player && !a.isDuplicate));
            for (let player of players) {
                if (player.IsGoingToOverlapSprite(this)) {
                    this.isTouched = true;
                    camera.Reset();
                    this.playerAge = player.age + editorHandler.bankedCheckpointTime + (levelGenerator?.bankedClearTime || 0);
                    //console.log(player.replayHandler.ExportToBase64());
                }
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

                if (levelGenerator) {
                    levelGenerator.OnLevelWin();
                    if (levelGenerator.levelsCleared == 3) {
                        MenuHandler.GoBack();
                        let successMenu = <MarathonThreeClearsMenu>MenuHandler.SubMenu(MarathonThreeClearsMenu);
                        successMenu.collectedGear = this;
                        audioHandler.SetBackgroundMusic("levelEnd");

                        DataService.CheckFor3RingUnlock(levelGenerator.difficulty.difficultyNumber).then(unlock => {
                            if (unlock) {
                                toastService.AnnounceAvatarUnlock(AvatarCustomizationMenu.GetImageFrom3CharCode(unlock));
                            }
                        })

                    } else {
                        levelGenerator.NextLevel();
                    }
                } else {
                    MenuHandler.GoBack();
                    let successMenu = <LevelSuccessMenu>MenuHandler.SubMenu(LevelSuccessMenu);
                    successMenu.collectedGear = this;
                    successMenu.SetLevelCompletionTime(this.playerAge);
                }
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
                editorHandler.SwitchToEditMode();

                let clearTimeText = new UIText(40 - 250, 165, Utility.FramesToTimeText(this.playerAge), 22, "white");
                clearTimeText.textAlign = "left";
                let clearTimePanel = new Panel(20 - 250, 130, 200, 50);
                clearTimePanel.backColor = "#0008";

                uiHandler.elements.push(clearTimePanel, clearTimeText);
                setTimeout(() => {
                    [clearTimeText, clearTimePanel].forEach(a => a.targetX += 250);
                }, 10);
                setTimeout(() => {
                    [clearTimeText, clearTimePanel].forEach(a => a.targetX -= 250);
                }, 3000);
                setTimeout(() => {
                    uiHandler.elements = uiHandler.elements.filter(a => a != clearTimeText && a != clearTimePanel);
                }, 4000);

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
                    if (levelGenerator) {
                        audioHandler.SetBackgroundMusic("silence");
                        audioHandler.PlaySound("carnivalVictoryShort", true);
                    } else {
                        audioHandler.SetBackgroundMusic("levelEnd");
                    }
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
            camera.ctx.strokeText("Mash JUMP", camera.canvas.width / 2, 450);
            camera.ctx.fillText("Mash JUMP", camera.canvas.width / 2, 450);
        }

        return {
            imageTile: tiles["gears"][Math.floor(this.frame / 20) % 6][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        };
    }

}