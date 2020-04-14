function EditorConveyor(x, y, width, height) {
    this.name = "Conveyor Belt";
    this.description = "Moves gerbils around. Takes input1 for speed (stopped at 0, full speed at 1) and input2 for direction (left at 0, right for >0).";
    this.isMovable = true;

    EditorBase.call(this, x, y, width, height);

    this.input1 = null;
    this.input2 = null;
    this.maxSpeed = 0.5;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin2));
    this.editables.push(new Editable('maxSpeed', paramTypes.decimal));
    this.editables.push(new Editable('input1', paramTypes.powerSource));
    this.editables.push(new Editable('input2', paramTypes.powerSource));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var logicSprite = new Conveyor(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.input1, this.input2);
        logicSprite.maxSpeed = this.maxSpeed;
        return logicSprite;
    }
}
EditorConveyor.prototype = new EditorBase();
EditorConveyor.prototype.constructor = EditorConveyor;

editorObjectTypes.push(
    { name: 'Conveyor', type: EditorConveyor, add: function (tileX, tileY) { return new this.type(tileX, tileY, 2, 1); } }
);


function Conveyor(x, y, width, height, input1, input2) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.input1 = input1;
    this.input2 = input2;

    this.direction = direction.left;
    this.speed = 0;

    this.executeRules = function () {
        this.speed = this.maxSpeed * (this.input1 ? this.input1.power : 0);
        this.direction = (this.input2 && this.input2.power != 0 ? direction.right : direction.left);
        if (this.direction == direction.left) this.speed *= -1;

        this.frameCounter += this.direction == direction.left ? -0.5 : 0.5;
        var riders = this.getCumulativeRiders();
        for (var i = 0; i < riders.length; i++) {
            riders[i].x += this.speed;
        }
    };

    this.frameCounter = 0;
    this.textures = [new ConveyorTexture1(), new ConveyorTexture2(), new ConveyorTexture3(), new ConveyorTexture4()];

    this.draw = function () {
        var frame = (parseInt(this.frameCounter)) % 4;
        if (frame < 0) frame += 4;
        this.textures[frame].draw(this);
    }
}
Conveyor.prototype = new SpriteBase();
Conveyor.prototype.constructor = Conveyor;