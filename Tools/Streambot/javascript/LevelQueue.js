

function CommandReserve(user, args) {
	let ret = CommandAddLevel(user, ["RES-ERV-ED0"]);
	if (ret.startsWith("Your level has been queued")) {
		ret = "Your spot is saved! Use !change if you want to swap the placeholder level code with a real one.";
	}
	return ret;
}

function CommandAddLevel(user, args) {
	if (isQueueOpen) {
		let userIsBlocked = StorageHandler.spamUsers.values.map(x => x.toLowerCase()).indexOf(user.username.toLowerCase()) > -1;
		if (userIsBlocked) {
			return " VoteNay VoteNay VoteNay For some reason you were flagged for possible spam/botting. Type !notSpam and then try again.";
		} else {
			let userInputCode = args[0];
			let strippedCode = StripLevelCode(userInputCode);
			if (strippedCode.length === 9) {
				if (DoesUserHaveQueueSpace(user.username)) {
					if (forbiddenCodes.indexOf(strippedCode.toLowerCase()) > -1) {
						return RandomFrom([
							"Weird, this code doesn't want to go in the queue, better try again.",
							"Error. ERROR! ERROR!",
							"Abort, do it again, fail?"
						]);
					} else {
						PushQueueEntry(user, strippedCode);
						let queuePosition = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending).length;
						return "Your level has been queued! It's in position " + queuePosition + ".";
					}
				} else {
					return "You've hit your maximum queue submissions, wait until one of your levels has been cleared."
				}
			} else {
				return "This level code has the wrong number of characters, can you double check it?";
			}
		}
	} else {
		return "The queue is closed right now. :(";
	}	
}
function StripLevelCode(rawCodeText) {
    let ret = "";
    let validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toLowerCase();
    for (let char of rawCodeText) {
        if (validChars.indexOf(char.toLowerCase()) > -1) ret += char;
    }
    return ret;
}
function PushQueueEntry(user, strippedCode) {
	let formattedCode = strippedCode.match(/.{1,3}/g).join('-').toUpperCase();
	let level = {
		code: formattedCode,
		username: user.username,
		badges: user.badges,
		status: levelStatus.pending,
		timeAdded: new Date(),
		timeStarted: null,
		timeEnded: null,
		isPriority: false,
		weight: 1, //weighting to be used for !randomnext
		weightPriorityPurchases: 0 //priority
	}
	StorageHandler.queue.push(level);
}
function DoesUserHaveQueueSpace(username) {
	// find all levels for this user that are pending or currently live
	let usersLevels = StorageHandler.queue.values.filter(x => x.username === username && 
		(x.status === levelStatus.live || x.status === levelStatus.pending));
		
	// eventually let this be set per user
	let user = GetUser(username);
	let userMaxLevelCount = user.queueSlots;
	if (usersLevels.length >= userMaxLevelCount) {
		return false;
	} else {
		return true;
	}
}

function CommandCurrent(user, args) {
	let currentLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
	let pendingLevels = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending);
	let ret = "";
	if (currentLevel) {
        let playTime = GetTimeDiff(currentLevel.timeStarted, new Date());
        ret += "The current level is " + currentLevel.code + " submitted by " + currentLevel.username + ". ";
        if (playTime) ret += "It's been live for " + playTime + ". ";
    }
	ret += "There " +
		(pendingLevels.length === 1 ? "is 1 level" : ("are " + pendingLevels.length + "levels")) +
		" pending in the queue.";
	return ret;
}

function CommandList(user, args) {
	let maxLevelsToList = 5;
	let liveAndPendingLevels = [
		...StorageHandler.queue.values.filter(x => x.status === levelStatus.live),
		...StorageHandler.queue.values.filter(x => x.status === levelStatus.pending)
	];
	let levelsToList = liveAndPendingLevels.slice(0,maxLevelsToList);
	let ret = "Live/upcoming levels by: " + levelsToList.map(x => x.username).join(", ");
	let unlistedCount = liveAndPendingLevels.length - levelsToList.length;
	if (unlistedCount > 0) {
		ret += " and " + unlistedCount + " more.";
	}
	return ret;
}

