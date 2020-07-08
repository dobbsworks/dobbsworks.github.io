let users = [];
let isQueueOpen = true;
let queueWindow = null;
let overlayWindow = null;
let marqueeWindow = null;
let streamerName = "dobbsworks";
let voice = null;
let forbiddenCodes = ["t9cn93lkg"];
var StorageHandler;

let commandPermission = {       // TODO VIP?
	"all": "all",
	//"follower": "follower",     // doesn't work yet
	"subscriber": "subscriber", 
	//"mod": "mod",               // doesn't work yet
	"streamer": "streamer",
	"reward": "reward",
};
let commandDisplay = {
	"hidden": "hidden",         // not displayed
	"chat": "chat",             // displayed with !help
	"reward": "reward", 
	"panel": "panel",           // only appears on streamer panel
};
let levelStatus = {
	"pending": "pending",
	"live": "live",
	"completed": "completed",
	"skipped": "skipped"
};


function Initialize() {
	LoadExternalFunctions();
	setTimeout(() => {
		LoadCommands();
		queueWindow = CreateQueueWindow();	
		overlayWindow = CreateOverlayWindow();
		marqueeWindow = CreateMarqueeWindow();
		let bc = new BroadcastChannel('helper');
		bc.onmessage = OnBroadcastMessage;
		setInterval(ProcessMessages, 1000);
	}, 1000);
}

function LoadExternalFunctions() {
	// for cleanliness, we'll start having some functions stored in other files
	// probably need to do some kind of error-checking on this
	let fileList = [
		"MessageProcessor.js",
		"MarqueeHandler.js",
		"StorageHandler.js",
		"SpamBlock.js",
		"LevelQueue.js",
		"WheelHandler.js",
		"LevelIdeaGenerator.js",
		"DiceRoller.js",
		"Minigame.js",
		"MinigameData.js",
		"PointHandler.js"
	];
	let cacheBreaker = (+(new Date()));
	for (let fileName of fileList) {
		let scriptTag = document.createElement('script');
		scriptTag.src = `https://dobbsworks.github.io/Tools/Streambot/javascript/${fileName}?q=${cacheBreaker}`;
		document.body.appendChild(scriptTag);
	}
}


/////////////////////////////////////////////////
// COMMANDS
/////////////////////////////////////////////////
// The return value of each command will be sent as a reply

