class DeathLogService {
    static LogDeathCounts() {
        let deathCount = StorageService.PopNextDeathCounter();
        while (deathCount != null) {
            let progressModel = new LevelProgressModel(deathCount.levelCode, 0, deathCount.deathCount);
            DataService.LogLevelPlayDone(progressModel).then((awardsModel) => { });
            deathCount = StorageService.PopNextDeathCounter();
        }
    }
}