function CommandComplete(user, args) {
	return FinishCurrentLevel(levelStatus.completed);
}
function CommandSkip(user, args) {
	return FinishCurrentLevel(levelStatus.skipped);
}
function FinishCurrentLevel(newStatus) {
	if (newStatus === levelStatus.completed || newStatus === levelStatus.skipped) {
		let currentLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
		if (currentLevel) {
			currentLevel.status = newStatus;
			currentLevel.timeEnded = new Date();
			let finishTime = null;
			if (currentLevel.timeStarted) {
				finishTime = GetTimeDiff(currentLevel.timeStarted, currentLevel.timeEnded);
			}
			return "Level " + newStatus + "!" + (finishTime ? (" This level was live for " + finishTime + ".") : "");
		} 
	}
}
function GetTimeDiff(t0, t1) {
	if (!t0 || !t1) return "";
    let totalTime = t1 - t0;
    let totalSeconds = Math.ceil(totalTime / 1000);
    let displayMinutes = Math.floor(totalSeconds / 60);
    let displaySeconds = totalSeconds % 60;
    return displayMinutes.toString().padStart(2, "0") + ":" + displaySeconds.toString().padStart(2, "0");
}

function CommandNext(user, args) {
	let currentLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		return "There's still a level going on, mark it as complete/skipped first.";
	} else {
		let nextLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.pending);
		if (nextLevel) {
			nextLevel.status = levelStatus.live;
			nextLevel.timeStarted = new Date();
			return "Hey @" + nextLevel.username + ", your level is up!";
		} else {
			return "The queue is empty!";
		}
	}
}

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

function CommandResetTimer(user, args) {
	let currentLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		currentLevel.timeStarted = new Date();
	}
	return "";
}

function CommandCloseQueue(user, args) {
    isQueueOpen = false;
    return "The queue is closed.";
}
function CommandOpenQueue(user, args) {
    isQueueOpen = true;
    return "The queue is open!";
}


function MoveLevelToFront(level) {
    let levels = StorageHandler.queue.values;
    let targetIndex = levels.filter(x => x.status !== levelStatus.pending || x.isPriority).length;
    let oldIndex = levels.indexOf(levels.find(x => x.status === levelStatus.pending && x.username === level.username && x.code === level.code));
	if (oldIndex <= -1 || targetIndex <= -1) return "Uh, something went wrong here, ask Dobbs to fix it, idk";

	levels.splice(targetIndex, 0, levels.splice(oldIndex, 1)[0]);

	return "Your level has been moved to the priority queue.";
}

function CommandQueueSlot(user, args) {
	let userObj = GetUser(user.username);
	if (userObj.queueSlots > 1) {
		return "You already have this upgrade!";
	} else {
		userObj.queueSlots++;
		return "You can now have " + userObj.queueSlots + " levels in the queue at once!";
	}
}

function CommandBiggerSlice(user, args) {
	// find all levels for this user that are pending and not priority
	let userLevels = StorageHandler.queue.values.filter(x => x.username === user.username && x.status === levelStatus.pending && !x.isPriority);
	if (userLevels.length === 0) return "There are no valid levels to prioritize.";
	let levelToPrioritze = userLevels[0];
	levelToPrioritze.weightPriorityPurchases += 1;
}

function CommandChangeLevel(user, args) {
	let userLevels = StorageHandler.queue.values.filter(x => x.username === user.username && x.status === levelStatus.pending);
	if (userLevels.length === 0) return "You have no levels in the queue, use !add instead.";
	let levelToChange = userLevels[0];
    
    let userInputCode = args[0];
    let strippedCode = userInputCode.replace(/-/g, "");
    
    if (strippedCode.length === 9) {
        levelToChange.code = userInputCode;
        return "Your level's id has been changed.";
    } else {
        return "This level code has the wrong number of characters, can you double check it?";
    }
}

function CommandLeaveQueue(user, args) {
    let newLevelList = StorageHandler.queue.values;
    newLevelList = newLevelList.filter(x => x.username !== user.username || x.status !== levelStatus.pending);
    if (newLevelList.length === StorageHandler.queue.values.length) {
        return "You have no levels in the queue.";
    }

    StorageHandler.queue = newLevelList;
    return "Your level has been removed from the queue.";
}