


/////////////////////////////////////////////////
// MESSAGE PROCESSING
/////////////////////////////////////////////////

function ProcessMessages() {
	let chatMessages = Array.from(document.getElementsByClassName("chat-line__message")).filter(m => !m.classList.contains("processed"));
	for (let message of chatMessages) {
		ProcessChatMessage(message, false);
	}
	let rewardMessages = Array.from(document.getElementsByClassName("user-notice-line")).filter(m => !m.classList.contains("processed"));
	for (let message of rewardMessages) {
		ProcessChatMessage(message, true);
	}

	let activityToProcess = FindActivityMessagesToProcess();
	for (let message of activityToProcess) {
		ProcessActivityMessage(message);
	}
}
function ProcessChatMessage(messageEl, isReward) {
	let textFragments = Array.from(messageEl.querySelectorAll(".text-fragment, .chat-image, .mention-fragment, .link-fragment"));
	let stitchedText = textFragments.map(x => x.innerText || x.alt).join("");
	let selectedReward = messageEl.children[0].innerText.split("\n")[0].replace("Redeemed ", "");

	// don't want to parse first time chat message as a message
	if (selectedReward == "First Time Chat from viewer") return;

	let badges = Array.from(messageEl.getElementsByClassName("chat-badge")).map(x => x.alt);

	let username = "";
	let usernameEl = messageEl.getElementsByClassName("chat-line__username");
	if (usernameEl.length) {
		username = usernameEl[0].innerText;
	} else {
		username = selectedReward.split(" ")[0];
		selectedReward = selectedReward.replace(username + " redeemed ", "");
	}

	LogChatMessage({ timestamp: new Date(), text: stitchedText, username: username, reward: isReward ? selectedReward : "" });

	// collect data on how much special chars is too many
	MonitorSpecialChars(username, stitchedText);

	// ban manofsteel
	Kryptonite(username);

	// Need to mark as present BEFORE processing command
	MarkUserAsPresent(username);

	MinigameHandler.ProcessText(username, stitchedText);

	ProcessCommand(username, stitchedText, false, badges);
	if (selectedReward.length > 0) {
		ProcessCommand(username, "!" + selectedReward.replace(/ /g, '') + " " + stitchedText, true, badges);
	}
	messageEl.classList.add("processed");

	let bitTotal = Array.from(messageEl.querySelectorAll(".chat-line__message--cheer-amount")).map(x => +(x.innerText)).reduce((a, b) => a + b, 0);
	if (bitTotal >= 5) {
		let trimmed = stitchedText;
		let cheerTypes = ["Cheer", "Pogchamp", "BibleThump", "cheerwhal", "Corgo", "uni", "ShowLove", "Party", "SeemsGood", "Pride", "Kappa", "FrankerZ", "HeyGuys", "DansGame", "EleGiggle", "TriHard", "Kreygasm", "4Head", "SwiftRage", "NotLikeThis", "FailFish", "VoHiYo", "PJSalt", "MrDestructoid", "bday", "RIPCheer", "Shamrock"];
		for (let cheerType of cheerTypes) {
			let myRe = new RegExp(cheerType + ' [\d]*', 'g');
			trimmed = trimmed.replace(myRe, "")
		}
		TTSMessage(trimmed, username, false);
	}
}

function MonitorSpecialChars(username, message) {
	if (username.toLowerCase() == "dobbsworks") return;
	let normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
	let normalCount = 0;
	for (let char of message.split('')) {
		if (normalChars.indexOf(char.toUpperCase()) > -1) {
			normalCount++;
		}
	}
	let normalRatio = normalCount / message.length;
	if (normalRatio < 0.2 && message.length > 20) {
		StorageHandler.alpharatio.push({
			username: username,
			text: message,
			normalRatio: normalRatio,
			timestamp: new Date()
		});
		WriteMessageRaw("/timeout " + username + " 10 spam");
	}
}

var bannedUsernames = ["manofsteel", "mrsteal", "ladyvalkyrie", "mannasteal", "certinalynot_mos"];
var notificationBlockedUsernames = ["hoss", "h0ss", "0312"]
function Kryptonite(username) {
	// check username against known manofsteel account patterns, ban
	if (!username) return false;
	username = username.toLowerCase();
	for (let bannedUsername of bannedUsernames) {
		let target = bannedUsername.toLowerCase();
		// search username for substring
		if (username.indexOf(target) > -1) {
			setTimeout(() => {
				WriteMessageRaw("/ban " + username);
			}, 100)
			return true;
		}
	}
	for (let bannedUsername of notificationBlockedUsernames) {
		let target = bannedUsername.toLowerCase();
		if (username.indexOf(target) > -1) {
			return true;
		}
	}
	return false;
}

