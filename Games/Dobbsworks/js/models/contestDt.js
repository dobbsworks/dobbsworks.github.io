"use strict";
var ContestDT = /** @class */ (function () {
    function ContestDT(id, title, description, openEntryTime, votingTime, resultsTime, endTime, status, submittedLevel, isHidden) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.openEntryTime = openEntryTime;
        this.votingTime = votingTime;
        this.resultsTime = resultsTime;
        this.endTime = endTime;
        this.status = status;
        this.submittedLevel = submittedLevel;
        this.isHidden = isHidden;
    }
    return ContestDT;
}());
