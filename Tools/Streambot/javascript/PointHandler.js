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
            pointValues.push({username: username, points: num});
        }
        StorageHandler.points = pointValues;
    },
    deductPoints: (username, num) => {
        let pointValues = StorageHandler.points.values;
        let userPointObj = pointValues.find(x => x.username.toLowerCase() === username.toLowerCase());
        if (userPointObj) {
            userPointObj.points = +(userPointObj.points) - num;
        } else {
            pointValues.push({username: username, points: num});
        }
        StorageHandler.points = pointValues;
    },
    canAfford: (username, num) => {
        let points = pointHandler.getPoints(username);
        return points >= num;
    }
};

function CommandAddPoints(user, args) {
    let username = args[0];
    let pointValue = +(args[1]);
    pointHandler.addPoints(username, pointValue);
    return {success: true, message: `Added ${pointValue} tokens.`};
}

function CommandGetPoints(user, args) {
    let num = pointHandler.getPoints(user.username);
    let text = pointHandler.formatValue(num);
    return {success: true, message: "You currently have " + text + "."};
}

function CommandGetTokens(user, args) {
    pointHandler.addPoints(user.username, 250);
    return {success: true, message: "Your account has been credited 250 tokens."};
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