class MinigameBase {
    timeBeforeStart = 15;
    lastUpdateTimestamp = null;
    initialized = false;
    instructions = "";
    gameMode = "UNKNOWN";
    msTimeBetweenGuesses = 10 * 1000;
    guesses = [];
    OnGameComplete = () => { }

    constructor(onGameComplete) {
        this.OnGameComplete = onGameComplete;
    }

    // try to call often (60 ticks per second?)
    Tick() {
        if (!this.initialized) {
            this.initialized = true;
            if (this.Initialize) this.Initialize();
            let instructions = this.GetInstructions() || this.instructions;
            let timeMessage = `${this.gameMode} minigame starting in ${this.timeBeforeStart} seconds! `;
            if (!this.timeBeforeStart) {
                timeMessage = `${this.gameMode} minigame starting now! `;
            }
            let openingMessage = timeMessage + instructions;
            this.WriteMessage(openingMessage);

            this.lastUpdateTimestamp = new Date();
        }
        let prevTimestamp = this.lastUpdateTimestamp;
        this.lastUpdateTimestamp = new Date();
        if (this.GameLoop) {
            this.GameLoop(this.lastUpdateTimestamp - prevTimestamp);
        } else {
            console.error("Minigame has no GameLoop")
        }
    }

    WriteMessage(message) {
        MinigameHandler.WriteMessage(message);
    }

    AwardPoints(username, amount, pretext) {
        pointHandler.addPoints(username, amount);
        let message = `${username} has received ${pointHandler.formatValue(amount)}.`;
        if (pretext) message = pretext + " " + message;
        this.WriteMessage(message);
        MinigameHandler.LogPoints(username, amount);
    }

    GetShuffledArray(array) {
        let scrambled = [];
        let startArray = [...array]; // copy to avoid editing original array
        while (startArray.length) {
            let randomIndex = Math.floor(Math.random() * startArray.length);
            let item = startArray.splice(randomIndex, 1)[0];
            scrambled.push(item);
        }
        return scrambled;
    }

    IsUserTooSoon(user, guess) {
        let userGuesses = this.guesses.filter(x => x.username.toUpperCase() === user.username.toUpperCase());
        if (userGuesses.length > 0) {
            let latestGuess = userGuesses[userGuesses.length - 1];
            let msSinceLastGuess = (new Date() - latestGuess.timestamp);
            if (msSinceLastGuess < this.msTimeBetweenGuesses) {
                // guessing too soon
                let secondsBetweenGuesses = (this.msTimeBetweenGuesses / 1000).toFixed(0);
                this.WriteMessage(`${user.username}, you can only guess every ${secondsBetweenGuesses} seconds.`);
                return true;
            }
        }
        this.guesses.push({ username: user.username, guess: guess, timestamp: new Date() });
        return false;
    }
}

class MinigameWordGameBase extends MinigameBase {
    state = "starting";
    winningPoints = 100;
    category = "???";
    correctAnswer = "";
    displayedClue = "";
    drawnClue = [];

    msIntroTimer = 0;
    msIntroWaitTime = this.timeBeforeStart * 1000;
    msSinceLastReveal = 0;
    msBetweenHints = 30 * 1000;

    GetInstructions() {
        return `The category is ${this.category}. ` + this.instructions;
    }

    IsAlphanumeric(char) {
        let alpha = MinigameHandler.alpha;
        return alpha.indexOf(char) > -1 || alpha.toLowerCase().indexOf(char) > -1;
    }

    GetPuzzle() {
        return MinigameHandler.GetPuzzle();
    }

    GameLoop(msTick) {
        if (this.state === "starting") {
            this.msIntroTimer += msTick;
            if (this.msIntroTimer > this.msIntroWaitTime) {
                this.state = "active";
                this.WriteMessage(this.displayedClue);
            }
        } else {
            this.msSinceLastReveal += msTick;
            if (this.msSinceLastReveal > this.msBetweenHints) {
                this.msSinceLastReveal = 0;
                if (this.Hint) this.Hint();
                if (this.correctAnswer.toUpperCase() === this.displayedClue.toUpperCase()) {
                    this.WriteMessage("Too bad! The correct answer was: " + this.correctAnswer);
                    this.OnGameComplete();
                } else {
                    this.WriteMessage(this.displayedClue);
                }
            }
        }
    }

