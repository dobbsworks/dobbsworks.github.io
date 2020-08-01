

function CommandShoutout(user, args) {
    let targetUser = args[0];
    if (targetUser) {
        targetUser = targetUser.replace("@","");
        let link = `twitch.tv/${targetUser}`;
        let specialShout = StorageHandler.shoutout.getUser(targetUser);
        if (specialShout && specialShout.text) {
            let text = specialShout.text;
            text = text.replace("$link", link);
            text = text.replace("$name", targetUser);
            return text;
        } else {
            return `Generic shout-out to ${targetUser}, watch them at ${link}`;
        }
    } else {
        return "WOOO";
    }
}

function CommandSetShoutout(user, args) {
    let targetUser = args[0];
    let shoutoutText = args.slice(1).join(" ");
    let record = {username: targetUser, text: shoutoutText};
    StorageHandler.shoutout.upsert(record);
    return `Shout-out registered for ${targetUser}.`;
}