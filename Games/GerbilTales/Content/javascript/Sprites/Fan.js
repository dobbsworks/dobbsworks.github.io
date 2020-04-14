function EditorFan(x, y, width) {
    this.name = "Fan";
    this.description = "Pushes gerbils sky-high when powered.";

    EditorBase.call(this, x, y, width, 1);
    this.tileRange = 5;
    this.powerSource = null;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));
    this.editables.push(new Editable('tileRange', paramTypes.integer, ValidateMin1));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new LeftAnchor(this));
    this.anchors.push(new RightAnchor(this));
    
    this.createSprite = function () {
        var fan = new Fan(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width) * editorScale,
            editorScale,
            this.powerSource);
        fan.range = this.tileRange * editorScale;
        return fan;
    }
}
EditorFan.prototype = new EditorBase();
EditorFan.prototype.constructor = EditorFan;

editorObjectTypes.push(
    { name: 'Fan', type: EditorFan, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4); } }
);

function Fan(x, y, width, height, powerSource) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.range = 300;

    this.powerSource = powerSource;

    this.fanParticles = []
    for (var i = 0; i < 9; i++) this.fanParticles.push(new FanParticle(this, Math.random() * this.width, 16 * i));

    this.color = new Color(100, 255, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
        this.cameraFocus = this.powerSource.cameraFocus;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] instanceof Gerbil) {
                if (sprites[i].getBottom() <= this.getTop() &&
                    sprites[i].getRight() > this.getLeft() &&
                    sprites[i].getLeft() < this.getRight()) {
                    sprites[i].dy -= this.getFanStrength(sprites[i].y);
                    sprites[i].dy -= Math.random() * 0.2;
                    if (sprites[i].getBottom() == this.getTop()) sprites[i].y -= 1;
                }
            }
        }
    };

    this.getPower = function () {
        if (this.powerSource) return this.powerSource.power;
        return 0;
    }

    this.getFanStrength = function (y) {
        return (this.range - (this.y - y)) / this.range * this.getPower() / 2;
    }

    this.texture = new FanTexture();

    this.draw = function () {
        this.texture.draw(this);
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft() + 4, this.getTop() + 11, (this.width - 8) * (this.getPower()), 2);

        for (var i = 0; i < this.fanParticles.length; i++) this.fanParticles[i].draw();
    }
}
Fan.prototype = new SpriteBase();
Fan.prototype.constructor = Fan;

function FanParticle(fan, x, y) {
    this.fan = fan;
    this.x = x;
    this.y = y;
    this.dy = 0;

    this.draw = function () {
        var fanStrength = this.fan.getFanStrength(this.fan.getTop() - this.y);
        this.dy = -(10 * fanStrength) - 1;
        this.y -= this.dy;
        if (this.y > this.fan.range) {
            this.y = 2;
            this.x = this.fan.width * Math.random();
        } 

        var fanColor = this.fan.borderColor;
        var alpha = Math.pow(this.fan.getPower() * (this.fan.range - this.y) / this.fan.range, 0.4);
        if (alpha > 1.0) alpha = 1.0;
        this.color = new Color(fanColor.r, fanColor.g, fanColor.b, alpha);
        gameViewContext.strokeStyle = this.color.toString();
        this.fan.camera.strokeRect(this.fan.getLeft() + this.x, this.fan.getTop() - this.y, 1, 1);
    }
}