function ProcessCommand(username, commandText, isReward, badges) {
	let user = {
		username: username,
		badges: badges,
		isSub: badges && badges.some(x => x.toLowerCase().indexOf("subscriber") > -1),
		isMod: badges && badges.some(x => x.toLowerCase().indexOf("moderator") > -1)
	};
	if (commandText.length < 2) return;
	let commandArgs = commandText.split(" ");
	let commandName = commandArgs.splice(0, 1)[0].toLowerCase();
	if (commandName[0] !== "!") return;
	let matchingCommands = GetCommandsByName(commandName.replace("!", ""));

	if (matchingCommands.length === 0 && !isReward) {
		StorageHandler.invalidCommand.push({
			username: username,
			text: commandText,
			timestamp: new Date()
		})
	}

	for (let command of matchingCommands) {
		let hasValidPermission = false;

		if (command.permissions === commandPermission.all) hasValidPermission = true;

		if (command.permissions === commandPermission.subscriber) {
			if (user.isSub) hasValidPermission = true;
		}
		if (command.permissions === commandPermission.mod) {
			if (user.isMod) hasValidPermission = true;
		}
		if (command.permissions === commandPermission.reward) {
			if (isReward) hasValidPermission = true;
		}
		if (username === streamerName) hasValidPermission = true;

		if (hasValidPermission) {
			try {

				if (command.cost) {
					if (!pointHandler.canAfford(username, command.cost)) {
						WriteMessage("@" + username + ", this reward costs " + pointHandler.formatValue(command.cost) + ", you can't afford it!");
						break;
					}
				}

				let func = typeof command.func === "string" ? window[command.func] : command.func;
				if (!func) return "Uh-oh, this command went missing."
				let response = func(user, commandArgs);

				let responseText = "";
				if (response && response.length) {
					responseText = response;
				} else if (response && typeof response === "object") {
					// handle success/fail object
					responseText = response.message;
					if (response.success && command.cost) {
						responseText = `[-${command.cost} tokens] ${responseText}`;
						pointHandler.deductPoints(username, command.cost);
					}
				}

				if (username !== streamerName && responseText) {
					responseText = responseText.charAt(0).toLowerCase() + responseText.slice(1);
					responseText = "@" + username + ", " + responseText;
				}
				if (responseText) WriteMessage(responseText);
			} catch (err) {
				console.error(err);
			}
			// run first valid command
			break;
		}
	}
}

function CommandSay(user, args) {
	WriteMessage(args.join(' '));
}

function WriteMessage(message) {
	WriteMessageRaw(" dobbswBeepBoop " + message);
}

function WriteMessageRaw(message) {
	let chatInput = document.getElementsByTagName('textarea')[0];
	let chatButton = [...document.getElementsByTagName('button')].find(x => x.innerText === "Chat");

	let oldValue = chatInput.value;
	SetInputValue(chatInput, message);
	chatButton.click();
	SetInputValue(chatInput, oldValue);
}

function SetInputValue(inputEl, value) {
	// simulates user input to work with React
	var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
	nativeInputValueSetter.call(inputEl, value);

	var ev2 = new Event('input', { bubbles: true });
	inputEl.dispatchEvent(ev2);
}

function OnBroadcastMessage(message) {
	// messages from the queue window panel
	ProcessCommand(streamerName, message.data, false, []);
}

function FindActivityMessagesToProcess() {
	let messages = Array.from(document.getElementsByClassName("activity-base-list-item"));
	let toProcess = messages.filter(m => !m.classList.contains("processed"));
	return toProcess;
}
function ProcessActivityMessage(messageEl) {
	let line1 = messageEl.querySelector(".tw-link").textContent;
	let line2 = messageEl.querySelector(".activity-base-list-item__subtitle span").textContent;
	let time = messageEl.querySelector(".activity-base-list-item__subtitle > span:last-child").textContent;
	
	if (time.indexOf("day") === -1 && time.indexOf("month") === -1 && time.indexOf("hour") === -1) {
		// Follows
		if (line2 === "Followed you") {
			let user = line1;
			let userIsBanned = Kryptonite(user);
			if (!userIsBanned) {
				let alertText = user + " is now following!";
				marqueeWindow.AddAlert(alertText, "rgb(0,255,128)");
			}
		}
		// Bits
		if (line2.startsWith("Cheered ") && line2.toLowerCase().indexOf(" bit") > -1) {
			let user = line1;
			let alertText = user + " " + line2.toLowerCase() + "!";
			marqueeWindow.AddAlert(alertText, "rgb(0,128,255)");
		}
		// Raids
		if (line2.startsWith("Raided you ")) {
			let user = line1;
			let alertText = user + " is raiding!";
			marqueeWindow.AddAlert(alertText, "rgb(128,128,255)");
			CommandShoutout(null, [user]);
		}
		// Subscribe
		if (line2.startsWith("Subscribed ")) {
			let user = line1;
			let alertText = user + " " + line2.toLowerCase() + "!";
			marqueeWindow.AddAlert(alertText, "rgb(128,0,255)");
		}
		// Gift sub
		if (line2.startsWith("Gave out ")) {
			let user = line1;
			let alertText = user + " " + line2.replace("Gave ", "gave") + "!";
			marqueeWindow.AddAlert(alertText, "rgb(255,0,128)");
		}
	}
	messageEl.classList.add("processed");
}