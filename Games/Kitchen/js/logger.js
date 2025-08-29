
let baseLetterTime = 30;
let letterPauses = {
    ".": 1000,
    "?": 1000,
    ";": 1000,
    ",": 400,
    ":": 600,
};

var loggedMessages = [];

function PrintToLog(message, isInstant = false) {
    loggedMessages.push(message);
    if (loggedMessages.length > 20) {
        loggedMessages.splice(0, 1);
    }
    return new Promise((resolve) => {
        let logPanel = document.getElementById("logPanel");
        let el = document.createElement("p");

        if (isInstant) {
            el.innerText = message;
        } else {
            var letters = message.split('');
            var timer = 0;
            let prevLetter = "";
            for (let letter of letters) {
                timer += baseLetterTime / gameSpeed;
                if (letterPauses[prevLetter]) {
                    timer += letterPauses[prevLetter] / gameSpeed;
                }
                prevLetter = letter;
                setTimeout(() => {
                    let letterSpan = document.createElement("span");
                    letterSpan.className = "letter";
                    letterSpan.innerText = letter;
                    el.appendChild(letterSpan);
                    if (logPanel.scrollTop < logPanel.scrollTopMax - 30) {
                        logPanel.scrollTo(0, logPanel.scrollHeight - 30);
                    }
                }, timer );
            }
            setTimeout(resolve, timer + 1000 / gameSpeed);
        }


        logPanel.appendChild(el)
    });
}

function Wait(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000 / gameSpeed);
    });
}