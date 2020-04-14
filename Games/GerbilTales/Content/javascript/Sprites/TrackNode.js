function EditorTrackNode(x, y, nextNode) {
    this.name = "TrackNode";
    this.description = "";
    this.isTrackNode = true;
    this.nextNode = nextNode;
    this.zIndex = -1;

    EditorBase.call(this, x, y, 1, 1);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('nextNode', paramTypes.pathNode));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new TrackNode(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            this.nextNode);
    }
}
EditorTrackNode.prototype = new EditorBase();
EditorTrackNode.prototype.constructor = EditorTrackNode;

editorObjectTypes.push(
    { name: 'TrackNode', type: EditorTrackNode, add: function (tileX, tileY) { return new this.type(tileX, tileY, null); } }
);


function TrackNode(x, y, nextNode) {
    SpriteBase.call(this, x, y);
    this.width = 8;
    this.height = 8;
    this.nextNode = nextNode;
    this.previousNode = this;
    this.solid = false;
    this.zIndex = -1;

    this.setDrawPoints = function () {
        this.drawPoints = [];

        var nextNode = this.nextNode;
        if (!nextNode) return;
        if (nextNode.createSprite) nextNode = nextNode.createSprite();

        var deltaX = nextNode.x - this.x;
        var deltaY = nextNode.y - this.y;
        var theta = Math.atan2(deltaY, deltaX);
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var delta = 8;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            delta /= Math.abs(Math.cos(theta));
        } else {
            delta /= Math.abs(Math.sin(theta));
        }

        for (var i = delta; i < distance; i += delta) {
            this.drawPoints.push({ x: this.x + i * Math.cos(theta), y: this.y + i * Math.sin(theta) });
        }
    }

    this.drawPoints = [];

    this.nodeImageSource = document.getElementById("TrackNode");
    this.pathImageSource = document.getElementById("TrackPath");
    
    this.executeRules = function () {
        if (this.previousNode == this) {
            this.previousNode = null;
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i].nextNode == this) {
                    this.previousNode = sprites[i];
                    break;
                }
            }
        }
    };

    this.draw = function () {
        if (this.drawPoints.length == 0)
            this.setDrawPoints();

        this.camera.drawImage(this.nodeImageSource, 0, 0, 8, 8, this.getLeft(), this.getTop(), this.width, this.height);
        //this.camera.drawLine(this.x - 4, this.y - 4, this.x + 4, this.y + 4);
        //this.camera.drawLine(this.x - 4, this.y + 4, this.x + 4, this.y - 4);
        if (this.nextNode) {
            var nextNode = this.nextNode;
            if (nextNode.createSprite) nextNode = nextNode.createSprite();

            for (var i = 0 ; i < this.drawPoints.length; i++) {
                this.camera.drawImage(this.pathImageSource, 0, 0, 2, 2, this.drawPoints[i].x - 1, this.drawPoints[i].y - 1, 2, 2);
            }
        }
    }
}
TrackNode.prototype = new SpriteBase();
TrackNode.prototype.constructor = TrackNode;