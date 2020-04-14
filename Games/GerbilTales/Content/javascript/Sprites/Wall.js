function EditorWall(x, y, width, height) {
    this.name = "Wall";
    this.description = "Your basic solid object";
    this.isMovable = true;

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('height', paramTypes.integer, ValidateMin1));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new Wall(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale);
    }
}
EditorWall.prototype = new EditorBase();
EditorWall.prototype.constructor = EditorWall;

editorObjectTypes.push(
    { name: 'Wall', type: EditorWall, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } }
);


function Wall(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.isMovable = true;

    this.color = new Color(100, 100, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
    };

    this.imageSource = document.getElementById("TextureGrassy");

    this.texture = new GrassyTexture();

    this.draw = function () {
        this.texture.draw(this);
    }
}
Wall.prototype = new SpriteBase();
Wall.prototype.constructor = Wall;