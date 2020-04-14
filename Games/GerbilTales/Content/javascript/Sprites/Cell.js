function EditorCell(x, y, width, height) {
    this.name = "Cell";
    this.description = "Releases its contents when receiving full power, but solid when unpowered.";

    EditorBase.call(this, x, y, width, height);

    this.powerSource = null;
    this.gerbilCount = 0;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('height', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));
    this.editables.push(new Editable('gerbilCount', paramTypes.integer));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var cell = new Cell(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width) * editorScale,
            parseInt(this.height) * editorScale,
            this.powerSource, 
            this.gerbilCount);
        return cell;
    }
}
EditorCell.prototype = new EditorBase();
EditorCell.prototype.constructor = EditorCell;

//editorObjectTypes.push(
//    { name: 'Cell', type: EditorCell, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } }
//);


function Cell(x, y, width, height, powerSource, gerbilCount) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.powerSource = powerSource;

    this.addCaptive = function (sprite) {
        this.captives.push(sprite);
        sprite.container = this;
    }

    this.captives = [];
    for (var i = 0; i < gerbilCount; i++)
        this.addCaptive(new Gerbil(this.x, this.y));

    this.barWidth = 5;
    this.color = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
        this.cameraFocus = this.powerSource.power > 0;
        if (this.powerSource.power >= 1) this.freeCaptives();
        for (var i = 0; i < this.captives.length; i++) {
            var captive = this.captives[i];
            captive.dy = 0;
            captive.setBottom(this.getBottom() - this.barWidth);
            if (captive.getLeft() < this.getLeft()) {
                captive.setLeft(this.getLeft() + 2);
                captive.dx = 1;
            }
            if (captive.getRight() > this.getRight()) {
                captive.setRight(this.getRight() - 2);
                captive.dx = -1;
            }
        }
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.strokeStyle = this.color.toString();
        gameViewContext.lineWidth = 3;
        var numBars = parseInt(this.width / this.barWidth / 2);
        var barOffset = (this.width - this.barWidth) / (numBars - 1);
        for (var i = 0; i < numBars; i++) {
            this.camera.fillRect(this.getLeft() + i * barOffset, this.getTop(), this.barWidth, this.height);
        }
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.barWidth);
        if (this.captives.length > 0) this.camera.fillRect(this.getLeft(), this.getBottom() - this.barWidth, this.width, this.barWidth);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.color.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }

    this.freeCaptives = function () {
        for (var i = 0; i < this.captives.length; i++)
            this.captives[i].container = null;
        this.captives = [];
    }
}
Cell.prototype = new SpriteBase();
Cell.prototype.constructor = Cell;