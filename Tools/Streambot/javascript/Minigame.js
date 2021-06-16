class MinigameBase {
    // PHASES
    //  INIT -> JOIN -> READY -> ACTIVE -> RESULTS -> END

    currentPhase = "init";
    currentPhaseTimestamp = null;
    timePhaseJoin = 0;
    timePhaseReady = 15;
    timePhaseResults = 3;
    forceNextPhase = false;

    lastUpdateTimestamp = null;
    gameMode = "UNKNOWN";
    msTimeBetweenGuesses = 10 * 1000;
    guesses = [];

    OnGameComplete() {
        this.currentPhase = "active";
        this.forceNextPhase = true;
    }

    ProcessPhaseMove() {
        let phasePropMap = [
            { phase: "init", time: 0 },
            { phase: "join", time: this.timePhaseJoin, text: this.GetOnJoinText, hook: this.OnJoinPhase },
            { phase: "ready", time: this.timePhaseReady, text: this.GetOnReadyText, hook: this.OnReadyPhase },
            { phase: "active", time: Infinity, text: this.GetOnActiveText },
            { phase: "results", time: this.timePhaseResults, text: this.GetOnResultsText, hook: this.OnResultsPhase },
            { phase: "end", time: Infinity },
        ];

        let now = new Date();
        let currentPhaseIndex = phasePropMap.findIndex(a => a.phase === this.currentPhase);
        let timeOnCurrentPhase = now - this.currentPhaseTimestamp;
        let timeAllottedForPhase = phasePropMap[currentPhaseIndex].time * 1000;
        if (timeOnCurrentPhase > timeAllottedForPhase || timeAllottedForPhase <= 0 || this.forceNextPhase) {
            // find next phase with any time available
            this.forceNextPhase = false;
            let newPhaseIndex = currentPhaseIndex + 1;
            while (phasePropMap[newPhaseIndex].time <= 0) {
                newPhaseIndex++;
            }
            this.currentPhase = phasePropMap[newPhaseIndex].phase;
            this.currentPhaseTimestamp = now;
            let textFunc = phasePropMap[newPhaseIndex].text;
            if (textFunc) {
                let message = textFunc.bind(this)();
                let isThisFirstMessage = (this.currentPhase === "join" || (this.currentPhase === "ready" && this.timePhaseJoin <= 0));
                if (isThisFirstMessage) {
                    let timeToStart = phasePropMap[newPhaseIndex].time;
                    let intro = `${this.gameMode} minigame starting in ${timeToStart} seconds! `
                    if (timeToStart === 0) intro = `${this.gameMode} minigame starting now! `;
                    message = intro + message;
                }
                if (message) this.WriteMessage(message);
                let hookFunc = phasePropMap[newPhaseIndex].hook;
                if (hookFunc) hookFunc.bind(this)();
            }
            if (this.currentPhase === "end") {
                MinigameHandler.OnGameOver();
            }
        }
    }

    // try to call often (60 ticks per second?)
    Tick() {
        if (this.currentPhase === "init") {
            if (this.Initialize) this.Initialize();
        }
        this.ProcessPhaseMove();

        let prevTimestamp = this.lastUpdateTimestamp;
        this.lastUpdateTimestamp = new Date();

        if (this.GameLoop) {
            if (this.currentPhase === "active") {
                this.GameLoop(this.lastUpdateTimestamp - prevTimestamp);
            }
        } else {
            console.error("Minigame has no GameLoop")
        }
    }

    WriteMessage(message) {
        MinigameHandler.WriteMessage(message);
    }

    AwardPoints(username, amount, pretext) {
        this.SilentAwardPoints(username, amount);
        if (amount > 0) {
            let message = `${username} has received ${pointHandler.formatValue(amount)}.`;
            if (pretext) message = pretext + " " + message;
            this.WriteMessage(message);
        }
    }

    SilentAwardPoints(username, amount) {
        pointHandler.addPoints(username, amount);
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

    GetMsSinceUserLastGuess(username) {
        let userGuesses = this.guesses.filter(x => x.username.toUpperCase() === username.toUpperCase());
        if (userGuesses.length > 0) {
            let latestGuess = userGuesses[userGuesses.length - 1];
            let msSinceLastGuess = (new Date() - latestGuess.timestamp);
            return msSinceLastGuess;
        }
        return Infinity;
    }

    IsUserTooSoon(user, guess) {
        let msSinceLastGuess = this.GetMsSinceUserLastGuess(user.username);
        if (msSinceLastGuess < this.msTimeBetweenGuesses) {
            // guessing too soon
            let secondsBetweenGuesses = (this.msTimeBetweenGuesses / 1000).toFixed(0);
            this.WriteMessage(`${user.username}, you can only guess every ${secondsBetweenGuesses} seconds.`);
            return true;
        }
        this.guesses.push({ username: user.username, guess: guess, timestamp: new Date() });
        return false;
    }

    DrawTitleLines(ctx, lines) {
        ctx.textAlign = "center";
        ctx.font = `${18}px Arial`;
        ctx.fillStyle = "white";
        let y = 60;
        for (let line of lines) {
            ctx.fillText(line, ctx.canvas.width / 2, y);
            y += 20;
        }
    }
}

class MinigameWordGameBase extends MinigameBase {
    state = "starting";
    winningPoints = 100;
    category = "???";
    correctAnswer = "";
    displayedClue = "";
    drawnClue = [];

    msSinceLastReveal = 0;
    msBetweenHints = 30 * 1000;

    GetOnReadyText() {
        console.log(this)
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
            this.state = "active";
            this.WriteMessage(this.displayedClue);
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

        // put user on scoreboard
        this.AwardPoints(user.username, 0);

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

        this.DrawTitleLines(ctx, [
            `${this.gameMode} Minigame`,
            `Category: ${this.category}`
        ]);

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

    OnResultsPhase() {
        this.Unscramble(30);
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
        let x = 50;
        let y = 300;
        for (let char of chars) {
            ctx.fillStyle = "white";
            if (this.guessedChars.indexOf(char) > -1) {
                ctx.fillStyle = "#555";
            }
            ctx.fillText(char, x, y);
            x += 25;
            if (x >= ctx.canvas.width - 25) {
                x = 50;
                y += 25;
            }
        }
    }

    OnResultsPhase() {
        this.drawnClue.forEach(a => a.hidden = false);
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
    timePhaseReady = 10;
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

    GetOnReadyText() {
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
        this.DrawTitleLines(ctx, [
            `${this.gameMode} Minigame`
        ]);
        let margin = 20;
        let baseX = 90;
        let rowHeight = this.cardHeight + margin;
        let colWidth = this.cardWidth + margin;
        let baseY = 80;

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

class MinigameTugOfWar extends MinigameBase {
    gameMode = "TUG OF WAR";
    timePhaseJoin = 30;
    timePhaseReady = 10;
    timePhaseResults = 5;
    areAnyTeamsEmpty = true;
    flagPosition = 0;
    pullBonus = 0;
    targetDistance = 50;

    teams = [
        { emote: "GivePLZ", name: "GIVE", dir: -1, usernames: [], pulls: [] },
        { emote: "TakeNRG", name: "TAKE", dir: 1, usernames: [], pulls: [] },
    ];
    sprites = [];

    Initialize() {
    }

    GetOnJoinText() {
        return "Type !join to play this minigame!";
    }
    GetOnReadyText() {
        if (this.areAnyTeamsEmpty) {
            return "Not enough players for this round! Moving on to another game."
        } else {
            return "The round is about to start! Scoring is based on number of messages containing your team's emote. Spam your emote when I say go...";
        }
    }
    GetOnActiveText() {
        if (this.areAnyTeamsEmpty) return "";
        let spam = this.teams.map(a => a.emote).join(" ");
        return `GO! ${spam} ${spam} ${spam}`;
    }
    GetOnResultsText() { return "" }

    ProcessJoin(user, args) {
        let userTeam = this.teams.find(a => a.usernames.indexOf(user.username) > -1);
        if (userTeam) return;

        let highestCapacity = Math.max(...this.teams.map(a => a.usernames.length));
        let areTeamsBalanced = this.teams.every(a => a.usernames.length === highestCapacity);
        let availableTeams = this.teams.filter(a => a.usernames.length < highestCapacity || areTeamsBalanced);
        let team = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        team.usernames.push(user.username);
        this.WriteMessage(`${user.username}, you are on team ${team.name}. When the game starts, spam the [${team.emote}] emote! ${team.emote}`);

        let image = MinigameHandler.imageMap[team.emote];
        this.sprites.push({
            name: user.username,
            image: image,
            targetX: 0,
            targetY: 0,
            z: 0,
            dz: 0,
            teamIndex: this.teams.indexOf(team)
        });
        this.RepositionTeams();

        this.areAnyTeamsEmpty = this.teams.some(a => a.usernames.length === 0);
    }

    RepositionTeams() {
        let height = 250;
        let width = 50;
        let highestCapacity = Math.max(...this.teams.map(a => a.usernames.length));
        let heightPerUser = height / highestCapacity;
        let widthPerUser = width / (highestCapacity / 2);
        heightPerUser = Math.min(60, heightPerUser); // clamp down
        let centerY = 100 + height / 2;

        for (let teamIndex = 0; teamIndex < this.teams.length; teamIndex++) {
            let isEvenTeam = this.teams[teamIndex].usernames.length % 2 === 0;
            let yOffset = isEvenTeam ? heightPerUser / 2 : 0;
            let xOffset = 0;
            for (let username of this.teams[teamIndex].usernames) {
                let sprite = this.sprites.find(a => a.name === username);
                if (!sprite) continue;

                let x = width * 2 - xOffset;
                sprite.targetX = teamIndex === 0 ? x : MinigameHandler.ctx.canvas.width - x;
                sprite.targetY = centerY + yOffset;
                sprite.x = sprite.targetX;
                sprite.y = sprite.targetY;

                yOffset *= -1
                if (yOffset >= 0) {
                    yOffset += heightPerUser
                    xOffset += widthPerUser;
                }
            }
        }
    }


    GameLoop(msTick) {
        if (this.areAnyTeamsEmpty) this.OnGameComplete();

        this.pullBonus += 0.005;
        this.targetDistance -= 0.01;
        for (let team of this.teams) {
            let teamSize = team.usernames.length;
            let opposingSize = this.teams.map(a => a.usernames.length).reduce((a, b) => a + b, 0) - teamSize;;
            let bonusRatio = (teamSize < opposingSize) ? (opposingSize / teamSize) : 1;
            while (team.pulls.length > 0) {
                let pull = team.pulls.pop();
                let sprite = this.sprites.find(a => a.name === pull);
                if (sprite.z === 0) {
                    sprite.dz = 3;
                    this.flagPosition += team.dir * this.pullBonus * bonusRatio;
                }
            }
        }

        for (let sprite of this.sprites) {
            if (!sprite.x) sprite.x = sprite.targetX;
            if (!sprite.y) sprite.y = sprite.targetY;

            sprite.x += (sprite.targetX - sprite.x) * 0.05;
            if (Math.abs(sprite.x - sprite.targetX) < 0.05) {
                sprite.x = sprite.targetX;
            }
            sprite.y += (sprite.targetY - sprite.y) * 0.05;
            if (Math.abs(sprite.y - sprite.targetY) < 0.05) {
                sprite.y = sprite.targetY;
            }

            sprite.z += sprite.dz;
            if (sprite.z > 0) sprite.dz -= 0.2;
            if (sprite.z <= 0) {
                sprite.z = 0;
                sprite.dz = 0;
            }
        }

        if (Math.abs(this.flagPosition) > this.targetDistance || this.targetDistance <= 0) {
            // GAME OVER
            let winningDir = this.flagPosition > 0 ? 1 : (this.flagPosition < 0 ? -1 : 0)
            let winningTeam = this.teams.find(a => a.dir === winningDir);
            if (winningTeam) {
                let points = 50;
                this.WriteMessage(`The winner is team ${winningTeam.name}! Awarded ${points} points each. ${winningTeam.emote} ${winningTeam.emote} ${winningTeam.emote}`);
                for (let username of winningTeam.usernames) {
                    this.SilentAwardPoints(username, points);
                }
            } else {
                this.WriteMessage(`It's a draw! Wow!`);
            }
            this.OnGameComplete();
        }
    }

    ProcessText(username, message) {
        for (let team of this.teams) {
            let teamEmote = team.emote;
            let otherEmotes = this.teams.map(a => a.emote).filter(a => a !== teamEmote);
            if (team.usernames.indexOf(username) > -1) {
                let messageHasRightEmote = message.indexOf(team.emote) > -1;
                let messageHasWrongEmote = otherEmotes.some(a => message.indexOf(a) > -1);
                if (messageHasRightEmote && !messageHasWrongEmote) {
                    if (team.pulls.indexOf(username) === -1) {
                        team.pulls.push(username);
                    }
                }
            }
        }
    }

    Draw(ctx) {
        this.DrawTitleLines(ctx, [
            `${this.gameMode} Minigame`
        ]);

        ctx.fillStyle = "red";
        let fx = ctx.canvas.width / 2 + this.flagPosition;
        let fy = 225;
        ctx.beginPath();
        ctx.moveTo(fx - 30, fy);
        ctx.lineTo(fx + 30, fy);
        ctx.lineTo(fx, fy + 75);
        ctx.fill();

        ctx.fillStyle = "yellow";
        for (let markerDir of [-1, 1]) {
            let mx = ctx.canvas.width / 2 + markerDir * this.targetDistance;
            let my = fy + 80;
            ctx.fillRect(mx - 2, my, 4, 20);
        }

        ctx.font = `${16}px Arial`;
        ctx.fillStyle = "#EEE";
        this.sprites.sort((a, b) => a.y - b.y);
        for (let sprite of this.sprites) {
            let image = sprite.image;
            let x = sprite.x - image.width / 4 + this.flagPosition;
            let y = sprite.y - image.height / 4;
            ctx.drawImage(image, x, y - sprite.z, image.width / 2, image.height / 2);

            if (sprite.teamIndex === 0 || sprite.teamIndex === 1) {
                ctx.textAlign = sprite.teamIndex === 0 ? "right" : "left";
                let xOff = sprite.teamIndex === 0 ? -10 : 10 + image.width / 2;
                ctx.fillText(sprite.name, x + xOff, y + 40);
            }
        }
    }
}



class MinigameSample extends MinigameBase {
    gameMode = "SAMPLE";
    timePhaseJoin = 0;
    timePhaseReady = 15;
    timePhaseResults = 0;

    Initialize() {
    }

    GetOnJoinText() { return ""; }
    GetOnReadyText() { return "" }
    GetOnResultsText() { return "" }

    GameLoop(msTick) {
    }

    ProcessJoin(user, args) {

    }

    Draw(ctx) {
    }
}

var MinigameHandler = {
    gameTypes: [MinigameScramble, MinigameHangman, MinigameMatch, MinigameTugOfWar],
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    handlerState: "inactive",
    repeatMode: false,
    winner: null,
    window: null,
    ctx: null,
    cardImage: null,
    imageMap: {},
    imageMapKeys: ["GivePLZ", "TakeNRG"],

    currentGame: null,
    interval: null,
    points: [],

    Init: () => {
        MinigameHandler.interval = setInterval(MinigameHandler.ProcessGame, 1000 / 60);
        //MinigameHandler.window = MinigameHandler.CreateWindow();
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
        if (MinigameHandler.window) MinigameHandler.window.close();
        MinigameHandler.CreateWindow();
        let gameType = MinigameHandler.gameTypes[Math.floor(Math.random() * MinigameHandler.gameTypes.length)];
        MinigameHandler.currentGame = new gameType();
        MinigameHandler.handlerState = "starting";
    },

    WriteMessage: (message) => {
        WriteMessageRaw(" PurpleStar " + message);
    },

    ProcessGame: () => {
        let ctx = MinigameHandler.ctx;
        if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let currentGame = MinigameHandler.currentGame;
        if (currentGame) {
            currentGame.Tick();
            if (currentGame.Draw) {
                if (ctx) currentGame.Draw(ctx);
            }
        }
        if (ctx) MinigameHandler.DrawScores(ctx);
    },

    DrawScores: (ctx) => {
        if (MinigameHandler.points.length !== 0) {
            MinigameHandler.points.sort((a, b) => b.points - a.points);
            let y = MinigameHandler.ctx.canvas.height / 2 + 40;
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

                if (MinigameHandler.currentGame) {
                    let timeSinceLast = MinigameHandler.currentGame.GetMsSinceUserLastGuess(record.username);
                    let totalTime = MinigameHandler.currentGame.msTimeBetweenGuesses;
                    if (totalTime && timeSinceLast != Infinity) {
                        let ratio = 1 - (timeSinceLast / totalTime);
                        if (ratio > 0) {
                            ctx.fillStyle = "#EEE";
                            ctx.strokeStyle = "#EEE";
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(x - 20, y - 10, 10, 0 - Math.PI / 2, 2 * Math.PI * ratio - Math.PI / 2);
                            ctx.lineTo(x - 20, y - 10);
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                }

                y += 20;
            }
        }
    },

    ProcessGuess: (user, guess) => {
        let currentGame = MinigameHandler.currentGame;
        if (currentGame) {
            if (currentGame.currentPhase === "active") {
                currentGame.ProcessGuess(user, guess);
            }
        }
    },

    ProcessJoin: (user, args) => {
        let currentGame = MinigameHandler.currentGame;
        if (currentGame && currentGame.ProcessJoin) {
            if (currentGame.currentPhase === "join") {
                currentGame.ProcessJoin(user, args);
            }
        }
    },

    ProcessText: (username, message) => {
        let currentGame = MinigameHandler.currentGame;
        if (currentGame && currentGame.ProcessText) {
            currentGame.ProcessText(username, message);
        }
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

        for (let imageKey of MinigameHandler.imageMapKeys) {
            MinigameHandler.window.document.writeln(`<image id="${imageKey}" style="display: none;" src="https://dobbsworks.github.io/Tools/Streambot/images/${imageKey}.png"></image>`);
            let image = MinigameHandler.window.document.getElementById(imageKey);
            MinigameHandler.imageMap[imageKey] = image;
        }
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

function CommandMinigameJoin(user, args) {
    let joinCom = args.join(' ');
    MinigameHandler.ProcessJoin(user, joinCom);
}