function EditorSpikeBlock(x, y, width, height) {
    this.name = "Spike Block";
    this.description = "Thorny and deadly to gerbils.";
    this.isMovable = true;

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new SpikeBlock(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale);
    }
}
EditorSpikeBlock.prototype = new EditorBase();
EditorSpikeBlock.prototype.constructor = EditorSpikeBlock;

editorObjectTypes.push(
    { name: 'Spike', type: EditorSpikeBlock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);


function SpikeBlock(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.isMovable = true;

    this.deadly = true;

    this.color = new Color(255, 100, 128, 1.0);
    this.borderColor = new Color(150, 80, 80, 1.0);

    this.executeRules = function () {
    };

    this.imageSource = document.getElementById("SpikeBlock");

    this.draw = function () {
        this.camera.drawImage(this.imageSource, 0, 0, editorScale, editorScale, this.getLeft(), this.getTop(), this.width, this.height);
    }
}
SpikeBlock.prototype = new SpriteBase();
SpikeBlock.prototype.constructor = SpikeBlock;