var pointHandler = {
    formatValue: (num) => {
        return num + " token" + (num === 1 ? "" : "s");
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