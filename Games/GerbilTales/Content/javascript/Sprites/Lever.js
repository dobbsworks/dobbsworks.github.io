function EditorLever(x, y) {
    this.name = "Lever";
    this.description = "Togglable power source. A nearby gerbil can switch it with the up key (default 'W').";
    this.isMovable = true;

    this.isPowerSource = true;
    this.startOn = false;
    EditorBase.call(this, x, y, 1, 1);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('startOn', paramTypes.boolean));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        var lever = new Lever((0.5 + parseInt(this.tileX)) * editorScale,
            (0.5 + parseInt(this.tileY)) * editorScale);
        lever.power = this.startOn ? 1 : 0;
        return lever;
    }
}
EditorLever.prototype = new EditorBase();
EditorLever.prototype.constructor = EditorLever;


editorObjectTypes.push(
    { name: 'Lever', type: EditorLever, add: function (tileX, tileY) { return new this.type(tileX, tileY); } }
);

function Lever(x, y) {
    SpriteBase.call(this, x, y);
    this.isMovable = true;

    this.solid = false;
    this.power = 0;
    this.upPressed = false;

    this.executeRules = function () {
        if (!this.upPressed && keyboardState.isUpPressed()) {
            this.upPressed = true;
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i] instanceof Gerbil && this.doesOverlapSprite(sprites[i])) {
                    this.power = 1 - this.power;
                    return;
                }
            }
        }
        if (!keyboardState.isUpPressed()) {
            this.upPressed = false;
        }
    };

    this.imageSource = document.getElementById("Lever");
    this.draw = function () {
        this.frameCounter++;
        if (this.frameCounter >= this.ticksPerFrame) {
            this.frameCounter = 0;
            this.frame++;
        }
        var frame = (this.power > 0 ? 1 : 0)
        this.camera.drawImage(this.imageSource, frame * 16, 0, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
    }

}
Lever.prototype = new SpriteBase();
Lever.prototype.constructor = Lever;