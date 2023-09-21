
class CutscenePreTitle extends BoardCutScene {
    Update(): void {
        if (mouseHandler.isMouseClicked()) this.isDone = true;
    }
    Draw(camera: Camera): void {
        camera.ctx.fillStyle = "#000";
        camera.ctx.fillRect(0, 0, 960, 540);
        camera.ctx.fillStyle = "#CCC";
        camera.ctx.textAlign = "center";
        camera.ctx.font = `700 ${20}px ${"arial"}`;
        camera.ctx.fillText("Click here to start", 960 / 2, 540 / 2);
    }
    GetFollowUpCutscenes(): BoardCutScene[] { return [new CutsceneTitle()] };
}

class CutsceneTitle extends BoardCutScene {
    private timer = 0;
    private closingTimer = 0;

    private dabble = new SimpleSprite(-600, 240, tiles["titleDabble"][0][0]);
    private die = new DiceSprite(0, 0, 6, false);
    private dieDy = -8;
    private logo = new SimpleSprite(0, -500, tiles["logo"][0][0]).Scale(1.5);

    private diceWave: DiceSprite[] = [];
    private diceFall: DiceSprite[] = [];

    CreateDiceLoop(): void {
        for (let i = 0; i < 40; i++) {
            let faces = Random.RandFrom([4, 6, 8, 10, 12, 20]) as FaceCount;
            let die = new DiceSprite(Math.random() * 1000 - 500, Math.random() * 800 - 1200, faces, false);
            die.frame = Math.floor(Math.random() * 48);
            this.diceFall.push(die);
        }
    }
    Update(): void {
        if (this.timer == 0) {
            this.die.Update();
        }
        this.timer++;

        if (this.timer > 0 && this.timer <= 300) {
            // Dabble carries die into frame
            this.dabble.x += 2;
            this.dabble.y = 240 - Math.abs(Math.sin(this.timer / 10)) * 10;
            if (this.timer % 31 == 0) {
                audioHandler.PlaySound("step", false);
            }
            this.die.x = this.dabble.x;
            this.die.y = this.dabble.y - 150;
        } else if (this.timer > 300 && this.timer <= 330) {
            // Short pause
        } else if (this.timer > 330 && this.timer <= 400) {
            // die thrown 
            if (this.timer == 331) {
                audioHandler.PlaySound("throw", false);
                this.dabble.imageTile = tiles["titleDabble"][1][0];
            }
            this.die.x += 10;
            this.die.y += this.dieDy;
            this.dieDy += 0.2;
            this.die.Update();
        } else if (this.timer > 400 && this.timer <= 415) {
            // crash sound
            if (this.timer == 401) {
                audioHandler.PlaySound("crash", false);
                this.dabble.imageTile = tiles["titleDabble"][2][0];
            }
            if (this.timer < 407) this.dabble.y -= 4;
            else this.dabble.y += 4;
        } else if (this.timer > 415 && this.timer <= 430) {
            // short pause
        } else if (this.timer > 430 && this.timer <= 439) {
            // look up
            this.dabble.imageTile = tiles["titleDabble"][3][0];
        } else if (this.timer == 440) {
            audioHandler.PlaySound("diceFall", false);
            audioHandler.SetBackgroundMusic("jazzy");
            // spawn big dice wave
            for (let i = 0; i < 100; i++) {
                let faces = Random.RandFrom([4, 6, 8, 10, 12, 20]) as FaceCount;
                let die = new DiceSprite(Math.random() * 1000 - 500, Math.random() * 600 - 900, faces, false);
                this.diceWave.push(die);
            }
        } else if (this.timer > 440) {
            this.diceWave.forEach(a => {
                a.Update();
                a.y += 12;
            })
            if (this.timer == 490) {
                audioHandler.PlaySound("dead", false);
            }
            if (this.timer > 490) {
                this.dabble.imageTile = tiles["titleDabble"][0][0];
                this.dabble.rotation += 0.2;
                this.dabble.y -= 10;
                this.dabble.x -= 5;

                this.logo.dy += 0.2;
                this.logo.y += this.logo.dy;
                if (this.logo.y > 0) {
                    if (this.logo.dy > 1) audioHandler.PlaySound("boing", false);
                    this.logo.y = 0;
                    this.logo.dy = -Math.abs(this.logo.dy) * 0.5;
                    if (Math.abs(this.logo.dy) < 1) {
                        this.logo.dy = 0;
                    }
                }
            }
            if (this.timer == 600) {
                this.CreateDiceLoop();
            }
            if (this.timer >= 600) {
                this.diceFall.forEach(a => {
                    a.Update();
                    a.y += 6;
                    if (a.y > 400) {
                        let faces = Random.RandFrom([4, 6, 8, 10, 12, 20]) as FaceCount;
                        a.y -= 800;
                        a.x = Math.random() * 1000 - 500;
                        a.faces = faces;
                    }
                });
            }
        }

        let startButtons = [KeyAction.Action1, KeyAction.Action2, KeyAction.Pause, KeyAction.Left]; 
        // including keyaction.left for smart alecs who press A on the keyboard
        if (startButtons.some(a => KeyboardHandler.IsKeyPressed(a, true)) && this.closingTimer == 0) {
            if (this.timer < 600) {
                this.timer = 600;
                if (this.diceFall.length == 0) this.CreateDiceLoop();

                this.dabble.x = -1000;
                this.die.x = -1000;
                this.logo.x = 0;
                this.logo.y = 0;
                this.logo.dy = 0;
                this.diceWave = [];
                audioHandler.SetBackgroundMusic("jazzy");
            }
            if (this.timer > 700) {
                this.closingTimer++;
                audioHandler.PlaySound("confirm", false);
            }
        }

        if (this.closingTimer > 0) {
            this.closingTimer++;
            if (this.closingTimer > 25) this.isDone = true;
        }

        // TODO hover panic
    }

    Draw(camera: Camera): void {
        let cam = new Camera(camera.canvas);
        let skyImage = tiles["titleSky"][0][0] as ImageTile;
        skyImage.Draw(cam, Math.sin(this.timer / 300) * 150, 0, 2, 2, false, false, 0);

        this.diceFall.forEach(a => a.Draw(cam));
        cam.ctx.fillStyle = "#FFF6";
        cam.ctx.fillRect(0, 0, 960, 540);

        this.dabble.Draw(cam);
        this.die.Draw(cam);
        this.diceWave.forEach(a => a.Draw(cam));
        this.logo.Draw(cam);

        if (this.timer < 16) {
            cam.ctx.fillStyle = `rgba(0,0,0,${(16 - this.timer) / 16})`;
            cam.ctx.fillRect(0, 0, 960, 540);
        }
        if (this.closingTimer > 0) {
            let opacity = (this.closingTimer - 4) / 16;
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;
            cam.ctx.fillStyle = `rgba(0,0,0,${opacity})`;
            cam.ctx.fillRect(0, 0, 960, 540);
        }

        if (this.timer > 700 && this.closingTimer == 0 && this.timer % 80 < 50) {
            camera.ctx.fillStyle = "#111";
            camera.ctx.textAlign = "center";
            camera.ctx.font = `700 ${24}px ${"arial"}`;
            camera.ctx.fillText("Press", 960 / 2 - 30, 540 / 2 + 180);

            let buttonImage = tiles["controls"][0][0] as ImageTile;
            buttonImage.Draw(cam, 30, 170, 1, 1, false, false, 0);
        }
    }
    GetFollowUpCutscenes(): BoardCutScene[] { return [new CutsceneMainMenu()] };

}

