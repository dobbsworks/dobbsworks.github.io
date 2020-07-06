

function CommandRandomNext(user, args) {
	let currentLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		return "There's still a level going on, mark it as complete/skipped first.";
	} else {
		let availableLevels = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending);
		CreateWheelOfLevels(availableLevels);
		return "HERE COMES THE WHEEL GivePLZ dobbswWheel TakeNRG";
	}
}

function CommandRandomWin(user, args) {
	let winningUser = args[0];
	let availableLevels = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending);
	let level = availableLevels.find(x => x.username === winningUser);
	if (level) {
		MoveLevelToFront(level);
		return CommandNext();
	}
}

function CommandWheelColor(user, args) {
    let username = user.username;
    let errorMessage = "Include a color value (0-255) like this: !wheelcolor 128";
    let argColor = args[0];
    if (!argColor || isNaN(argColor)) return {message: errorMessage, success: false};
    let hueNum = +argColor;
    if (hueNum < 0 || hueNum > 255) return {message: errorMessage, success: false};

    let wheelValues = StorageHandler.wheel.values;
    let userObj = wheelValues.find(x => x.username === username);
    if (userObj) {
        userObj.hue = hueNum;
    } else {
        wheelValues.push({username:username, hue: hueNum});
    }
    StorageHandler.wheel = wheelValues;

    return {message: "Wheel color has been set!", success: true}
}

function CommandWheelPattern(user, args) {
    let username = user.username;
    let allowed = ["heart","star"];
    let allowedStr = allowed.join(', ');
    let errorMessage = `Include a pattern name (${allowedStr}) like this: !wheelcolor star`;
    let argPattern = args[0];
    if (!argPattern) return {message: errorMessage, success: false};
    argPattern = argPattern.toLowerCase();
    if (allowed.indexOf(argPattern) === -1) return {message: errorMessage, success: false};

    let wheelValues = StorageHandler.wheel.values;
    let userObj = wheelValues.find(x => x.username === username);
    if (userObj) {
        userObj.pattern = argPattern;
    } else {
        wheelValues.push({username:username, pattern: argPattern});
    }
    StorageHandler.wheel = wheelValues;

    return {message: "Wheel pattern has been set!", success: true}
}


/////////////////////////////////////////////////
// WHEEL OF LEVELS
/////////////////////////////////////////////////
function CreateWheelOfLevels(levels) {
    let w = window.open("", "WheelOfLevels", "width=1000,height=900,left=700");
    let wheelSettings = StorageHandler.wheel.values;
	
	let request = new XMLHttpRequest();
    let wheelData = [];
    for (let x of levels) {
        let setting = wheelSettings.find(x => x.username === x.username);
        wheelData.push({
            name: x.username, 
            weight: CalculateLevelWeight(x), 
            badges: x.badges,
            hue: setting ? setting.hue : null,
            pattern: setting ? setting.pattern : null,
        });
    }
	let url = "https://dobbsworks.github.io/Tools/Streambot/wheel.html?q=" + (+(new Date()));
	request.open("GET", url, true);
	request.onload = () => {
		w.document.write(request.responseText);
		setTimeout(() => {
			w.window.SetItems(wheelData);
			w.window.init();
			//for (l of levels) l.weight++;
		}, 100);
	}
	request.send();
	return w;
}

function CommandBiggerSlice(user, args) {
	// find all levels for this user that are pending and not priority
	let levels = StorageHandler.queue.values;
	let userLevels = levels.filter(x => x.username === user.username && x.status === levelStatus.pending && !x.isPriority);
	if (userLevels.length === 0) return "There are no valid levels to prioritize.";
	let levelToPrioritze = userLevels[0];
	levelToPrioritze.weightPriorityPurchases += 1;
	StorageHandler.queue = levels;
}

function CalculateLevelWeight(level) {
	let now = new Date();
	let timeBonusWeight = ((now - new Date(level.timeAdded)) / 1000 / 60 / 10) ** 2; 
	let bonusScale = Math.pow(2, level.weightPriorityPurchases);
	let ret = bonusScale * (level.weight + timeBonusWeight);
	
	// penalty for being absent, base off of last message received
	// let userMessages = StorageHandler.log.values.filter(x => x.username === level.username);
	// let lastLog = userMessages[userMessages.length-1];
	// if (lastLog) {
	// 	let minutesSinceLastMessage = ((now - new Date(lastLog.timestamp)) / 1000 / 60);
	// 	// starting at 5 minutes, linearly scale down weight to 0 at 25 minutes
	// 	let penaltyBegins = 15;
	// 	let completePenalty = 25;
	// 	let penaltyRatio = 1 - ((minutesSinceLastMessage - penaltyBegins) / (completePenalty - penaltyBegins));
	// 	// clamp to [0,1]
	// 	penaltyRatio = penaltyRatio < 0 ? 0 : penaltyRatio;
	// 	penaltyRatio = penaltyRatio > 1 ? 1 : penaltyRatio;
	// 	penaltyRatio = penaltyRatio ** 0.5;
	// 	ret *= penaltyRatio;
	// }
	
	return ret;
}