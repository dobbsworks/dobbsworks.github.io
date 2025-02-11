"use strict";
function getLevelsFromDB(pageIndex, ordering) {
    var ret = [];
    var levelsPerPage = 50;
    var sorted = _levelDB.sort(function (a, b) { return ordering(b) - ordering(a) > 0 ? 1 : (ordering(b) - ordering(a) < 0 ? -1 : (Math.random() > 0.5 ? 1 : -1)); });
    var _loop_1 = function (i) {
        var author = _userDB.find(function (a) { return a.id == sorted[i].userId; }) || new UserDT(0, "unknown", "", "");
        var wr = _userDB.find(function (a) { return a.id == sorted[i].recordUserId; }) || new UserDT(0, "unknown", "", "");
        ret.push(new LevelListing(sorted[i], author, wr, false, false, false, false, 0, 0, 0));
    };
    for (var i = pageIndex * levelsPerPage; i < (pageIndex + 1) * levelsPerPage && i < _levelDB.length; i++) {
        _loop_1(i);
    }
    return new LevelBrowseResults(ret, ret.length, pageIndex, Math.ceil(_levelDB.length / levelsPerPage));
}
