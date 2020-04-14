function EditorLaserSource(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.powerSource = null;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new LaserSource(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.powerSource);
    }
}
EditorLaserSource.prototype = new EditorBase();
EditorLaserSource.prototype.constructor = EditorLaserSource;

//editorObjectTypes.push(
//    { name: 'Laser', type: EditorLaserSource, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
//);


function LaserSource(x, y, width, height, powerSource) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.solid = false;

    var hitPoint = this.findSolidPoint(sprites, direction.down);
    this.laser = null;
    if (hitPoint) this.laser = new Laser(this.x, this.y, this.x, hitPoint.y);

    this.powerSource = powerSource;

    this.color = new Color(100, 255, 255, 1.0);
    this.borderColor = new Color(80, 200, 200, 1.0);

    this.onKill = function () {
        if (this.laser) this.laser.kill();
    }

    this.executeRules = function () {
        if (this.laser) {
            if (this.powerSource && this.powerSource.power > 0) {
                if (sprites.indexOf(this.laser) < 0) sprites.push(this.laser);
            } else {
                if (sprites.indexOf(this.laser > -1)) this.laser.kill();
            }
        }
    };

    this.draw = function () {
        if (this.laser) this.laser.draw();

        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
LaserSource.prototype = new SpriteBase();
LaserSource.prototype.constructor = LaserSource;