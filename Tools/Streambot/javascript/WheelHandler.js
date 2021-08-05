

function CommandRandomNext(user, args) {
    let currentLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
    if (currentLevel) {
        return "There's still a level going on, mark it as complete/skipped first.";
    } else {
        CreateWheelOfLevels(StorageHandler.queue.values);
        return "HERE COMES THE WHEEL GivePLZ dobbswWheel TakeNRG";
    }
}

function CommandRandomWin(user, args) {
    // for some mysterious reason resizeto gets the window closer to, but not exactly 0,0
    // call it 10 times I guess? This is really weird behavior
    for (let i = 0; i < 20; i++) wheelWindow.resizeTo(0, 0);
    let winningUser = decodeURI(args[0]);
    let availableLevels = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending);
    let level = availableLevels.find(x => x.username === winningUser);
    if (level) {
        let returnText = "Hey @" + winningUser + ", your level is up!";

        let preEventChance = (100 * parseFloat(args[1])).toFixed(1) + "%";
        let postEventChance = (100 * parseFloat(args[2])).toFixed(1) + "%";

        returnText = "The wheel has chosen @" + winningUser + "! The chance of this slice being chosen was: " + preEventChance;
        if (preEventChance !== postEventChance) {
            returnText += " (" + postEventChance + " after wheel shenanigans)"
        }

        MoveLevelToFront(level);
        CommandNext();

        return returnText;
    }
}

function CommandBonusPrize(user, args) {
    let winningUser = args[0];
    return "Whoa, @dobbsworks, we got a big winner over here!";
}

