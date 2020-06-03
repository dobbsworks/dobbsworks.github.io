let users = [];
let queue = [];
let isQueueOpen = true;
let queueWindow = null;
let overlayWindow = null;
let marqueeWindow = null;
let streamerName = "dobbsworks";
let voice = null;
let forbiddenCodes = ["t9cn93lkg"];

let commandPermission = {       // TODO VIP?
	"all": "all",
	//"follower": "follower",     // doesn't work yet
	//"subscriber": "subscriber", // doesn't work yet
	//"mod": "mod",               // doesn't work yet
	"streamer": "streamer",
	"reward": "reward",
};
let commandDisplay = {
	"hidden": "hidden",         // not displayed
	"chat": "chat",             // displayed with !help
	"panel": "panel",           // only appears on streamer panel
};
let levelStatus = {
	"pending": "pending",
	"live": "live",
	"completed": "completed",
	"skipped": "skipped"
};


function Initialize() {
	//window.resizeTo(222, 759);
	queueWindow = CreateQueueWindow();	
	overlayWindow = CreateOverlayWindow();
	marqueeWindow = CreateMarqueeWindow();
	let bc = new BroadcastChannel('helper');
	bc.onmessage = OnBroadcastMessage;	
	LoadExternalFunctions();
	setInterval(ProcessMessages, 1000);
}

function LoadExternalFunctions() {
	// for cleanliness, we'll start having some functions stored in other files
	// probably need to do some kind of error-checking on this
	let fileList = ["LevelIdeaGenerator.js"];
	let cacheBreaker = (+(new Date()));
	for (let fileName of fileList) {
		let scriptTag = document.createElement('script');
		scriptTag.src = `https://dobbsworks.github.io/Tools/Streambot/${fileName}?q=${cacheBreaker}`;
		document.body.appendChild(scriptTag);
	}
}


/////////////////////////////////////////////////
// COMMANDS
/////////////////////////////////////////////////
// The return value of each command will be sent as a reply

