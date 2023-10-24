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
var MinigameHoopstersForever = /** @class */ (function (_super) {
    __extends(MinigameHoopstersForever, _super);
    function MinigameHoopstersForever() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Hoopsters Forever";
        _this.instructions = [
            "Line up your shot and go for the goal! Try to find",
            "the right angle and power for your shot. And remember:",
            "hoopsters are forever."
        ];
        _this.backdropTile = tiles["bgHoops"][0][0];
        _this.thumbnail = tiles["thumbnails"][0][1];
        _this.controls = [
            new InstructionControl(Control.Move, "Adjust angle"),
            new InstructionControl(Control.Button, "(Hold) Adjust power"),
            new InstructionControl(Control.Button, "(Release) Launch shot"),
        ];
        _this.songId = "choir";
        _this.launchPower = 0;
        _this.powerDirection = 1;
        _this.goalIn = false;
        _this.didBallGoAboveGoal = false;
        return _this;
    }
    MinigameHoopstersForever.prototype.Initialize = function () {
        Random.SetSeed(5);
        this.hoop = new SimpleSprite(80, 200, tiles["hoops"][playerIndex][0]);
        this.hoopOverlay = new SimpleSprite(80, 200, tiles["hoops"][1][1]);
        this.ball = new SimpleSprite(19, 1000, tiles["hoops"][0][1]);
        this.launcher = new SimpleSprite(-350, 170, tiles["hoops"][2][1]);
        this.sprites.push(this.hoop, this.ball, this.hoopOverlay, this.launcher);
        this.SetHoopPosition();
    };
    MinigameHoopstersForever.prototype.Update = function () {
        var rotationSpeed = 0.03;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) || KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.launcher.rotation -= rotationSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) || KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.launcher.rotation += rotationSpeed;
        }
        if (this.launcher.rotation > 0)
            this.launcher.rotation = 0;
        if (this.launcher.rotation < -Math.PI / 2)
            this.launcher.rotation = -Math.PI / 2;
        if (!this.isEnded && this.timer >= 0) {
            this.ball.rotation += 0.03;
            this.ball.dy += 0.2;
            this.ball.y += this.ball.dy;
            this.ball.x += this.ball.dx;
            var rimX1 = this.hoop.x - 65;
            var rimX2 = this.hoop.x + 65;
            var rimY = this.hoop.y + 15;
            var rimRadius = 10;
            var ballRadius = 38;
            if (this.ball.y < this.hoop.y)
                this.didBallGoAboveGoal = true;
            for (var _i = 0, _a = [rimX1, rimX2]; _i < _a.length; _i++) {
                var rimX = _a[_i];
                var distanceFromRimCenterToCenter = Math.sqrt(Math.pow((rimX - this.ball.x), 2) + Math.pow((rimY - this.ball.y), 2));
                if (distanceFromRimCenterToCenter < rimRadius + ballRadius) {
                    // hit the rim!
                    // mirror velocity across tangent vector, then reverse
                    var theta = Math.atan2(this.ball.y - rimY, this.ball.x - rimX);
                    var oldVelocityAngle = Math.atan2(this.ball.dy, this.ball.dx);
                    var newVelocityAngle = oldVelocityAngle + (theta - oldVelocityAngle) * 2 + Math.PI;
                    var velocityMagnitude = Math.sqrt(Math.pow(this.ball.dy, 2) + Math.pow(this.ball.dx, 2));
                    // don't let ball be overinflated, dampen velocity
                    velocityMagnitude = velocityMagnitude * 0.5 + 1;
                    this.ball.dy = velocityMagnitude * Math.sin(newVelocityAngle);
                    this.ball.dx = velocityMagnitude * Math.cos(newVelocityAngle);
                    this.ball.y += this.ball.dy;
                    this.ball.x += this.ball.dx;
                    audioHandler.PlaySound("soccer", false);
                }
            }
            var distanceFromGoalCenterToCenter = Math.sqrt(Math.pow((this.hoop.x - this.ball.x), 2) + Math.pow((rimY + 15 - this.ball.y), 2));
            if (distanceFromGoalCenterToCenter < ballRadius + 18 && !this.goalIn && this.didBallGoAboveGoal) {
                // goal!
                this.goalIn = true;
                this.score++;
                audioHandler.PlaySound("dobbloon", false);
                var scoreUp = new SimpleSprite(this.ball.x + 1, this.ball.y, tiles["droppingItems"][3][0], function (s) {
                    s.y -= 2;
                    if (s.age > 50)
                        s.isActive = false;
                }).Scale(2);
                this.sprites.push(scoreUp);
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, false)) {
                this.launchPower += this.powerDirection;
                if (this.launchPower == 100 || this.launchPower == 0)
                    this.powerDirection *= -1;
            }
            if (this.goalIn && this.IsBallOffScreen()) {
                // reset board
                this.goalIn = false;
                this.SetHoopPosition();
            }
            if (!KeyboardHandler.IsKeyPressed(KeyAction.Action1, false) && this.launchPower > 0) {
                // FIRE!
                var launchSpeed = this.launchPower / 5;
                this.ball.dx = launchSpeed * Math.cos(this.launcher.rotation);
                this.ball.dy = launchSpeed * Math.sin(this.launcher.rotation);
                this.ball.x = this.launcher.x + 50 * Math.cos(this.launcher.rotation);
                this.ball.y = this.launcher.y + 50 * Math.sin(this.launcher.rotation);
                this.powerDirection = 1;
                this.launchPower = 0;
                this.didBallGoAboveGoal = false;
            }
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameHoopstersForever.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    MinigameHoopstersForever.prototype.SetHoopPosition = function () {
        this.hoop.x = Random.GetSeededRandInt(-120, 380);
        this.hoop.y = Random.GetSeededRandInt(0, 120);
        this.hoopOverlay.x = this.hoop.x;
        this.hoopOverlay.y = this.hoop.y;
    };
    MinigameHoopstersForever.prototype.IsBallOffScreen = function () {
        var isBallOob = this.ball.y > 400 || this.ball.x > 600;
        return isBallOob && !this.isEnded && this.timer >= 0;
    };
    MinigameHoopstersForever.prototype.OnAfterDraw = function (camera) {
        if (!this.isEnded) {
            camera.ctx.fillStyle = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false) ? "#0008" : "#0001";
            camera.ctx.fillRect(30, 510, 40, -204);
            camera.ctx.fillStyle = "lime";
            camera.ctx.fillRect(32, 508, 36, -this.launchPower * 2);
        }
        //camera.ctx.fillRect(camera.canvas.width / 2 + this.hoop.x - 9, camera.canvas.height / 2 +this.hoop.y + 15 + 15 - 9, 18, 18);
    };
    return MinigameHoopstersForever;
}(MinigameBase));
