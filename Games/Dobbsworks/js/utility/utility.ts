class Utility {
    public static Round(n: number): number {
        return +(n.toFixed(3));
    }

    public static OnlyUnique(value: any, index: number, self: any) {
        return self.indexOf(value) === index;
    }

    public static Sum(a: number, b: number): number {
        return a + b;
    }

    public static b64Str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    public static toTwoDigitB64(num: number): string {
        return Utility.b64Str[Math.floor(num / 64)] + Utility.b64Str[num % 64];
    }

    public static IntFromB64(b64: string): number {
        let digits = b64.split("");
        let ret = 0;
        let scale = 1;
        while (digits.length) {
            let digit = digits.pop();
            if (digit) {
                let value = Utility.b64Str.indexOf(digit);
                ret += value * scale;
                scale *= 64;
            }
        }
        return ret;
    }

    public static FramesToTimeText(frameCount: number): string {
        let minutes = Math.floor(frameCount / 60 / 60);
        let seconds = Math.floor(frameCount / 60) % 60;
        let milliseconds = Math.floor((frameCount % 60) / 60 * 1000);

        return minutes.toString().padStart(2, "0") + ":" +
            seconds.toString().padStart(2, "0") + "." +
            milliseconds.toString().padStart(3, "0");
    }

    public static MsToTimeText(ms: number): string {
        let days = Math.floor(ms / 1000 / 60 / 60 / 24);
        let hours = Math.floor(ms / 1000 / 60 / 60) % 24;
        let minutes = Math.floor(ms / 1000 / 60) % 60;
        let seconds = Math.floor(ms / 1000) % 60;

        if (ms < 1) return "Time's up!"

        return (days ? (days.toString() + " day" + (days == 1 ? "" : "s") + " ") : "") +
            ((days || hours) ? (hours.toString() + " hour" + (hours == 1 ? "" : "s") + " ") : "") +
            ((days || hours || minutes) ? (minutes.toString() + " minute" + (minutes == 1 ? "" : "s") + " ") : "") +
            ((days || hours) ? "" : (seconds.toString() + " second" + (seconds == 1 ? "" : "s") + " "))
    }

    public static PascalCaseToSpaces(text: string): string {
        let ret = "";

        let letters = text.split("");
        for (let letter of letters) {
            if (letter == letter.toUpperCase() && ret.length != 0) {
                ret += " " + letter;
            } else {
                ret += letter;
            }
        }


        return ret;
    }

    public static Xor(con1: boolean, con2: boolean): boolean {
        return (con1 && !con2) || (!con1 && con2);
    }

    public static GetClosestInList(listOfNumbers: number[], targetNumber: number): number | null {
        if (listOfNumbers.length == 0) return null;

        let currentClosest = listOfNumbers[0];
        let currentDistance = Math.abs(targetNumber - currentClosest);
        for (let index = 1; index < listOfNumbers.length; index++) {
            let thisNumber = listOfNumbers[index];
            let thisDistance = Math.abs(targetNumber - thisNumber);
            if (thisDistance < currentDistance) {
                currentDistance = thisDistance;
                currentClosest = thisNumber;
            }
        }

        return currentClosest;
    }


    public static RandFrom<T>(list: T[]): T {
        if (list.length == 0) {
            throw "RandFrom called on empty list";
        }
        if (list.length == 0) return list[0];
        let index = Math.floor(Math.random() * list.length)
        return list[index];
    }


    private static IsOnSegment(p: Point, q: Point, r: Point) {
        return (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
    }

    private static GetOrientation(p: Point, q: Point, r: Point) {
        let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);

        if (val == 0) return 0; // collinear

        return (val > 0) ? 1 : 2; // clock or counterclock wise
    }

    // The main function that returns true if line segment 'p1q1'
    // and 'p2q2' intersect.
    public static DoLinesIntersect(p1: Point, q1: Point, p2: Point, q2: Point) {

        // Find the four orientations needed for general and
        // special cases
        let o1 = Utility.GetOrientation(p1, q1, p2);
        let o2 = Utility.GetOrientation(p1, q1, q2);
        let o3 = Utility.GetOrientation(p2, q2, p1);
        let o4 = Utility.GetOrientation(p2, q2, q1);

        // General case
        if (o1 != o2 && o3 != o4)
            return true;

        // Special Cases
        // p1, q1 and p2 are collinear and p2 lies on segment p1q1
        if (o1 == 0 && Utility.IsOnSegment(p1, p2, q1)) return true;

        // p1, q1 and q2 are collinear and q2 lies on segment p1q1
        if (o2 == 0 && Utility.IsOnSegment(p1, q2, q1)) return true;

        // p2, q2 and p1 are collinear and p1 lies on segment p2q2
        if (o3 == 0 && Utility.IsOnSegment(p2, p1, q2)) return true;

        // p2, q2 and q1 are collinear and q1 lies on segment p2q2
        if (o4 == 0 && Utility.IsOnSegment(p2, q1, q2)) return true;

        return false; // Doesn't fall in any of the above cases
    }

    static IsBetween(x: number, a: number, b: number): boolean {
        if (x <= a && x >= b) return true;
        if (x >= a && x <= b) return true;
        return false;
    }

    static Lerp(from: number, to: number, weight: number): number {
        return from + (to - from) * weight;
    }
    static Approach(from: number, to: number, amount: number): number {
        if (Math.abs(from - to) <= amount) return to;
        if (from < to) return from + amount;
        return from - amount;
    }

    // static LerpColor(from: string, to: string, weight: number): string {
    //     let hsl1 = rgbStringToHSL(from);
    //     let hsl2 = rgbStringToHSL(to);
    //     if (Math.abs(hsl2.h - hsl1.h) > 180) {
    //         if (hsl1.h > 180) hsl1.h -= 360;
    //         if (hsl2.h > 180) hsl2.h -= 360;
    //     }
    //     let hslNew = {
    //         h: Utility.Lerp(hsl1.h, hsl2.h, weight) % 360,
    //         s: Utility.Lerp(hsl1.s, hsl2.s, weight),
    //         l: Utility.Lerp(hsl1.l, hsl2.l, weight),
    //     };
    //     return hslToRGB(hslNew);
    // }
    static ApproachColor(from: string, to: string, speed: number): string {
        var rgbToInts = (rgb: string) => {
            return [0,1,2].map((n,i) => {
                let a = rgb.replace("#","");
                let l = Math.floor(a.length / 3);
                let s = i * l;
                let sub = a.substring(s, s + l);
                return parseInt(sub, 16);
        });}
        let rgb1 = rgbToInts(from);
        let rgb2 = rgbToInts(to);

        for (let i = 0; i < 3; i++) {
            if (Math.abs(rgb1[i] - rgb2[i]) <= speed) rgb1[i] = rgb2[i];
            if (rgb1[i] < rgb2[i]) rgb1[i] += speed;
            if (rgb1[i] > rgb2[i]) rgb1[i] -= speed;
        }

        return "#" + rgb1.map(a => a.toString(16).padStart(2, "00")).join("");
    }
}