let commands = [
    Command("add", 				CommandAddLevel, 	commandPermission.all, 		commandDisplay.chat,    "Add a level to the queue. Usage: !add LEV-ELC-ODE"),
    Command("notspam", 			CommandNotSpam, 	commandPermission.all, 		commandDisplay.hidden),
    Command("spam", 			CommandSpam, 		commandPermission.mod, 		commandDisplay.hidden),
    Command("spamlist", 		CommandSpamList, 	commandPermission.mod, 		commandDisplay.hidden),
    Command("reserve", 			CommandReserve, 	commandPermission.all, 		commandDisplay.chat,    "Reserve a spot in the queue without a code. Usage: !reserve"),
    Command("change", 			CommandChangeLevel, commandPermission.all, 		commandDisplay.chat,    "Change your queued level id. Usage: !change LEV-ELC-ODE"),
    Command("leave", 			CommandLeaveQueue, 	commandPermission.all, 		commandDisplay.chat,    "Remove your levels from the queue."),
    Command("remove", 			CommandLeaveQueue, 	commandPermission.all, 		commandDisplay.hidden),
    Command("help", 			CommandHelp, 		commandPermission.all, 		commandDisplay.hidden),
    Command("commands", 		CommandHelp, 		commandPermission.all, 		commandDisplay.hidden),
    Command("list", 			CommandList, 		commandPermission.all, 		commandDisplay.chat,    "Displays the upcoming levels from the queue."),
    Command("queue", 			CommandList, 		commandPermission.all, 		commandDisplay.hidden),
    Command("current", 			CommandCurrent, 	commandPermission.all, 		commandDisplay.chat,    "Displays information about the level being played."),
    Command("complete", 		CommandComplete,	commandPermission.streamer, commandDisplay.panel),
    Command("skip", 			CommandSkip, 		commandPermission.streamer, commandDisplay.panel),
    Command("next", 			CommandNext, 		commandPermission.streamer, commandDisplay.panel),
    Command("randomnext",		CommandRandomNext,	commandPermission.streamer, commandDisplay.panel),
    Command("randomwin",		CommandRandomWin,	commandPermission.streamer, commandDisplay.hidden),
    Command("resettimer",		CommandResetTimer,	commandPermission.streamer, commandDisplay.panel),
    Command("roll", 			CommandRoll, 		commandPermission.all,      commandDisplay.chat,    "Roll the dice! Usage: !roll d6, !roll d20+3"),
    Command("open", 			CommandOpenQueue, 	commandPermission.streamer, commandDisplay.panel),
    Command("close", 			CommandCloseQueue, 	commandPermission.streamer, commandDisplay.panel),
    Command("texttospeech",		CommandTTS, 		commandPermission.reward, 	commandDisplay.hidden),
	Command("priorityqueue",	CommandPriority,	commandPermission.reward, 	commandDisplay.hidden),
	Command("secondqueueslot",	CommandQueueSlot,	commandPermission.reward,	commandDisplay.hidden),
	Command("biggerwheelslice",	CommandBiggerSlice,	commandPermission.reward, 	commandDisplay.hidden),
	Command("addcom",			CommandAddCommand,	commandPermission.mod, 		commandDisplay.hidden),

    Command("levelidea", 		"CommandLevelIdea", commandPermission.all, 		commandDisplay.chat,    "Generates a random level idea."),
	
	Command("tickeradd",		CommandTickerAdd,	commandPermission.mod, 		commandDisplay.hidden),
	Command("tickerlist",		CommandTickerList,	commandPermission.mod, 		commandDisplay.hidden),
	Command("tickerremove",		CommandTickerRemove,commandPermission.mod, 		commandDisplay.hidden),
	
    Command("debugadd",			CommandDebugAdd,	commandPermission.streamer, commandDisplay.hidden),
    Command("as",				CommandAs,			commandPermission.streamer, commandDisplay.hidden),
    Command("exportchat",		CreateChatLogWindow,commandPermission.streamer, commandDisplay.panel),
	
	MessageCommand("maker", "My maker id is: S2C-HX7-01G"),
	MessageCommand("makerid", "My maker id is: S2C-HX7-01G"),
	MessageCommand("id", "My maker id is: S2C-HX7-01G"),
	MessageCommand("priority", "Your level will cut ahead of any level that isn't in the priority queue. Note that you need to already have your level in the queue before redeeming this reward!"),
	MessageCommand("bot", "Hello there, I'm the bot! Dobbs wrote me in JavaScript of all things. I handle the level queue and stuff. Sometimes I break for no good reason! Kappa"),
	
	MessageCommand("random", "Sometimes instead of taking levels in order, we'll go randomly. If your level doesn't get picked, it'll be more likely to get drawn next time."),
	MessageCommand("discord", "Join the discord here: https://discord.gg/cdPmKUP"),
	
	MessageCommand("charity", "I'm setting aside $25 of cash every stream that you can have me spend towards the channel's selected charity. Check the channel points for what we're supporting."),
]

function Command(...args) {
    let command = {};
    command.name = args[0];
    command.func = args[1];
    command.permissions = args[2];
    command.display = args[3];
    command.help = args[4];
    return command;
}

function MessageCommand(...args) {
	return Command(args[0], () => {return args[1]}, commandPermission.all, commandDisplay.hidden);
}

function CommandHelp(user, args) {
    let commName = args[0];
    if (commName) {
        let command = commands.find(x => x.name.toLowerCase() === commName.toLowerCase());
        if (command && command.help) {
            return command.help;
        } else {
            return "No information found for command " + commName;
        }
    } else {
        let commandsToDisplay = commands.filter(x => x.display === commandDisplay.chat);
        let commandList = commandsToDisplay.map(x => "!" + x.name).join(" ");
        return 'Use "!help commandName" for more info about a command. Commands: ' + commandList;
    }
}

function CommandReserve(user, args) {
	let ret = CommandAddLevel(user, ["RES-ERV-ED0"]);
	if (ret.startsWith("Your level has been queued")) {
		ret = "Your spot is saved! Use !change if you want to swap the placeholder level code with a real one.";
	}
	return ret;
}

