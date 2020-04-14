function EditorButton(x, y, width) {
    this.name = "Button";
    this.description = "Acts as a power source based on the number of gerbils stacked on top.";
    this.neededPush = 1;
    this.isMovable = true;

    EditorBase.call(this, x, y, width, 1);

    this.isPowerSource = true;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('neededPush', paramTypes.integer, ValidateMin1));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new LeftAnchor(this));
    this.anchors.push(new RightAnchor(this));
    
    this.createSprite = function () {
        var button = new Button(parseInt(this.tileX) * editorScale,
            (parseInt(this.tileY) + 0.5) * editorScale,
            parseInt(this.width) * editorScale,
            editorScale / 2);
        button.neededPush = this.neededPush;
        return button;
    }
}
EditorButton.prototype = new EditorBase();
EditorButton.prototype.constructor = EditorButton;

editorObjectTypes.push(
    { name: 'Button', type: EditorButton, add: function (tileX, tileY) { return new this.type(tileX, tileY, 3); } }
);

function Button(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.isMovable = true;

    this.color = new Color(100, 255, 128, 1.0);

    this.pushers = 0;
    this.neededPush = 3;
    this.power = 0;

    this.executeRules = function () {
        this.pushers = this.getCumulativeRiders();
        this.power = this.pushers.length / this.neededPush;
        if (this.power > 1) this.power = 1;
    };

    this.texture = new ButtonTexture();

    this.draw = function () {
        this.texture.draw(this);
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft() + 4, this.getTop() + 4, (this.width - 8) * (this.power), 1);
    }

}
Button.prototype = new SpriteBase();
Button.prototype.constructor = Button;