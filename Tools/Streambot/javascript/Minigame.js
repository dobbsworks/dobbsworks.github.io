


var MinigameHandler = {
    gameState: "inactive",
    answer: "",
    display: "",
    timer: 0,
    guesses: [],
    revealIndex: 0,
    timeBeforeStart: 1,
    timeBetweenHints: 1,

    interval: null,
    Init: () => {
        MinigameHandler.interval = setInterval(MinigameHandler.ProcessGame, 1000);
    },

    StartGame: () => {
        //TODO randomly grab an answer
        MinigameHandler.answer = "Final Fantasy: Crystal Chronicles"
        MinigameHandler.display = MinigameHandler.ScrambleWord(MinigameHandler.answer);
        MinigameHandler.WriteMessage(`Minigame starting in ${MinigameHandler.timeBeforeStart} seconds! When the puzzle appears, guess the answer with !guess MY ANSWER`);
        MinigameHandler.gameState = "active";
        MinigameHandler.timer = -MinigameHandler.timeBeforeStart;
        MinigameHandler.revealIndex = 0;
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
        console.log(" PurpleStar " + message + " PurpleStar");
    }
};

MinigameHandler.Init();
MinigameHandler.StartGame();