    ProcessGuess(user, guess) {
        if (this.state === "starting") return;

        let tooSoon = this.IsUserTooSoon(user, guess);
        if (tooSoon) return;

        // allow missing special characters
        let trimmedAnswer = this.correctAnswer.split('').filter(this.IsAlphanumeric).join('').toUpperCase();
        let trimmedGuess = guess.split('').filter(this.IsAlphanumeric).join('').toUpperCase();


        if (!this.OnGuess || this.OnGuess(user, guess)) {
            // run this block only if there's no special handling, or if special handling returns true
            let isGuessCorrect = trimmedAnswer === trimmedGuess;
            if (isGuessCorrect) {
                this.GameWin(user);
            } else {
                this.WriteMessage(`${user.username}, "${guess}" is incorrect.`);
            }
        }
    }

    Draw(ctx) {
        for (let clue of this.drawnClue) {
            if (Math.abs(clue.x - clue.targetX) < 0.05) {
                clue.x = clue.targetX;
            } else {
                clue.x += (clue.targetX - clue.x) * 0.05;
            }

            if (Math.abs(clue.y - clue.targetY) < 0.05) {
                clue.y = clue.targetY;
            } else {
                clue.y += (clue.targetY - clue.y) * 0.05;
            }
        }

        ctx.fillStyle = "#18181b";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        ctx.textAlign = "center";
        ctx.font = `${18}px Arial`;
        ctx.fillStyle = "white";
        ctx.fillText(`${this.gameMode} Minigame`, ctx.canvas.width / 2, 60);
        ctx.fillText(`Category: ${this.category}`, ctx.canvas.width / 2, 80);

        if (this.state === "active") {
            let margin = 10;
            let pixelsPerChar = 25;
            let fontSize = pixelsPerChar;
            ctx.font = `${fontSize}px Arial`;
            for (let clue of this.drawnClue) {
                let x = pixelsPerChar * clue.x + margin + pixelsPerChar / 2;
                let y = fontSize + clue.y * (fontSize + 20) + 120;
                if (this.IsAlphanumeric(clue.char)) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(x - pixelsPerChar / 2, y - pixelsPerChar, pixelsPerChar, pixelsPerChar + 6);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#CCC";
                    ctx.strokeRect(x - pixelsPerChar / 2, y - pixelsPerChar, pixelsPerChar, pixelsPerChar + 6);
                }
                if (!clue.hidden) {
                    ctx.fillStyle = "white";
                    ctx.fillText(clue.char.toUpperCase(), x, y);
                }
            }
        }

        if (this.DrawGuessSection) this.DrawGuessSection(ctx);
    }

    GameWin(user) {
        this.WriteMessage(`${user.username} correctly guessed the answer! ${this.correctAnswer}`);
        this.OnGameComplete();
        setTimeout(() => { this.AwardPoints(user.username, this.winningPoints); }, 1000);
    }

    TileOutText(text) {
        let words = text.split(" ");
        let lines = [];
        while (words.length > 0) {
            let word = words.splice(0, 1)[0];
            if (lines.length === 0) {
                lines.push(word);
            } else {
                let currentLineLength = lines[lines.length - 1].length;
                if (currentLineLength + word.length >= 14) {
                    lines[lines.length - 1] += " ";
                    lines.push(word);
                } else {
                    lines[lines.length - 1] += " " + word;
                }
            }
        }

        let ret = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            let line = lines[lineIndex];
            let chars = line.split("");
            let mid = (line.length - 1) / 2;
            let shiftRight = line.endsWith(" ");
            let lineTiles = chars.map((char, index) => ({
                char: char,
                x: 7,
                targetX: 7 + (index - mid) + (shiftRight ? 0.5 : 0),
                y: -2,
                targetY: lineIndex
            }));
            ret.push(...lineTiles);
        }
        ret.forEach((a, i) => a.tileIndex = i);
        return ret;
    }
}

class MinigameScramble extends MinigameWordGameBase {
    gameMode = "SCRAMBLE";
    instructions = "When the puzzle appears, guess the answer with !guess MY ANSWER";
    msBetweenHints = 20 * 1000;

    Initialize() {
        let puzzle = this.GetPuzzle();
        this.correctAnswer = puzzle.answer;
        this.category = puzzle.category;
        this.displayedClue = this.ScrambleWord(this.correctAnswer);
        this.drawnClue = this.TileOutText(this.displayedClue);
    }


