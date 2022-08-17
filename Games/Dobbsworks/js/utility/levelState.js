"use strict";
var LevelState;
(function (LevelState) {
    LevelState[LevelState["pending"] = 0] = "pending";
    LevelState[LevelState["cleared"] = 1] = "cleared";
    LevelState[LevelState["live"] = 2] = "live";
    LevelState[LevelState["removed"] = 3] = "removed";
})(LevelState || (LevelState = {}));
