
let reserveCode = "RES-ERV-ED0";

function CommandReserve(user, args) {
	let ret = CommandAddLevel(user, [reserveCode]);
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
					PushQueueEntry(user, strippedCode);
					let queuePosition = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending).length;
					return "Your level has been queued! May the wheel spin in your favor GivePLZ dobbswWheel ";
				} else {
					if (DoesUserHaveReserve(user.username)) {
						return CommandChangeLevel(user, args);
					} else {
						return "You've hit your maximum queue submissions, wait until one of your levels has been cleared."
					}
				}
			} else {
				return "This level code has the wrong number of characters, can you double-check it?";
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
		isSub: user.isSub,
		status: levelStatus.pending,
		timeAdded: new Date(),
		timeStarted: null,
		timeEnded: null,
		isPriority: false,
		weight: 1, //weighting to be used for !randomnext
		weightPriorityPurchases: 0, //priority
		afkStartTime: null,
		totalAfkTime: 0,
	}
	StorageHandler.queue.push(level);
}

function DoesUserHaveReserve(username) {
	let userLevels = StorageHandler.queue.values.filter(x => x.username === username &&
		(x.status === levelStatus.live || x.status === levelStatus.pending));
	if (userLevels && userLevels[0] && userLevels[0].code === reserveCode) {
		return true;
	}
	return false;
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
	let levelsToList = liveAndPendingLevels.slice(0, maxLevelsToList);
	let ret = "Live/upcoming levels by: " + levelsToList.map(x => x.username).join(", ");
	let unlistedCount = liveAndPendingLevels.length - levelsToList.length;
	if (unlistedCount > 0) {
		ret += " and " + unlistedCount + " more.";
	}
	return ret;
}

function CommandClearOldLevels(user, args) {
	let levels = StorageHandler.queue.values;
	levels = levels.filter(x => x.status === levelStatus.live || x.status === levelStatus.pending);
	StorageHandler.queue = levels;
}

function CommandComplete(user, args) {
	return FinishCurrentLevel(levelStatus.completed);
}
function CommandSkip(user, args) {
	return FinishCurrentLevel(levelStatus.skipped);
}
function FinishCurrentLevel(newStatus) {
	let levels = StorageHandler.queue.values;
	if (newStatus === levelStatus.completed || newStatus === levelStatus.skipped) {
		let currentLevel = levels.find(x => x.status === levelStatus.live);
		if (currentLevel) {
			currentLevel.status = newStatus;
			currentLevel.timeEnded = new Date();
			let finishTime = null;
			if (currentLevel.timeStarted) {
				finishTime = GetTimeDiff(currentLevel.timeStarted, currentLevel.timeEnded);
			}
			StorageHandler.queue = levels;
			return "Level " + newStatus + "!" + (finishTime ? (" This level was live for " + finishTime + ".") : "");
		}
	}
}
function GetTimeDiff(t0, t1) {
	if (!t0 || !t1) return "";
	t0 = new Date(t0);
	t1 = new Date(t1);
	let totalTime = t1 - t0;
	let totalSeconds = Math.ceil(totalTime / 1000);
	let displayMinutes = Math.floor(totalSeconds / 60);
	let displaySeconds = totalSeconds % 60;
	return displayMinutes.toString().padStart(2, "0") + ":" + displaySeconds.toString().padStart(2, "0");
}

function CommandNext(user, args) {
	let levels = StorageHandler.queue.values;
	let currentLevel = levels.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		return "There's still a level going on, mark it as complete/skipped first.";
	} else {
		let nextLevel = levels.find(x => x.status === levelStatus.pending);
		if (nextLevel) {
			nextLevel.status = levelStatus.live;
			nextLevel.timeStarted = new Date();
			StorageHandler.queue = levels;
			return "Hey @" + nextLevel.username + ", your level is up!";
		} else {
			return "The queue is empty!";
		}
	}
}

function CommandResetTimer(user, args) {
	let levels = StorageHandler.queue.values;
	let currentLevel = levels.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		currentLevel.timeStarted = new Date();
		StorageHandler.queue = levels;
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
	StorageHandler.queue = levels;

	return "Your level has been moved to the priority queue.";
}

function CommandChangeLevel(user, args) {
	let levels = StorageHandler.queue.values;
	let userLevels = levels.filter(x => x.username === user.username && x.status === levelStatus.pending);
	if (userLevels.length === 0) return "You have no levels in the queue, use !add instead.";
	let levelToChange = userLevels[0];

	let userInputCode = args[0];
	let strippedCode = userInputCode.replace(/-/g, "");

	if (strippedCode.length === 9) {
		levelToChange.code = strippedCode.match(/.{1,3}/g).join('-').toUpperCase();
		StorageHandler.queue = levels;
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


function CommandDebugAdd() {
	let username = "user" + Math.ceil(100 * Math.random());
	let getLevelSegment = () => Math.floor(16 * 16 * 16 * Math.random()).toString(16).padStart(3, "000");
	let levelCode = getLevelSegment() + "-" + getLevelSegment() + "-" + getLevelSegment();
	CommandAddLevel({ username: username, badges: [], isSub: false }, [levelCode]);
}

function CommandFreezeLevel() {
	// marks current live level as pending/afk
	let levels = StorageHandler.queue.values;
	let liveLevel = levels.find(x => x.status === levelStatus.live);
	if (!liveLevel) return "There is no live level.";
	liveLevel.status = levelStatus.pending;
	liveLevel.afkStartTime = new Date();
	StorageHandler.queue = levels;
	return "Level has been cryogenically frozen and will be thawed when " + liveLevel.username + " says something in chat.";
}

function CommandAfk(user, args) {
	let levels = StorageHandler.queue.values;
	let userLevels = levels.filter(x => x.username === user.username && x.status === levelStatus.pending);
	if (userLevels.length === 0) return "You have no levels in the queue, but thanks for letting us know, I guess.";
	let levelToChange = userLevels[0];
	levelToChange.afkStartTime = new Date();
	StorageHandler.queue = levels;
	return "Thanks for the heads up! You'll be automatically re-entered in the queue the next time you say something in chat.";
}

function MarkUserAsPresent(username) {
	let levels = StorageHandler.queue.values;
	let userLevels = levels.filter(x => x.username === username && x.status === levelStatus.pending);
	let userHadAfkLevel = false;

	for (let levelToChange of userLevels) {
		if (levelToChange.afkStartTime) {
			let timeSpentAfk = new Date() - +(new Date(levelToChange.afkStartTime));
			if (levelToChange.totalAfkTime) {
				levelToChange.totalAfkTime += timeSpentAfk;
			} else {
				levelToChange.totalAfkTime = timeSpentAfk;
			}
			levelToChange.afkStartTime = null;
			userHadAfkLevel = true;
		}
	}
	StorageHandler.queue = levels;

	if (userHadAfkLevel) {
		WriteMessage("Welcome back, @" + username + "! Your level is back in the queue.")
	}
}