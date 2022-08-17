"use strict";
var LevelDT = /** @class */ (function () {
    function LevelDT(code, userId, timestamp, name, description, levelData, thumbnail, recordFrames, recordUserId, firstClearUserId, numberOfClears, numberOfAttempts, numberOfUniquePlayers, numberOfLikes, numberOfDislikes, levelState, username) {
        this.code = code;
        this.userId = userId;
        this.timestamp = timestamp;
        this.name = name;
        this.description = description;
        this.levelData = levelData;
        this.thumbnail = thumbnail;
        this.recordFrames = recordFrames;
        this.recordUserId = recordUserId;
        this.firstClearUserId = firstClearUserId;
        this.numberOfClears = numberOfClears;
        this.numberOfAttempts = numberOfAttempts;
        this.numberOfUniquePlayers = numberOfUniquePlayers;
        this.numberOfLikes = numberOfLikes;
        this.numberOfDislikes = numberOfDislikes;
        this.levelState = levelState;
        this.username = username;
    }
    return LevelDT;
}());
