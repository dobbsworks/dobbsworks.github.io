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
var CutscenePreTitle = /** @class */ (function (_super) {
    __extends(CutscenePreTitle, _super);
    function CutscenePreTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CutscenePreTitle.prototype.Update = function () {
        if (mouseHandler.isMouseClicked())
            this.isDone = true;
    };
    CutscenePreTitle.prototype.Draw = function (camera) {
        camera.ctx.fillStyle = "#000";
        camera.ctx.fillRect(0, 0, 960, 540);
        camera.ctx.fillStyle = "#CCC";
        camera.ctx.textAlign = "center";
        camera.ctx.font = "700 " + 20 + "px " + "arial";
        camera.ctx.fillText("Click here to start", 960 / 2, 540 / 2);
    };
    CutscenePreTitle.prototype.GetFollowUpCutscenes = function () { return [new CutsceneTitle()]; };
    ;
    return CutscenePreTitle;
}(BoardCutScene));
var CutscenePreTitleAltForTest = /** @class */ (function (_super) {
    __extends(CutscenePreTitleAltForTest, _super);
    function CutscenePreTitleAltForTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CutscenePreTitleAltForTest.prototype.Update = function () {
        if (mouseHandler.isMouseClicked())
            this.isDone = true;
    };
    CutscenePreTitleAltForTest.prototype.Draw = function (camera) {
        camera.ctx.fillStyle = "#000";
        camera.ctx.fillRect(0, 0, 960, 540);
        camera.ctx.fillStyle = "#CCC";
        camera.ctx.textAlign = "center";
        camera.ctx.font = "700 " + 20 + "px " + "arial";
        camera.ctx.fillText("Click here to start", 960 / 2, 540 / 2);
    };
    CutscenePreTitleAltForTest.prototype.GetFollowUpCutscenes = function () {
        return [new BoardCutSceneSingleAction(function () {
                currentMinigame = new MinigameTest();
            })];
    };
    ;
    return CutscenePreTitleAltForTest;
}(BoardCutScene));
var CutsceneTitle = /** @class */ (function (_super) {
    __extends(CutsceneTitle, _super);
    function CutsceneTitle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.closingTimer = 0;
        _this.dabble = new SimpleSprite(-600, 240, tiles["titleDabble"][0][0]);
        _this.die = new DiceSprite(0, 0, 6, false);
        _this.dieDy = -8;
        _this.logo = new SimpleSprite(0, -500, tiles["logo"][0][0]).Scale(1.5);
        _this.diceWave = [];
        _this.diceFall = [];
        return _this;
    }
    CutsceneTitle.prototype.CreateDiceLoop = function () {
        for (var i = 0; i < 40; i++) {
            var faces = Random.RandFrom([4, 6, 8, 10, 12, 20]);
            var die = new DiceSprite(Math.random() * 1000 - 500, Math.random() * 800 - 1200, faces, false);
            die.frame = Math.floor(Math.random() * 48);
            this.diceFall.push(die);
        }
    };
    CutsceneTitle.prototype.Update = function () {
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
        }
        else if (this.timer > 300 && this.timer <= 330) {
            // Short pause
        }
        else if (this.timer > 330 && this.timer <= 400) {
            // die thrown 
            if (this.timer == 331) {
                audioHandler.PlaySound("throw", false);
                this.dabble.imageTile = tiles["titleDabble"][1][0];
            }
            this.die.x += 10;
            this.die.y += this.dieDy;
            this.dieDy += 0.2;
            this.die.Update();
        }
        else if (this.timer > 400 && this.timer <= 415) {
            // crash sound
            if (this.timer == 401) {
                audioHandler.PlaySound("crash", false);
                this.dabble.imageTile = tiles["titleDabble"][2][0];
            }
            if (this.timer < 407)
                this.dabble.y -= 4;
            else
                this.dabble.y += 4;
        }
        else if (this.timer > 415 && this.timer <= 430) {
            // short pause
        }
        else if (this.timer > 430 && this.timer <= 439) {
            // look up
            this.dabble.imageTile = tiles["titleDabble"][3][0];
        }
        else if (this.timer == 440) {
            audioHandler.PlaySound("diceFall", false);
            audioHandler.SetBackgroundMusic("jazzy");
            // spawn big dice wave
            for (var i = 0; i < 100; i++) {
                var faces = Random.RandFrom([4, 6, 8, 10, 12, 20]);
                var die = new DiceSprite(Math.random() * 1000 - 500, Math.random() * 600 - 900, faces, false);
                this.diceWave.push(die);
            }
        }
        else if (this.timer > 440) {
            this.diceWave.forEach(function (a) {
                a.Update();
                a.y += 12;
            });
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
                    if (this.logo.dy > 1)
                        audioHandler.PlaySound("boing", false);
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
                this.diceFall.forEach(function (a) {
                    a.Update();
                    a.y += 6;
                    if (a.y > 400) {
                        var faces = Random.RandFrom([4, 6, 8, 10, 12, 20]);
                        a.y -= 800;
                        a.x = Math.random() * 1000 - 500;
                        a.faces = faces;
                    }
                });
            }
        }
        var startButtons = [KeyAction.Action1, KeyAction.Action2, KeyAction.Pause, KeyAction.Left];
        // including keyaction.left for smart alecs who press A on the keyboard
        if (startButtons.some(function (a) { return KeyboardHandler.IsKeyPressed(a, true); }) && this.closingTimer == 0) {
            if (this.timer < 600) {
                this.timer = 600;
                if (this.diceFall.length == 0)
                    this.CreateDiceLoop();
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
            if (this.closingTimer > 25)
                this.isDone = true;
        }
        // TODO hover panic
    };
    CutsceneTitle.prototype.Draw = function (camera) {
        var cam = new Camera(camera.canvas);
        var skyImage = tiles["titleSky"][0][0];
        skyImage.Draw(cam, Math.sin(this.timer / 300) * 150, 0, 2, 2, false, false, 0);
        this.diceFall.forEach(function (a) { return a.Draw(cam); });
        cam.ctx.fillStyle = "#FFF6";
        cam.ctx.fillRect(0, 0, 960, 540);
        this.dabble.Draw(cam);
        this.die.Draw(cam);
        this.diceWave.forEach(function (a) { return a.Draw(cam); });
        this.logo.Draw(cam);
        if (this.timer < 16) {
            cam.ctx.fillStyle = "rgba(0,0,0," + (16 - this.timer) / 16 + ")";
            cam.ctx.fillRect(0, 0, 960, 540);
        }
        if (this.closingTimer > 0) {
            var opacity = (this.closingTimer - 4) / 16;
            if (opacity < 0)
                opacity = 0;
            if (opacity > 1)
                opacity = 1;
            cam.ctx.fillStyle = "rgba(0,0,0," + opacity + ")";
            cam.ctx.fillRect(0, 0, 960, 540);
        }
        if (this.timer > 700 && this.closingTimer == 0 && this.timer % 80 < 50) {
            camera.ctx.fillStyle = "#111";
            camera.ctx.textAlign = "center";
            camera.ctx.font = "700 " + 24 + "px " + "arial";
            camera.ctx.fillText("Press", 960 / 2 - 30, 540 / 2 + 180);
            var buttonImage = tiles["controls"][0][0];
            buttonImage.Draw(cam, 30, 170, 1, 1, false, false, 0);
        }
    };
    CutsceneTitle.prototype.GetFollowUpCutscenes = function () { return [new CutsceneMainMenu()]; };
    ;
    return CutsceneTitle;
}(BoardCutScene));
