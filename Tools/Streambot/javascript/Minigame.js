var MinigameHandler = {
    gameState: "inactive",
    repeatMode: false,
    answer: "",
    display: "",
    winner: null,
    timer: 0,
    guesses: [],
    revealIndex: 0,
    timeBeforeStart: 15,
    timeBetweenHints: 25,
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
        let puzzle = MinigameHandler.GetPuzzle();
        MinigameHandler.answer = puzzle.answer;
        MinigameHandler.revealPerHint = Math.ceil(puzzle.answer.length / 10);
        MinigameHandler.display = MinigameHandler.ScrambleWord(MinigameHandler.answer);
        MinigameHandler.WriteMessage(`Minigame starting in ${MinigameHandler.timeBeforeStart} seconds! The category is ${puzzle.category}. When the puzzle appears, guess the answer with !guess MY ANSWER`);
        MinigameHandler.gameState = "starting";
        MinigameHandler.timer = -MinigameHandler.timeBeforeStart;
        MinigameHandler.revealIndex = 0;
        MinigameHandler.guesses = [];
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

    SetChar: (text, char, index) => {
        let letters = text.split("");
        letters[index] = char;
        return letters.join("");
    },
    
    GameWin: (user) => {
        MinigameHandler.WriteMessage(`${user.username} currectly guessed the answer! ${MinigameHandler.answer}`);
        MinigameHandler.gameState = "inactive"
        MinigameHandler.winner = user;
        setTimeout( ()=>{MinigameHandler.AwardPrize(); },1000);
    },

    GameLoss: () => {
        MinigameHandler.WriteMessage("Too bad! The answer was... " + MinigameHandler.answer);
        MinigameHandler.gameState = "inactive"
    },

    AwardPrize: () => {
        let attemptPrize = CommandBiggerSlice(MinigameHandler.winner, []);
        if (!attemptPrize) {
            MinigameHandler.WriteMessage(`${MinigameHandler.winner.username} has received a wheel slice upgrade!`);
        } else {
            MinigameHandler.WriteMessage(`${MinigameHandler.winner.username} has no levels in the queue, so they have been awarded braggin rights.`);
        }
        if (MinigameHandler.repeatMode) {
            setTimeout( ()=>{MinigameHandler.StartGame(); },1000);
        }
    },

    IsAlphanumeric: (letter) => {
        let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return alpha.indexOf(letter) > -1 || alpha.toLowerCase().indexOf(letter) > -1;
    },

    // Scramble letters/numbers, leave spaces and special characters in place
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

    WriteMessage(message) {
        WriteMessageRaw(" PurpleStar " + message + " PurpleStar");
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
