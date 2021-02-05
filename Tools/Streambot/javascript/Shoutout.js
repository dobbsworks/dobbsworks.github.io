

function CommandShoutout(user, args) {
    let targetUser = args[0].replace("@","");
    if (targetUser) {
        targetUser = targetUser.replace("@","");
        let link = `twitch.tv/${targetUser}`;
        let shoutoutMessage = `Shout-out to ${targetUser}! Watch them at ${link}`;
        let specialShout = StorageHandler.shoutout.getUser(targetUser);
        if (specialShout && specialShout.text) {
            let text = specialShout.text;
            text = text.replace("$link", link);
            text = text.replace("$name", targetUser);
            shoutoutMessage = text;
        }
        ShoutoutAppendCategory(targetUser, shoutoutMessage);
        return {success: true};
    } else {
        return {success: true, message: "WOOO"};
    }
}

function CommandSetShoutout(user, args) {
    let targetUser = args[0].replace("@","");
    let shoutoutText = args.slice(1).join(" ");
    let record = {username: targetUser, text: shoutoutText};
    StorageHandler.shoutout.upsert(record);
    return `Shout-out registered for ${targetUser}.`;
}

function ShoutoutAppendCategory(username, baseText) {
    let request = new XMLHttpRequest();
	let url = `https://decapi.me/twitch/game/${username}`;
	request.open("GET", url, true);
	request.onload = () => {
        let category = request.responseText;
        if (category.indexOf("No user with the name") > -1) {
            category = "Unknown category";
        }
        let shoutout = baseText + ` (${category})`;
        WriteMessage(shoutout);
	}
	request.send();
}