function isColor(strColor) {
    let s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

function CommandWheelColor(user, args) {
    let username = user.username;
    let argColor = args.join(" ");
    if (!argColor) return { message: "Include a color: !wheelcolor red, !wheelcolor #00FF33", success: false };
    if (!isColor(argColor)) return { message: `Invalid color "${argColor}", correct usage: !wheelcolor red, !wheelcolor #00FF33`, success: false };

    let wheelValues = StorageHandler.wheel.values;
    let userObj = wheelValues.find(x => x.username === username);
    if (userObj) {
        userObj.color = argColor;
    } else {
        wheelValues.push({ username: username, color: argColor });
    }
    StorageHandler.wheel = wheelValues;

    return { message: "Wheel color has been set!", success: true }
}

function CommandWheelPattern(user, args) {
    let username = user.username;
    let allowed = ["star", "bowser", "heart", "club", "diamond", "spade", "checker", "dobbs", "triforce", "pokeball", "cactus"];
    let allowedStr = allowed.join(', ');
    let errorMessage = `Include a pattern name (${allowedStr}) like this: !wheelpattern star`;
    let argPattern = args[0];
    if (!argPattern) return { message: errorMessage, success: false };
    argPattern = argPattern.toLowerCase();
    if (allowed.indexOf(argPattern) === -1) return { message: errorMessage, success: false };

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

    return { message: retMessage, success: true }
}


/////////////////////////////////////////////////
// WHEEL OF LEVELS
/////////////////////////////////////////////////
let wheelWindow = null;
function CreateWheelOfLevels(levels) {
    wheelWindow = window.open("", "WheelOfLevels", "width=1000,height=900,left=700");
    for (let i = 0; i < 10; i++) wheelWindow.resizeTo(1300, 800);
    let request = new XMLHttpRequest();
    let wheelData = GetWheelData(levels);
    let url = "https://dobbsworks.github.io/Tools/Streambot/wheel.html?q=" + (+(new Date()));
    request.open("GET", url, true);
    request.onload = () => {
        wheelWindow.document.write(request.responseText);
        setTimeout(() => {
            wheelWindow.window.SetItems(wheelData);
            wheelWindow.window.init();
            //for (l of levels) l.weight++;
        }, 100);
    }
    request.send();
    return wheelWindow;
}

function GetWheelData() {
    let levels = StorageHandler.queue.values;
    let wheelSettings = StorageHandler.wheel.values;
    let wheelData = [];
    for (let x of levels) {
        if (x.afkStartTime) continue; // user is AFK
        if (x.status !== "pending") continue;
        let setting = wheelSettings.find(s => s.username === x.username);
        let hue = null;
        let pattern = null;
        let color = null;
        if (setting) {
            color = setting.color;
            hue = setting.hue;
            pattern = setting.pattern;
            if (setting.expires && setting.expires < +(new Date())) pattern = null;
        }
        wheelData.push({
            name: x.username,
            weight: CalculateLevelWeight(x),
            isSub: x.isSub,
            hue: hue,
            color: color,
            pattern: pattern,
        });
    }
    return wheelData;
}

function CommandBiggerSlice(user, args) {
    let targetUser = args[0];
    if (targetUser) {
        targetUser = targetUser.replace("@", "");
        let success = UpgradeWheelSliceForUser(targetUser);
        if (success) {
            return { message: `Thank you! ${targetUser}'s slice has been upgraded!`, success: true };
        } else {
            return { message: "There are no valid levels to prioritize.", success: false };
        }
    } else {
        let success = UpgradeWheelSliceForUser(user.username);
        if (success) {
            return { message: "Wheel slice upgraded!", success: true };
        } else {
            return { message: "There are no valid levels to prioritize.", success: false };
        }
    }
}

function UpgradeWheelSliceForUser(username) {
    // find all levels for this user that are pending and not priority
    let levels = StorageHandler.queue.values;
    let userLevels = levels.filter(x => x.username.toLowerCase() === username.toLowerCase() && x.status === levelStatus.pending && !x.isPriority);
    if (userLevels.length === 0) return false;
    let levelToPrioritze = userLevels[0];
    levelToPrioritze.weightPriorityPurchases += 1;
    StorageHandler.queue = levels;
    return true;
}


function CalculateLevelWeight(level) {
    let allLevels = StorageHandler.queue.values;
    let levelsSinceThisUser = -1;
    for (let oldLevel of allLevels) {
        if (oldLevel.status === "pending") break;
        if (level.username === oldLevel.username) {
            levelsSinceThisUser = 0;
            continue;
        }
        if (levelsSinceThisUser >= 0) {
            let levelTime = new Date(oldLevel.timeEnded) - new Date(oldLevel.timeStarted);
            if (levelTime > 1000 * 60) { // ignore levels that are live for less than one minute
                levelsSinceThisUser++;
            }
        }
    }

    let recentPlayPenaltyScale = 1;
    if (levelsSinceThisUser <= 2 && levelsSinceThisUser > -1) {
        recentPlayPenaltyScale = (levelsSinceThisUser + 1) / 4
    }
    // if you played last, level slice down to 25% weight
    // if one level played since your level, level slice down to 50% weight
    // if two levels played since your level, level slice down to 75% weight


    let now = new Date();
    let timeSinceAdded = (now - new Date(level.timeAdded));
    if (level.totalAfkTime) timeSinceAdded -= level.totalAfkTime;
    let timeBonusWeight = (timeSinceAdded / 1000 / 60 / 10) ** 2;
    let bonusScale = (1 + level.weightPriorityPurchases);
    let ret = bonusScale * (level.weight + timeBonusWeight) * recentPlayPenaltyScale;

    return ret;
}

function CommandSlice(user, args) {
    // get chance of being selected next
    let levels = GetWheelData();
    let myLevel = levels.find(x => x.name === user.username);
    if (!myLevel) return "You don't have a level in the queue right now.";

    if (args[0] === "up") {
        return "Did you mean !sliceup instead? Use !slice to get data about your wheel chances, and !sliceup to buy an upgrade.";
    }

    let myWeight = myLevel.weight;
    let totalWeight = levels.map(x => x.weight).reduce((a, b) => a + b, 0);
    let chance = (100 * myWeight / totalWeight).toFixed(1) + "%";
    return `You currently have a ${chance} chance of being selected next. Your slice has a weight of ${myWeight.toFixed(1)} out of a total wheel weight of ${totalWeight.toFixed(1)}.`;
}
