"use strict";
var ContestDT = /** @class */ (function () {
    function ContestDT(id, title, description, openEntryTime, votingTime, resultsTime, endTime, status, serverTime, submittedLevel) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.openEntryTime = openEntryTime;
        this.votingTime = votingTime;
        this.resultsTime = resultsTime;
        this.endTime = endTime;
        this.status = status;
        this.serverTime = serverTime;
        this.submittedLevel = submittedLevel;
    }
    return ContestDT;
}());
