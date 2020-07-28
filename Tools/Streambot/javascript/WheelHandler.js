

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
    let errorMessage = "Include a color value (0-360) like this: !wheelcolor 128";
    let argColor = args[0];
    if (!argColor || isNaN(argColor)) return {message: errorMessage, success: false};
    let hueNum = +argColor;
    if (hueNum < 0 || hueNum > 360) return {message: errorMessage, success: false};
    hueNum = Math.floor(hueNum);
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
    let allowed = ["heart","star","bowser","club"];
    let allowedStr = allowed.join(', ');
    let errorMessage = `Include a pattern name (${allowedStr}) like this: !wheelpattern star`;
    let argPattern = args[0];
    if (!argPattern) return {message: errorMessage, success: false};
    argPattern = argPattern.toLowerCase();
    if (allowed.indexOf(argPattern) === -1) return {message: errorMessage, success: false};

    let wheelValues = StorageHandler.wheel.values;
    let userObj = wheelValues.find(x => x.username === username);
    let expires = +(+(new Date()) + (60 * 60 * 1000));
    if (userObj) {
        userObj.pattern = argPattern;
        if (!user.isSub) userObj.expires = expires;
        else userObj.expires = null;
    } else {
        userObj = {};
        userObj.username = username;
        userObj.pattern = argPattern;
        if (!user.isSub) userObj.expires = expires;
        wheelValues.push(userObj);
    }
    StorageHandler.wheel = wheelValues;

    let retMessage = "Wheel pattern has been set!";
    if (!user.isSub) retMessage += " Expires in one hour.";

    return {message: retMessage, success: true}
}


/////////////////////////////////////////////////
// WHEEL OF LEVELS
/////////////////////////////////////////////////
function CreateWheelOfLevels(levels) {
    let w = window.open("", "WheelOfLevels", "width=1000,height=900,left=700");
	let request = new XMLHttpRequest();
    let wheelData = GetWheelData(levels);
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

function GetWheelData(levels) {
    let wheelSettings = StorageHandler.wheel.values;
    let wheelData = [];
    for (let x of levels) {
        if (x.afkStartTime) continue; // user is AFK
        let setting = wheelSettings.find(s => s.username === x.username);
        let hue = null;
        let pattern = null;
        if (setting) {
            hue = setting.hue;
            pattern = setting.pattern;
            if (setting.expires && setting.expires < +(new Date())) pattern = null;
        }
        wheelData.push({
            name: x.username, 
            weight: CalculateLevelWeight(x), 
            isSub: x.isSub,
            hue: hue,
            pattern: pattern,
        });
    }
    return wheelData;
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
    let timeSinceAdded = (now - new Date(level.timeAdded));
    if (level.totalAfkTime) timeSinceAdded -= level.totalAfkTime;
	let timeBonusWeight = (timeSinceAdded / 1000 / 60 / 10) ** 2; 
	let bonusScale = (1 + level.weightPriorityPurchases); 
	let ret = bonusScale * (level.weight + timeBonusWeight);
	
	return ret;
}

function CommandSlice(user, args) {
    // get chance of being selected next
    let levels = StorageHandler.queue.values.filter(x => x.status === "pending");
    let myLevel = levels.find(x => x.username === user.username);
    if (!myLevel) return "You don't have a level in the queue right now.";
    let myWeight = myLevel.weight;
    let totalWeight = levels.reduce((a,b)=>a+b,0);
    let chance = (100*myWeight/totalWeight).toFixed(1) + "%";
    return `You currently have a ${chance} chance of being selected next. Your slice has a weight of ${myWeight.toFixed(1)} out of a total wheel weight of ${totalWeight.toFixed(1)}.`;
}
