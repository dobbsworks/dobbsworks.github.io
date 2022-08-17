"use strict";
var BenchmarkService = /** @class */ (function () {
    function BenchmarkService() {
    }
    BenchmarkService.Log = function (key) {
        var now = performance.now();
        var latestTimestamp = BenchmarkService.timestamps[BenchmarkService.timestamps.length - 1];
        if (latestTimestamp) {
            latestTimestamp.d = now - latestTimestamp.t;
        }
        BenchmarkService.timestamps.push({ k: key, t: now, d: -1 });
        if (BenchmarkService.timestamps.length > 500)
            BenchmarkService.timestamps.splice(0, 2);
        if (BenchmarkService.keys.indexOf(key) == -1)
            BenchmarkService.keys.push(key);
    };
    BenchmarkService.GetPerf = function (key) {
        var timestamps = BenchmarkService.timestamps.filter(function (a) { return a.k == key; });
        var times = timestamps.map(function (a) { return a.d; });
        if (times.length > 0) {
            var totalTime = times.reduce(Utility.Sum);
            return (totalTime / timestamps.length).toFixed(2);
        }
        return "";
    };
    BenchmarkService.GetFPS = function () {
        var timestamps = BenchmarkService.timestamps.filter(function (a) { return a.k == "IDLE"; });
        try {
            var lastTime = timestamps[timestamps.length - 1].t;
            var firstTime = timestamps[0].t;
            var msPerFrame = (lastTime - firstTime) / (timestamps.length - 1);
            var fps = 1000 / msPerFrame;
            return fps.toFixed(1);
        }
        catch (e) {
            return "";
        }
    };
    BenchmarkService.GetReports = function () {
        var ret = "";
        ret += "FPS: " + BenchmarkService.GetFPS() + "<br/><br/>";
        for (var _i = 0, _a = BenchmarkService.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.indexOf("Done") > -1)
                continue;
            var ms = BenchmarkService.GetPerf(key);
            ret += key + ": " + ms + "ms <br/>";
        }
        return ret;
    };
    BenchmarkService.timestamps = [];
    BenchmarkService.lastTimestamp = 0;
    BenchmarkService.keys = [];
    return BenchmarkService;
}());
