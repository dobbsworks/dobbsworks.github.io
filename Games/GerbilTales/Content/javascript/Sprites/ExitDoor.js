function EditorExitDoor(x, y, width, height) {
    this.name = "Exit Door";
    this.description = "Get a gerbil here to beat the level.";

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    //this.editables.push(new Editable('requiredGerbils', paramTypes.integer));

    this.anchors = ResizerAnchorSet(this);

    this.requiredGerbils = 1;

    this.createSprite = function () {
        return new ExitDoor(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width) * editorScale,
            parseInt(this.height) * editorScale,
            this.requiredGerbils);
    }
}
EditorExitDoor.prototype = new EditorBase();
EditorExitDoor.prototype.constructor = EditorExitDoor;


editorObjectTypes.push(
    { name: 'Exit Door', type: EditorExitDoor, add: function (tileX, tileY) { return new this.type(tileX, tileY, 2, 2); } }
);

function ExitDoor(x, y, width, height, requiredGerbils) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.currentGerbilCount = 0;
    this.requiredGerbils = requiredGerbils;

    this.color = new Color(65, 80, 80, 1.0);

    this.solid = false;

    this.executeRules = function () {
        var gerbils = sprites.filter(function (spr) { return spr instanceof Gerbil; });
        for (var i = 0; i < gerbils.length; i++) {
            if (this.doesOverlapSprite(gerbils[i])) {
                gerbils[i].delete();
                this.currentGerbilCount++;
            }
        }
    };

    this.frame = 0;
    this.frameCounter = 0;
    this.ticksPerFrame = 4;
    this.imageSource = document.getElementById("ExitDoor");
    this.draw = function () {
        var circleY = this.getTop() + this.width / 2;

        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.beginPath();
        this.camera.arc(this.x, circleY, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.fill();
        this.camera.fillRect(this.getLeft(), circleY, this.width, this.height - (this.width / 2));
        
        gameViewContext.font = "20px monospace";
        gameViewContext.fillStyle = this.color.toString();
        //this.camera.centerText(this.currentGerbilCount + "/" + this.requiredGerbils, this.x, this.y - this.width * 0.6);
    }

}
ExitDoor.prototype = new SpriteBase();
ExitDoor.prototype.constructor = ExitDoor;