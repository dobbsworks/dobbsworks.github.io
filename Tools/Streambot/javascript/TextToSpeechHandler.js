
let voice = null;
let currentTtsTimestamp = null;
let pendingTtsItems = [];

let ttsInterval = setInterval(TTSLoop, 2000);
function TTSLoop() {
	if (!voice) voice = GetVoice(); // keep trying to load TTS voice until it's ready
    if (currentTtsTimestamp) {
        if (speechSynthesis.speaking) {
            // api reports message in progress, but sometimes it's wrong and gets stuck
            let totalSpeakingSeconds = (new Date() - currentTtsTimestamp) / 1000;
            if (totalSpeakingSeconds > 60) {
                speechSynthesis.cancel();
                currentTtsTimestamp = null;
            }
        } else {
            currentTtsTimestamp = null;
        }
    } else {
        if (pendingTtsItems.length > 0) {
            currentTtsTimestamp = new Date();
            let msg = pendingTtsItems.splice(0,1)[0];
            window.speechSynthesis.speak(msg);
        }
    }
}


function CommandTTS(user, args) {
    let text = args.join(" ");
    TTSMessage(text, user.username, true);
    return {success: true};
}

function TTSMessage(text, username, spentPoints) {
	let msg = new SpeechSynthesisUtterance(text);
	msg.volume = 0.8;
	msg.voice = voice;
	msg.onerror = function(event) {
		WriteMessage("Hey, bot here. ALERT! TTS just DIED or something. @dobbsworks please notice this message, kind of important. Chat, tell dobbs to notice this");
		console.error('An error has occurred with the speech synthesis: ' + event.error);
    }
    //pendingTtsItems.push(msg);
    TTSCheckAccountAge(msg, username, (ttsMessage, username) => {
        // if account is old enough
        pendingTtsItems.push(ttsMessage);
    }, (ttsMessage, username) => {
        // if account is less than a week old
        WriteMessage(`@${username}, something went wrong with TTS. Your channel points have been returned as !tokens. `)
        pointHandler.addPoints(username, 500);
    });
}

function GetVoice() {
	if (!voice) {
		let voices = speechSynthesis.getVoices();
		voice = voices.filter(x => x.name === "Google UK English Female")[0];
		if (!voice) voice = voices.filter(x => x.name === "Google UK English Male")[0];
		if (!voice) voice = voices.filter(x => x.name === "Google US English")[0];
	}
	return voice;
}


function TTSCheckAccountAge(ttsMessage, username, onSuccess, onError) {
    let request = new XMLHttpRequest();
	let url = `https://decapi.me/twitch/accountage/${username}`;
	request.open("GET", url, true);
	request.onload = () => {
        let accountAge = request.responseText;
        // Possible responses:
        // No user with the name "manofsteel2801" found.
        // 2 days, 18 hours
        // 4 weeks, 1 day
        // 3 years, 4 months
        let textToFind = ["year", "month", "week"];
        let isAccountOldEnough = (textToFind.some(a => accountAge.indexOf(a) > -1));
        
        if (isAccountOldEnough) {
            onSuccess(ttsMessage, username);
        } else {
            onError(ttsMessage, username)
        }
	}
	request.send();
}