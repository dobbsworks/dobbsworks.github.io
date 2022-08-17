class BenchmarkService {

    static timestamps: KeyedTime[] = []
    static lastTimestamp: number = 0;
    static keys: string[] = [];

    static Log(key: string): void {
        let now = performance.now();

        let latestTimestamp = BenchmarkService.timestamps[BenchmarkService.timestamps.length - 1];
        if (latestTimestamp) {
            latestTimestamp.d = now - latestTimestamp.t;
        }

        BenchmarkService.timestamps.push({ k: key, t: now, d: -1 });
        if (BenchmarkService.timestamps.length > 500) BenchmarkService.timestamps.splice(0, 2);

        if (BenchmarkService.keys.indexOf(key) == -1) BenchmarkService.keys.push(key);
    }

    static GetPerf(key: string): string {
        let timestamps = BenchmarkService.timestamps.filter(a => a.k == key);
        let times = timestamps.map(a => a.d);
        if (times.length > 0) {
            let totalTime = times.reduce(Utility.Sum);
            return (totalTime / timestamps.length).toFixed(2);
        }
        return "";
    }

    static GetFPS(): string {
        let timestamps = BenchmarkService.timestamps.filter(a => a.k == "IDLE");
        try {
            let lastTime = timestamps[timestamps.length - 1].t;
            let firstTime = timestamps[0].t;
            let msPerFrame = (lastTime - firstTime) / (timestamps.length - 1);
            let fps = 1000 / msPerFrame;
            return fps.toFixed(1);
        } catch (e) {
            return "";
        }
    }

    static GetReports(): string {
        let ret = "";
        
        ret += "FPS: " + BenchmarkService.GetFPS() + "<br/><br/>";

        for (let key of BenchmarkService.keys) {
            if (key.indexOf("Done") > -1) continue;
            let ms = BenchmarkService.GetPerf(key);
            ret += `${key}: ${ms}ms <br/>`
        }

        return ret;
    }

}

interface KeyedTime {
    t: number,
    k: string,
    d: number
}