function Catcher(x, lane) {
    SpriteBase.call(this, x, lane.y);
    this.color = new Color(255, 255, 255, 1.0);
    this.radius = 20;
    this.initialShape = shapes.circle;
    this.shape = this.initialShape;
    this.lane = lane;
    
    this.switchKeyPressed = false;
    

    this.executeRules = function () {
        this.y = this.lane.y;
        this.handleSwitchShapeDirection();
        this.handleSwitchShapeNumKeys();
        this.color = this.shape.color;
    }


    this.draw = function () {
        this.shape.draw(this.x, this.y, this.radius, 3, this.color, null, null);
    }


    this.resetShape = function () {
        this.shape = this.initialShape;
    }


    this.randomShape = function () {
        if (!level) return;
        this.shape = shapeChoices[parseInt(level.numChoices * Math.random())];
    }


    this.advanceShape = function () {
        if (!level) return;
        var shapeIndex = shapeChoices.indexOf(this.shape);
        if (shapeIndex < level.numChoices - 1) {
            this.shape = shapeChoices[shapeIndex + 1];
        } else {
            this.shape = shapeChoices[0];
        }
    }

    this.handleSwitchShapeDirection = function () {
        if (keyboardState.isUpPressed() || isMouseClicked) {
            if (!this.switchKeyPressed) {
                this.advanceShape();
            }
            this.switchKeyPressed = true;
        } else if (keyboardState.isDownPressed()) {
            if (!this.switchKeyPressed) {
                for (var i = 0; i < level.numChoices - 1; i++) this.advanceShape();
            }
            this.switchKeyPressed = true;
        } else {
            this.switchKeyPressed = false;
        }
    }


    this.handleSwitchShapeNumKeys = function () {
        if (!level) return;
        for (var i = 0; i < level.numChoices; i++) {
            if (keyboardState.isKeyPressed(keyboardState.key["Digit" + (i + 1).toString()])) {
                this.resetShape();
                for (var j = 0; j < i; j++) this.advanceShape();
            }
        }
    }

}
Catcher.prototype = new SpriteBase();
Catcher.prototype.constructor = Catcher;