    // Scramble letters/numbers
    // e.g. "Final Fantasy: Crystal Chronicles" 
    // into "NYTNE RCSAAOA: FHTSICY CLRLANLFSI"
    ScrambleWord(word) {
        word = word.toUpperCase();
        let letters = word.split("");
        let scrambledLetters = [];
        while (letters.length) {
            let randomIndex = Math.floor(Math.random() * letters.length);
            let letter = letters.splice(randomIndex, 1)[0];
            if (this.IsAlphanumeric(letter)) {
                scrambledLetters.push(letter);
            }
        }
        // only scramble alphanumeric characters
        let ret = "";
        for (let i = 0; i < word.length; i++) {
            if (this.IsAlphanumeric(word[i])) {
                ret += scrambledLetters.pop();
            } else {
                ret += word[i];
            }
        }
        return ret;
    }

    Hint() {
        let hintNum = Math.ceil(this.correctAnswer.length / 10);
        this.Unscramble(hintNum);
    }

    Unscramble(num) {
        for (let i = 0; i < num; i++) {
            // swaps two incorrectly placed letters
            // the swap will move at least one of the letters to the right place, maybe both
            let targetAnswer = this.correctAnswer.toUpperCase();
            let targetMap = this.displayedClue.split("").map((char, index) => {
                if (char === targetAnswer[index]) {
                    return index;
                } else {
                    let availableAnswer = targetAnswer.split("").map((c, i) => this.displayedClue[i] === targetAnswer[i] ? " " : c);
                    let correctIndex = availableAnswer.indexOf(char, index + 1);
                    if (correctIndex === -1) correctIndex = availableAnswer.indexOf(char);
                    if (correctIndex === -1) {
                        console.error("Uh oh, correctIndex -1", availableAnswer, targetAnswer, char);
                    }
                    return correctIndex;
                }
            });
            let outOfPlaceIndexes = targetMap.map((target, i) => ({ target: target, current: i })).filter(a => a.target !== a.current);
            let randomIndextoCorrect = outOfPlaceIndexes[Math.floor(outOfPlaceIndexes.length * Math.random())];
            if (randomIndextoCorrect) {
                this.SwapLetters(randomIndextoCorrect.target, randomIndextoCorrect.current);
            } else {
                // could not unscramble
            }
        }
    }

    SwapLetters(indexA, indexB) {
        let chars = this.displayedClue.split("");
        let temp = chars[indexA];
        chars[indexA] = chars[indexB];
        chars[indexB] = temp;
        this.displayedClue = chars.join("");

        let charA = this.drawnClue.find(a => a.tileIndex === indexA);
        let charB = this.drawnClue.find(a => a.tileIndex === indexB);
        if (charA !== undefined && charB !== undefined) {
            let x = charA.targetX;
            charA.targetX = charB.targetX;
            charB.targetX = x;
            let y = charA.targetY;
            charA.targetY = charB.targetY;
            charB.targetY = y;
            let i = charA.tileIndex;
            charA.tileIndex = charB.tileIndex;
            charB.tileIndex = i;
        } else {
            console.error("Uh oh, undefined char", this.drawnClue, indexA, indexB);
        }
    }
}

class MinigameHangman extends MinigameWordGameBase {
    gameMode = "HANGMAN";
    instructions = "Guess letters with !guess X, or guess the full answer with !guess MY ANSWER";
    hideCharacter = "+";
    winningPoints = 50;
    guessedChars = [];

    Initialize() {
        let puzzle = this.GetPuzzle();
        this.correctAnswer = puzzle.answer;
        this.category = puzzle.category;
        this.displayedClue = this.HideWord(this.correctAnswer);
        this.drawnClue = this.TileOutText(this.correctAnswer);
        this.drawnClue.forEach(t => {
            if (this.IsAlphanumeric(t.char)) t.hidden = true;
        })
    }

    DrawGuessSection(ctx) {
        ctx.textAlign = "center";
        ctx.font = `${18}px Arial`;
        ctx.fillStyle = "white";

        let chars = MinigameHandler.alpha;
        let x = 37;
        let y = 300;
        for (let char of chars) {
            ctx.fillStyle = "white";
            if (this.guessedChars.indexOf(char) > -1) {
                ctx.fillStyle = "#555";
            }
            ctx.fillText(char, x, y);
            x += 25;
            if (x >= ctx.canvas.width - 15) {
                x = 37;
                y += 25;
            }
        }
    }

