function EditorLogicNot(x, y, width, height) {
    this.name = "Not Gate";
    this.description = "Provides power equal to the opposite of its power source. If it has no power source, it produces full power.";
    EditorBase.call(this, x, y, width, height);

    this.input = null;
    this.isPowerSource = true;
    this.visible = true;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('input', paramTypes.powerSource));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var logicSprite = new LogicNot(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.input);
        logicSprite.visible = this.visible;
        return logicSprite;
    }
}
EditorLogicNot.prototype = new EditorBase();
EditorLogicNot.prototype.constructor = EditorLogicNot;

editorObjectTypes.push(
    { name: 'LogicNot', type: EditorLogicNot, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);

function LogicNot(x, y, width, height, input) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.visible = true;

    this.input = input;

    this.color = new Color(100, 128, 100, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);
    this.power = 0;

    this.executeRules = function () {
        if (this.input) this.power = 1 - this.input.power;
        else this.power = 1;
    };

    this.imageSource = document.getElementById("LogicGates");

    this.draw = function () {
        this.camera.drawImage(this.imageSource, 32, (this.power > 0 ? 16 : 0), editorScale, editorScale, this.getLeft(), this.getTop(), this.width, this.height);
    }
}
LogicNot.prototype = new SpriteBase();
LogicNot.prototype.constructor = LogicNot;