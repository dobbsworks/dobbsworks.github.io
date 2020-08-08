var MinigameHandler = {
    gameTypes: ["scramble","hangman"],
    gameType: null,
    gameState: "inactive",
    repeatMode: false,
    answer: "",
    display: "",
    winner: null,
    timer: 0,
    guesses: [],
    revealIndex: 0,
    timeBeforeStart: 15,
    timeBetweenHints: 30,
    revealPerHint: 1,
    timeBetweenGuesses: 10,

    interval: null,
    Init: () => {
        MinigameHandler.interval = setInterval(MinigameHandler.ProcessGame, 1000);
    },
    
    GetPuzzle: () => {
        var categories = Object.keys(minigameAnswers);
        var categoryIndex = Math.floor(Math.random() * categories.length);
        var category = categories[categoryIndex];
        var puzzles = minigameAnswers[category];
        var puzzleIndex = Math.floor(Math.random() * puzzles.length);
        var puzzle = puzzles[puzzleIndex];
        return {answer: puzzle, category: category};
    },

    StartGame: () => {
        if (MinigameHandler.gameState !== "inactive") {
            MinigameHandler.WriteMessage("There's already a minigame in progress.");
            return;
        }
        MinigameHandler.gameType = MinigameHandler.gameTypes[Math.floor(Math.random() * MinigameHandler.gameTypes.length)];
        let puzzle = MinigameHandler.GetPuzzle();
        MinigameHandler.answer = puzzle.answer;

        let openingMessage = `${MinigameHandler.gameType.toUpperCase} minigame starting in ${MinigameHandler.timeBeforeStart} seconds! The category is ${puzzle.category}. `;
        if (MinigameHandler.gameType === "scramble") {
            MinigameHandler.revealPerHint = Math.ceil(puzzle.answer.length / 10);
            MinigameHandler.display = MinigameHandler.ScrambleWord(MinigameHandler.answer);
            openingMessage += `When the puzzle appears, guess the answer with !guess MY ANSWER`;
        } else if (MinigameHandler.gameType === "hangman") {
            MinigameHandler.revealPerHint = 0;
            MinigameHandler.display = MinigameHandler.HideWord(MinigameHandler.answer);
            openingMessage += `Guess letters with !guess X, or guess the full answer with !guess MY ANSWER`;
        }

        MinigameHandler.gameState = "starting";
        MinigameHandler.timer = -MinigameHandler.timeBeforeStart;
        MinigameHandler.revealIndex = 0;
        MinigameHandler.guesses = [];
        MinigameHandler.WriteMessage(openingMessage);
    },
    
    ProcessGuess: (user, guess) => {
        if (MinigameHandler.gameState !== "active") return;
        let userGuesses = MinigameHandler.guesses.filter(x => x.username.toUpperCase() === user.username.toUpperCase());
        if (userGuesses.length > 0) {
            let latestGuess = userGuesses[userGuesses.length-1];
            let secondsSinceLastGuess = (new Date() - latestGuess.timestamp) / 1000;
            if (secondsSinceLastGuess < MinigameHandler.timeBetweenGuesses) {
                // guessing too soon
                MinigameHandler.WriteMessage(`${user.username}, you can only guess every ${MinigameHandler.timeBetweenGuesses} seconds.`);
                return;
            }
        }
        MinigameHandler.guesses.push({username: user.username, guess: guess, timestamp: new Date()});
        
        // allow missing special characters
        let trimmedAnswer = MinigameHandler.answer.split('').filter(MinigameHandler.IsAlphanumeric).join('').toUpperCase();
        let trimmedGuess = guess.split('').filter(MinigameHandler.IsAlphanumeric).join('').toUpperCase();
        let isGuessCorrect = trimmedAnswer === trimmedGuess;
        if (isGuessCorrect) {
            MinigameHandler.GameWin(user);
        }

        // guess single letter
        if (MinigameHandler.gameType === "hangman" && guess.length === 1 && MinigameHandler.IsAlphanumeric(guess[0])) {
            let revealedCount = MinigameHandler.UnhideCharacter(guess);
            if (revealedCount > 0) {
                pointHandler.addPoints(user.username, 10);
                MinigameHandler.WriteMessage(`${revealedCount} ${guess.toUpperCase()}${revealedCount===1?"":"'s"}, ${user.username} has received ${pointHandler.formatValue(10)}.`);
                MinigameHandler.timer = MinigameHandler.timeBetweenHints;
            }
        }
    },

    // Run on a loop
    ProcessGame: () => {
        MinigameHandler.timer++;
        if (MinigameHandler.gameState == "starting" && MinigameHandler.timer > 0) {
            MinigameHandler.WriteMessage(MinigameHandler.display);
            MinigameHandler.gameState = "active"
        }
        if (MinigameHandler.gameState == "active" && MinigameHandler.timer > MinigameHandler.timeBetweenHints) {
            MinigameHandler.timer -= MinigameHandler.timeBetweenHints;
            for (let i=0; i<MinigameHandler.revealPerHint; i++) {
                MinigameHandler.IncreaseReveal();
            }
            if (MinigameHandler.answer.toUpperCase() === MinigameHandler.display.toUpperCase()) {
                MinigameHandler.GameLoss();
            } else {
                MinigameHandler.WriteMessage(MinigameHandler.display);
            }
        }
    },

    IncreaseReveal: () => {        
        // increase reveal index until a non-ordered alphanumeric char is found
        while (true) {
            let answerLetter = MinigameHandler.answer[MinigameHandler.revealIndex].toUpperCase();
            let scrambleLetter = MinigameHandler.display[MinigameHandler.revealIndex].toUpperCase();
            if (MinigameHandler.IsAlphanumeric(answerLetter) && scrambleLetter !== answerLetter) {
                // descramble this letter
                let replacementLetterIndex = MinigameHandler.display.lastIndexOf(answerLetter);
                MinigameHandler.display = MinigameHandler.SetChar(MinigameHandler.display, answerLetter, MinigameHandler.revealIndex);
                MinigameHandler.display = MinigameHandler.SetChar(MinigameHandler.display, scrambleLetter, replacementLetterIndex);
                return;
            }
            MinigameHandler.revealIndex++;
            if (MinigameHandler.revealIndex >= MinigameHandler.answer.length) {
                MinigameHandler.GameLoss();
                return;
            }
        }
    },

    UnhideCharacter: (char) => {
        char = char.toUpperCase();
        let newDisplay = "";
        let revealCount = 0;
        for (let i=0; i<MinigameHandler.display.length; i++) {
            if (MinigameHandler.answer[i].toUpperCase() === char) {
                newDisplay += MinigameHandler.answer[i];
                revealCount++;
            } else {
                newDisplay += MinigameHandler.display[i];
            }
        }
        MinigameHandler.display = newDisplay;
        return revealCount;
    },

    SetChar: (text, char, index) => {
        let letters = text.split("");
        letters[index] = char;
        return letters.join("");
    },
    
    GameWin: (user) => {
        MinigameHandler.WriteMessage(`${user.username} correctly guessed the answer! ${MinigameHandler.answer}`);
        MinigameHandler.gameState = "inactive"
        MinigameHandler.winner = user;
        let winningPoints = (MinigameHandler.gameType === "hangman") ? 50 : 100;
        setTimeout( ()=>{MinigameHandler.AwardPrize(user.username, winningPoints); },1000);
    },

    GameLoss: () => {
        MinigameHandler.WriteMessage("Too bad! The answer was... " + MinigameHandler.answer);
        MinigameHandler.gameState = "inactive"
    },

    AwardPrize: (username, pointPrizeTotal) => {
        pointHandler.addPoints(username, pointPrizeTotal);
        MinigameHandler.WriteMessage(`${username} has received ${pointHandler.formatValue(pointPrizeTotal)}!`);

        if (MinigameHandler.repeatMode) {
            setTimeout( ()=>{MinigameHandler.StartGame(); },1000);
        }
    },

    IsAlphanumeric: (letter) => {
        let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return alpha.indexOf(letter) > -1 || alpha.toLowerCase().indexOf(letter) > -1;
    },

    // Scramble letters/numbers
    // e.g. "Final Fantasy: Crystal Chronicles" 
    // into "NYTNE RCSAAOA: FHTSICY CLRLANLFSI"
    ScrambleWord: (word) => {
        word = word.toUpperCase();
        let letters = word.split("");
        let scrambledLetters = [];
        while (letters.length) {
            let randomIndex = Math.floor(Math.random() * letters.length);
            let letter = letters.splice(randomIndex, 1)[0];
            if (MinigameHandler.IsAlphanumeric(letter)) {
                scrambledLetters.push(letter);
            }
        }
        // only scramble alphanumeric characters
        let ret = "";
        for (let i=0; i<word.length; i++) {
            if (MinigameHandler.IsAlphanumeric(word[i])) {
                ret += scrambledLetters.pop();
            } else {
                ret += word[i];
            }
        }
        return ret;
    },

    // Blank out letters/numbers, leave spaces and special characters in place
    // e.g. "Final Fantasy: Crystal Chronicles" 
    // into "+++++ +++++++: +++++++ ++++++++++"
    HideWord: (word) => {
        let char = "+";
        return word.split("").map(c => MinigameHandler.IsAlphanumeric(c) ? char : c).join("");
    },

    WriteMessage(message) {
        WriteMessageRaw(" PurpleStar " + message);
    }
};
MinigameHandler.Init();


function CommandMinigame(user, args) {
    if (!args[0]) return "Usage: !minigame {start|stop|repeat|last}";
    if (args[0].toLowerCase() === "start") {
        MinigameHandler.StartGame();
    } else if (args[0].toLowerCase() === "stop") {
        MinigameHandler.repeatMode = false;
        MinigameHandler.gameState = "inactive";
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