    OnGuess(user, guess) {
        if (guess.length === 1) {
            let revealedCount = this.UnhideCharacter(guess[0]);

            if (revealedCount > 0) {
                this.msSinceLastReveal = 0;

                if (this.correctAnswer.toUpperCase() === this.displayedClue.toUpperCase()) {
                    this.GameWin(user);
                } else {
                    let pretext = `${revealedCount} ${guess.toUpperCase()}${revealedCount === 1 ? "" : "'s"},`;
                    this.AwardPoints(user.username, 10, pretext);
                    this.WriteMessage(this.displayedClue);
                }
            } else {
                this.WriteMessage(`There are no ${guess.toUpperCase()}'s.`);
            }
            return false;
        }
        return true;
    }

    // Blank out letters/numbers, leave spaces and special characters in place
    // e.g. "Final Fantasy: Crystal Chronicles" 
    // into "+++++ +++++++: +++++++ ++++++++++"
    HideWord(word) {
        return word.split("").map(c => this.IsAlphanumeric(c) ? this.hideCharacter : c).join("");
    }

    Hint() {
        let hiddenIndexes = this.displayedClue.split("").map((c, i) => c === this.hideCharacter ? i : -1).filter(a => a > -1);
        let indexToReveal = hiddenIndexes[Math.floor(hiddenIndexes.length * Math.random())];
        if (indexToReveal) {
            this.UnhideCharacter(this.correctAnswer[indexToReveal]);
        }
    }

    UnhideCharacter(char) {
        // returns number revealed
        char = char.toUpperCase();
        this.guessedChars.push(char);
        let newDisplay = "";
        let revealCount = 0;
        for (let i = 0; i < this.displayedClue.length; i++) {
            if (this.correctAnswer[i].toUpperCase() === char && this.displayedClue[i] === this.hideCharacter) {
                newDisplay += this.correctAnswer[i];
                revealCount++;
            } else {
                newDisplay += this.displayedClue[i];
            }
        }
        this.displayedClue = newDisplay;
        this.drawnClue.filter(a => a.char.toLowerCase() === char.toLowerCase()).forEach(a => a.hidden = false);
        return revealCount;
    }
}

class MinigameMatch extends MinigameBase {
    gameMode = "MATCHING";
    timeBeforeStart = 0;
    cardHeight = 60;
    cardWidth = 40;
    numRows = 3;
    numCols = 6;
    cardTypes = [
        { chatText: "mushroom", chatCode: "🍄", xIndex: 1, yIndex: 0 },
        { chatText: "flower", chatCode: "🌼", xIndex: 2, yIndex: 0 },
        { chatText: "star", chatCode: "⭐", xIndex: 3, yIndex: 0 },
        { chatText: "leaf", chatCode: "🍁", xIndex: 0, yIndex: 1 },
        { chatText: "hammer", chatCode: "🔨", xIndex: 1, yIndex: 1 },
        { chatText: "coin", chatCode: "💰", xIndex: 2, yIndex: 1 },
        { chatText: "anchor", chatCode: "⚓", xIndex: 3, yIndex: 1 },
        { chatText: "frog", chatCode: "🐸", xIndex: 0, yIndex: 2 },
        { chatText: "tanooki", chatCode: "🐻", xIndex: 1, yIndex: 2 },
        { chatText: "shoe", chatCode: "👞", xIndex: 2, yIndex: 2 },
        { chatText: "cloud", chatCode: "☁", xIndex: 3, yIndex: 2 },
    ];
    cards = [];
    cardImage = MinigameHandler.cardImage;
    msTimeBetweenGuesses = 10 * 1000;
    guesses = [];

    Initialize() {
        let pairsNeeded = this.numCols * this.numRows / 2;
        let deck = [];
        for (let i = 0; i < pairsNeeded; i++) {
            let cardType = this.cardTypes[Math.floor(Math.random() * this.cardTypes.length)];
            deck.push(cardType, cardType);
        }
        deck = this.GetShuffledArray(deck);
        this.cards = deck.map((a, i) => ({
            cardType: a,
            index: i,
            x: i % this.numCols,
            y: Math.floor(i / this.numCols),
            key: MinigameHandler.alpha[i],
            state: "down", // down, up, hint
            hintTimer: 0,
            rotation: 0, // [0,PI] = [face down, face up]
            print: a.chatCode + " " + a.chatText,
        }));
    }

    GetInstructions() {
        return "Guess matching pairs with !guess A B";
    }

