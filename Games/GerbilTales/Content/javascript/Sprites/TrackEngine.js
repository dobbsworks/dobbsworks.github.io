function EditorTrackEngine(x, y, nextNode, startingNode, cargo) {
    this.name = "TrackEngine";
    this.description = "An engine moves its cargo along a path";
    this.startingNode = startingNode;
    this.cargo = cargo;
    this.powerSource = null;
    this.speed = 1;
    this.zIndex = 4;

    EditorBase.call(this, x, y, 1, 1);

    this.editables.push(new Editable('startingNode', paramTypes.pathNode));
    this.editables.push(new Editable('cargo', paramTypes.movable));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));
    this.editables.push(new Editable('speed', paramTypes.decimal));

    this.anchors = [new CenterAnchor(this)];

    this.executeRules = function () {
        if (this.startingNode) {
            this.tileX = this.startingNode.tileX;
            this.tileY = this.startingNode.tileY;
        }
    }
    
    this.createSprite = function () {
        return new TrackEngine(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            this.startingNode, this.cargo, null, this.speed);
    }
}
EditorTrackEngine.prototype = new EditorBase();
EditorTrackEngine.prototype.constructor = EditorTrackEngine;

editorObjectTypes.push(
    { name: 'TrackEngine', type: EditorTrackEngine, add: function (tileX, tileY) { return new this.type(tileX, tileY, null, null, null); } }
);


function TrackEngine(x, y, startingNode, cargo, powerSource, speed) {
    SpriteBase.call(this, x, y);
    this.width = editorScale;
    this.height = editorScale;
    this.startingNode = startingNode;
    this.solid = false;
    this.cargo = cargo;
    this.powerSource = powerSource;
    this.speed = speed;
    this.dx = 0;
    this.dy = 0;
    this.zIndex = 4;

    this.frame = 0;
    this.frameCounter = 0;
    this.ticksPerFrame = 4;
    this.imageSource = document.getElementById("Engine");
    
    this.executeRules = function () {
        if (!this.initialized) {
            this.x = this.startingNode.x;
            this.y = this.startingNode.y;
            this.initialized = true;
            this.originalX = this.x;
            this.originalY = this.y;
            this.currentNode = this.startingNode;
            this.targetNode = null;
            if (this.currentNode) this.targetNode = this.currentNode.nextNode;
        }
        
        if (this.powerSource && this.powerSource.power == 1) {
            if (this.targetNode) {
                var distanceToTravel = this.speed * this.powerSource.power;
                var remainingDistance = Math.sqrt(Math.pow(this.x - this.targetNode.x, 2) + Math.pow(this.y - this.targetNode.y, 2));
                if (remainingDistance <= distanceToTravel) {
                    this.dx = 0;
                    this.dy = 0;

                    this.x = this.targetNode.x;
                    this.y = this.targetNode.y;

                    this.targetNode = this.targetNode.nextNode;
                } else {
                    var theta = Math.atan2(this.targetNode.y - this.y, this.targetNode.x - this.x);
                    this.dx = Math.cos(theta) * distanceToTravel;
                    this.dy = Math.sin(theta) * distanceToTravel;

                    this.x += this.dx;
                    this.y += this.dy;
                }
            }
        } else {
            this.dx = 0;
            this.dy = 0;
        }

        if (this.cargo) {
            if (!this.cargo.originalX) this.cargo.originalX = this.cargo.x;
            if (!this.cargo.originalY) this.cargo.originalY = this.cargo.y;
            this.cargo.x = this.x - this.originalX + this.cargo.originalX;
            this.cargo.y = this.y - this.originalY + this.cargo.originalY;
            this.cargo.dx = this.dx;
            this.cargo.dy = this.dy;
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i].riding == this.cargo) {
                    sprites[i].x += this.dx;
                    sprites[i].y += this.dy;
                }
            }
        }
    };

    this.draw = function () {
        this.frameCounter++;
        if (this.frameCounter >= this.ticksPerFrame) {
            this.frameCounter = 0;
            this.frame++;
        }
        var frameX = this.frame % 3;
        this.camera.drawImage(this.imageSource, frameX * 16, 0, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
    }
}
TrackEngine.prototype = new SpriteBase();
TrackEngine.prototype.constructor = TrackEngine;