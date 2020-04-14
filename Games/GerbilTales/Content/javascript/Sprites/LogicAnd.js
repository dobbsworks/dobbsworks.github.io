function EditorLogicAnd(x, y, width, height) {
    this.name = "And Gate";
    this.description = "Provides power equal to the minimum of its two power sources.";

    EditorBase.call(this, x, y, width, height);

    this.input1 = null;
    this.input2 = null;
    this.isPowerSource = true;
    this.visible = true;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('input1', paramTypes.powerSource));
    this.editables.push(new Editable('input2', paramTypes.powerSource));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var logicSprite = new LogicAnd(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.input1, this.input2);
        logicSprite.visible = this.visible;
        return logicSprite;
    }
}
EditorLogicAnd.prototype = new EditorBase();
EditorLogicAnd.prototype.constructor = EditorLogicAnd;

editorObjectTypes.push(
    { name: 'LogicAnd', type: EditorLogicAnd, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);


function LogicAnd(x, y, width, height, input1, input2) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.visible = true;

    this.input1 = input1;
    this.input2 = input2;

    this.color = new Color(100, 128, 100, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);
    this.power = 0;

    this.executeRules = function () {
        if (this.input1 && this.input2) this.power = [this.input1.power, this.input2.power].min();
        else this.power = 0;
    };


    this.imageSource = document.getElementById("LogicGates");

    this.draw = function () {
        this.camera.drawImage(this.imageSource, 0, (this.power > 0 ? 16 : 0), editorScale, editorScale, this.getLeft(), this.getTop(), this.width, this.height);
    }
}
LogicAnd.prototype = new SpriteBase();
LogicAnd.prototype.constructor = LogicAnd;