    ProcessGuess(user, guess) {
        if (!guess) return;

        let tooSoon = this.IsUserTooSoon(user, guess);
        if (tooSoon) return;

        let keys = guess.toUpperCase().split(" ");
        if (keys.length !== 2) {
            keys = guess.toUpperCase().split("");
        }
        let card1 = this.FlipCard(keys[0]);
        let card2 = this.FlipCard(keys[1]);
        if (!card1 || !card2 || keys[0] === keys[1]) {
            // invalid guess!
            this.WriteMessage(`${user.username}, make sure to include 2 different card letters like this: !guess A B`);
            return;
        }

        let message = `Flipped ${this.CardText(card1)} and ${this.CardText(card2)}. `
        if (card1.state !== "up" && card2.state !== "up" && card1.cardType === card2.cardType) {
            // MATCH!
            message += " It's a match!"
            card1.state = "up";
            card2.state = "up";
            this.AwardPoints(user.username, 20, message);

            if (this.cards.every(a => a.state === "up")) {
                this.OnGameComplete();
            }
        } else {
            this.WriteMessage(message);
        }
    }

    CardText(card) {
        let isUp = card.state === "up";
        return `[${card.key}] ${card.print}` + (isUp ? ` (already matched)` : "");
    }

    FlipCard(key) {
        if (!key) return null;
        if (!key.toUpperCase) return null;
        let card = this.cards.find(a => a.key === key.toUpperCase());
        if (!card) return null;
        if (card.state === "down" || card.state === "hint") {
            card.state = "hint";
        }
        card.hintTimer = 180;
        return card;
    }

    GameLoop(msTick) {
        // handle cards flipping
        for (let card of this.cards) {
            let targetRotation = 0;
            if (card.state !== "down") {
                targetRotation = 3 * Math.PI;
            }
            
            card.rotation += (targetRotation - card.rotation) * 0.05;
            if (Math.abs(card.rotation - targetRotation) < 0.01) {
                card.rotation = targetRotation;
            }

            if (card.hintTimer) {
                card.hintTimer--;
            }
            if (card.hintTimer <= 0 && card.state === "hint") {
                card.state = "down";
            }
        }
    }

    Draw(ctx) {
        let margin = 20;
        let baseX = 30;
        let rowHeight = this.cardHeight + margin;
        let colWidth = this.cardWidth + margin;
        let baseY = 30;

        for (let card of this.cards) {
            let sx = card.cardType.xIndex * this.cardWidth;
            let sy = card.cardType.yIndex * this.cardHeight;
            if (Math.cos(card.rotation) > 0) {
                // is face down
                sx = 0;
                sy = 0;
            }
            let xOffset = Math.abs(Math.sin(card.rotation)) * this.cardWidth / 2;
            let cardScale = 1 - Math.abs(Math.sin(card.rotation));
            let dx = baseX + colWidth * card.x;
            let dy = baseY + rowHeight * card.y;
            if (card.state === "up") {
                ctx.fillStyle = "#FF0";
                ctx.fillRect(dx + xOffset - 1, dy - 1, this.cardWidth * cardScale + 2, this.cardHeight + 2);
            }
            ctx.drawImage(this.cardImage, sx, sy, this.cardWidth, this.cardHeight,
                dx + xOffset, dy, this.cardWidth * cardScale, this.cardHeight);

            if (card.state !== "up") {
                ctx.fillStyle = "#333";
                ctx.beginPath();
                ctx.arc(dx, dy, 10, 0, 2 * Math.PI);
                ctx.fill();

                ctx.font = `${16}px Arial`;
                ctx.fillStyle = "#EEE";
                ctx.textAlign = "center";
                ctx.fillText(card.key, dx, dy + 6);
            }
        }
    }
}

