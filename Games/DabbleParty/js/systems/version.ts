class Version {
    static Current = "0.0.0";

    private static Compare(v1: string, v2: string): number {
        let v1Subs = v1.split(".");
        let v2Subs = v2.split(".");
        if (v1 == v2) return 0;
        for (let i = 0; i < v1Subs.length; i++) {
            let v1Sub = +(v1Subs[i]);
            let v2Sub = +(v2Subs[i]);

            if (v1Sub < v2Sub) return -1;
            if (v1Sub > v2Sub) return 1;

            if (isNaN(v1Sub) || isNaN(v2Sub)) {
                if (v1Subs[i] != v2Subs[i]) return v1Subs[i] < v2Subs[i] ? -1 : 1;
            }
        }
        console.error("Unhandled version comparison: ", v1, v2);
        return 0;
    }
}