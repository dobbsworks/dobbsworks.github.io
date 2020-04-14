function Level() {
    this.bpm = 80;
    this.beat = 0;
    this.frameCounter = -300;
    this.movementSpeed = 3;
    this.initialX = 1200;

    var framesPerMinute = 60000 / mainLoop.milliseconds;
    this.framesPerBeat = framesPerMinute / this.bpm;
    this.numChoices = 2;
    this.powerups = false;
    this.powerdowns = false;

    this.downBeatFrequency = 0.5;
    this.upBeatFrequency = 0.1;

    this.lastBeat = -1;
    this.levelLength = 400;

    this.addLane = function () {
        var y = lanes.last().y;
        var targetY = lanes.last().targetY + 80;
        var newLane = new Lane(y, targetY);
        newLane.catcher.shape = lanes.last().catcher.shape;
        newLane.catcher.advanceShape();
        newLane.catcher.initialShape = newLane.catcher.shape;
        lanes.push(newLane);
        sprites.push(newLane);
    }

    this.spawnPowerup = function () {
        var powerup = this.spawnTarget();
        powerup.color = new Color(200, 200, 220, 1.0);
        powerup.isPowerup = true;
        powerup.activatePower = [
            function () { Unity(5000); },
            function () { Sizeup(); },
            function () { Reorder(); }
        ].rand();
        return powerup;
    }

    this.spawnPowerdown = function () {
        var powerdown = this.spawnTarget();
        powerdown.color = new Color(92, 0, 92, 1.0);
        powerdown.isPowerdown = true;
        powerdown.activatePower = [
            function () { ColorBlind(5000); },
            function () { Scramble(); }
        ].rand();
        return powerdown;
    }

    this.spawnTarget = function (avoidLaneIndex) {
        var red = new Color(255, 0, 0, 1.0);
        var green = new Color(0, 255, 0, 1.0);
        var blue = new Color(0, 0, 255, 1.0);
        var yellow = new Color(255, 255, 0, 1.0);

        var colors = [red, blue, green, yellow];

        var laneNumber = parseInt(Math.random() * lanes.length);
        var shapeNumber = parseInt(Math.random() * this.numChoices);

        if (laneNumber == avoidLaneIndex) return;

        var lane = lanes[laneNumber];
        var shape = shapeChoices[shapeNumber];
        var color = shape.color;

        var target = new Target(this.initialX, lane, -this.movementSpeed, color, shape);
        sprites.push(target);
        return target;
    }

    this.executeRules = function () {
        this.beat = parseInt(this.frameCounter / this.framesPerBeat);
        if (this.beat > this.levelLength) {
            if (!sprites.any(function (spr) { return spr instanceof MeasureLine; })) {
                level = null;
            }
            return;
        }

        this.frameCounter++;

        if (this.frameCounter < 0) return;

        var white = new Color(255, 255, 255, 1.0);
        var whiteTranslucent = new Color(255, 255, 255, 0.5);

        if (this.lastBeat != this.beat) {
            this.lastBeat = this.beat;
            if (this.downBeatFrequency < 0.95) this.downBeatFrequency += 0.001;
            if (this.upBeatFrequency < 0.8) this.upBeatFrequency += 0.002;

            if (this.beat % 4 == 0) sprites.push(new MeasureLine(this.initialX, -this.movementSpeed, white, 3));
            else sprites.push(new MeasureLine(this.initialX, -this.movementSpeed, whiteTranslucent, 1));

            var powerupLane = -1;
            if (Math.random() < 0.1) {
                if (Math.random() < 0.5 && this.powerups) {
                    powerupLane = lanes.indexOf(this.spawnPowerup().lane);
                } else if (this.powerdowns) {
                    powerupLane = lanes.indexOf(this.spawnPowerdown().lane);
                }
            }


            if (this.beat == 90 || this.beat == 210) {
                sprites.push(new TextBubble(200, 250, "New shape!", true, 200));
                this.numChoices += 1;
            }
            if ((this.beat % 60) - 40 == 0 && lanes.length <= 6) {
                sprites.push(new TextBubble(200, 250, "New lane!", true, 200));
                this.addLane();
            }
            if (this.beat == 150) {
                sprites.push(new TextBubble(200, 250, "Get silver!", true, 200));
                this.spawnPowerup();
                this.powerups = true;
            }
            if (this.beat == 270) {
                sprites.push(new TextBubble(200, 250, "Avoid purple!", true, 200));
                this.spawnPowerdown();
                this.powerdowns = true;
            }
            if (this.numChoices > shapeChoices.length) {
                this.numChoices = shapeChoices.length;
            }


            if (this.beat % 2 == 1) {
                if (Math.random() > this.upBeatFrequency) return;
            } else if (Math.random() > this.downBeatFrequency) return;
            this.spawnTarget(powerupLane);
        }
    }
}