var MinigameHandler = {
    gameTypes: [MinigameScramble, MinigameHangman, MinigameMatch],
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    handlerState: "inactive",
    repeatMode: false,
    winner: null,
    window: null,
    ctx: null,
    cardImage: null,

    currentGame: null,
    interval: null,
    points: [],

    Init: () => {
        MinigameHandler.interval = setInterval(MinigameHandler.ProcessGame, 1000 / 60);
        MinigameHandler.window = MinigameHandler.CreateWindow();
    },

    LogPoints: (username, amount) => {
        let record = MinigameHandler.points.find(a => a.username === username);
        if (!record) {
            record = { username: username, points: 0 };
            MinigameHandler.points.push(record);
        }
        record.points += amount;
    },

    GetPuzzle: () => {
        // TODO, track recent puzzles to prevent repeats
        var categories = Object.keys(minigameAnswers);
        var categoryIndex = Math.floor(Math.random() * categories.length);
        var category = categories[categoryIndex];
        var puzzles = minigameAnswers[category];
        var puzzleIndex = Math.floor(Math.random() * puzzles.length);
        var puzzle = puzzles[puzzleIndex];
        return { answer: puzzle, category: category };
    },

    StartGame: () => {
        if (MinigameHandler.handlerState !== "inactive") {
            MinigameHandler.WriteMessage("There's already a minigame in progress.");
            return;
        }
        let gameType = MinigameHandler.gameTypes[Math.floor(Math.random() * MinigameHandler.gameTypes.length)];
        MinigameHandler.currentGame = new gameType(MinigameHandler.OnGameOver);
        MinigameHandler.handlerState = "starting";
    },


    WriteMessage: (message) => {
        WriteMessageRaw(" PurpleStar " + message);
    },

    ProcessGame: () => {
        let ctx = MinigameHandler.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let currentGame = MinigameHandler.currentGame;
        if (currentGame) {
            currentGame.Tick();
            if (currentGame.Draw) {
                currentGame.Draw(ctx);
            }
        }
        MinigameHandler.DrawScores(ctx);
    },

    DrawScores: (ctx) => {
        if (MinigameHandler.points.length !== 0) {
            MinigameHandler.points.sort((a, b) => b.points - a.points);
            let y = MinigameHandler.ctx.canvas.height / 2;
            let x = 60;

            ctx.font = `${20}px Arial`;
            ctx.fillStyle = "#EEE";
            ctx.textAlign = "center";
            ctx.fillText("Today's winnings", MinigameHandler.ctx.canvas.width / 2, y);
            y += 25;

            for (let record of MinigameHandler.points) {
                ctx.font = `${16}px Arial`;
                ctx.fillStyle = "#EEE";
                ctx.textAlign = "left";
                ctx.fillText(record.username, x, y);
                ctx.textAlign = "right";
                ctx.fillText(record.points.toFixed(0), MinigameHandler.ctx.canvas.width - x, y);
                y += 20;
            }
        }
    },

    ProcessGuess: (user, guess) => {
        let currentGame = MinigameHandler.currentGame;
        if (currentGame) currentGame.ProcessGuess(user, guess);
    },

    OnGameOver: () => {
        MinigameHandler.handlerState = "inactive";
        MinigameHandler.currentGame = null;
        if (MinigameHandler.repeatMode) {
            setTimeout(() => { MinigameHandler.StartGame(); }, 1000);
        } else {
            if (MinigameHandler.window) MinigameHandler.window.close();
        }
    },

    CreateWindow: () => {
        MinigameHandler.window = window.open("", "Minigame", "width=400,height=800");
        MinigameHandler.window.document.writeln(`<canvas width="400" height="800" id="canvas" style="background-color: #18181b; position:fixed; left:0; top:0;"></canvas>`);
        MinigameHandler.window.document.writeln(`<image id="card" style="display: none;" src="https://dobbsworks.github.io/Tools/Streambot/images/cards.png"></image>`);
        MinigameHandler.window.document.title = "Minigame";
        let canvas = MinigameHandler.window.document.getElementById("canvas");
        let cardImage = MinigameHandler.window.document.getElementById("card");
        MinigameHandler.ctx = canvas.getContext("2d");
        MinigameHandler.cardImage = cardImage;
    },
};
MinigameHandler.Init();


function CommandMinigame(user, args) {
    if (!args[0]) return "Usage: !minigame {start|stop|repeat|last}";
    if (args[0].toLowerCase() === "start") {
        MinigameHandler.StartGame();
    } else if (args[0].toLowerCase() === "stop") {
        MinigameHandler.repeatMode = false;
        MinigameHandler.handlerState = "inactive";
        MinigameHandler.currentGame = null;
    } else if (args[0].toLowerCase() === "repeat") {
        MinigameHandler.repeatMode = true;
        MinigameHandler.StartGame();
    } else if (args[0].toLowerCase() === "last") {
        MinigameHandler.repeatMode = false;
    } else {
        return "Usage: !minigame {start|stop|repeat|last}";
    }
}

function CommandMinigameGuess(user, args) {
    let guess = args.join(' ');
    MinigameHandler.ProcessGuess(user, guess);
}