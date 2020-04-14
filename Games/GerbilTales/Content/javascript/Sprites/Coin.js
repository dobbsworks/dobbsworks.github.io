function EditorCoin(x, y) {
    this.name = "Coin";
    this.description = "Cha-ching!";
    this.solid = false;

    EditorBase.call(this, x, y, 1, 1);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new Coin(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale);
    }
}
EditorCoin.prototype = new EditorBase();
EditorCoin.prototype.constructor = EditorCoin;


editorObjectTypes.push(
    { name: 'Coin', type: EditorCoin, add: function (tileX, tileY) { return new this.type(tileX, tileY); } }
);

function Coin(x, y) {
    SpriteBase.call(this, x, y);

    this.solid = false;

    this.executeRules = function () {

    };

    this.frame = 0;
    this.frameCounter = 0;
    this.ticksPerFrame = 4;
    this.imageSource = document.getElementById("Coin");
    this.draw = function () {
        this.frameCounter++;
        if (this.frameCounter >= this.ticksPerFrame) {
            this.frameCounter = 0;
            this.frame++;
        }
        var frameX = this.frame % 4;
        var frameY = (parseInt(this.frame / 4)) % 2;
        this.camera.drawImage(this.imageSource, frameX * 16, frameY * 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
    }

}
Coin.prototype = new SpriteBase();
Coin.prototype.constructor = Coin;