let commands = [];
function LoadCommands() {
	commands = [
		Command("add", 			"CommandAddLevel", 	commandPermission.all, 		commandDisplay.chat,    "Add a level to the queue. Usage: !add LEV-ELC-ODE"),
		Command("notspam", 		"CommandNotSpam", 	commandPermission.all, 		commandDisplay.hidden),
		Command("spam", 		"CommandSpam", 		commandPermission.mod, 		commandDisplay.hidden),
		Command("spamlist", 		"CommandSpamList", 	commandPermission.mod, 		commandDisplay.hidden),
		Command("reserve", 		"CommandReserve", 	commandPermission.all, 		commandDisplay.chat,    "Reserve a spot in the queue without a code. Usage: !reserve"),
		Command("replace", 		"CommandChangeLevel", commandPermission.all, 		commandDisplay.chat,    "Change your queued level id. Usage: !change LEV-ELC-ODE"),
		Command("change", 		"CommandChangeLevel", commandPermission.all, 		commandDisplay.chat,    "Change your queued level id. Usage: !change LEV-ELC-ODE"),
		Command("leave", 		"CommandLeaveQueue", 	commandPermission.all, 		commandDisplay.chat,    "Remove your levels from the queue."),
		Command("remove", 		"CommandLeaveQueue", 	commandPermission.all, 		commandDisplay.hidden),
		Command("help", 		"CommandHelp", 		commandPermission.all, 		commandDisplay.hidden),
		Command("commands", 		"CommandHelp", 		commandPermission.all, 		commandDisplay.hidden),
		Command("list", 		"CommandList", 		commandPermission.all, 		commandDisplay.chat,    "Displays the upcoming levels from the queue."),
		Command("queue", 		"CommandList", 		commandPermission.all, 		commandDisplay.hidden),
		Command("current", 		"CommandCurrent", 	commandPermission.all, 		commandDisplay.chat,    "Displays information about the level being played."),
		Command("complete", 		"CommandComplete",	commandPermission.streamer, commandDisplay.panel),
		Command("skip", 		"CommandSkip", 		commandPermission.streamer, commandDisplay.panel),
		Command("next", 		"CommandNext", 		commandPermission.streamer, commandDisplay.panel),
		Command("randomnext",		"CommandRandomNext",	commandPermission.streamer, commandDisplay.panel),
		Command("randomwin",		"CommandRandomWin",	commandPermission.streamer, commandDisplay.hidden),
		Command("resettimer",		"CommandResetTimer",	commandPermission.streamer, commandDisplay.panel),
		Command("roll", 		"CommandRoll", 		commandPermission.all,      commandDisplay.chat,    "Roll the dice! Usage: !roll d6, !roll d20+3"),
		Command("open", 		"CommandOpenQueue", 	commandPermission.streamer, commandDisplay.panel),
		Command("close", 		"CommandCloseQueue", 	commandPermission.streamer, commandDisplay.panel),
		Command("texttospeech",		"CommandTTS", 		commandPermission.reward, 	commandDisplay.hidden),
		//Command("secondqueueslot",	"CommandQueueSlot",	commandPermission.reward,	commandDisplay.hidden),
		Command("biggerwheelslice",	"CommandBiggerSlice",	commandPermission.reward, 	commandDisplay.hidden),
		Command("addcom",		"CommandAddCommand",	commandPermission.mod, 		commandDisplay.hidden),
	
		
		Command("minigame",		"CommandMinigame",	commandPermission.streamer, commandDisplay.hidden),
		MessageCommand("minigame", "Compete for a better shot at having your level played next! A scrambled word will appear in chat. Use !guess YOUR ANSWER to take a stab at solving the puzzle."),
		Command("guess", 		"CommandMinigameGuess",commandPermission.all, 	commandDisplay.hidden),
		
		Command("tickeradd",		"CommandTickerAdd",	commandPermission.mod, 		commandDisplay.hidden),
		Command("tickerlist",		"CommandTickerList",	commandPermission.mod, 		commandDisplay.hidden),
		Command("tickerremove",		"CommandTickerRemove",commandPermission.mod, 		commandDisplay.hidden),
		
		Command("debugadd",		"CommandDebugAdd",	commandPermission.streamer, commandDisplay.hidden),
		Command("as",			"CommandAs",			commandPermission.streamer, commandDisplay.hidden),
		Command("exportchat",		"CreateChatLogWindow",commandPermission.streamer, commandDisplay.panel),
		
		MessageCommand("maker", "My maker id is: S2C-HX7-01G"),
		MessageCommand("makerid", "My maker id is: S2C-HX7-01G"),
		MessageCommand("id", "My maker id is: S2C-HX7-01G"),
		MessageCommand("priority", "Your level will cut ahead of any level that isn't in the priority queue. Note that you need to already have your level in the queue before redeeming this reward!"),
		MessageCommand("bot", "Hello there, I'm the bot! Dobbs wrote me in JavaScript of all things. I handle the level queue and stuff. Sometimes I break for no good reason! Kappa"),
		MessageCommand("schedule", "all times in Eastern: Mon 8:30PM, Wed 5PM, Sat 2PM. Mario Maker every stream except Monday."),
		
		MessageCommand("wheel", "Instead of taking levels in order, we'll go randomly. Your chances of being chosen are based on how long you've been in the queue."),
		MessageCommand("discord", "Join the discord here: https://discord.gg/cdPmKUP"),
		
		MessageCommand("charity", "I'm setting aside $25 of cash every stream that you can have me spend towards the channel's selected charity. Check the channel points for what we're supporting."),
	
	
		Command("addpoints",		"CommandAddPoints",commandPermission.streamer, commandDisplay.hidden),
		Command("points",		"CommandGetPoints",commandPermission.all, commandDisplay.chat),
		Command("tokens",		"CommandGetPoints",commandPermission.all, commandDisplay.chat),


		Command("rewards", 		"CommandRewards", 		commandPermission.all, 		commandDisplay.chat, 	"Get information about the things you can spend !tokens on."),
	
		RewardCommand(100, "wheelcolor", "CommandWheelColor", commandPermission.all,    "Sets the color for your slice of the !wheel."),
		RewardCommand(250, "wheelpattern", "CommandWheelPattern", commandPermission.all,    "Sets the background pattern for your slice of the !wheel. Lasts one hour for non-subs."),

		
		Command("getalevelidea", 		"CommandLevelIdea", commandPermission.reward, 		commandDisplay.hidden,    "Generates a random level idea."),
		RewardCommand(25, "levelidea", "CommandLevelIdea", commandPermission.all,    "Generates a random level idea."),
	];
}

