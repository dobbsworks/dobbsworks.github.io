"use strict";
var LevelListing = /** @class */ (function () {
    function LevelListing(level, author, wrHolder, isStarted, isCleared, isLiked, isDisliked, personalBestFrames, contestVote, contestRank) {
        this.level = level;
        this.author = author;
        this.wrHolder = wrHolder;
        this.isStarted = isStarted;
        this.isCleared = isCleared;
        this.isLiked = isLiked;
        this.isDisliked = isDisliked;
        this.personalBestFrames = personalBestFrames;
        this.contestVote = contestVote;
        this.contestRank = contestRank;
    }
    return LevelListing;
}());
