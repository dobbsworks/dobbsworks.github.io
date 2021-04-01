var pointHandler = {
    formatValue: (num) => {
        return num + " !tokens";
    },
    getPoints: (username) => {
        let pointValues = StorageHandler.points.values;
        let userPointObj = pointValues.find(x => x.username.toLowerCase() === username.toLowerCase());
        if (userPointObj) return +(userPointObj.points);
        return 0;
    },
    addPoints: (username, num) => {
        let pointValues = StorageHandler.points.values;
        let userPointObj = pointValues.find(x => x.username.toLowerCase() === username.toLowerCase());
        if (userPointObj) {
            userPointObj.points = +(userPointObj.points) + num;
        } else {
            pointValues.push({ username: username, points: num });
        }
        StorageHandler.points = pointValues;
    },
    deductPoints: (username, num) => {
        let pointValues = StorageHandler.points.values;
        let userPointObj = pointValues.find(x => x.username.toLowerCase() === username.toLowerCase());
        if (userPointObj) {
            userPointObj.points = +(userPointObj.points) - num;
        } else {
            pointValues.push({ username: username, points: num });
        }
        StorageHandler.points = pointValues;
    },
    canAfford: (username, num) => {
        let points = pointHandler.getPoints(username);
        return points >= num;
    }
};

function CommandAddPoints(user, args) {
    let username = args[0].replace("@", "");
    let pointValue = +(args[1]);
    if (isNaN(pointValue)) {
        pointValue = +(args[0]);
        username = args[1].replace("@", "");
        if (isNaN(pointValue)) {
            return { success: false, message: `${pointValue} is not a number. Usage: !addpoints @user num` }
        }
    }
    pointHandler.addPoints(username, pointValue);
    return { success: true, message: `Added ${pointValue} tokens.` };
}

function CommandGivePoints(user, args) {
    let targetUsername = args[0].replace("@", "");
    let pointValue = +(args[1]);
    if (isNaN(pointValue)) {
        pointValue = +(args[0]);
        targetUsername = args[1].replace("@", "");
        if (isNaN(pointValue)) {
            return { success: false, message: `${pointValue} is not a number. Usage: !give @user num` }
        }
    }
    if (pointValue < 0) {
        return { success: false, message: `Nice try.` }
    }
    if (pointValue % 1) {
        return { success: false, message: `Integers please.` }
    }
    let sourceUsername = user.username;
    let sourcePoints = pointHandler.getPoints(sourceUsername);
    let text = pointHandler.formatValue(pointValue);
    if (sourcePoints < pointValue) {
        return { success: false, message: `You do not have ${text} to give.` }
    } else {
        pointHandler.deductPoints(sourceUsername, pointValue);
        pointHandler.addPoints(targetUsername, pointValue);
        return { success: true, message: `${text} given to ${targetUsername}.` }
    }
}

function CommandGetPoints(user, args) {
    let targetUsername = user.username;
    if (args[0]) {
        targetUsername = args[0].replace("@", "");
    }
    let num = pointHandler.getPoints(targetUsername);
    let text = pointHandler.formatValue(num);
    let watchFor = [69, 420, 42069, 69420, 1337];
    let tag = (watchFor.indexOf(num) > -1) ? " Ha, nice." : "";
    if (targetUsername === user.username) {
        return { success: true, message: `You currently have ${text}.${tag}` };
    } else {
        return { success: true, message: `${targetUsername} currently has ${text}.${tag}` };
    }
}

function CommandGetTokens(user, args) {
    pointHandler.addPoints(user.username, 250);
    return { success: true, message: "Your account has been credited 250 tokens." };
}

function CommandGetLotsOfTokens(user, args) {
    pointHandler.addPoints(user.username, 2000);
    return { success: true, message: "Your account has been credited 2,000 tokens." };
}

function CommandGetTooManyTokens(user, args) {
    pointHandler.addPoints(user.username, 10000);
    return { success: true, message: "Your account has been credited 10,000 tokens." };
}




// Example point calls

// pointHandler.getPoints("dobbsworks")
// pointHandler.addPoints("dobbsworks", 100)
// pointHandler.deductPoints("dobbsworks", 100)


/* example point schema
    [
        {"username": "dobbsworks", "points": 100},
        {"username": "testUser", "points": 2000}
    ]
*/