function Command(...args) {
    let command = {};
    command.name = args[0];
    command.func = args[1];
    command.permissions = args[2];
    command.display = args[3];
    command.help = args[4];
    command.cost = args[5];
    return command;
}

function MessageCommand(...args) {
	return Command(args[0], () => {return args[1]}, commandPermission.all, commandDisplay.hidden);
}

function RewardCommand(...args) {
	return Command(args[1], args[2], args[3], commandDisplay.reward, "", args[0]);
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

function CommandRewards(user, args) {
    let commName = args[0];
    if (commName) {
        let command = commands.find(x => x.name.toLowerCase() === commName.toLowerCase());
        if (command) {
			let text = command.help;
			if (!text) text = "";
            return text + " Costs " + pointHandler.formatValue(command.cost);
        } else {
            return "No information found for command " + commName;
        }
    } else {
        let commandsToDisplay = commands.filter(x => x.cost);
        let commandList = commandsToDisplay.map(x => "!" + x.name).join(" ");
        return 'Use "!rewards commandName" for more info about a command. Commands: ' + commandList;
    }
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
// CONTROL PANEL
/////////////////////////////////////////////////

function CreateQueueWindow() {
	let w = window.open("", "Queue", "width=600,height=700,left=1140");
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
	
    if (StorageHandler) for (let level of StorageHandler.queue.values) {
		let color = colors[level.status];
        table += '<tr style="color:' + color + (level.status === levelStatus.live ? ';font-weight:bold' : '') + ';">';
        table += "<td>" + level.code + "</td>";
        table += "<td>" + level.username + "</td>";
        table += "<td>" + level.status + "</td>";
		if (level.status === levelStatus.live) {
			table += "<td>" + GetTimeDiff(new Date(level.timeStarted), new Date()) + "</td>";
		} else if (level.timeEnded) {
			table += "<td>" + GetTimeDiff(new Date(level.timeStarted), level.timeEnded) + "</td>";
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
	let w = window.open("", "Overlay", "width=172,height=476,left=1740");
	DrawOverlayContent(w);
	return w;
}
function DrawOverlayContent(w) {
	if (!w || !w.document) return;
	if (!StorageHandler) return;
    StyleWindow(w);
    w.document.body.innerHTML = "";
	w.document.title = "Overlay";
	
	let targetRecentCount = 2;
	let pastLevels = StorageHandler.queue.values.filter(x => x.status === levelStatus.completed || x.status === levelStatus.skipped);
	let recentLevels = pastLevels.slice(pastLevels.length - targetRecentCount);
	
	if (recentLevels.length > 0) {
		w.document.writeln("<hr/>");
		w.document.writeln("<div>Recent Levels</div>");
		w.document.writeln("<hr/>");
		
		for (let level of recentLevels) {
			w.document.writeln(GetOverlayContentFromLevel(level));
		}		
	}
	
	let liveLevel = StorageHandler.queue.values.find(x => x.status === levelStatus.live);
	let levelTime = "";
	if (liveLevel) {
		levelTime = GetTimeDiff(new Date(liveLevel.timeStarted), new Date());
	}
	w.document.writeln("<br/>");
	w.document.writeln("<hr/>");
	w.document.writeln("<div>Now Playing   " + levelTime + "</div>");
	w.document.writeln("<hr/>");	
	w.document.writeln(GetOverlayContentFromLevel(liveLevel));	
	w.document.writeln("<br/>");
	
	
	let targetTotalCount = 5; // maximum sum of recent and upcoming
	let targetUpcomingCount = targetTotalCount - recentLevels.length; 
	let upcomingLevels = StorageHandler.queue.values.filter(x => x.status === levelStatus.pending).slice(0,targetUpcomingCount);
	
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
	let w = window.open("", "Chat Log", "width=872,height=476");
	let logMessages = StorageHandler.log.values;
	w.document.writeln("<table>");
	for (let m of logMessages) 
		w.document.writeln("<tr><td>" + (new Date(m.timestamp)).toLocaleDateString() + " " + 
			(new Date(m.timestamp)).toLocaleTimeString() + 
			"</td><td>" + m.username + "</td><td>" + m.reward + "</td><td>" + m.text + "</td></tr>");
	w.document.writeln("</table>");
	StorageHandler.log.clear();
}
function LogChatMessage(m) {
	StorageHandler.log.push(m);
}



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



