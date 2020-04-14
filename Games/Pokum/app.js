var Pokum = (function () {
    function Pokum(parentCell) {
        this.parentCell = parentCell;
        this.score = 100;
        this.timer = 0;
        this.isHit = false;
        this.isGoingDown = false;
        this.outroTimerStart = 10;
        this.maxHeight = parentCell.height * 2 / 6;
    }
    Object.defineProperty(Pokum.prototype, "heightRatio", {
        get: function () {
            var introTimerMax = 30;
            if (this.isGoingDown)
                return this.timer / this.outroTimerStart;
            if (this.timer < introTimerMax)
                return this.timer / introTimerMax;
            return 1;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Pokum.prototype, "left", {
        get: function () {
            return this.parentCell.centerX - this.parentCell.width / 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pokum.prototype, "width", {
        get: function () {
            return this.parentCell.width / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pokum.prototype, "height", {
        get: function () {
            return this.maxHeight * this.heightRatio + this.parentCell.width / 12;
        },
        enumerable: true,
        configurable: true
    });

    Pokum.prototype.cycle = function () {
        if (this.timer > 30)
            this.score--;
        if (this.score <= 0) {
            this.isGoingDown = true;
        }
        if (this.isHit)
            this.isGoingDown = true;
        if (this.isGoingDown) {
            this.timer--;
            if (this.timer > this.outroTimerStart)
                this.timer = this.outroTimerStart;
        } else
            this.timer++;
    };
    return Pokum;
})();

var Cell = (function () {
    function Cell(centerX, centerY, width, height) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
    }
    return Cell;
})();

var PokumSpawn = (function () {
    function PokumSpawn(game, cellIndeces, frameDelay) {
        this.game = game;
        this.cellIndeces = cellIndeces;
        this.frameDelay = frameDelay;
    }
    PokumSpawn.prototype.spawn = function () {
        for (var i = 0; i < this.cellIndeces.length; i++) {
            var cellIndex = this.cellIndeces[i];
            var cell = this.game.cells[cellIndex];

            var isCellFull = false;
            for (var j = 0; j < this.game.pokums.length; j++) {
                if (this.game.pokums[j].parentCell === cell) {
                    isCellFull = true;
                }
            }
            if (isCellFull)
                continue;

            var pokum = new Pokum(cell);
            this.game.pokums.push(pokum);
        }
    };
    return PokumSpawn;
})();

var Game = (function () {
    function Game(canvas) {
        this.canvas = canvas;
        this.score = 0;
        this.pokumSpawns = [];
        this.pokums = [];
        this.sparkles = [];
        this.cells = [];
        this.timer = 0;
        this.restartTargetTime = Infinity;
        this.isStarted = false;
        this.isRoundOver = false;
        this.setupGame();
    }
    Game.prototype.roundOver = function () {
        this.isRoundOver = true;
        this.restartTargetTime = 3000 / 60 + this.timer;
    };

    Game.prototype.canRestart = function () {
        return this.timer >= this.restartTargetTime;
    };

    Game.prototype.cycle = function () {
        this.timer++;
        var spawnsRemain = false;
        for (var i = 0; i < this.pokumSpawns.length; i++) {
            if (this.timer <= this.pokumSpawns[i].frameDelay)
                spawnsRemain = true;
            if (this.timer === this.pokumSpawns[i].frameDelay) {
                this.pokumSpawns[i].spawn();
            }
        }
        for (var i = this.pokums.length - 1; i >= 0; i--) {
            var pokum = this.pokums[i];
            pokum.cycle();
            if (pokum.isGoingDown && pokum.timer <= 0)
                this.pokums.splice(i, 1);
        }
        for (var i = this.sparkles.length - 1; i >= 0; i--) {
            var sparkle = this.sparkles[i];
            sparkle.cycle();
            if (sparkle.size >= sparkle.maxSize)
                this.sparkles.splice(i, 1);
        }

        if (!spawnsRemain && this.pokums.length === 0 && !this.isRoundOver)
            this.roundOver();
    };

    Game.prototype.onClick = function (e) {
        this.isStarted = true;
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;

        for (var i = 0; i < this.pokums.length; i++) {
            var pokum = this.pokums[i];
            var cell = pokum.parentCell;
            if (Math.abs(cell.centerX - mouseX) < cell.width / 2 && Math.abs(cell.centerY - mouseY) < cell.height / 2) {
                pokum.isHit = true;
                for (var i = 0; i < 50; i++)
                    this.sparkles.push(new Sparkle(pokum.parentCell.centerX, pokum.parentCell.centerY));
                if (pokum.score > 0) {
                    this.score += pokum.score;
                }
            }
        }

        if (this.canRestart()) {
            this.setupGame();
        }
    };

    Game.prototype.setupGame = function () {
        this.restartTargetTime = Infinity;
        this.isRoundOver = false;
        this.score = 0;
        this.timer = 0;

        var width = this.canvas.width;
        var height = this.canvas.height * 7 / 8;

        var rows = 3;
        var cols = 3;

        var firstX = width / cols / 2;
        var firstY = width / rows / 2 + this.canvas.height / 8;
        var xPer = width / cols;
        var yPer = height / rows;

        this.cells = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var newCell = new Cell(firstX + i * xPer, firstY + j * yPer, xPer, yPer);
                this.cells.push(newCell);
            }
        }

        this.pokumSpawns = [];
        for (var i = 0; i < 20; i++) {
            var cellIndex = Math.floor(Math.random() * this.cells.length);
            var spawn = new PokumSpawn(this, [cellIndex], i * 50);
            this.pokumSpawns.push(spawn);
        }
    };
    return Game;
})();

var Sparkle = (function () {
    function Sparkle(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.maxSize = 40;
        var theta = Math.random() * Math.PI * 2;
        var radius = Math.random() * 7.5;
        this.dx = Math.cos(theta) * radius;
        this.dy = -Math.abs(Math.sin(theta) * radius);
    }
    Sparkle.prototype.cycle = function () {
        this.dx *= 0.96;
        this.dy *= 0.96;
        this.size += 0.8;
        this.x += this.dx;
        this.y += this.dy;
        this.color = "rgba(255,255,255," + (1 - this.size / this.maxSize) + ")";
    };
    return Sparkle;
})();

var Renderer = (function () {
    function Renderer(canvas) {
        this.canvas = canvas;
        this.groundColor = "lightgreen";
        this.skyColor = "skyblue";
        this.holeColor = "gray";
        this.pokumColor = "darkviolet";
        this.pokumHitColor = "purple";
        this.pokumEyeColor = "white";
        this.textColor = "white;";
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
    }
    Renderer.prototype.drawHole = function (cell, back) {
        this.ctx.save();
        this.ctx.translate(cell.centerX, cell.centerY);
        this.ctx.scale(1, 1 / 4);
        var offset = !back ? 0 : Math.PI;
        if (back) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, cell.width / 3, 0, Math.PI * 2, false);
            this.ctx.fill();
        }
        this.ctx.beginPath();
        this.ctx.arc(0, offset, cell.width / 3, 0 + offset, Math.PI + offset, false);
        this.ctx.restore();
        this.ctx.stroke();
    };

    Renderer.prototype.drawPokum = function (pokum) {
        var cell = pokum.parentCell;
        this.ctx.save();
        var pokumY = cell.centerY - pokum.maxHeight * pokum.heightRatio;
        this.ctx.translate(cell.centerX, pokumY);
        this.ctx.scale(1, pokum.heightRatio * 0.8);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, cell.width / 4, 0, 2 * Math.PI, false);
        this.ctx.restore();
        this.ctx.fillStyle = pokum.isHit ? this.pokumHitColor : this.pokumColor;
        this.ctx.fill();
        this.ctx.fillRect(pokum.left, pokumY, pokum.width, pokum.height);

        this.ctx.fillStyle = this.pokumEyeColor;
        this.ctx.fillRect(pokum.left + pokum.width / 3, pokumY, pokum.width / 16, 30 * pokum.heightRatio);
        this.ctx.fillRect(pokum.left + pokum.width * 2 / 3, pokumY, -pokum.width / 16, 30 * pokum.heightRatio);
    };

    Renderer.prototype.drawSparkle = function (sparkle) {
        this.ctx.fillStyle = sparkle.color;
        this.ctx.beginPath();
        this.ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, 2 * Math.PI);
        this.ctx.fill();
    };

    Renderer.prototype.drawText = function (text, fontSize, y, fillColor, borderColor) {
        var oldLineWidth = this.ctx.lineWidth;
        var oldFillColor = this.ctx.fillStyle;
        var oldStrokeColor = this.ctx.strokeStyle;

        this.ctx.font = fontSize.toString() + 'pt Candy Shop Black';
        var textWidth = this.ctx.measureText(text).width;
        var left = (this.canvas.width - textWidth) / 2;

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = fontSize / 5 + 4;
        this.ctx.strokeText(text, left, y);

        this.ctx.fillStyle = fillColor;
        this.ctx.fillText(text, left, y);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = fontSize / 5;
        this.ctx.strokeText(text, left, y);

        this.ctx.lineWidth = oldLineWidth;
        this.ctx.strokeStyle = oldStrokeColor;
        this.ctx.fillStyle = oldFillColor;
    };

    Renderer.prototype.drawGame = function (game) {
        this.ctx.fillStyle = this.groundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.skyColor;
        this.ctx.fillRect(0, 0, this.width, this.height / 8);
        this.ctx.fillStyle = this.holeColor;
        for (var i = 0; i < game.cells.length; i++) {
            this.drawHole(game.cells[i], true);
        }
        for (var i = 0; i < game.pokums.length; i++) {
            this.drawPokum(game.pokums[i]);
        }
        for (var i = 0; i < game.sparkles.length; i++) {
            this.drawSparkle(game.sparkles[i]);
        }
        this.ctx.strokeStyle = this.holeColor;
        this.ctx.fillStyle = this.holeColor;
        this.ctx.lineWidth = 28;
        for (var i = 0; i < game.cells.length; i++) {
            this.drawHole(game.cells[i], false);
        }

        if (!game.isStarted) {
            this.drawText("Pokum!", 100, 250, "orange", "orangered");
            this.drawText("Tap to start", 30, 400, "orange", "orangered");
        }

        if (game.isRoundOver) {
            this.drawText("Final score:", 30, 150, "orange", "orangered");
            this.drawText(game.score.toString(), 50, 400, "orange", "orangered");

            if (game.canRestart()) {
                this.drawText("Tap to play again", 30, 650, "orange", "orangered");
            }
        }
    };
    return Renderer;
})();

window.onload = function () {
    var canvas = document.getElementById("canvas");

    var renderer = new Renderer(canvas);
    var game = new Game(canvas);

    canvas.onclick = function (e) {
        game.onClick(e);
    };
    renderer.drawGame(game);

    Loop(game, renderer);
};

function Loop(game, renderer) {
    if (game.isStarted)
        game.cycle();
    renderer.drawGame(game);
    requestAnimationFrame(function () {
        Loop(game, renderer);
    });
}
//# sourceMappingURL=app.js.map
