function EditorTextBox(x, y, width, height) {
    this.name = "Text Box";
    this.description = "Provides helpful hints. Fades out when it leaves the center of the screen.";

    EditorBase.call(this, x, y, width, height);
    this.text = 'Text here';

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('text', paramTypes.string));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new TextBox(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            this.text);
    }
}
EditorTextBox.prototype = new EditorBase();
EditorTextBox.prototype.constructor = EditorTextBox;

editorObjectTypes.push(
    { name: 'Textbox', type: EditorTextBox, add: function (tileX, tileY) { return new this.type(tileX, tileY); } }
);


function TextBox(x, y, text) {
    SpriteBase.call(this, x, y);
    this.width = editorScale;
    this.height = editorScale;
    this.text = text;
    this.solid = false;

    this.color = new Color(40, 40, 50, 1.0);
    this.containerColor = new Color(40, 160, 160, 0.5);
    this.borderColor = new Color(0, 0, 0, 0.5);
    this.editorBorderColor = new Color(0, 0, 0, 0.2);

    this.executeRules = function () {
    };

    this.draw = function () {
        var fontSize = 25;
        gameViewContext.font = fontSize + "px Arial";
        var textWidth = gameViewContext.measureText(this.text).width;
        var left = camera.convertX(this.x) - textWidth/2;
        var top = camera.convertY(this.y);
        var margin = 8;

        var cameraXDistance = camera.x - this.x;
        var cameraYDistance = camera.y - this.y;
        var cameraDistance = Math.pow(cameraXDistance * cameraXDistance + cameraYDistance * cameraYDistance, 0.5);
        var opacity = [[1.4 - (cameraDistance / editorScale)/5, 0].max(), 1].min();

        this.color = new Color(40, 40, 50, opacity);
        this.containerColor = new Color(40, 160, 160, 0.5 * opacity);
        this.borderColor = new Color(0, 0, 0, 0.5 * opacity);
        this.editorBorderColor = new Color(0, 0, 0, 0.2);

        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.fillStyle = this.containerColor.toString();
        gameViewContext.fillRect(left - margin, top - fontSize - margin, textWidth + margin * 2, fontSize + margin * 2);
        gameViewContext.strokeRect(left - margin, top - fontSize - margin, textWidth + margin * 2, fontSize + margin * 2);
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.fillText(this.text, left, top);

        if (mode == gameMode.edit) {
            gameViewContext.strokeStyle = this.editorBorderColor.toString();
            camera.strokeRect(this.x - this.width/2, this.y - this.height / 2, this.width, this.height);
        }
    }
}
TextBox.prototype = new SpriteBase();
TextBox.prototype.constructor = TextBox;