class StorageService {

    public static GetSavedLevel(slot: number): { level: string, thumb: string } {
        return {
            level: localStorage.getItem("save_" + slot) || "",
            thumb: localStorage.getItem("thumb_" + slot) || ""
        };
    }
    public static SetSavedLevel(slot: number, level: string, thumb: string): boolean {
        try {
            localStorage.setItem("save_" + slot, level);
            localStorage.setItem("thumb_" + slot, thumb);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public static IncrementDeathCounter(levelCode: string): number {
        let allDeathCounts = <DeathCounter[]>JSON.parse(localStorage.getItem("deaths") || "[]");
        let thisLevelCounter = allDeathCounts.find(a => a.levelCode == levelCode);
        if (!thisLevelCounter) {
            thisLevelCounter = {levelCode: levelCode, deathCount: 0};
            allDeathCounts.push(thisLevelCounter);
        }
        thisLevelCounter.deathCount++;
        localStorage.setItem("deaths", JSON.stringify(allDeathCounts));
        return thisLevelCounter.deathCount;
    }

    public static PopDeathCounter(levelCode: string): number {
        let allDeathCounts = <DeathCounter[]>JSON.parse(localStorage.getItem("deaths") || "[]");
        let thisLevelCounter = allDeathCounts.find(a => a.levelCode == levelCode);
        allDeathCounts = allDeathCounts.filter(a => a.levelCode != levelCode);
        localStorage.setItem("deaths", JSON.stringify(allDeathCounts));
        return thisLevelCounter ? thisLevelCounter.deathCount : 0;
    }

    public static GetMusicVolume(): number {
        return +(localStorage.getItem("musicVol") || "75");
    }
    public static GetSfxVolume(): number {
        return +(localStorage.getItem("sfxVol") || "65");
    }
    public static SetMusicVolume(val: number): void {
        if (val < 0 || val > 100) throw "Invalid volume level";
        localStorage.setItem("musicVol", val.toString());
    }
    public static SetSfxVolume(val: number): void {
        if (val < 0 || val > 100) throw "Invalid volume level";
        localStorage.setItem("sfxVol", val.toString());
    }

    // TODO, Get all death counts on app load

}