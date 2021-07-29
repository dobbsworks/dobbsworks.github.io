


/////////////////////////////////////////////////
// SPAM BLOCK
/////////////////////////////////////////////////

function CommandSpam(user, args) {
	let targetUser = args[0].replace("@","");
	if (StorageHandler.spamUsers.values.indexOf(targetUser) > -1) {
		return "User " + targetUser + " is already flagged for possible spam.";
	} else {
		AddSpamUser(targetUser);
		return "User " + targetUser + " has been flagged for possible spam.";
	}
}

function CommandSpamList(user, args) {
	return "The following users have been flagged for possible spam: " + StorageHandler.spamUsers.values.join(", ");
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
function AddSpamUser(user) {
	StorageHandler.spamUsers.push(user);
}
function RemoveSpamUser(username) {
	let spamUsers = StorageHandler.spamUsers.values;
	let userRemovedFromSpamList = false;
	for (let i=0; i<spamUsers.length; i++) {
		if (spamUsers[i].toLowerCase() === username.toLowerCase()) {
			spamUsers.splice(i, 1);
			userRemovedFromSpamList = true;
		}
	}
	StorageHandler.spamUsers = spamUsers;
	return userRemovedFromSpamList;
}