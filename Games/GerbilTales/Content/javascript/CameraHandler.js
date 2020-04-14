function Camera(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.scale = 1;
    this.editorTargetScale = 1;
    this.width = 0;
    this.height = 0;
    this.accel = 0.5;
    this.maxSpeed = 10;
    this.inertia = 0.9;
    this.zoomSpeedRatio = 1.5;

    this.convertX = function (x) { return (x - this.x) * this.scale + this.width/2; }
    this.convertY = function (y) { return (y - this.y) * this.scale + this.height / 2; }
    this.invertX = function (x) { return (x - this.width / 2) / this.scale + this.x; }
    this.invertY = function (y) { return (y - this.height / 2) / this.scale + this.y; }

    this.getMouseX = function () { return this.invertX(mouseX); }
    this.getMouseY = function () { return this.invertY(mouseY); }

    this.moveTo = function (x, y) {
        gameViewContext.moveTo(this.convertX(x), this.convertY(y));
    }

    this.lineTo = function (x, y) {
        gameViewContext.lineTo(this.convertX(x), this.convertY(y));
    }

    this.drawVerticalLine = function (x) {
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.convertX(x), 0);
        gameViewContext.lineTo(this.convertX(x), this.height);
        gameViewContext.stroke();
    }
    this.drawHorizontalLine = function (y) {
        gameViewContext.beginPath();
        gameViewContext.moveTo(0, this.convertY(y));
        gameViewContext.lineTo(this.width, this.convertY(y));
        gameViewContext.stroke();
    }
    this.drawLine = function (x1, y1, x2, y2) {
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.convertX(x1), this.convertY(y1));
        gameViewContext.lineTo(this.convertX(x2), this.convertY(y2));
        gameViewContext.closePath();
        gameViewContext.stroke();
    }
    this.drawPolygon = function (points) {
        if (points.length == 0) return;
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.convertX(points[0].x), this.convertY(points[0].y));
        for (var i = 1; i < points.length; i++) {
            gameViewContext.lineTo(this.convertX(points[i].x), this.convertY(points[i].y));
            gameViewContext.stroke();
        }
        gameViewContext.lineTo(this.convertX(points[0].x), this.convertY(points[0].y));
        gameViewContext.stroke();
        gameViewContext.fill();
    }
    this.fillRect = function (x, y, width, height) {
        gameViewContext.fillRect(this.convertX(x), this.convertY(y), width * this.scale, height * this.scale);
    }
    this.strokeRect = function (x, y, width, height) {
        gameViewContext.strokeRect(this.convertX(x), this.convertY(y), width * this.scale, height * this.scale);
    }
    this.drawImage = function (image, sx, sy, swidth, sheight, x, y, width, height) {
        gameViewContext.drawImage(image, sx, sy, swidth, sheight,
            this.convertX(x), this.convertY(y), width * this.scale, height * this.scale);
    }
    this.fillText = function (text, x, y) {
        gameViewContext.fillText(text, this.convertX(x), this.convertY(y));
    }
    this.centerText = function (text, x, y) {
        var width = gameViewContext.measureText(text).width;
        gameViewContext.fillText(text, this.convertX(x) - width/2, this.convertY(y));
    }
    this.arc = function (x, y, radius, thetaStart, thetaEnd, counterclockwise) {
        //if (thetaEnd < thetaStart) return;
        gameViewContext.arc(this.convertX(x), this.convertY(y), radius * this.scale, thetaStart, thetaEnd, counterclockwise);
    }
    this.arcTo = function (x1, y1, x2, y2, r) {
        gameViewContext.arcTo(this.convertX(x1), this.convertY(y1), this.convertX(x2), this.convertY(y2), r);
    }

    this.updateCamera = function () {
        this.width = viewWidth;
        this.height = viewHeight;
        if (mode == gameMode.play || mode == gameMode.playPaused) {
            var cameraFoci = sprites.filter(function (obj) { return obj.cameraFocus; });
            if (cameraFoci.length > 0) {
                var fociXs = cameraFoci.map(function (obj) { return obj.x + 16 * obj.dx; });
                var fociYs = cameraFoci.map(function (obj) { return obj.y + 16 * obj.dy; });

                var targetX = fociXs.average();
                var targetY = fociYs.average();
                var xRange = cameraFoci.map(function (obj) { return obj.getRight(); }).max() - cameraFoci.map(function (obj) { return obj.getLeft(); }).min();
                var yRange = cameraFoci.map(function (obj) { return obj.getBottom(); }).max() - cameraFoci.map(function (obj) { return obj.getTop(); }).min();

                var targetScale = 1 / [(xRange + 128) / this.width, (yRange + 128) / this.height].max();
                this.scale += (targetScale - this.scale) / 20;
                this.editorTargetScale = this.scale;

                this.dx = (targetX - this.x) / 20;
                this.dy = (targetY - this.y) / 20;
            } else {
                this.dx *= 0.95;
                this.dy *= 0.95;
            }
        } else if (mode == gameMode.edit) {
            if (mouseScroll > 0) this.editorTargetScale *= this.zoomSpeedRatio;
            if (mouseScroll < 0) this.editorTargetScale /= this.zoomSpeedRatio;
            this.scale += (this.editorTargetScale - this.scale) / 20;

            if (!keyboardState.isLeftPressed() && !keyboardState.isRightPressed()) this.dx *= this.inertia;
            if (!keyboardState.isUpPressed() && !keyboardState.isDownPressed()) this.dy *= this.inertia;

            var accel = this.accel / this.scale;
            var maxSpeed = this.maxSpeed / this.scale;
            if (document.activeElement && document.activeElement.tagName.toLowerCase() != 'input') {
                if (keyboardState.isLeftPressed()) this.dx -= accel;
                if (keyboardState.isRightPressed()) this.dx += accel;
                if (keyboardState.isUpPressed()) this.dy -= accel;
                if (keyboardState.isDownPressed()) this.dy += accel;
            }
            if (this.dx > maxSpeed) this.dx = maxSpeed;
            if (this.dx < -maxSpeed) this.dx = -maxSpeed;
            if (this.dy > maxSpeed) this.dy = maxSpeed;
            if (this.dy < -maxSpeed) this.dy = -maxSpeed;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    this.drawPowerConnection = function (target) {

        // THIS COULD BE IMPROVED

        var powerParams = ["powerSource","input1","input2","input"];
        for (var i = 0; i < powerParams.length; i++) {
            var powerParam = powerParams[i];
            var source = target[powerParam];
            if (source == null) continue;
            if (!target.powerFrame) target.powerFrame = 0;
            if (!source.power) source.power = 0;
            target.powerFrame += source.power;

            if (target.createSprite) target = target.createSprite();
            if (source.createSprite) source = source.createSprite();

            var xDir = target.x > source.x ? 1 : -1;
            var yDir = target.y > source.y ? 1 : -1;
            var indicatorDistance = 8;

            var unpoweredColor = new Color(80, 80, 80, (source.power / 4) + 0.2);
            var poweredColor = new Color(64, 255, 64, (source.power / 4) + 0.2);
            gameViewContext.strokeStyle = unpoweredColor.toString();
            gameViewContext.fillStyle = poweredColor.toString();

            var bubbleGap = 3;
            var bubbleDelay = 7;
            var bubbleRadius = 3;
            var bubbleCount = parseInt(target.powerFrame / bubbleDelay + 1) % bubbleGap;

            for (var x = source.x - (source.x - target.x) % indicatorDistance ; x * xDir < target.x * xDir; x += xDir * indicatorDistance) {
                gameViewContext.beginPath();
                this.arc(x, source.y, bubbleRadius, 0, Math.PI * 2);
                if (bubbleCount == 0) gameViewContext.fill();
                gameViewContext.stroke();
                bubbleCount = (bubbleCount - 1 + bubbleGap) % bubbleGap;
            }
            for (var y = source.y; y * yDir < target.y * yDir; y += yDir * indicatorDistance) {
                gameViewContext.beginPath();
                this.arc(target.x, y, bubbleRadius, 0, Math.PI * 2);
                if (bubbleCount == 0) gameViewContext.fill();
                gameViewContext.stroke();
                bubbleCount = (bubbleCount - 1 + bubbleGap) % bubbleGap;
            }
        }
    }

    this.drawEditorGridLines = function () {
        if (mode == gameMode.edit) {
            gameViewContext.strokeStyle = new Color(128, 128, 128, 0.2).toString();
            gameViewContext.lineWidth = 3;

            var xStart = parseInt(this.x / editorScale) * editorScale;
            for (var i = 0; i < 30; i++) {
                this.drawVerticalLine(xStart + editorScale * (i + 1));
                this.drawVerticalLine(xStart - editorScale * i);
            }
            var yStart = parseInt(this.y / editorScale) * editorScale;
            for (var i = 0; i < 30; i++) {
                this.drawHorizontalLine(yStart + editorScale * (i + 1));
                this.drawHorizontalLine(yStart - editorScale * i);
            }
        }
    }
}