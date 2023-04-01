"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GoldGear = /** @class */ (function (_super) {
    __extends(GoldGear, _super);
    function GoldGear() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 22;
        _this.width = 22;
        _this.respectsSolidTiles = false;
        _this.isExemptFromSilhoutte = true;
        _this.isRequired = true;
        _this.maxAllowed = 1;
        _this.isTouched = false;
        _this.collectTimer = 0;
        _this.frameRow = 0;
        _this.playerAge = 0;
        _this.hasProcessedLevelComplete = false;
        _this.spinMode = false;
        _this.spinigameTimer = 0;
        _this.pushTimer = 0;
        _this.frame = 0;
        _this.disappearMode = false;
        return _this;
    }
    GoldGear.prototype.Update = function () {
        if (!this.isTouched) {
            this.y += Math.sin(this.age / 30) / 20;
            var frameIndeces = [
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5
            ];
            this.frame = frameIndeces[this.age % frameIndeces.length] * 20;
            var players = (this.layer.sprites.filter(function (a) { return a instanceof Player && !a.isDuplicate; }));
            for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                var player_1 = players_1[_i];
                if (player_1.IsGoingToOverlapSprite(this)) {
                    this.isTouched = true;
                    camera.Reset();
                    this.playerAge = player_1.age + editorHandler.bankedCheckpointTime + ((levelGenerator === null || levelGenerator === void 0 ? void 0 : levelGenerator.bankedClearTime) || 0);
                    //console.log(player.replayHandler.ExportToBase64());
                }
            }
        }
        if (this.spinMode) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.pushTimer += 15;
            }
            if (this.pushTimer > 0)
                this.pushTimer *= 0.98;
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
                        var successMenu = MenuHandler.SubMenu(MarathonThreeClearsMenu);
                        successMenu.collectedGear = this;
                        audioHandler.SetBackgroundMusic("levelEnd");
                        DataService.CheckFor3RingUnlock(levelGenerator.difficulty.difficultyNumber).then(function (unlock) {
                            if (unlock) {
                                toastService.AnnounceAvatarUnlock(AvatarCustomizationMenu.GetImageFrom3CharCode(unlock));
                            }
                        });
                    }
                    else {
                        levelGenerator.NextLevel();
                    }
                }
                else {
                    MenuHandler.GoBack();
                    var successMenu = MenuHandler.SubMenu(LevelSuccessMenu);
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
                var clearTimeText_1 = new UIText(40 - 250, 165, Utility.FramesToTimeText(this.playerAge), 22, "white");
                clearTimeText_1.textAlign = "left";
                var clearTimePanel_1 = new Panel(20 - 250, 130, 200, 50);
                clearTimePanel_1.backColor = "#0008";
                uiHandler.elements.push(clearTimePanel_1, clearTimeText_1);
                setTimeout(function () {
                    [clearTimeText_1, clearTimePanel_1].forEach(function (a) { return a.targetX += 250; });
                }, 10);
                setTimeout(function () {
                    [clearTimeText_1, clearTimePanel_1].forEach(function (a) { return a.targetX -= 250; });
                }, 3000);
                setTimeout(function () {
                    uiHandler.elements = uiHandler.elements.filter(function (a) { return a != clearTimeText_1 && a != clearTimePanel_1; });
                }, 4000);
            }
            else {
                // level done
                if (!this.hasProcessedLevelComplete) {
                    this.hasProcessedLevelComplete = true;
                    currentMap.GetLayerList().forEach(function (a) { return a.sprites.forEach(function (b) { return b.locked = true; }); });
                    this.locked = false;
                    //this.spinMode = true;
                    this.disappearMode = true;
                    camera.target = this;
                    camera.targetScale = 8;
                    if (levelGenerator) {
                        audioHandler.SetBackgroundMusic("silence");
                        audioHandler.PlaySound("carnivalVictoryShort", true);
                    }
                    else {
                        audioHandler.SetBackgroundMusic("levelEnd");
                    }
                }
            }
        }
    };
    GoldGear.prototype.GetFrameData = function (frameNum) {
        if (this.spinMode && (frameNum % 6 < 3)) {
            camera.ctx.textAlign = "center";
            camera.ctx.fillStyle = "white";
            camera.ctx.strokeStyle = "black";
            camera.ctx.lineWidth = 10;
            camera.ctx.font = "70px grobold";
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
    };
    return GoldGear;
}(Sprite));