function CommandAddLevel(user, args) {
	if (isQueueOpen) {
		let userIsBlocked = GetSpamUsers().map(x => x.toLowerCase()).indexOf(user.username.toLowerCase()) > -1;
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
						let queuePosition = queue.filter(x => x.status === levelStatus.pending).length;
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
	queue.push(level);
}
function DoesUserHaveQueueSpace(username) {
	// find all levels for this user that are pending or currently live
	let usersLevels = queue.filter(x => x.username === username && 
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
	let currentLevel = queue.find(x => x.status === levelStatus.live);
	let pendingLevels = queue.filter(x => x.status === levelStatus.pending);
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
		...queue.filter(x => x.status === levelStatus.live),
		...queue.filter(x => x.status === levelStatus.pending)
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
		let currentLevel = queue.find(x => x.status === levelStatus.live);
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
	let currentLevel = queue.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		return "There's still a level going on, mark it as complete/skipped first.";
	} else {
		let nextLevel = queue.find(x => x.status === levelStatus.pending);
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
	let currentLevel = queue.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		return "There's still a level going on, mark it as complete/skipped first.";
	} else {
		let availableLevels = queue.filter(x => x.status === levelStatus.pending);
		CreateWheelOfLevels(availableLevels);
	}
}

function CommandRandomWin(user, args) {
	let levelCode = args[0];
	let availableLevels = queue.filter(x => x.status === levelStatus.pending);
	let level = availableLevels.find(x => x.code === levelCode);
	if (level) {
		MoveLevelToFront(level);
		return CommandNext();
	}
}

function CommandResetTimer(user, args) {
	let currentLevel = queue.find(x => x.status === levelStatus.live);
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

function CommandRoll(user, args) {
    let rawRollString = args.join('').replace(/\s/g, '').toLowerCase();
    let hasInvalidChars = rawRollString.replace(/[\d,d,+,-]/g, '').length > 0;
    if (hasInvalidChars) {
        return 'Invalid roll! Example usages: "!roll d6" or "!roll d20+3" or "!roll 3d8-d6"'
    } else {
        rawRollString = rawRollString.replace(/\+/g, ",+").replace(/-/g, ",-");
        if (!rawRollString.startsWith("-") && !rawRollString.startsWith("+")) rawRollString = "+" + rawRollString;
        let rollGroups = rawRollString.split(",");
        let total = 0;
        let breakdowns = [];
        let totalDice = 0;
        for (let rollGroup of rollGroups) {
            if (rollGroup.indexOf("d") === -1) {
                // constant num
                let num = +(rollGroup.slice(1, rollGroup.length));
                //breakdowns.push(num);
                total += rollGroup.startsWith("+") ? num : -num;
            } else {
                let numDice = +(rollGroup.slice(1,rollGroup.indexOf("d")));
                totalDice += numDice;
                if (totalDice > 20) return "That's too many dice...";
                if (rollGroup.indexOf("d") === 1) numDice = 1;
                let numFaces = +(rollGroup.slice(rollGroup.indexOf("d")+1,rollGroup.length));
                let rolledNums = RollDice(numDice, numFaces);
                let sum = rolledNums.reduce((a,b)=>a+b,0);
                breakdowns.push(rolledNums);
                total += rollGroup.startsWith("+") ? sum : -sum;
            }
        }
        let ret = "You rolled a " + total + "!";
        if (totalDice > 1) ret += " " + breakdowns.map(x => "[" + x.toString() + "]").join(",");
        return ret;
    }
}
function RollDice(n, d) {
    let ret = [];
    for (let i=0; i<n; i++) ret.push(Math.ceil(Math.random()*d));
    return ret;
}

function CommandTTS(user, args) {
	let text = args.join(" ");
	let msg = new SpeechSynthesisUtterance(text);
	msg.volume = 0.5;
	voice = GetVoice();
	if (voice) msg.voice = voice;
	window.speechSynthesis.speak(msg);
}
function GetVoice() {
	if (!voice) {
		let voices = window.speechSynthesis.getVoices();
		voice = voices.filter(x => x.name === "Google US English")[0];
	}
	return voice;
}

function CommandPriority(user, args) {
	// find all levels for this user that are pending and not priority
	let userLevels = queue.filter(x => x.username === user.username && x.status === levelStatus.pending && !x.isPriority);
	if (userLevels.length === 0) return "There are no valid levels to prioritize.";
	let levelToPrioritze = userLevels[0];

	let errorStr = MoveLevelToFront(levelToPrioritze);
	if (errorStr) return errorStr;
	levelToPrioritze.isPriority = true;

	return "Your level has been moved to the priority queue.";
}


function MoveLevelToFront(level) {
	let oldIndex = queue.indexOf(level);
	let targetIndex = queue.filter(x => x.status !== levelStatus.pending || x.isPriority).length;
	if (oldIndex <= -1 || targetIndex <= -1) return "Uh, something went wrong here, ask Dobbs to fix it, idk";

	queue.splice(targetIndex, 0, queue.splice(oldIndex, 1)[0]);
	return "Your level has been moved to the priority queue.";
	return false;
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
	let userLevels = queue.filter(x => x.username === user.username && x.status === levelStatus.pending && !x.isPriority);
	if (userLevels.length === 0) return "There are no valid levels to prioritize.";
	let levelToPrioritze = userLevels[0];
	levelToPrioritze.weightPriorityPurchases += 1;
}

function CommandChangeLevel(user, args) {
	let userLevels = queue.filter(x => x.username === user.username && x.status === levelStatus.pending);
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
	let userLevels = queue.filter(x => x.username === user.username && x.status === levelStatus.pending);
	if (userLevels.length === 0) return "You have no levels in the queue.";
    
    for (let level of userLevels) {
        let index = queue.indexOf(level);
        queue.splice(index, 1);
    }
    return "Your level" + (userLevels.length > 1 ? "s have" : " has") + " been removed from the queue.";
}

function CommandAddCommand(user, args) {
	let newCommandName = args[0];
	let newCommandResponse = args.slice(1).join(" ");
	let newCommand = Command(newCommandName, () => {return newCommandResponse}, commandPermission.all, commandDisplay.hidden);
	commands.push(newCommand);
	return "Command successfully registered!";
}



function CommandAs(user, args) {
	let asUser = args[0];
	let asCommandText = args.slice(1).join(" ");
	ProcessCommand(asUser, asCommandText, true, []);
}


function CommandDebug(user, args) {
	console.log(user, args);
}


/////////////////////////////////////////////////
// USER STUFF
/////////////////////////////////////////////////

function GetUser(username) {
	let user = users.find(x => x.username.toLowerCase() === username.toLowerCase());
	if (!user) {
		user = {
			username: username, 
			queueSlots: 1
		};
		users.push(user);
	}
	return user;
}


/////////////////////////////////////////////////
// MESSAGE PROCESSING
/////////////////////////////////////////////////

function ProcessMessages() {
	if (!voice) voice = GetVoice(); // keep trying to load TTS voice until it's ready
	let toProcess = FindChatMessagesToProcess();
	for (let message of toProcess) {
		ProcessChatMessage(message);
	}
	
	let activityToProcess = FindActivityMessagesToProcess();
	for (let message of activityToProcess) {
		ProcessActivityMessage(message);
	}

    if (toProcess.length > 0) DrawPanelContent(queueWindow);
	DrawOverlayContent(overlayWindow);
}
function FindChatMessagesToProcess() {
	let chatMessages = Array.from(document.getElementsByClassName("chat-line__message")); 
	let rewardMessages = Array.from(document.getElementsByClassName("channel-points-reward-line"))
	let allMessages = [...chatMessages, ...rewardMessages];
	let toProcess = allMessages.filter(m => !m.classList.contains("processed"));
	return toProcess;
}
function ProcessChatMessage(messageEl) {
	let textFragments = Array.from(messageEl.querySelectorAll(".text-fragment, .chat-image, .mention-fragment"));
	let stitchedText = textFragments.map(x => x.innerText || x.alt).join("");
	let selectedReward = messageEl.children[0].innerText.split("\n")[0].replace("Redeemed ","");
	let badges = Array.from(messageEl.getElementsByClassName("chat-badge")).map(x => x.alt);
	
	let username = "";
	let usernameEl = messageEl.getElementsByClassName("chat-line__username");
	if (usernameEl.length) {
		username = usernameEl[0].innerText;
	} else {
		username = selectedReward.split(" ")[0];
		selectedReward = selectedReward.replace(username + " redeemed ","");
	}
	
	LogChatMessage({timestamp: new Date(), text: stitchedText, username: username, reward: selectedReward});
	
	ProcessCommand(username, stitchedText, false, badges);
	if (selectedReward.length > 0) {
		ProcessCommand(username, "!" + selectedReward.replace(/ /g,'') + " " + stitchedText, true, badges);
	}
    messageEl.classList.add("processed");
}

function ProcessCommand(username, commandText, isReward, badges) {
	let user = {
		username: username,
		badges: badges
	};
	if (commandText.length < 2) return;
    let commandArgs = commandText.split(" ");
    let commandName = commandArgs.splice(0,1)[0].toLowerCase();
    let command = commands.find(x => "!" + x.name === commandName.toLowerCase());
    if (command) {
        // todo - actual permission system, allow for all/follower/subscriber/mod/streamer
		let hasValidPermission = false;
		
		if (command.permissions === commandPermission.all) hasValidPermission = true;
		if (command.permissions === commandPermission.subscriber) {
			//TODO 
		}
		if (command.permissions === commandPermission.reward) {
			if (isReward) hasValidPermission = true;
		}
		if (username === streamerName) hasValidPermission = true;
		
        if (hasValidPermission) {
			try {
				let func = typeof command.func === "string" ? window[command.func] : command.func;
				if (!func) return "Uh-oh, this command went missing."
				let response = func(user, commandArgs);
				if (username !== streamerName && response != null) {
					response = response.charAt(0).toLowerCase() + response.slice(1);
					response = "@" + username + ", " + response;
				}
				if (response) WriteMessage(response);
			} catch(err) {
				console.error(err);
			}
        }
    }
    DrawPanelContent(queueWindow);
}

function WriteMessage(message) {
	message = "BEEP! copyThis " + message;
	let chatInput = document.getElementsByTagName('textarea')[0];
	let chatButton = [...document.getElementsByTagName('button')].find(x => x.innerText === "Chat");
	
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(chatInput, message);

    var ev2 = new Event('input', { bubbles: true});
    chatInput.dispatchEvent(ev2);
	
	chatButton.click();
}

function OnBroadcastMessage(message) {
    // messages from the queue window panel
    ProcessCommand(streamerName, message.data);
}

function FindActivityMessagesToProcess() {
	let messages = Array.from(document.getElementsByClassName("activity-base-list-item")); 
	let toProcess = messages.filter(m => !m.classList.contains("processed"));
	return toProcess;
}
function ProcessActivityMessage(messageEl) {
	let line1 = messageEl.querySelector(".activity-base-list-item__title").textContent;
	let line2 = messageEl.querySelector(".activity-base-list-item__subtitle span").textContent;
	let time = messageEl.querySelector(".activity-base-list-item__subtitle > span:last-child").textContent;

	if (time.indexOf("day") === -1 && time.indexOf("month") === -1) {
		// Follows
		if (line2 === "Followed you") {
			let user = line1;
			marqueeWindow.AddAlert(user + " is now following!");
		}
		// Bits
		if (line2.startsWith("Cheered ") && line2.indexOf(" bit") > -1) {
			let user = line1;
			marqueeWindow.AddAlert(user + " " + line2.toLowerCase() + "!");
		}
		// Raids
		if (line2.startsWith("Raided you ")) {
			let user = line1;
			marqueeWindow.AddAlert(user + " is raiding" + line2.replace("Raided you","") + "!");
		}
		// Subscribe
		if (line2.startsWith("Subscribed ")) {
			let user = line1;
			marqueeWindow.AddAlert(user + " " + line2.toLowerCase() + "!");
		}
	}
    messageEl.classList.add("processed");
}

/////////////////////////////////////////////////
// CONTROL PANEL
/////////////////////////////////////////////////

function CreateQueueWindow() {
	let w = window.open("", "Queue", "width=600,height=700");
    DrawPanelContent(w);
	return w;
}
function DrawPanelContent(w) {
	if (!w || !w.document) return;
    w.document.body.innerHTML = "";
    StyleWindow(w);
    CreateButtons(w);
    CreateQueueTable(w);
    CreateButtons(w);
}
function StyleWindow(w) {
	w.document.body.style.backgroundColor = "#18181b";
	w.document.body.style.color = "#adadb8";
	w.document.body.style.fontFamily = "sans-serif";
}
function CreateButtons(w) {
	let buttons = '<div style="">';
    let buttonCommands = commands.filter(x => x.display === commandDisplay.panel);
    for (let buttonCommand of buttonCommands) {
        buttons += GetButtonHtml(buttonCommand.name);
    }
	buttons += '</div>';
	w.document.writeln(buttons);
}
function GetButtonHtml(command) {
    let displayName = command.charAt(0).toUpperCase() + command.slice(1);
	let onclick = "(new BroadcastChannel('helper')).postMessage('!" + command + "')";
	return '<button type="button" onclick="' + onclick + '">' + displayName + '</button>';
}
function CreateQueueTable(w) {
    let table = '<table style="border-spacing: 10px;">';
	
	let colors = {}
	colors[levelStatus.pending] = "#99A";
	colors[levelStatus.live] = "#FFF";
	colors[levelStatus.completed] = "#555";
	colors[levelStatus.skipped] = "#855";
	
    for (let level of queue) {
		let color = colors[level.status];
        table += '<tr style="color:' + color + (level.status === levelStatus.live ? ';font-weight:bold' : '') + ';">';
        table += "<td>" + level.code + "</td>";
        table += "<td>" + level.username + "</td>";
        table += "<td>" + level.status + "</td>";
		if (level.status === levelStatus.live) {
			table += "<td>" + GetTimeDiff(level.timeStarted, new Date()) + "</td>";
		} else if (level.timeEnded) {
			table += "<td>" + GetTimeDiff(level.timeStarted, level.timeEnded) + "</td>";
		}
        table += "</tr>";
    }
    table += "</table>";
	w.document.writeln(table);
}

/////////////////////////////////////////////////
// OVERLAY PANEL
/////////////////////////////////////////////////

function CreateOverlayWindow() {
	let w = window.open("", "Overlay", "width=172,height=476");
	DrawOverlayContent(w);
	return w;
}
function DrawOverlayContent(w) {
	if (!w || !w.document) return;
    StyleWindow(w);
    w.document.body.innerHTML = "";
	w.document.title = "Overlay";
	
	let targetRecentCount = 2;
	let pastLevels = queue.filter(x => x.status === levelStatus.completed || x.status === levelStatus.skipped);
	let recentLevels = pastLevels.slice(pastLevels.length - targetRecentCount);
	
	if (recentLevels.length > 0) {
		w.document.writeln("<hr/>");
		w.document.writeln("<div>Recent Levels</div>");
		w.document.writeln("<hr/>");
		
		for (let level of recentLevels) {
			w.document.writeln(GetOverlayContentFromLevel(level));
		}		
	}
	
	let liveLevel = queue.find(x => x.status === levelStatus.live);
	let levelTime = "";
	if (liveLevel) {
		levelTime = GetTimeDiff(liveLevel.timeStarted, new Date());
	}
	w.document.writeln("<br/>");
	w.document.writeln("<hr/>");
	w.document.writeln("<div>Now Playing   " + levelTime + "</div>");
	w.document.writeln("<hr/>");	
	w.document.writeln(GetOverlayContentFromLevel(liveLevel));	
	w.document.writeln("<br/>");
	
	
	let targetTotalCount = 5; // maximum sum of recent and upcoming
	let targetUpcomingCount = targetTotalCount - recentLevels.length; 
	let upcomingLevels = queue.filter(x => x.status === levelStatus.pending).slice(0,targetUpcomingCount);
	
	if (upcomingLevels.length > 0) {
		w.document.writeln("<hr/>");
		w.document.writeln("<div>Upcoming Levels</div>");
		w.document.writeln("<hr/>");
		
		for (let level of upcomingLevels) {
			w.document.writeln(GetOverlayContentFromLevel(level));
		}		
	} else {
		w.document.writeln("<hr/>");
		if (isQueueOpen) {
			w.document.writeln("<div>No pending levels, add yours now with !add</div>");
		} else {
			w.document.writeln("<div>The queue is closed.</div>");
		}
	}
}

function GetOverlayContentFromLevel(level) {
	if (level) {
		let flags = "";
		if (level.isPriority) flags += ' <span style="color:yellow;"> ★</span>';
		if (level.status === levelStatus.completed) flags += ' <span style="color:green;"> ✓</span>';
		
		let html = '<div style="margin-bottom: 8px;">';
		html +=			'<div>' + level.code + flags + '</div>'
		html +=			'<div>' + level.username + '</div>';
		html +=		'</div>';
		
		return html;
	} else {
		return '<div style="margin-bottom: 8px;"><div>-</div><div>-</div></div>';
	}
}



/////////////////////////////////////////////////
// SPAM BLOCK
/////////////////////////////////////////////////

function CommandSpam(user, args) {
	let targetUser = args[0];
	if (GetSpamUsers().indexOf(targetUser) > -1) {
		return "User " + targetUser + " is already flagged for possible spam.";
	} else {
		AddSpamUser(targetUser);
		return "User " + targetUser + " has been flagged for possible spam.";
	}
}

function CommandSpamList(user, args) {
	return "The following users have been flagged for possible spam: " + GetSpamUsers().join(", ");
}

function CommandNotSpam(user, args) {
	if (!user.username) return "Error, couldn't detect user name.";
	let userRemovedFromSpamList = RemoveSpamUser(user.username);
	if (userRemovedFromSpamList) {
		return "You were successfully removed from the spam list! You may now resubmit your level with !add.";
	} else {
		return "Dude, you weren't even in the spam list. Chill.";
	}
}

function GetSpamUsers() {
	let spamUsers = localStorage.getItem("spamusers");
	if (spamUsers) return JSON.parse(spamUsers);
	return [];
}
function AddSpamUser(user) {
	let spamUsers = localStorage.getItem("spamusers");
	if (!spamUsers) spamUsers = "[]";
	let newSpamUsers = JSON.parse(spamUsers);
	newSpamUsers.push(user);
	localStorage.setItem("spamusers", JSON.stringify(newSpamUsers));
}
function RemoveSpamUser(username) {
	let userRemovedFromSpamList = false;
	let spamUsers = localStorage.getItem("spamusers");
	if (spamUsers) {
		spamUsers = JSON.parse(spamUsers);
		for (let i=0; i<spamUsers.length; i++) {
			if (spamUsers[i].toLowerCase() === username.toLowerCase()) {
				spamUsers.splice(i, 1);
				userRemovedFromSpamList = true;
			}
		}
		localStorage.setItem("spamusers", JSON.stringify(spamUsers));
	}
	return userRemovedFromSpamList;
}


/////////////////////////////////////////////////
// CHAT LOG PANEL
/////////////////////////////////////////////////

function CreateChatLogWindow() {
	let w = window.open("", "Chat Log", "width=872,height=476");
	let currentLog = localStorage.getItem("log");
	if (currentLog) {
		let logMessages = JSON.parse(currentLog);
		w.document.writeln("<table>");
		for (let m of logMessages) 
			w.document.writeln("<tr><td>" + (new Date(m.timestamp)).toLocaleDateString() + " " + 
				(new Date(m.timestamp)).toLocaleTimeString() + 
				"</td><td>" + m.username + "</td><td>" + m.reward + "</td><td>" + m.text + "</td></tr>");
		w.document.writeln("</table>");
	}
	ClearChatLog();
}
function ClearChatLog() {
	localStorage.setItem("log","");
}
function LogChatMessage(m) {
	let currentLog = localStorage.getItem("log");
	if (currentLog) {
		let logMessages = JSON.parse(currentLog);
		logMessages.push(m);
		localStorage.setItem("log", JSON.stringify(logMessages));
	} else {
		localStorage.setItem("log", JSON.stringify([m]));
	}
	// chatLogWindow.document.writeln("<table><tr><td>" + m.timestamp.toLocaleDateString() + " " + m.timestamp.toLocaleTimeString() + 
	// "</td><td>" + m.username + "</td><td>" + m.reward + "</td><td>" + m.text + "</td></tr></table>");
}

/////////////////////////////////////////////////
// WHEEL OF LEVELS
/////////////////////////////////////////////////
function CreateWheelOfLevels(levels) {
	let w = window.open("", "WheelOfLevels", "width=1000,height=900,left=700");
	
	let request = new XMLHttpRequest();
	let wheelData = levels.map(x => {return {name: x.username, weight: CalculateLevelWeight(x), code: x.code, badges: x.badges}});
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

function CalculateLevelWeight(level) {
	let now = new Date();
	let timeBonusWeight = Math.floor((now - level.timeAdded) / 1000 / 60 / 5); // number of 5 minute chunks
	let bonusScale = Math.pow(2, level.weightPriorityPurchases);
	let ret = bonusScale * (level.weight + timeBonusWeight);
	return ret;
}

function PlayAudio(ytid) {
	let w = window.open("https://www.youtube.com/watch?v=" + ytid + "?t=0");
	return w;
}

function CommandDebugAdd() {
	let username = "user" + Math.ceil(100*Math.random());
	let getLevelSegment = () => Math.floor(16*16*16*Math.random()).toString(16).padStart(3,"000");
	let levelCode = getLevelSegment() + "-" + getLevelSegment() + "-" + getLevelSegment();
	CommandAddLevel({username: username, badges:[]}, [levelCode]);
}


/////////////////////////////////////////////////
// MARQUEE PANEL
/////////////////////////////////////////////////
function CreateMarqueeWindow() {
	let w = window.open("", "Marquee", "width=850,height=53");
	
	let request = new XMLHttpRequest();
	let url = "https://dobbsworks.github.io/Tools/Streambot/marquee.html?q=" + (+(new Date()));
	request.open("GET", url, true);
	request.onload = () => {
		w.document.write(request.responseText);
		setTimeout(() => {
			w.window.init();
			let currentItems = localStorage.getItem("ticker");
			if (!currentItems) currentItems = "[]";
			let itemList = JSON.parse(currentItems);
			w.window.SetScrollItems(itemList);
		}, 500);
	}
	request.send();
	return w;
}

function CommandTickerAdd(user, args) {
	let newText = args.join(' ');
	let currentItems = localStorage.getItem("ticker");
	if (!currentItems) currentItems = "[]";
	let itemList = JSON.parse(currentItems);
	itemList.push(newText);
	localStorage.setItem("ticker", JSON.stringify(itemList));
	UpdateTickerItems();
	return "Ticker item registered.";
}
function CommandTickerList(user, args) {
	let currentItems = localStorage.getItem("ticker");
	if (!currentItems) currentItems = "[]";
	let itemList = JSON.parse(currentItems);
	let requestedIndex = +(args[0]);
	if (requestedIndex)  {
		let item = itemList[requestedIndex-1];
		return "Ticker item text: " + item;
	} else {
		return "Run this command with a number from 1 to " + itemList.length.toString() + " to get that item's text.";
	}
}
function CommandTickerRemove(user, args) {
	if (isNaN(+(args[0]))) return "Usage: !tickerRemove itemNum"
	let currentItems = localStorage.getItem("ticker");
	if (!currentItems) currentItems = "[]";
	let itemList = JSON.parse(currentItems);
	let itemNum = +(args[0]) - 1;
	itemList.splice(itemNum, 1);
	localStorage.setItem("ticker", JSON.stringify(itemList));
	UpdateTickerItems();
	return "Item removed.";
}
// function UpdateTickerItems() {
// 	let tickerItems = localStorage.getItem("ticker");
// 	if (tickerItems) {
// 		marqueeWindow.window.SetScrollItems(JSON.parse(tickerItems));
// 	}
// }



/////////////////////////////////////////////////

function RandomFrom(list) {
	let index = RandomNumber(list.length) - 1;
	return list[index];
}
function RandomNumber(min, max) {
	if (max === undefined) {
		max = min;
		min = 1;
	}
	return min + Math.floor(Math.random() * (1+max-min))
}

function RandomWeightedFrom(list, weightFunc) {
	let weightTotal = list.map(weightFunc).reduce((a,b) => a+b, 0);
	let randomIndex = RandomNumber(1, weightTotal);
	let cumulativeWeight = 0;
	for (let item of list) {
		cumulativeWeight += weightFunc(item);
		if (cumulativeWeight >= randomIndex) return item;
	}
	return null;
}

Initialize();



