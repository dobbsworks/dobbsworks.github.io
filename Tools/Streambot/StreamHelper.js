let users = [];
let isQueueOpen = true;
let queueWindow = null;
let overlayWindow = null;
let marqueeWindow = null;
let ironSwornWindow = null;
let streamerName = "dobbsworks";
var StorageHandler;

let commandPermission = {       // TODO VIP?
	"all": "all",
	//"follower": "follower",     // doesn't work yet
	"subscriber": "subscriber",
	"mod": "mod",
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
		let now = new Date();
		let targetEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12 + 9, 28, 0);
		setTimeout(() => {
			WriteMessage("BEEP BOOP! Dobbs needs to end stream soon! Everyone bug him about it! GivePLZ GivePLZ GivePLZ")
		}, targetEnd - now);
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
		"IronswornData.js",
		"PointHandler.js",
		"SoundboardHandler.js",
		"Shoutout.js",
		"TextToSpeechHandler.js",
		"8ball.js",
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
let aliases = [];
function LoadCommands() {
	commands = [
		Command("add", "CommandAddLevel", commandPermission.all, commandDisplay.chat, "Add a level to the queue. Usage: !add LEV-ELC-ODE"),
		Command("afk", "CommandAfk", commandPermission.all, commandDisplay.chat, "Mark yourself as AFK so that your level doesn't get played until you get back."),
		Command("notspam", "CommandNotSpam", commandPermission.all, commandDisplay.hidden),
		Command("spam", "CommandSpam", commandPermission.mod, commandDisplay.hidden),
		Command("spamlist", "CommandSpamList", commandPermission.mod, commandDisplay.hidden),
		Command("reserve", "CommandReserve", commandPermission.all, commandDisplay.chat, "Reserve a spot in the queue without a code. Usage: !reserve"),
		Command("replace", "CommandChangeLevel", commandPermission.all, commandDisplay.hidden, "Change your queued level id. Usage: !change LEV-ELC-ODE"),
		Command("leave", "CommandLeaveQueue", commandPermission.all, commandDisplay.chat, "Remove your levels from the queue."),
		Command("clearqueue", "CommandClearOldLevels", commandPermission.streamer, commandDisplay.panel),
		MessageCommand("position", "Levels are processed in a semi-random order. The longer you're in the queue, the better your chance! Use !slice to check your current chances."),
		Command("slice", "CommandSlice", commandPermission.all, commandDisplay.chat, "Check your level's chance of being chosen next. Usage: !slice"),

		MessageCommand("splice", "you might mean !slice"),
		MessageCommand("spliceup", "you might mean !sliceup"),
		MessageCommand("slicedown", "wow dude. Harsh."),
		MessageCommand("ban", "mods can use the built-in command: /ban "),
		MessageCommand("lurk", "cool 🐢"),

		Command("help", "CommandHelp", commandPermission.all, commandDisplay.hidden),
		Command("list", "CommandList", commandPermission.all, commandDisplay.chat, "Displays the upcoming levels from the queue."),
		Command("current", "CommandCurrent", commandPermission.all, commandDisplay.chat, "Displays information about the level being played."),
		Command("complete", "CommandComplete", commandPermission.streamer, commandDisplay.panel),
		Command("skip", "CommandSkip", commandPermission.streamer, commandDisplay.panel),
		Command("next", "CommandNext", commandPermission.streamer, commandDisplay.panel),
		Command("randomnext", "CommandRandomNext", commandPermission.streamer, commandDisplay.panel),
		Command("freeze", "CommandFreezeLevel", commandPermission.streamer, commandDisplay.panel),
		Command("randomwin", "CommandRandomWin", commandPermission.streamer, commandDisplay.hidden),
		Command("bonusprize", "CommandBonusPrize", commandPermission.streamer, commandDisplay.hidden),
		Command("resettimer", "CommandResetTimer", commandPermission.streamer, commandDisplay.panel),
		Command("roll", "CommandRoll", commandPermission.all, commandDisplay.chat, "Roll the dice! Usage: !roll d6, !roll d20+3"),
		Command("8ball", "Command8Ball", commandPermission.all, commandDisplay.chat, "Ask your question! Usage: !8ball Does Billy like me?"),
		Command("open", "CommandOpenQueue", commandPermission.streamer, commandDisplay.panel),
		Command("close", "CommandCloseQueue", commandPermission.streamer, commandDisplay.panel),
		//Command("secondqueueslot", "CommandQueueSlot", commandPermission.reward, commandDisplay.hidden),
		Command("biggerwheelslice", "CommandBiggerSlice", commandPermission.reward, commandDisplay.hidden),
		RewardCommand(500, "sliceup", "CommandBiggerSlice", commandPermission.all, "Increases the chance of your level being chosen on the wheel. Lasts until your level is chosen."),
		RewardCommand(2500, "setmakerid", "CommandSetMakerId", commandPermission.all, "Sets your maker id. Once set, you can use !add without an id to queue the saved id. Usage: !setmakerid MYM-AKE-RID"),
		Command("addcom", "CommandAddCommand", commandPermission.mod, commandDisplay.hidden, "Adds a text command for the duration of the stream. Usage: !addcom myCom This is the response"),

		Command("texttospeech", "CommandTTS", commandPermission.reward, commandDisplay.hidden),
		Command("tts", "CommandTTS", commandPermission.streamer, "Makes the computer voice say a thing hehe"),

		Command("minigame", "CommandMinigame", commandPermission.mod, commandDisplay.hidden),
		MessageCommand("minigame", "Compete for bonus tokens! Use !guess YOUR ANSWER to take a stab at solving the puzzle."),
		Command("guess", "CommandMinigameGuess", commandPermission.all, commandDisplay.hidden),

		Command("tickeradd", "CommandTickerAdd", commandPermission.mod, commandDisplay.hidden),
		Command("tickerlist", "CommandTickerList", commandPermission.mod, commandDisplay.hidden),
		Command("tickerremove", "CommandTickerRemove", commandPermission.mod, commandDisplay.hidden),

		Command("debugadd", "CommandDebugAdd", commandPermission.streamer, commandDisplay.hidden),
		Command("as", "CommandAs", commandPermission.streamer, commandDisplay.hidden),
		Command("exportchat", "CreateChatLogWindow", commandPermission.streamer, commandDisplay.panel),

		MessageCommand("maker", "My maker id is: S2C-HX7-01G"),
		MessageCommand("priority", "Your level will cut ahead of any level that isn't in the priority queue. Note that you need to already have your level in the queue before redeeming this reward!"),
		MessageCommand("bot", "Hello there, I'm the bot! Dobbs wrote me in JavaScript of all things. I handle the level queue and stuff. Sometimes I break for no good reason! Kappa"),
		MessageCommand("schedule", "all times in Eastern: Mon 8:30PM, Wed 5PM, Sat 2PM. Mario Maker every stream except Monday."),

		MessageCommand("wheel", "Instead of taking levels in order, we'll go randomly. Your chances of being chosen are based on how long you've been in the queue."),
		MessageCommand("discord", "Join the discord here: https://discord.gg/cdPmKUP"),
		MessageCommand("youtube", "Technically there is a YouTube channel, but it's just VOD exports: https://www.youtube.com/channel/UCV-i_rqdTGBMYzxzrrephSw"),
		MessageCommand("twitch", "Really? Sure, whatever. Catch me on Twitch here: https://www.twitch.tv/dobbsworks/"),
		MessageCommand("phasetendo", "PhaseTendo is a MM2 game by LurkingTurtleGaming. In normal endless, you race to complete extra clear conditions to advance, such as collecting no coins or not killing any enemies."),

		MessageCommand("charity", "I'm setting aside $25 of cash every stream that you can have me spend towards the channel's selected charity. Check the channel points for what we're supporting."),
		MessageCommand("horse", "honse"),
		MessageCommand("plunk", "plunk successful, thank you."),
		MessageCommand("disney", "https://disneydunces.podbean.com/"),
		MessageCommand("moonrover", "Moon Rover is a vanilla JS game built from chat's suggestions. Play the latest version here: https://dobbsworks.github.io/Games/MoonRover/"),

		Command("gettokens", "CommandGetTokens", commandPermission.reward, commandDisplay.hidden),
		Command("getlotsoftokens", "CommandGetLotsOfTokens", commandPermission.reward, commandDisplay.hidden),
		Command("gettoomanytokens", "CommandGetTooManyTokens", commandPermission.reward, commandDisplay.hidden),

		Command("addpoints", "CommandAddPoints", commandPermission.streamer, commandDisplay.hidden),
		Command("give", "CommandGivePoints", commandPermission.all, commandDisplay.chat, "Give !tokens to another user. Usage: !give @user 100"),
		Command("points", "CommandGetPoints", commandPermission.all, commandDisplay.chat),


		Command("rewards", "CommandRewards", commandPermission.all, commandDisplay.chat, "Get information about the things you can spend !tokens on."),

		RewardCommand(100, "wheelcolor", "CommandWheelColor", commandPermission.all, "Sets the color for your slice of the !wheel. Example: !wheelcolor red OR !wheelcolor #AA5D00"),
		RewardCommand(250, "wheelpattern", "CommandWheelPattern", commandPermission.all, "Sets the background pattern for your slice of the !wheel. Lasts one hour for non-subs. Example: !wheelpattern star"),
		MessageCommand("pattern", "uh, !wheelpattern maybe?"),

		Command("getalevelidea", "CommandLevelIdea", commandPermission.reward, commandDisplay.hidden, "Generates a random level idea."),
		RewardCommand(25, "levelidea", "CommandLevelIdea", commandPermission.all, "Generates a random level idea."),

		RewardCommand(100, "sound", "CommandSoundBoard", commandPermission.all, "Play a sound. Use !sounds for a list of options."),
		RewardCommand(75, "soundrandom", "CommandSoundBoardRandom", commandPermission.all, "Play a random sound from the soundboard. Use !sound to play a specific sound."),
		Command("soundlist", "CommandSoundList", commandPermission.all, "Display sounds for !soundboard"),

		Command("so", "CommandShoutout", commandPermission.mod, commandDisplay.hidden, "Usage: !so username"),
		Command("setshoutout", "CommandSetShoutout", commandPermission.mod, commandDisplay.hidden, "Usage: !so username Shout-out to $name!"),
		Command("transfer", "CommandTransfer", commandPermission.mod, commandDisplay.hidden, "Transfers points, wheel color, etc to a new username (for when a user's name changes). Usage: !transfer oldName newName"),

		Command("ironprogress", "CommandIronswornProgressRoll", commandPermission.streamer, commandDisplay.hidden, "Roll an Ironsworn progress check."),
		Command("ironroll", "CommandIronswornRoll", commandPermission.all, commandDisplay.hidden, "Roll an Ironsworn action."),
		Command("ironreroll", "CommandIronswornReroll", commandPermission.all, commandDisplay.hidden, "Reroll an Ironsworn action."),
		Command("say", "CommandSay", commandPermission.streamer, commandDisplay.hidden, "Broadcast message."),
		Command("moves", "CommandIronswornMoves", commandPermission.all, commandDisplay.hidden, "Check an Ironsworn move."),
		Command("assets", "CommandIronswornAssets", commandPermission.all, commandDisplay.hidden, "Check an Ironsworn asset."),
		Command("oracle", "CommandIronswornOracle", commandPermission.streamer, commandDisplay.hidden, "Roll on an oracle table."),
	];
	aliases = [
		AliasCommand("brb", "afk"),
		AliasCommand("change", "replace"),
		AliasCommand("remove", "leave"),
		AliasCommand("odds", "slice"),
		AliasCommand("commands", "help"),
		AliasCommand("queue", "list"),
		AliasCommand("makerid", "maker"),
		AliasCommand("id", "maker"),
		AliasCommand("shop", "rewards"),
		AliasCommand("reward", "rewards"),
		AliasCommand("pos", "position"),
		AliasCommand("sounds", "soundlist"),
		AliasCommand("sfx", "soundlist"),
		AliasCommand("givepoints", "give"),
		AliasCommand("givetokens", "give"),
		AliasCommand("tokens", "points"),
		AliasCommand("credits", "points"),
		AliasCommand("tickets", "points"),
		AliasCommand("rover", "moonrover"),
		AliasCommand("coins", "points"),
		AliasCommand("answer", "guess"),
		AliasCommand("move", "moves"),
		AliasCommand("asset", "assets"),
		AliasCommand("oracles", "oracle"),
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
	return Command(args[0], () => { return args[1] }, commandPermission.all, commandDisplay.hidden);
}

function RewardCommand(...args) {
	return Command(args[1], args[2], args[3], commandDisplay.reward, args[4], args[0]);
}

function AliasCommand(alias, targetCommandName) {
	return { alias: alias, targetCommandName: targetCommandName };
}

function GetCommandsByName(commandName) {
	let allCommandNames = [
		...(aliases.filter(x => x.alias.toLowerCase() === commandName.toLowerCase()).map(x => x.targetCommandName)),
		commandName
	].map(x => x.toLowerCase());
	return commands.filter(x => allCommandNames.indexOf(x.name.toLowerCase()) > -1);
}

function CommandHelp(user, args) {
	let commName = args[0];
	if (commName) {
		let command = GetCommandsByName(commName)[0];
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
		let command = GetCommandsByName(commName)[0];
		if (command) {
			let text = command.help;
			if (!text) text = "";
			return text + " Costs " + pointHandler.formatValue(command.cost);
		} else {
			return "No information found for command " + commName;
		}
	} else {
		let commandsToDisplay = commands.filter(x => x.cost);
		let commandList = commandsToDisplay.map(x => `!${x.name} [${x.cost}]`).join(", ");
		return 'Use "!rewards commandName" for more info about a command. Commands: ' + commandList;
	}
}

function CommandAddCommand(user, args) {
	let newCommandName = args[0];
	let newCommandResponse = args.slice(1).join(" ");
	let newCommand = Command(newCommandName, () => { return newCommandResponse }, commandPermission.all, commandDisplay.hidden);
	commands.push(newCommand);
	return "Command successfully registered!";
}



function CommandAs(user, args) {
	let asUser = args[0].replace("@", "");
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
	let w = window.open("", "Queue", "width=800,height=900,left=1100");

	let request = new XMLHttpRequest();
	let url = "https://dobbsworks.github.io/Tools/Streambot/controlPanel.html?q=" + (+(new Date()));
	request.open("GET", url, true);
	request.onload = () => {
		w.document.write(request.responseText);
		setTimeout(() => {
			let buttonCommands = commands.filter(x => x.display === commandDisplay.panel);
			for (let buttonCommand of buttonCommands) {
				w.window.CreateHeaderButton(buttonCommand.name);
			}
		}, 100);
	}
	request.send();

	return w;
}

/////////////////////////////////////////////////
// OVERLAY PANEL
/////////////////////////////////////////////////

function CreateOverlayWindow() {
	let w = window.open("", "Overlay", "width=172,height=476,left=1740");

	let request = new XMLHttpRequest();
	let url = "https://dobbsworks.github.io/Tools/Streambot/sidebar.html?q=" + (+(new Date()));
	request.open("GET", url, true);
	request.onload = () => {
		w.document.write(request.responseText);
	}
	request.send();

	return w;
}

/////////////////////////////////////////////////
// IRONSWORN PANEL
/////////////////////////////////////////////////

function CreateIronswornWindow() {
	let w = window.open("", "Dice Roller", "width=950,height=600,left=1740");

	let request = new XMLHttpRequest();
	let url = "https://dobbsworks.github.io/Tools/Streambot/ironsworn.html?q=" + (+(new Date()));
	request.open("GET", url, true);
	request.onload = () => {
		w.document.write(request.responseText);
	}
	request.send();

	return w;
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

	// snapshot of point totals		
	w.document.writeln("<tr><td>" + localStorage.points + "</td></tr>");
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
	return min + Math.floor(Math.random() * (1 + max - min))
}

function RandomWeightedFrom(list, weightFunc) {
	let weightTotal = list.map(weightFunc).reduce((a, b) => a + b, 0);
	let randomIndex = RandomNumber(1, weightTotal);
	let cumulativeWeight = 0;
	for (let item of list) {
		cumulativeWeight += weightFunc(item);
		if (cumulativeWeight >= randomIndex) return item;
	}
	return null;
}

Initialize();



