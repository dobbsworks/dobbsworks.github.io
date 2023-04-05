"use strict";
var ContestState;
(function (ContestState) {
    ContestState[ContestState["pending"] = 0] = "pending";
    ContestState[ContestState["submissionsOpen"] = 1] = "submissionsOpen";
    ContestState[ContestState["votingOpen"] = 2] = "votingOpen";
    ContestState[ContestState["results"] = 3] = "results";
    ContestState[ContestState["closed"] = 4] = "closed";
})(ContestState || (ContestState = {}));
