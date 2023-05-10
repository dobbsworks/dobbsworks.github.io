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

    public static SaveKeyboardMappings(): void {
        let added = KeyboardHandler.GetNonDefaultMappings();
        let removed = KeyboardHandler.GetRemovedDefaultMappings();

        let objects = [
            ...added.map(a => ({k: a.k, v: a.v.keyCode, s: "+"})),
            ...removed.map(a => ({k: a.k, v: a.v.keyCode, s: "-"}))
        ];

        localStorage.setItem("mapping", JSON.stringify(objects));
    }

    public static LoadKeyboardMappings(): void {
        let mappings = JSON.parse(localStorage.getItem("mapping") || "[]");
        for (let mapping of mappings) {
            let action = <KeyAction>(Object.values(KeyAction).find(a => a.keyCode == mapping.v));
            if (mapping.s == "+") {
                KeyboardHandler.keyMap.push({k: mapping.k, v: action});
            }
            if (mapping.s == "-") {
                KeyboardHandler.keyMap = KeyboardHandler.keyMap.filter(a => !(a.k == mapping.k && a.v == action));
            }
        }
    }

    public static GetPreferenceBool(pref: Preference): boolean {
        let saved = localStorage.getItem("pref-" + pref.key);
        if (saved === null) return pref.defaultValue;
        return saved == "1";
    }
    public static SetPreferenceBool(pref: Preference, newValue: boolean): void {
        let value = newValue ? "1" : "0";
        localStorage.setItem("pref-" + pref.key, value);
    }

    public static GetPreference(key: string, initialValue: string): string {
        let saved = localStorage.getItem("pref-" + key);
        if (saved === null) return initialValue;
        return saved;
    }
    public static SetPreference(key: string, newValue: string): void {
        localStorage.setItem("pref-" + key, newValue);
    }
}

class Preference {
    constructor(public optionText: string, public key: string, public defaultValue: boolean) {}
    
    static ConfirmOnClose: Preference = new Preference("Confirm before closing game", "confirm-close", true);
    static MuteOnLoseFocus: Preference = new Preference("Mute when game is minimized", "mute-on-lose-focus", false);
}