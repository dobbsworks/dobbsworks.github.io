function EditorPeekablock(x, y, width, height) {
    this.name = "Peekablock";
    this.description = "Only solid when powered.";

    EditorBase.call(this, x, y, width, height);

    this.powerSource = null;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('height', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new Peekablock(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.powerSource);
    }
}
EditorPeekablock.prototype = new EditorBase();
EditorPeekablock.prototype.constructor = EditorPeekablock;

editorObjectTypes.push(
    { name: 'Peekablock', type: EditorPeekablock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } }
);


function Peekablock(x, y, width, height, powerSource) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    
    this.powerSource = powerSource;

    this.color = new Color(100, 100, 128, 1.0);
    this.transparentColor = new Color(100, 100, 128, 0.4);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
        var isOn = false;
        if (this.powerSource) isOn = this.powerSource.power > 0;
        this.solid = isOn;
        this.zIndex = -1;
        if (isOn) this.zIndex = 0;
    };

    this.textureOn = new StoneTexture();
    this.textureOff = new StoneTextureRecessed();

    this.draw = function () {
        if (this.solid) {
            this.textureOn.draw(this);
        } else {
            this.textureOff.draw(this);
        }
    }
}
Peekablock.prototype = new SpriteBase();
Peekablock.prototype.constructor = Peekablock;