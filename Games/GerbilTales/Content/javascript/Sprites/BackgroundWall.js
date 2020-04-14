function EditorBackgroundWall(x, y, width, height) {
    this.name = "BackgroundWall";
    this.description = "For a little extra flavor in your level. ";
    //this.background = true;

    this.zIndex = -3;

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('height', paramTypes.integer, ValidateMin1));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new BackgroundWall(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale);
    }
}
EditorBackgroundWall.prototype = new EditorBase();
EditorBackgroundWall.prototype.constructor = EditorBackgroundWall;

editorObjectTypes.push(
    { name: 'BackgroundWall', type: EditorBackgroundWall, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } }
);


function BackgroundWall(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.solid = false;
    this.zIndex = -3;

    this.executeRules = function () {
    };


    this.texture = new DirtBackgroundTexture();

    this.draw = function () {
        this.texture.draw(this);
    }
}
BackgroundWall.prototype = new SpriteBase();
BackgroundWall.prototype.constructor = BackgroundWall;