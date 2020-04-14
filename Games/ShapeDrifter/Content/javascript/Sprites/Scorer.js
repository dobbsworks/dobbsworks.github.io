var mood = {
    neutral: 0,
    happy: 1,
    sad: -1
}

function Scorer(x, y) {
    SpriteBase.call(this, x, y);
    this.color = new Color(92, 255, 255, 1.0);
    this.shadowColor = new Color(0, 0, 0, 0.1);
    this.eyeColor = new Color(92, 92, 255, 1.0);

    this.eyeOffset = 0.35; // ratio compared to body radius
    this.eyeHeight = 0.3; // ratio compared to body radius

    this.successes = 0;
    this.misses = 0;
    this.score = 0;

    this.z = 0;
    this.dz = 0;
    this.radius = 30;
    this.drawRadius = this.radius; // used for flair, not function
    this.maxJiggleTimer = 20;
    this.jiggleTimer = 0;
    this.strikes = 0;

    this.textBubbleColor = new Color(222, 222, 255, 1.0);
    this.textColor = new Color(30, 30, 50, 1.0);

    this.combo = 0;
    this.bestCombo = 0;
    this.mood = mood.neutral;
    this.mouthOpen = false;
    
    this.frame = 0;
    this.gameOver = false;

    this.executeRules = function () {
        if (level == null) {
            if (this.gameOver == false) {
                this.gameOver = true;
                this.mood = mood.happy;
                for (var i = sprites.length - 1; i >= 0; i--) {
                    if (sprites[i] != this) sprites[i].active = false;
                }

                var comboBonus = this.bestCombo * 50;
                var sizeBonus = parseInt(this.radius * this.radius / 5);
                var finalScore = comboBonus + this.score + sizeBonus;

                var scoreText = [
                    "You got " + this.successes + "/" + (this.successes + this.misses) + "!",
                    "Your score: " + this.score,
                    "Best combo: " + this.bestCombo,
                    "Combo bonus: " + comboBonus,
                    "Size bonus: " + sizeBonus,
                    "Final score: " + finalScore
                ];

                for (var i = 0; i < scoreText.length; i++) {
                    var box = new TextBubble(700, 135 + 65 * i, scoreText[i], false, 500000);
                    box.width = 500;
                    sprites.push(box);
                }

                sprites.push(new TextBubble(200, 100, "Click me to restart!", true, 500000));
            }
            if (isMouseClicked && mouseX < 400) {
                StartGame();
                return;
            }
            if (this.dz == 0) this.dz = 10;
        }

        this.dz -= 0.4;
        this.z += this.dz;
        if (this.z < 0) {
            this.z = 0;
            this.dz *= -0.7;
            if (this.dz < 0.5) this.dz = 0;
        }


        this.frame += 1;
        var hits = sprites.filter(function (spr) { return spr instanceof TargetHit && spr.x < scorer.x });
        var comboUp = false;

        for (var i = 0; i < hits.length; i++) {
            var hit = hits[i];

            if (hit.isSuccess) {
                comboUp = true;
                this.combo++;
                this.radius += 1;
                if (this.combo >= 1) this.mood = mood.neutral;
                if (this.combo >= 6) this.mood = mood.happy;
                if (this.combo > this.bestCombo) this.bestCombo = this.combo;
            } else {
                if (this.radius <= 10) {
                    level.levelLength = 0;
                }
                this.combo = 0;
                this.radius /= 1.4;
                this.radius -= 1;
                this.mood = mood.sad;
            }

            hit.active = false;
            this.jiggleTimer = this.maxJiggleTimer;
        }

        if (this.radius < 10) this.radius = 10;
        if (this.radius > 150) this.radius = 150;

        if (this.jiggleTimer > 0) {
            this.jiggleTimer--;
            this.drawRadius = this.radius * (1 + (Math.random() / 5) * (this.jiggleTimer / this.maxJiggleTimer));
        }

        if (this.combo % 10 == 0 && this.combo >= 10 && comboUp) {
            sprites.push(new TextBubble(this.x, 100, this.combo + " COMBO!", true, 80));
        }
        this.mouthOpen = false;
        if (sprites.any(function (spr) { return spr instanceof TextBubble })) {
            if (parseInt(this.frame / 5) % 2 == 0) this.mouthOpen = true;
        }
    }

    this.draw = function () {
        var drawY = this.y - this.z;

        for (var i = 0; i < 10; i++) {
            var shadowRadius = this.radius * Math.pow(0.95, i);
            shadowRadius -= (this.z / 5);
            if (shadowRadius <= 0) break;
            shapes.ellipse.draw(this.x, this.y + this.radius / 5, shadowRadius, null, null, this.shadowColor, null);
        }
        shapes.blob.draw(this.x, drawY, this.drawRadius, null, null, this.color, null);

        var eyeOffsetPx = this.eyeOffset * this.drawRadius;
        var eyeHeight = this.eyeHeight * this.drawRadius;
        var eyeRadius = this.drawRadius / 5;
        var eyeWidth = eyeRadius / 2;

        if (this.mood == mood.neutral || this.mood == mood.happy) {
            shapes.ellipse.draw(this.x + eyeOffsetPx, drawY - eyeHeight, eyeRadius, null, null, this.eyeColor, Math.PI / 2);
            shapes.ellipse.draw(this.x - eyeOffsetPx, drawY - eyeHeight, eyeRadius, null, null, this.eyeColor, Math.PI / 2);
        } else {
            shapes.line.draw(this.x + eyeOffsetPx - eyeWidth, drawY - eyeHeight, this.x + eyeOffsetPx + eyeWidth, drawY - eyeHeight + eyeRadius, 2, this.eyeColor);
            shapes.line.draw(this.x + eyeOffsetPx - eyeWidth, drawY - eyeHeight, this.x + eyeOffsetPx + eyeWidth, drawY - eyeHeight - eyeRadius, 2, this.eyeColor);
            shapes.line.draw(this.x - eyeOffsetPx + eyeWidth, drawY - eyeHeight, this.x - eyeOffsetPx - eyeWidth, drawY - eyeHeight + eyeRadius, 2, this.eyeColor);
            shapes.line.draw(this.x - eyeOffsetPx + eyeWidth, drawY - eyeHeight, this.x - eyeOffsetPx - eyeWidth, drawY - eyeHeight - eyeRadius, 2, this.eyeColor);
        }

        if (this.mood == mood.neutral) {
            var height = this.mouthOpen ? 4 : 0;
            shapes.roundedRectangle.draw(this.x + eyeWidth, drawY + eyeWidth, eyeWidth, height, height / 2, 2, this.eyeColor, this.eyeColor);
        }
        if (this.mood == mood.happy) {
            var fillColor = this.mouthOpen ? this.eyeColor : null;
            shapes.smile.draw(this.x, drawY, eyeRadius, 2, this.eyeColor, fillColor);
        }
        if (this.mood == mood.sad) {
            var fillColor = this.mouthOpen ? this.eyeColor : null;
            shapes.frown.draw(this.x, drawY + eyeWidth, eyeRadius, 2, this.eyeColor, fillColor);
        }

        if (level && level.levelLength) {
            var barWidth = 200;
            var barHeight = 10;
            var barY = this.y + 130;
            var completion = level.beat / level.levelLength;
            var completionWidth = barWidth * completion;
            shapes.roundedRectangle.draw(this.x, barY, barWidth, barHeight, barHeight / 3, 0, null, this.shadowColor);
            shapes.roundedRectangle.draw(this.x - barWidth / 2 + completionWidth / 2, barY, completionWidth, barHeight, barHeight / 3, 0, null, this.eyeColor);
        }
     }
}
Scorer.prototype = new SpriteBase();
Scorer.prototype.constructor = Scorer;