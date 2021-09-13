class PuzzleBoard {
    tiles = [];
    boardSprites = [];
    guessedChars = [];
    constructor(answer) {
        this.answer = answer.split("/").join(" ").trim();
        this.generateTiles(answer);

        
        let boardBackColor = "green";
        let boardBackBorderColor = "lime";
        let panelWidth = 250;
        let panelHeight = 310;
        let panel1 = new Rect(boardBackColor, 0, 0, panelWidth * 12 + 60, panelHeight * 4 + 60);
        panel1.x += panelWidth * 6.5;
        panel1.y += panelHeight * 1.5;
        let panel2 = new Rect(boardBackColor, 0, 0, panelWidth * 14 + 60, panelHeight * 2 + 60);
        panel2.x += panelWidth * 6.5;
        panel2.y += panelHeight * 1.5;
        let borderPanels = [panel1, panel2].map(a =>
            new Rect(boardBackBorderColor, a.x, a.y, a.xScale + 60, a.yScale + 60)
        );
        this.boardSprites.push(...borderPanels, panel1, panel2);
        camera.zoom /= 2;

        for (let row of [0, 1, 2, 3]) {
            for (let col of [...Array(14).keys()]) {
                if ((row === 0 || row === 3) && (col === 0 || col === 13)) continue;
                let tile = this.tiles.find(a => a.row === row && a.col === col);
                let tileImage = new StaticImage(images.panel, 1, col * 250, row * 310);
                this.boardSprites.push(tileImage);
                if (tile) {
                    tile.sprite = tileImage;
                    tileImage.tile = 1;
                    let tileText = new StaticText(tile.char, 180, "#000", "#0000", tileImage.x, tileImage.y + 20);
                    tileText.fontFace = "Verdana";
                    tileText.boldness = 800;
                    if (!tile.revealed) tileText.color = "#0000";
                    tile.textSprite = tileText;
                    this.boardSprites.push(tileText);
                }
                tileImage.animated = false;
            }
        }
        this.boardSprites.forEach(a => {
            a.x -= panelWidth * 6.5;
            a.y -= panelHeight * 2.5;
        })
        sprites.push(...this.boardSprites);
    }

    RevealTile(tile) {
        tile.sprite.tile = 1;
        tile.revealed = true;
        tile.highlighted = false;
        tile.textSprite.color = "#000";
    }

    RevealRandomTile() {
        // for toss-ups
        let unrevealedTiles = this.tiles.filter(a => !a.revealed);
        if (unrevealedTiles.length === 0) return;
        let chosenIndex = Math.floor(Math.random() * unrevealedTiles.length);
        this.revealTile(unrevealedTiles[chosenIndex]);
    }

    GetUnrevealedByChar(char) {
        return this.tiles.filter(a => !a.revealed && a.char === char);
    }

    OnGuessChar(char) {
        this.guessedChars.push(char.toUpperCase());
        let tiles = this.GetUnrevealedByChar(char);
        let delay = 40 * frames;
        let delayNum = 0;
        for (let tile of tiles) {
            tile.guessed = true;
            setTimeout(() => {
                tile.highlighted = true;
                let tone = document.getElementById("ding");
                tone.volume = 0.1;
                tone.pause();
                tone.currentTime = 0;
                tone.play();
            }, delayNum * delay)
            delayNum++;
        }

        if (tiles.length === 0) {
            let tone = document.getElementById("buzz");
            tone.volume = 0.1;
            tone.pause();
            tone.currentTime = 0;
            tone.play();
        }
    }

    splitText(answer) {
        let spaceIndexes = [];
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === " ") spaceIndexes.push(i);
        }
        let possibleConfigs = [];
        for (let configIndex = 0; configIndex < Math.pow(2, spaceIndexes.length); configIndex++) {
            let newConfig = answer;
            let binaryConfig = configIndex.toString("2").split("");
            while (binaryConfig.length < spaceIndexes.length) binaryConfig.unshift("0");
            for (let i = 0; i < newConfig.length; i++) {
                if (newConfig[i] === " ") {
                    let isSwap = binaryConfig.pop() === "0";
                    if (isSwap) {
                        newConfig = newConfig.substring(0, i) + "/" + newConfig.substring(i + 1);
                    }
                }
            }

            let lines = newConfig.split("/");
            let isNarrowEnough = lines.every(l => l.length <= 14);
            let isShortEnough = lines.length <= 4;
            if (lines.length >= 3) {
                // top line used
                if (lines[0].length > 12) isNarrowEnough = false;
                if (lines.length === 4) {
                    // bottom line used
                    if (lines[3].length > 12) isNarrowEnough = false;
                }
            }

            if (isNarrowEnough && isShortEnough) {
                let variance = this.calculateVariance(lines.map(a => a.length));
                let wordCountVar = this.calculateVariance(lines.map(a => a.split(" ").length));
                let score = 10;
                score -= variance / 10;
                score -= wordCountVar;
                score -= lines.length * 10;
                possibleConfigs.push({ config: newConfig, score: score });
            }
        }

        possibleConfigs.sort((a, b) => b.score - a.score);
        return possibleConfigs[0].config;
    }

    calculateVariance(dataset) {
        if (dataset.length <= 1) return 0;
        let sum = (a, b) => a + b;
        let mean = dataset.reduce(sum, 0) / dataset.length;
        let sumOfSquareDiffs = dataset.map(a => (a - mean) ** 2).reduce(sum, 0);
        let count = dataset.length;
        let variance = sumOfSquareDiffs / (count - 1)
        return variance;
    }

    generateTiles(answer) {
        // answer user / for newline
        // spread words across the board
        // left-aligned to longest line
        // longest line is centered (lean right if odd)
        // lines are centered (lean up if odd)

        let lines = this.splitText(answer.toUpperCase()).split("/");
        let maxLineLength = Math.max(...lines.map(a => a.length));
        let blanksToLeft = Math.ceil((14 - maxLineLength) / 2);
        let blanksToTop = Math.floor((4 - lines.length) / 2);

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            let line = lines[lineIndex];
            let rowIndex = lineIndex + blanksToTop;

            // handle top and bottom having one less tile of space
            if (rowIndex === 0 || rowIndex === 3) {
                if (blanksToLeft === 0) {
                    line = " " + line;
                }
            }

            for (let charIndex = 0; charIndex < line.length; charIndex++) {
                let char = line[charIndex];
                let colIndex = charIndex + blanksToLeft;

                if (char !== " ") {
                    let tile = new PuzzleChar(rowIndex, colIndex, char);
                    this.tiles.push(tile)
                }
            }

        }

    }

    Update() {
        for (let tile of this.tiles) {
            tile.Update();
        }
    }
}