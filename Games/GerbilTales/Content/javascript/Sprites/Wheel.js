function EditorWheel(x, y, radius) {
    this.name = "Wheel";
    this.description = "Provides power while gerbils are running inside. Press the up key (default 'W') to have a nearby gerbil jump inside.";

    EditorBase.call(this, x, y, radius * 2, radius*2);

    this.isPowerSource = true;
    this.radius = radius;
    this.maxRunners = 3;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('maxRunners', paramTypes.integer));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new RadiusAnchor(this));
    
    this.createSprite = function () {
        var wheel = new Wheel(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.radius * 2) * editorScale);
        wheel.maxRunners = this.maxRunners;
        return wheel;
    }
}
EditorWheel.prototype = new EditorBase();
EditorWheel.prototype.constructor = EditorWheel;

editorObjectTypes.push(
    { name: 'Wheel', type: EditorWheel, add: function (tileX, tileY) { return new this.type(tileX, tileY, 3); } }
);

function Wheel(x, y, diameter) {
    SpriteBase.call(this, x, y);
    this.width = diameter;
    this.height = diameter;
    this.maxRunners = 3;
    this.runners = [];
    this.power = 0;
    this.solid = false;

    this.unpoweredColor = new Color(255, 64, 64, 0.7);
    this.poweredColor = new Color(64, 255, 64, 0.7);
    this.borderColor = new Color(100, 100, 80, 1.0);
    this.downPressed = false;
    this.upPressed = false;

    this.executeRules = function () {
        this.cameraFocus = (this.runners.length > 0);

        if (!this.downPressed && keyboardState.isDownPressed() && this.runners.length > 0) {
            this.downPressed = true;
            this.runners[0].container = null;
            this.runners[0].solid = true;
            this.runners[0].dx = -3;
            this.runners.splice(0, 1);
        }
        if (!keyboardState.isDownPressed()) {
            this.downPressed = false;
        }

        for (var i = 0; i < this.runners.length; i++) this.updateRunner(this.runners[i]);
        this.power += this.runners.length * 0.0003;
        if (this.power > this.runners.length / this.maxRunners) this.power = this.runners.length / this.maxRunners;

        if (!this.upPressed && keyboardState.isUpPressed()) {
            this.upPressed = true;
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i] instanceof Gerbil && this.doesOverlapSprite(sprites[i])) {
                    if (sprites[i].container == null) {
                        this.runners.push(sprites[i]);
                        sprites[i].container = this;
                        sprites[i].riding = this;
                        sprites[i].solid = false;
                        return;
                    }
                }
            }
        }
        if (!keyboardState.isUpPressed()) {
            this.upPressed = false;
        }
    };

    this.updateRunner = function (runner) {
        runner.x += runner.dx;
        runner.y += runner.dy;
        var radius = this.width / 2 - 8;
        var minX = this.x - this.width / 3;
        if (runner.x < minX) {
            runner.x += 2;
            runner.y -= 2;
            runner.dx = 2 + Math.random() * 3;
            runner.dy = -3;
        }
        var maxX = this.x + radius - 3;
        if (runner.x > maxX) runner.x = maxX;
        var maxY = this.y + Math.pow(-Math.pow(this.x - runner.x, 2) + Math.pow(radius, 2), 0.5);
        if (runner.y > maxY) {
            runner.y = maxY;
            runner.dy = 0;
            runner.dx = -5 * this.power * (runner.y - this.y) / radius;
        }
        var maxY = this.y + radius;
        if (runner.y > maxY) runner.y = maxY;
        runner.dy += 0.4;
    }

    this.baseTheta = 0;
    this.draw = function () {
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.fillStyle = this.borderColor.toString();
        gameViewContext.beginPath();
        this.camera.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.stroke();
        gameViewContext.beginPath();
        this.camera.arc(this.x, this.y, 8, 0, 2 * Math.PI);
        gameViewContext.fill();

        this.baseTheta += this.power / 10;
        for (var i = 0; i < this.maxRunners; i++) {
            var thetaStart = i * 2 * Math.PI / this.maxRunners + this.baseTheta;
            var arcLength = 2 * Math.PI / this.maxRunners - 0.1;
            gameViewContext.strokeStyle = this.unpoweredColor.toString();
            gameViewContext.beginPath();
            this.camera.arc(this.x, this.y, 5 + this.width / 2, thetaStart, thetaStart + arcLength);
            gameViewContext.stroke();
            if (this.power > i / this.maxRunners) {
                var powerSlice = (this.power - i / this.maxRunners) * this.maxRunners;
                if (powerSlice > 1) powerSlice = 1;
                gameViewContext.strokeStyle = this.poweredColor.toString();
                gameViewContext.beginPath();
                this.camera.arc(this.x, this.y, 5 + this.width / 2, thetaStart, thetaStart + arcLength * powerSlice);
                gameViewContext.stroke();
            }
        }
        if (this.runners.length) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.centerText(this.runners.length + "/" + this.maxRunners, this.x, this.y - this.width * 0.6);
        }

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Wheel.prototype = new SpriteBase();
Wheel.prototype.constructor = Wheel;