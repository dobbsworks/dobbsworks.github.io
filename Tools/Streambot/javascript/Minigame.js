var MinigameHandler = {
    gameState: "inactive",
    answer: "",
    display: "",
    winner: "",
    timer: 0,
    guesses: [],
    revealIndex: 0,
    timeBeforeStart: 20,
    timeBetweenHints: 15,
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
        let puzzle = MinigameHandler.GetPuzzle();
        MinigameHandler.answer = puzzle.answer;
        MinigameHandler.display = MinigameHandler.ScrambleWord(MinigameHandler.answer);
        MinigameHandler.WriteMessage(`Minigame starting in ${MinigameHandler.timeBeforeStart} seconds! The category is ${puzzle.category}. When the puzzle appears, guess the answer with !guess MY ANSWER`);
        MinigameHandler.gameState = "starting";
        MinigameHandler.timer = -MinigameHandler.timeBeforeStart;
        MinigameHandler.revealIndex = 0;
        MinigameHandler.guesses = [];
    },
    
    ProcessGuess: (username, guess) => {
        let userGuesses = MinigameHandler.guesses.filter(x => x.username.toUpperCase() === username.toUpperCase());
        if (userGuesses.length > 0) {
            let latestGuess = userGuesses[userGuesses.length-1];
            let secondsSinceLastGuess = (new Date() - latestGuess.timestamp) / 1000;
            if (secondsSinceLastGuess < MinigameHandler.timeBetweenGuesses) {
                // guessing too soon
                MinigameHandler.WriteMessage(`${username}, you can only guess every ${MinigameHandler.timeBetweenGuesses} seconds.`);
                return;
            }
        }
        MinigameHandler.guesses.push({username: username, guess: guess, timestamp: new Date()});
        
        // allow missing special characters
        let trimmedAnswer =MinigameHandler.answer.split('').filter(MinigameHandler.IsAlphanumeric).join('').toUpperCase();
        let trimmedGuess = guess.split('').filter(MinigameHandler.IsAlphanumeric).join('').toUpperCase();
        let isGuessCorrect = trimmedAnswer === trimmedGuess;
        if (isGuessCorrect) {
            MinigameHandler.GameWin(username);
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
            MinigameHandler.IncreaseReveal();
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
    
    GameWin: (username) => {
        MinigameHandler.WriteMessage(`${username} currectly guessed the answer! ${MinigameHandler.answer}`);
        MinigameHandler.gameState = "inactive"
        MinigameHandler.winner = username;
        
        // TODO
        setTimeout( ()=>{MinigameHandler.WriteMessage(`Prizes are not yet automatic, so Dobbs will manually do something now.`)},2000);
    },

    GameLoss: () => {
        MinigameHandler.WriteMessage("Too bad! The answer was... " + MinigameHandler.answer);
        MinigameHandler.gameState = "inactive"
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
        WriteMessage(" PurpleStar " + message + " PurpleStar");
    }
};
MinigameHandler.Init();


function CommandMinigameStart(user, args) {
    MinigameHandler.StartGame();
}

function CommandMinigameGuess(user, args) {
    let guess = args.join(' ');
    MinigameHandler.ProcessGuess(user.username, guess);
}
