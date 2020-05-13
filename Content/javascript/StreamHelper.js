//TODO
/*	
    + lower text box - scrolling info
        + recent followers/raids/subs?
        + spend points to have message on ticker
    + !schedule !nextstream
    + storage
        use localStorage to keep some kind of data available
        allow spreadsheet export/import
    + allow creation of commands from mods (e.g. !race, !discord, !youtube)
    + allow querying user stats - number of submitted levels, amount of time spent on levels, complete/skip ratio
    + Spend points on 
        sound effects - no cors issues :)
		Monty Python - Run away!

        ?? screen animations - maybe have some kind of overlay panel in OBS
        change SMM2 character
 */

let users = [];
let queue = [];
let isQueueOpen = true;
let queueWindow = null;
let overlayWindow = null;
let marqueeWindow = null;
let streamerName = "dobbsworks";
let voice = null;
let forbiddenCodes = ["t9cn93lkg"];
let forbiddenUsers = ["marcos_brmakerr", "stelo76", "whale_smm"];

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
	setInterval(ProcessChatMessages, 1000);
}


/////////////////////////////////////////////////
// COMMANDS
/////////////////////////////////////////////////
// The return value of each command will be sent as a reply

let commands = [
    Command("add", 		CommandAddLevel, 	commandPermission.all, 		commandDisplay.chat,    "Add a level to the queue. Usage: !add LEV-ELC-ODE"),
    Command("notspam", 	CommandNotSpam, 	commandPermission.all, 		commandDisplay.hidden),
    Command("reserve", 	CommandReserve, 	commandPermission.all, 		commandDisplay.chat,    "Reserve a spot in the queue without a code. Usage: !reserve"),
    Command("change", 	CommandChangeLevel, commandPermission.all, 		commandDisplay.chat,    "Change your queued level id. Usage: !change LEV-ELC-ODE"),
    Command("leave", 	CommandLeaveQueue, 	commandPermission.all, 		commandDisplay.chat,    "Remove your levels from the queue."),
    Command("remove", 	CommandLeaveQueue, 	commandPermission.all, 		commandDisplay.hidden),
    Command("help", 	CommandHelp, 		commandPermission.all, 		commandDisplay.hidden),
    Command("commands", CommandHelp, 		commandPermission.all, 		commandDisplay.hidden),
    Command("list", 	CommandList, 		commandPermission.all, 		commandDisplay.chat,    "Displays the upcoming levels from the queue."),
    Command("queue", 	CommandList, 		commandPermission.all, 		commandDisplay.hidden),
    Command("current", 	CommandCurrent, 	commandPermission.all, 		commandDisplay.chat,    "Displays information about the level being played."),
    Command("complete", CommandComplete,	commandPermission.streamer, commandDisplay.panel),
    Command("skip", 	CommandSkip, 		commandPermission.streamer, commandDisplay.panel),
    Command("next", 	CommandNext, 		commandPermission.streamer, commandDisplay.panel),
    Command("randomnext",CommandRandomNext, commandPermission.streamer, commandDisplay.panel),
    Command("randomwin",CommandRandomWin,	commandPermission.streamer, commandDisplay.hidden),
    Command("resettimer",CommandResetTimer, commandPermission.streamer, commandDisplay.panel),
    Command("roll", 	CommandRoll, 		commandPermission.all,      commandDisplay.chat,    "Roll the dice! Usage: !roll d6, !roll d20+3"),
    Command("open", 	CommandOpenQueue, 	commandPermission.streamer, commandDisplay.panel),
    Command("close", 	CommandCloseQueue, 	commandPermission.streamer, commandDisplay.panel),
    Command("texttospeech",CommandTTS, 		commandPermission.reward, 	commandDisplay.hidden),
	Command("priorityqueue",CommandPriority,commandPermission.reward, 	commandDisplay.hidden),
	Command("secondqueueslot",CommandQueueSlot,commandPermission.reward,commandDisplay.hidden),
    Command("addcom",	CommandAddCommand,	commandPermission.mod, 		commandDisplay.hidden),
	
    Command("as",		CommandAs,			commandPermission.streamer, commandDisplay.hidden),
    Command("exportchat",CreateChatLogWindow,commandPermission.streamer, commandDisplay.panel),
	
	MessageCommand("maker", "My maker id is: S2C-HX7-01G"),
	MessageCommand("makerid", "My maker id is: S2C-HX7-01G"),
	MessageCommand("id", "My maker id is: S2C-HX7-01G"),
	MessageCommand("priority", "Your level will cut ahead of any level that isn't in the priority queue. Note that you need to already have your level in the queue before redeeming this reward!"),
	MessageCommand("bot", "Hello there, I'm the bot! Dobbs wrote me in JavaScript of all things. I handle the level queue and stuff. Sometimes I break for no good reason! Kappa"),
	
	MessageCommand("random", "Sometimes instead of taking levels in order, we'll go randomly. If your level doesn't get picked, it'll be more likely to get drawn next time."),

	//MessageCommand("race", "I'm racing today on the SpeedGaming2 channel starting at 2PM Eastern. Want to learn more? Check the !discord, or learn the !format."),
	//MessageCommand("discord", "Get involved with the SMM2 weekly race here: https://discord.gg/VX7fHcC"),
	//MessageCommand("format", "The race has 3 phases: !blind, !optimize, and !endless. Players compete for the fastest/best score in each round."),
	//MessageCommand("blind", "Players race to be the first to complete 5 courses that they've never seen before. Charging ahead is fast, but taking a death can really slow you down!"),
	//MessageCommand("optimize", "Players are given 15 minutes on 3 courses (45 minutes total) to try and get their best time on a course. Find the fastest route and then execute it well!"),
	//MessageCommand("endless", "Players are given 20 minutes to complete as many expert endless levels as possible. Skips are allowed, but don't spend the whole race searching for a good level..."),
	
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

function CommandHelp(username, args) {
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

function CommandNotSpam(username, args) {
	let userRemovedFromSpamList = false;
	for (let i=0; i<forbiddenUsers.length; i++) {
		if (forbiddenUsers[i].toLowerCase() === username.toLowerCase()) {
			forbiddenUsers.splice(i, 1);
			userRemovedFromSpamList = true;
		}
	}
	if (userRemovedFromSpamList) {
		return "You were successfully removed from the spam list! You may now resubmit your level with !add.";
	} else {
		return "Dude, you weren't even in the spam list. Chill.";
	}
}

function CommandReserve(username, args) {
	let ret = CommandAddLevel(username, ["RES-ERV-ED0"]);
	if (ret.startsWith("Your level has been queued")) {
		ret = "Your spot is saved! Use !change if you want to swap the placeholder level code with a real one.";
	}
	return ret;
}

function CommandAddLevel(username, args) {
	if (isQueueOpen) {
		let userIsBlocked = forbiddenUsers.map(x => x.toLowerCase()).indexOf(username.toLowerCase()) > -1;
		if (userIsBlocked) {
			return " VoteNay VoteNay VoteNay For some reason you were flagged for possible spam/botting. Type !notSpam and then try again.";
		} else {
			let userInputCode = args[0];
			let strippedCode = StripLevelCode(userInputCode);
			if (strippedCode.length === 9) {
				if (DoesUserHaveQueueSpace(username)) {
					if (forbiddenCodes.indexOf(strippedCode.toLowerCase()) > -1) {
						return RandomFrom([
							"Weird, this code doesn't want to go in the queue, better try again.",
							"Error. ERROR! ERROR!",
							"Abort, do it again, fail?"
						]);
					} else {
						PushQueueEntry(username, strippedCode);
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
function PushQueueEntry(username, strippedCode) {
	let formattedCode = strippedCode.match(/.{1,3}/g).join('-').toUpperCase();
	let level = {
		code: formattedCode,
		username: username,
		status: levelStatus.pending,
		timeAdded: new Date(),
		timeStarted: null,
		timeEnded: null,
		isPriority: false,
		weight: 1 //weighting to be used for !randomnext
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

function CommandCurrent(username, args) {
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
		"pending in the queue.";
	return ret;
}

function CommandList(username, args) {
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

function CommandComplete(username, args) {
	return FinishCurrentLevel(levelStatus.completed);
}
function CommandSkip(username, args) {
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

function CommandNext(username, args) {
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

function CommandRandomNext(username, args) {
	let currentLevel = queue.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		return "There's still a level going on, mark it as complete/skipped first.";
	} else {
		let availableLevels = queue.filter(x => x.status === levelStatus.pending);
		CreateWheelOfLevels(availableLevels);
	}
}

function CommandRandomWin(username, args) {
	console.log(args);
}

function CommandResetTimer(username, args) {
	let currentLevel = queue.find(x => x.status === levelStatus.live);
	if (currentLevel) {
		currentLevel.timeStarted = new Date();
	}
	return "";
}

function CommandCloseQueue(username, args) {
    isQueueOpen = false;
    return "The queue is closed.";
}
function CommandOpenQueue(username, args) {
    isQueueOpen = true;
    return "The queue is open!";
}

function CommandRoll(username, args) {
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

function CommandTTS(username, args) {
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

function CommandPriority(username, args) {
	// find all levels for this user that are pending and not priority
	let userLevels = queue.filter(x => x.username === username && x.status === levelStatus.pending && !x.isPriority);
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
	level.isPriority = true;

	queue.splice(targetIndex, 0, queue.splice(oldIndex, 1)[0]);
	return "Your level has been moved to the priority queue.";
	return false;
}

function CommandQueueSlot(username, args) {
	let user = GetUser(username);
	if (user.queueSlots > 1) {
		return "You already have this upgrade!";
	} else {
		user.queueSlots++;
		return "You can now have " + user.queueSlots + " levels in the queue at once!";
	}
}

function CommandChangeLevel(username, args) {
	let userLevels = queue.filter(x => x.username === username && x.status === levelStatus.pending);
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
	
	return "Your level id has been changed.";
}

function CommandLeaveQueue(username, args) {
	let userLevels = queue.filter(x => x.username === username && x.status === levelStatus.pending);
	if (userLevels.length === 0) return "You have no levels in the queue.";
    
    for (let level of userLevels) {
        let index = queue.indexOf(level);
        queue.splice(index, 1);
    }
    return "Your level" + (userLevels.length > 1 ? "s have" : " has") + " been removed from the queue.";
}

function CommandAddCommand(username, args) {
	let newCommandName = args[0];
	let newCommandResponse = args.slice(1).join(" ");
	let newCommand = Command(newCommandName, () => {return newCommandResponse}, commandPermission.all, commandDisplay.hidden);
	commands.push(newCommand);
	return "Command successfully registered!";
}



function CommandAs(username, args) {
	let asUser = args[0];
	let asCommandText = args.slice(1).join(" ");
	ProcessCommand(asUser, asCommandText, true, []);
}


function CommandDebug(username, args) {
	console.log(username, args);
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

function ProcessChatMessages() {
	if (!voice) voice = GetVoice(); // keep trying to load TTS voice until it's ready
	let toProcess = FindChatMessagesToProcess();
	for (let message of toProcess) {
		ProcessChatMessage(message);
	}
    if (toProcess.length > 0) DrawPanelContent(queueWindow);
	DrawOverlayContent(overlayWindow);
}
function FindChatMessagesToProcess() {
	let chatMessages = Array.from(document.getElementsByClassName("chat-line__message")); //.filter(m => m.parentElement.classList.contains("chat-list__list-container"));
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
				let response = command.func(username, commandArgs);
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
// CHAT LOG PANEL
/////////////////////////////////////////////////

function CreateChatLogWindow() {
	let w = window.open("", "Chat Log", "width=172,height=476");
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
	let w = window.open("", "WheelOfLevels", "width=1000,height=900");
	
	let request = new XMLHttpRequest();
	request.open("GET", "https://dobbsworks.github.io/Content/Pages/wheel.html", true);
	request.onload = () => {
		w.document.write(request.responseText);
		setTimeout(() => {
			w.window.SetItems(levels.map(x => {return {name: x.username, weight: x.weight, code: x.code}}));
			w.window.init();
		}, 100);
	}
	request.send();
	return w;
}


/////////////////////////////////////////////////
// MARQUEE PANEL
/////////////////////////////////////////////////
function CreateMarqueeWindow() {
	let w = window.open("", "Marquee", "width=850,height=53");
	DrawMarqueeContent(w);
	let styleSheetElement = w.document.createElement("style");
	w.document.head.appendChild(styleSheetElement);
	let customStyleSheet = w.document.styleSheets[0];
	customStyleSheet.insertRule("@keyframes marquee { from {transform: translateX(100%); } to {transform: translateX(-100%);}}")
	customStyleSheet.insertRule("@keyframes marquee2 { from {transform: translateX(0%); } to {transform: translateX(-200%);}}");;
	return w;
}
function DrawMarqueeContent(w) {
	if (!w || !w.document) return;
	StyleWindow(w);
	let elements = [
		"Dobbs's maker ID: S2C-HX7-01G",
		"!help for common commands",
		"Stream schedule (ET): Mon 8:30pm, Wed 5pm, Sat 2pm",
		"YTD charity donations: $590",
		"Super world completion: ~34%"
	];
	let text = elements.join("  ●  ") + "  ●  ";
	
	let seconds = Math.ceil(text.length / 3) * 2;
	let delay = seconds/2;
	let div1 = '<div style="display: inline-block; padding: 8px; animation: marquee ' + seconds + 's linear infinite;">' + text + '</div>';
	let div2 = '<div style="display: inline-block; padding: 8px; animation: marquee2 ' + seconds + 's linear infinite; animation-delay: -' + delay + 's;">' + text + '</div>';
	let mainDiv = '<div style="overflow: hidden; white-space: nowrap; font-size: 24;">' + div1 + div2 + '</div>';
	w.document.writeln(mainDiv);
    StyleWindow(w);
	w.document.title = "Marquee";
}


function RandomNumber(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}
	return min + Math.floor(Math.random() * (1+max-min))
}

function RandomFrom(list) {
	let index = RandomNumber(list.length);
	return list[index];
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



