function EditorClock(x, y, radius) {
    this.name = "Clock";
    this.description = "Provides power periodically. Time is measured in frames (roughly 50 per second).";

    EditorBase.call(this, x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.timeOn = 25;
    this.timeOff = 25;
    this.startingTick = 0;
    this.isMovable = true;

    this.isPowerSource = true;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    //this.editables.push(new Editable('radius', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('timeOn', paramTypes.integer));
    this.editables.push(new Editable('timeOff', paramTypes.integer));
    this.editables.push(new Editable('startingTick', paramTypes.integer));

    this.anchors.push(new CenterAnchor(this));
    //this.anchors.push(new RadiusAnchor(this));
    
    this.createSprite = function () {
        var clock = new Clock((parseInt(this.tileX) + 0.5) * editorScale,
            (parseInt(this.tileY) + 0.5) * editorScale,
            parseInt(this.radius * 2) * editorScale);
        clock.timeOff = this.timeOff;
        clock.timeOn = this.timeOn;
        clock.currentTimeCounter = this.startingTick;
        return clock;
    }
}
EditorClock.prototype = new EditorBase();
EditorClock.prototype.constructor = EditorClock;

editorObjectTypes.push(
    { name: 'Clock', type: EditorClock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 0.5); } }
);

function Clock(x, y, diameter) {
    SpriteBase.call(this, x, y);
    this.width = diameter;
    this.height = diameter;
    this.isMovable = true;

    this.poweredColor = new Color(50, 192, 50, 1.0);
    this.color = new Color(128, 192, 192, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);
    this.solid = false;

    this.power = 1;
    this.timeOn = 30;
    this.timeOff = 30;

    this.currentTimeCounter = 0;

    this.executeRules = function () {
        if (this.currentTimeCounter >= this.timeOn) {
            this.power = 0;
        }
        if (this.currentTimeCounter >= this.timeOn + this.timeOff) {
            this.power = 1;
            this.currentTimeCounter %= (this.timeOn + this.timeOff);
        }
        this.currentTimeCounter++;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;


        gameViewContext.beginPath();
        this.camera.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.fill();
        gameViewContext.fillStyle = this.poweredColor.toString();
        gameViewContext.beginPath();
        this.camera.moveTo(this.x, this.y);
        this.camera.arc(this.x, this.y, this.width / 2, 3 * Math.PI / 2, 3 * Math.PI / 2 + (2 * Math.PI) * (this.timeOn / (this.timeOn + this.timeOff)), false);
        this.camera.lineTo(this.x, this.y);
        gameViewContext.closePath();
        gameViewContext.fill();

        var theta = (-0.25 + (this.currentTimeCounter / (this.timeOn + this.timeOff))) * Math.PI * 2;
        var radius = this.width / 2;
        this.camera.drawLine(this.x, this.y, this.x + radius * Math.cos(theta), this.y + radius * Math.sin(theta));
        gameViewContext.beginPath();
        this.camera.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.closePath();
        gameViewContext.stroke();

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Clock.prototype = new SpriteBase();
Clock.prototype.constructor = Clock;