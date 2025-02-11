function getLevelsFromDB(pageIndex: number, ordering: (level: LevelDT) => number): LevelBrowseResults {
    var ret: LevelListing[] = []
    var levelsPerPage = 50
    var sorted = _levelDB.sort((a,b) => ordering(b) - ordering(a) > 0 ? 1 : (ordering(b) - ordering(a) < 0 ? -1 : (Math.random() > 0.5 ? 1 : -1)))
    for (let i = pageIndex * levelsPerPage; i < (pageIndex + 1) * levelsPerPage && i < _levelDB.length; i++) {
        let author = _userDB.find(a => a.id == sorted[i].userId) || new UserDT(0, "unknown", "", "");
        let wr = _userDB.find(a => a.id == sorted[i].recordUserId) || new UserDT(0, "unknown", "", "");
        ret.push(new LevelListing(sorted[i], author, wr, false, false, false, false, 0, 0, 0));
    }
    return new LevelBrowseResults(ret, ret.length, pageIndex, Math.ceil(_levelDB.length / levelsPerPage));
}